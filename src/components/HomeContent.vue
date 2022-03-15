<!-- 右内容栏 -->
<template>
    <div class="home-content">
        <Toolbar
            v-if="!multi"
            @onBack="onBack"
            @refresh="refresh"
            @toReverse="getReverse"
            @toSort="getSort"
        ></Toolbar>
        <MultipleBar
            v-else
            @toPutSelectinRecycle="putSelectinRecycle"
            @toComplete="getComplete"
            @toSelectAll="getSelectAll"
            ref="myRef"
        ></MultipleBar>
        <PopupMenu
            v-if="isRename"
            title="重命名"
            determine="确定"
            @toModify="isRename = false"
            @toDetermine="reName"
            :determineDisabled="showName.length === 0"
        >
            <a-space>
                <a-form-item field="name" label="名称">
                    <a-input
                        v-model.trim="showName"
                        style="width: 370px"
                        :max-length="25"
                        :error="showName.length === 0"
                        show-word-limit
                        allow-clear
                        placeholder="请输入章名..."
                    />
                </a-form-item>
            </a-space>
        </PopupMenu>
        <PopupMenu
            v-if="isExportAll"
            title="导出设置"
            determine="导出"
            @toModify="isExportAll = false"
            @toDetermine="exportAll"
        >
            <a-space size="large">
                <a-radio-group
                    @change="changeMode"
                    :default-value="modeType"
                    style="text-align: left;"
                >
                    <a-radio value="m1" style="margin: 8px;">导出为单个TXT</a-radio>
                    <a-radio value="m2" style="margin: 8px;">导出为多个TXT</a-radio>
                    <a-radio value="m3" style="margin: 8px;">导出为单个DOCX</a-radio>
                    <a-radio value="m4" style="margin: 8px;">导出为多个DOCX</a-radio>
                </a-radio-group>
            </a-space>
        </PopupMenu>
        <div v-if="displyBlock" class="content">
            <a-empty
                v-if="!booksData.data.length"
                style="margin-top: 100px;"
                description="暂无数据,左上角添加"
            />
            <!-- 新封面 -->
            <div v-for="(item, i) in booksData.data" :key="item.id" class="book-cover">
                <a-dropdown
                    trigger="contextMenu"
                    alignPoint
                    :disabled="isdisable"
                    :style="{ display: 'block' }"
                >
                    <div @click="choiceItem(i)" :class="multi ? 'check-book' : 'book'">
                        <div @click="routerLink(item.id as number)">
                            <div v-if="item.checked">
                                <div v-if="!item.checked" class="btn-unchecked"></div>
                                <div v-else class="btn-checked">
                                    <icon-check
                                        style="color: rgb(var(--my-bg-color));font-size: 18px;"
                                    />
                                </div>
                            </div>
                            <img
                                :src="item.imgSrc === '' ? defaultCover : item.imgSrc"
                                :alt="item.title"
                                title="右键查看更多"
                            />
                        </div>
                    </div>
                    <template #content>
                        <a-doption @click="continueWriting(item.id as number)">✍🏻&nbsp;继续写作</a-doption>
                        <a-doption @click="showReName(item.id as number, item.title)">🔤&nbsp;重命名</a-doption>
                        <a-doption
                            @click="putinRecycle(item.id as number, item.title)"
                        >🗑️&nbsp;置入回收站</a-doption>
                        <a-doption @click="showExportOption(item.id as number)">📁&nbsp;导出</a-doption>
                    </template>
                </a-dropdown>
                <div class="book-shadow"></div>
                <div class="title">{{ item.title }}</div>
                <div class="date">{{ standTime(item.updateTime, true) }}</div>
            </div>
        </div>
        <div v-else class="content">
            <a-empty
                v-if="!booksData.data.length"
                style="margin-top: 100px;"
                description="暂无数据,左上角添加"
            />
            <ul class="list">
                <div
                    v-for="(item, i) in booksData.data"
                    :key="item.id"
                    @click="choiceItem(i)"
                    :style="item.checked ? 'background-color: #f2f3f5' : ''"
                    title="右键查看更多"
                >
                    <a-dropdown
                        trigger="contextMenu"
                        alignPoint
                        :disabled="isdisable"
                        :style="{ display: 'block' }"
                    >
                        <div class="li">
                            <img
                                @click="routerLink(item.id as number)"
                                :src="item.imgSrc === '' ? defaultCover : item.imgSrc"
                                alt="封面"
                            />
                            <div @click="routerLink(item.id as number)" class="sub">
                                <p>
                                    <span>{{ item.title }}</span>
                                    <span>{{ standTime(item.updateTime) }}&nbsp;更新</span>
                                </p>
                                <p>{{ getDesc(item.desc) }}</p>
                            </div>
                        </div>
                        <template #content>
                            <a-doption @click="continueWriting(item.id as number)">✍🏻&nbsp;继续写作</a-doption>
                            <a-doption
                                @click="showReName(item.id as number, item.title)"
                            >🔤&nbsp;重命名</a-doption>
                            <a-doption
                                @click="putinRecycle(item.id as number, item.title)"
                            >🗑️&nbsp;置入回收站</a-doption>
                            <a-doption @click="showExportOption(item.id as number)">📁&nbsp;导出</a-doption>
                        </template>
                    </a-dropdown>
                </div>
            </ul>
        </div>
        <!-- 主题按钮 -->
        <div class="theme" title="更换主题">
            <a-trigger trigger="click" :popup-translate="[-130, -10]">
                <a-button class="btn" type="primary">
                    <template #icon>
                        <icon-skin />
                    </template>
                </a-button>
                <template #content>
                    <ThemeContainer></ThemeContainer>
                </template>
            </a-trigger>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, onUnmounted, watch } from "vue";
import { IconSkin, IconCheck, IconSunFill, IconMoonFill } from "@arco-design/web-vue/es/icon";
import Toolbar from "./widget/Toolbar.vue";
import MultipleBar from "./widget/MultipleBar.vue";
import PopupMenu from './widget/PopupMenu.vue';
import ThemeContainer from './widget/ThemeContainer.vue';
import { db } from "../db/db";
import { useRouter } from 'vue-router';
import timeFormat from "../utils/timeFormat";
import useCurrentInstance from '../utils/useCurrentInstance';
import defaultCover from '../../public/static/img/default-cover.jpg';

const { proxy } = useCurrentInstance();

/*----数据库取值----*/
const booksData: { data: Array<Userdb> } = reactive({
    data: []
});

const $modal = proxy.$modal;
const $message = proxy.$message;
loadData();

// 控制路由跳转
const router = useRouter();
const routerLink = (id: number) => {
    if (!switchMult) {
        router.push({
            path: '/detail',
            query: {
                id: id
            }
        })
    }
}
// 继续写作按键
const continueWriting = (id: number) => {
    booksData.data.forEach(item => {
        if (item.id === id) {
            router.push({
                path: '/writer',
                query: {
                    id: id,
                    vid: item.historRecord.vid,
                    cid: item.historRecord.cid
                }
            })
        }
    })
}
// 反转顺序
const getReverse = () => {
    booksData.data.reverse();
}
// 获得排序设置并给数据排序
const getSort = (type: string) => {
    // type==1 按创建时间排序(默认)
    // type==2 按编辑时间排序
    // type==3 按名称排序
    switch (type) {
        case '1':
            // 默认就是按创建时间由小到大排序(升序)
            loadData();
            break;
        case '2':
            // 按编辑时间排序(升序)
            booksData.data.sort(function (a, b) {
                return a.updateTime - b.updateTime;
            });
            break;
        case '3':
            // 按名称排序(升序)
            booksData.data.sort(function (a, b) {
                return a.title.localeCompare(b.title);
            })
            break;
    }
}

// 是否以作品封面的方式显示(localStorage缓存状态)
const displyBlock = ref(true), getDisplyBlock = localStorage.getItem('displyBlock');
if (getDisplyBlock === null) localStorage.setItem('displyBlock', 'true');
else displyBlock.value = getDisplyBlock === 'true' ? true : false;

// 接收子组件传参
const onBack = (data: boolean) => {
    displyBlock.value = data;
};

// 刷新列表重新获取数据
const refresh = loadData;

// 时间格式化计算属性
const standTime = computed(() => (ts: number, mode?: boolean) => {
    // 选择格式,是否裁切后半部分的准确时间
    mode = mode || false;
    if (mode) {
        return timeFormat(ts).split(" ")[0];
    } else {
        return timeFormat(ts);
    }
});

// 简介数据处理
const getDesc = (desc: string) => {
    return desc === '' ? '请填写作品简介......' : desc.replaceAll('<br/>', ' ');
}
// 右键置入回收站
const putinRecycle = (id: number, title: string) => {
    $modal.warning({
        title: "删除作品",
        content: `目标【${title}】将放入废纸篓, 并保留30天`,
        simple: true,
        onOk: () => {
            db.opus.update(id, { discard: 't', discardTime: new Date().getTime() }).then(() => {
                loadData();
                $message.success('删除成功!');
            });
        }
    })
}
// 右键重命名
const isRename = ref(false), showName = ref('');
let temp_id: number;
const showReName = (id: number, name: string) => {
    temp_id = id;
    showName.value = name;
    isRename.value = true;
}
const reName = () => {
    db.opus.update(temp_id, { title: showName.value }).then(() => {
        loadData();
        isRename.value = false;
    })
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
    myRef = ref(),
    isdisable = ref(false);
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
// 监视变化控制dropdown
watch(() => multi.value, current => {
    isdisable.value = current;
})
// 置入选中目标到回收站
const putSelectinRecycle = () => {
    booksData.data.forEach(async item => {
        if (item.checked) {
            await db.opus.update(item.id as number, { discard: 't', discardTime: new Date().getTime() });
        }
    })
    loadData();
    $message.success('删除成功!');
}
// 点击全选键
const getSelectAll = () => {
    let temp = 0, len = booksData.data.length;
    for (let i = 0; i < len; i++) {
        temp += booksData.data[i].checked ? 1 : 0;
        if (!booksData.data[i].checked) {
            booksData.data.forEach((item) => {
                item.checked = true;
                myRef.value.getData(len, len);
            });
            break;
        }
    }
    if (temp === len) {
        booksData.data.forEach((item) => {
            item.checked = false;
            myRef.value.getData(len, 0);
        });
    }
};
// 点击完成键
const getComplete = () => {
    switchMult = multi.value = false;
    booksData.data.forEach((item) => {
        item.checked = false;
    });
};

// 导出一整部作品
const isExportAll = ref(false), modeType = ref('m1');
let targetId = 0;
const showExportOption = (id: number) => {
    targetId = id;
    isExportAll.value = true;
}
const changeMode = (mode: string) => {
    modeType.value = mode;
}
// 导出操作
const exportAll = () => {
    booksData.data.forEach(item => {
        if (item.id === targetId) {
            if (modeType.value === 'm1') {
                let opusStr = '';
                item.data.forEach((v_item, index) => {
                    // 插入卷名
                    if (index > 0) opusStr += '\n\n' + v_item.volumeName + '\n';
                    else opusStr += v_item.volumeName + '\n'
                    v_item.volume.forEach((c_item, i) => {
                        // 插入章名
                        if (i > 0) opusStr += '\n\n' + c_item.chapterName + '\n';
                        else opusStr += '\n' + c_item.chapterName + '\n';
                        // 插入章内容
                        opusStr += c_item.chapter.join('\n');
                    })
                })
                window.$API.ipcSend('expFile', {
                    type: 'TXT',
                    name: item.title,
                    file: opusStr
                });
            } else if (modeType.value === 'm2') {
                const opusArr = item.data.map(v_item => {
                    return {
                        volumeName: v_item.volumeName,
                        volume: v_item.volume.map(c_item => {
                            return {
                                chapterName: c_item.chapterName,
                                chapter: c_item.chapter.join('\n')
                            }
                        })
                    }
                })
                window.$API.ipcSend('expFile', {
                    type: 'TXT_mult',
                    name: item.title,
                    file: opusArr
                });
            } else if (modeType.value === 'm3') {
                let opusHTML = '';
                item.data.forEach(v_item => {
                    opusHTML += '<h3>' + v_item.volumeName + '</h3>';
                    v_item.volume.forEach(c_item => {
                        opusHTML += '<h4>' + c_item.chapterName + '</h4>';
                        c_item.chapter.forEach(para => {
                            opusHTML += '<p>' + para + '</p>';
                        })
                    })
                })
                opusHTML = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>' + opusHTML + '</body></html>';
                window.$API.ipcSend('expFile', {
                    type: 'DOCX',
                    name: item.title,
                    file: opusHTML
                });
            } else if (modeType.value === 'm4') {
                const opusArr = item.data.map(v_item => {
                    return {
                        volumeName: v_item.volumeName,
                        volume: v_item.volume.map(c_item => {
                            return {
                                chapterName: c_item.chapterName,
                                chapter: '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>' + c_item.chapter.map(para => '<p>' + para + '</p>').join('') + '</body></html>'
                            }
                        })
                    }
                })
                window.$API.ipcSend('expFile', {
                    type: 'DOCX_mult',
                    name: item.title,
                    file: opusArr
                });
            }
        }
    })
    window.$API.ipcOnce('expFile-result', (data: 'success' | 'err') => {
        if (data === 'success') $message.success('文件导出成功!');
        else if (data === 'err') $message.error('文件导出失败!');
    });
    isExportAll.value = false;
}

function loadData() {
    db.opus.where(":id").between(1, Infinity).toArray().then(value => {
        booksData.data = value.filter(item => {
            item.checked = false;
            return item.discard === 'f';
        })
        // 按顺序排序(必须剔除type1的情况,不然会死循环调用loadData)
        if (localStorage.getItem('sortType') !== '1') {
            getSort(localStorage.getItem('sortType')!);
        }
    });
}
/*----离开页面销毁----*/
onUnmounted(() => {
    window.removeEventListener("keydown", multiChoice);
    window.removeEventListener("keyup", multiCancel);
});
</script>

<style lang="scss" src="../style/homecontent.scss" scoped></style>