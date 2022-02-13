<!-- 右侧回收站页面 -->
<template>
    <div class="recycle-content">
        <Toolbar v-if="!multi" @toDeleteAll="getDeleteAll"></Toolbar>
        <MultipleBar
            v-else
            @toDeleteSelect="getDeleteSelect"
            @toRestoreSelect="getRestoreSelect"
            @toComplete="getComplete"
            @toSelectAll="getSelectAll"
            ref="myRef"
        ></MultipleBar>
        <a-empty
            v-if="!booksData.data.length"
            style="margin-top: 100px;"
            description="暂无数据,回收站的数据将会保留30天"
        >
            <template #image>
                <img :src="svg_trashcan" />
            </template>
        </a-empty>
        <div v-else class="discard-item">
            <!-- 循环 -->
            <div
                v-for="(item, i) in booksData.data"
                :key="item.id"
                @click="choiceItem(i)"
                class="card"
            >
                <a-tooltip
                    :content="timeFormat(item.discardTime as number)"
                    background-color="#3491fa"
                    mini
                >
                    <a-avatar
                        :style="{ backgroundColor: avatarColor(item.reTime), fontSize: '18px' }"
                        shape="square"
                    >{{ item.reTime }}天</a-avatar>
                </a-tooltip>
                <span :title="item.title">{{ item.title }}</span>
                <a-link v-if="!multi" @click="markRestore(item.id as number)">还原</a-link>
                <div v-else>
                    <div v-if="!item.checked" class="btn-unchecked"></div>
                    <div v-else class="btn-checked">
                        <icon-check style="color: #fff;font-size: 18px;" />
                    </div>
                </div>
            </div>
            <!-- 循环 -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted, nextTick } from "vue";
import { IconCheck } from "@arco-design/web-vue/es/icon";
import Toolbar from "./widget/Toolbar.vue";
import MultipleBar from "./widget/MultipleBar.vue";
import { db } from "../db/db";
import timeFormat from "../utils/timeFormat";
import useCurrentInstance from '../utils/useCurrentInstance';
import svg_trashcan from '../assets/svg/trashcan.svg';

interface Bookdata {
    id?: number,
    title: string,
    discardTime?: number,
    reTime: number,
    checked: boolean
}
/*----离开页面销毁----*/
onUnmounted(() => {
    window.removeEventListener("keydown", multiChoice);
    window.removeEventListener("keyup", multiCancel);
});

/*----数据库取值----*/
const booksData: { data: Array<Bookdata> } = reactive({ data: [] }),
    { proxy } = useCurrentInstance();
const $message = proxy.$message;
const $modal = proxy.$modal;
loadData();

// 取出被discard的数据,即索引discard为't'
function loadData() {
    db.opus.where("discard").equalsIgnoreCase("t").toArray().then(value => {
        booksData.data = value.map(item => {
            return {
                id: item.id,
                title: item.title,
                discardTime: item.discardTime,
                reTime: 30 - Math.floor((new Date().getTime() - item.discardTime!) / 86400000), // 倒计时多少天销毁
                checked: false,
            };
        });
        // 删除过期数据
        const overdue: Array<number> = [];
        booksData.data.forEach(item => {
            if (item.reTime <= 0) overdue.push(<number>item.id);
        })
        if (overdue.length > 0) {
            db.opus.bulkDelete(overdue);
            loadData();
        }
    });
}

// 计算头像颜色
function avatarColor(t: number) {
    if (t <= 10) {
        return "#f53f3f";
    } else if (t <= 20) {
        return "#ff7d00";
    } else {
        return "#00b42a";
    }
}

// 从回收站还原数据
const markRestore = (id: number) => {
    db.opus.update(id, { discard: 'f' }).then(() => {
        loadData();
        $message.success('还原成功!');
    });
}

// 点击一键全清
const getDeleteAll = () => {
    $modal.warning({
        title: "全部删除",
        content: "将全部清空并彻底删除回收站内的文件,该过程将不可逆",
        simple: true,
        onOk: () => {
            db.opus.bulkDelete(booksData.data.map(item => {
                return item.id;
            }) as Array<number>)
                .then(() => {
                    booksData.data.forEach(item => {
                        // 将该作品的文件夹一并清除
                        const path = 'workspace/opus/' + item.id + item.title;
                        window.$API.ipcSend('deleteFolder', path);
                    })
                    loadData();
                    $message.success('已全部清空!');
                });
        }
    });
};
// 点击删除选中键
const getDeleteSelect = () => {
    const tarArr: Array<{ id: number, title: string }> = [];
    booksData.data.forEach(item => {
        item.checked ? tarArr.push({ id: item.id!, title: item.title }) : null;
    });
    $modal.warning({
        title: "删除选中",
        content: "将目标清空并彻底删除, 该过程将不可逆",
        simple: true,
        onOk: () => {
            db.opus.bulkDelete(tarArr.map(item => {
                return item.id;
            })).then(() => {
                tarArr.forEach(item => {
                    // 将该作品的文件夹一并清除
                    const path = 'workspace/opus/' + item.id + item.title;
                    window.$API.ipcSend('deleteFolder', path);
                })
                loadData();
                $message.success('删除成功!');
            });
        }
    })
}
// 点击还原选中键
const getRestoreSelect = () => {
    booksData.data.forEach(async item => {
        if (item.checked) {
            await db.opus.update(item.id!, { discard: 'f' });
        }
    });
    loadData();
    $message.success('还原成功!');
}
// 点击全选键
const getSelectAll = () => {
    let temp = 0, len = booksData.data.length;
    for (let i = 0; i < len; i++) {
        temp += booksData.data[i].checked ? 1 : 0;
        if (!booksData.data[i].checked) {
            booksData.data.forEach(item => {
                item.checked = true;
                myRef.value.getData(len, len);
            });
            break;
        }
    }
    if (temp === len) {
        booksData.data.forEach(item => {
            item.checked = false;
            myRef.value.getData(len, 0);
        });
    }
};
// 点击完成键
const getComplete = () => {
    switchMult = multi.value = false;
    booksData.data.forEach(item => {
        item.checked = false;
    });
};
// 多选功能: Ctrl + 鼠标左键
const multi = ref(false), myRef = ref();
const choiceItem = (i: number) => {
    if (switchMult) {
        switchMult = true;
        window.removeEventListener("keyup", multiCancel);
        multi.value = true;
        booksData.data[i].checked = !booksData.data[i].checked;
        // 调用子组件的方法给子组件传递总个数和选中的个数
        nextTick(() => {
            let len = booksData.data.length,
                sele = 0;
            for (let i = 0; i < len; i++) {
                sele += booksData.data[i].checked ? 1 : 0;
            }
            myRef.value.getData(len, sele);
        });
    }
};
let switchMult = false;
window.addEventListener("keydown", multiChoice);
window.addEventListener("keyup", multiCancel);
function multiChoice(e: KeyboardEvent) {
    if (e.key === "Control") {
        switchMult = true;
    }
}
function multiCancel(e: KeyboardEvent) {
    if (e.key === "Control") {
        switchMult = false;
    }
}

</script>
<style lang="scss" src="../style/recyclecontent.scss" scoped></style>