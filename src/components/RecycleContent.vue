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
            description="暂无数据，回收站的数据将会保留30天"
        >
            <template #image>
                <svg
                    t="1642567735953"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2446"
                    width="50"
                    height="50"
                >
                    <path
                        d="M277.333333 266.666667m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z"
                        fill="#a9aeb8"
                        p-id="2447"
                    />
                    <path
                        d="M448 266.666667m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z"
                        fill="#a9aeb8"
                        p-id="2448"
                    />
                    <path
                        d="M341.333333 181.333333m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z"
                        fill="#a9aeb8"
                        p-id="2449"
                    />
                    <path
                        d="M469.333333 160m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z"
                        fill="#a9aeb8"
                        p-id="2450"
                    />
                    <path
                        d="M522.666667 74.666667m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z"
                        fill="#a9aeb8"
                        p-id="2451"
                    />
                    <path
                        d="M576 181.333333m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z"
                        fill="#a9aeb8"
                        p-id="2452"
                    />
                    <path
                        d="M618.666667 266.666667m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z"
                        fill="#a9aeb8"
                        p-id="2453"
                    />
                    <path
                        d="M746.666667 245.333333m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z"
                        fill="#a9aeb8"
                        p-id="2454"
                    />
                    <path
                        d="M661.333333 117.333333m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z"
                        fill="#a9aeb8"
                        p-id="2455"
                    />
                    <path
                        d="M722.688 341.333333H301.312c-52.053333 0-92.714667 43.584-87.530667 93.824l48.384 469.333334C266.666667 948.117333 304.490667 981.333333 349.696 981.333333h324.608c45.205333 0 83.029333-33.216 87.530667-76.842666l48.384-469.333334C815.402667 384.917333 774.741333 341.333333 722.688 341.333333zM426.666667 832a32 32 0 0 1-64 0V490.666667a32 32 0 0 1 64 0v341.333333z m117.333333 0a32 32 0 0 1-64 0V490.666667a32 32 0 0 1 64 0v341.333333z m117.333333 0a32 32 0 0 1-64 0V490.666667a32 32 0 0 1 64 0v341.333333z"
                        fill="#a9aeb8"
                        p-id="2456"
                    />
                </svg>
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
import { ref, reactive, onUnmounted, nextTick, getCurrentInstance } from "vue";
import { IconCheck } from "@arco-design/web-vue/es/icon";
import Toolbar from "./widget/Toolbar.vue";
import MultipleBar from "./widget/MultipleBar.vue";
import { db } from "../db/db";
import timeFormat from "../utils/timeFormat";
import useCurrentInstance from '../utils/useCurrentInstance';

interface Bookdata {
    id?: number,
    title: string,
    discardTime?: number,
    reTime: number,
    checked: boolean
}

/*----数据库取值----*/
const booksData: { data: Array<Bookdata> } = reactive({ data: [] }),
    { proxy } = useCurrentInstance();
const $message = proxy.$message;
const $modal = proxy.$modal;
loadData();

// 取出被discard的数据,即索引discard为't'
function loadData() {
    db.opus
        .where("discard")
        .equalsIgnoreCase("t")
        .toArray()
        .then(value => {
            booksData.data = value.map(item => {
                return {
                    id: item.id,
                    title: item.title,
                    discardTime: item.discardTime,
                    reTime: 30 - Math.floor((new Date().getTime() - item.discardTime!) / 86400000), // 倒计时多少天销毁
                    checked: false,
                };
            });
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

// 多选功能: Ctrl + 鼠标左键
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
const multi = ref(false),
    myRef = ref();
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
// 点击一键全清
const getDeleteAll = () => {
    $modal.warning({
        title: "全部删除",
        content: "将全部清空并彻底删除回收站内的文件，该过程将不可逆",
        simple: true,
        onOk: () => {
            db.opus.bulkDelete(booksData.data.map(item => {
                return item.id;
            }) as Array<number>)
                .then(() => {
                    booksData.data.forEach(item => {
                        // 将该作品的文件夹一并清除
                        const path = '/workspace/opus/' + item.id + item.title;
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
        content: "将目标清空并彻底删除，该过程将不可逆",
        simple: true,
        onOk: () => {
            db.opus.bulkDelete(tarArr.map(item => {
                return item.id;
            })).then(() => {
                tarArr.forEach(item => {
                    // 将该作品的文件夹一并清除
                    const path = '/workspace/opus/' + item.id + item.title;
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

/*----离开页面销毁----*/
onUnmounted(() => {
    window.removeEventListener("keydown", multiChoice);
    window.removeEventListener("keyup", multiCancel);
});

</script>
<style src="../style/recyclecontent.css" scoped></style>