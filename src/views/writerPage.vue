<!-- 作品(纯文本)编写页 -->
<template>
    <TitleBlock v-show="!fullScreenState"></TitleBlock>
    <KeywordDetail
        v-if="showkeywordDetail"
        @getkeywordDetail="getkeywordDetail"
        @displayKeyPanel="displayKeyPanel"
        ref="keywordDetailRef"
    ></KeywordDetail>
    <PopupMenu
        v-if="isRename"
        title="重命名"
        determine="确定"
        @toModify="modify"
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
        v-if="isNewVolume"
        title="新增卷"
        determine="确定"
        @toModify="modify"
        @toDetermine="addNewVolume"
        :determineDisabled="volumeName.length === 0"
    >
        <a-space>
            <a-form-item field="name" label="卷名">
                <a-input
                    v-model.trim="volumeName"
                    style="width: 370px"
                    :max-length="25"
                    :error="volumeName.length === 0"
                    show-word-limit
                    allow-clear
                    placeholder="请输入卷名..."
                />
            </a-form-item>
        </a-space>
    </PopupMenu>
    <PopupMenu
        v-if="isNewChapter"
        title="新增章"
        determine="确定"
        @toModify="modify"
        @toDetermine="addNewChapter"
        :determineDisabled="chapterName.length === 0"
    >
        <a-space>
            <a-form-item field="name" label="章名">
                <a-input
                    v-model.trim="chapterName"
                    style="width: 370px"
                    :max-length="25"
                    :error="chapterName.length === 0"
                    show-word-limit
                    allow-clear
                    placeholder="请输入章名..."
                />
            </a-form-item>
        </a-space>
    </PopupMenu>
    <div class="layout-write">
        <a-layout>
            <a-layout-header v-show="!fullScreenState">
                <TopToolbar @fullscreen="turnfullScreen" ref="topToolRef"></TopToolbar>
            </a-layout-header>
            <a-layout>
                <a-layout-sider
                    collapsible
                    :collapsed="isCollapse"
                    @collapse="onCollapse"
                    class="siderLeft-w"
                >
                    <a-menu
                        :default-open-keys="[vid]"
                        :default-selected-keys="[cid]"
                        :style="{ width: '100%', textAlign: 'left' }"
                    >
                        <button
                            @click="isNewVolume = true"
                            class="topBtn"
                        >📜&nbsp;{{ isCollapse ? '' : '添加卷' }}</button>
                        <a-sub-menu v-for="item in booksLists.data" :key="item.vid">
                            <template #title>
                                <icon-right-circle
                                    @click.stop="showLeftMore = showLeftMore === item.vid ? '' : item.vid"
                                    class="siderLeft-btn"
                                />
                                <span title="删除卷">
                                    <svg
                                        v-if="showLeftMore === item.vid"
                                        viewBox="0 0 1024 1024"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        style="margin-bottom: -5px; margin-right: 5px;margin-left: 5px;"
                                        @mouseenter="editVid1 = item.vid"
                                        @mouseleave="editVid1 = ''"
                                        @click.stop="deleteVolume(item.vid, item.volumeName)"
                                    >
                                        <path
                                            p-id="3022"
                                            :fill="editVid1 === item.vid ? '#bf5e00' : '#ff7d00'"
                                        />
                                    </svg>
                                </span>
                                <span title="重命名">
                                    <svg
                                        v-if="showLeftMore === item.vid"
                                        viewBox="0 0 1024 1024"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        style="margin-bottom: -5px; margin-right: 5px;"
                                        @mouseenter="editVid2 = item.vid"
                                        @mouseleave="editVid2 = ''"
                                        @click.stop="showReName('v', item.vid, item.volumeName)"
                                    >
                                        <path
                                            :fill="editVid2 === item.vid ? '#276dbc' : '#3491fa'"
                                            p-id="3276"
                                        />
                                    </svg>
                                </span>
                                <span title="新增章">
                                    <svg
                                        v-if="showLeftMore === item.vid"
                                        viewBox="0 0 1024 1024"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        style="margin-bottom: -4px; margin-right: 5px;"
                                        @mouseenter="editVid3 = item.vid"
                                        @mouseleave="editVid3 = ''"
                                        @click.stop="newChapter(item.vid)"
                                    >
                                        <path
                                            p-id="1550"
                                            :fill="editVid3 === item.vid ? '#008720' : '#00b42a'"
                                        />
                                    </svg>
                                </span>
                                {{ item.volumeName }}
                            </template>
                            <a-dropdown
                                v-for="it in item.volume"
                                :key="it.cid"
                                trigger="contextMenu"
                                alignPoint
                                :style="{ display: 'block' }"
                            >
                                <a-menu-item
                                    :key="it.cid"
                                    @click="onClickMenuItem(item.vid, it.cid)"
                                    :style="deletedCid === it.cid ? 'color:#f53f3f;text-decoration:line-through;text-indent:10px;' : 'text-indent:10px;'"
                                    :title="it.chapterName"
                                >{{ it.chapterName }}</a-menu-item>
                                <template #content>
                                    <a-doption
                                        @click="showReName('c', it.cid, it.chapterName)"
                                        class="iconfont"
                                    >&#xe82a;&nbsp;&nbsp;重命名</a-doption>
                                    <a-doption
                                        @click="deleteChapter(item.vid, it.cid, it.chapterName)"
                                        class="iconfont"
                                    >&#xe7f2;&nbsp;&nbsp;删除章</a-doption>
                                </template>
                            </a-dropdown>
                        </a-sub-menu>
                    </a-menu>
                    <template #trigger="{ collapsed }">
                        <IconCaretRight v-if="collapsed"></IconCaretRight>
                        <IconCaretLeft v-else></IconCaretLeft>
                    </template>
                </a-layout-sider>
                <a-layout-content
                    @mouseover="showScroll"
                    @mouseout="closeScroll"
                    @scroll="getScrollTop"
                >
                    <div
                        v-if="!showSiderRight"
                        @click="openTheSide"
                        class="open-button"
                        title="展开右侧 Ctrl+Shift+["
                    >
                        <icon-left :stroke-width="2" />
                    </div>
                    <SearchBox v-if="showSearchBox" @close="closeSearch" ref="searchBoxRef"></SearchBox>
                    <WritingPaper
                        @todata="sendPaperData"
                        @addKeyWord="addKeyWord"
                        @toWebView="toWebView"
                        ref="paperRef"
                    ></WritingPaper>
                </a-layout-content>
                <a-resize-box
                    @moving-start="showIframeWrap = true"
                    @moving-end="showIframeWrap = false"
                    @moving="resizeBoxMoving"
                    :directions="['left']"
                    class="sider-right"
                    :style="{ minWidth: '250px' }"
                    v-model:width="resizeBoxWdith"
                    v-show="showSiderRight"
                >
                    <!-- 伸缩杆 -->
                    <template #resize-trigger="{ direction }">
                        <div
                            :class="[
                                `resizebox-demo`,
                                `resizebox-demo-${direction === 'left' ? 'vertical' : 'horizontal'}`
                            ]"
                        >
                            <div class="resizebox-demo-line" />
                        </div>
                    </template>
                    <!-- 内容区 -->
                    <div class="sider-right-content">
                        <!-- 漂浮工具栏 -->
                        <FloatTool @choiceItem="choicePopButton"></FloatTool>
                        <div
                            v-if="showSiderRight"
                            @click="stowTheSide"
                            class="fold-button"
                            title="收起右侧 Ctrl+Shift+]"
                        >
                            <icon-right :stroke-width="2" />
                        </div>
                        <!-- 各个需要显示的组件 -->
                        <WebviewBlock v-if="showModular === '0'" ref="webviewBlockRef"></WebviewBlock>
                        <PlotEditor v-if="showModular === '1'"></PlotEditor>
                        <KeywordEditor
                            v-if="showModular === '2'"
                            @kChange="changeKeyWordState"
                            ref="keyWordRef"
                        ></KeywordEditor>
                        <DiagramEditor v-if="showModular === '3'"></DiagramEditor>
                        <TimelineEditor v-if="showModular === '4'" ref="ref_TimelineEditor"></TimelineEditor>
                        <MapContent v-if="showModular === '5'"></MapContent>
                        <div v-if="showIframeWrap" class="right-Wrap"></div>
                    </div>
                </a-resize-box>
            </a-layout>
        </a-layout>
    </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, reactive, onMounted, nextTick, onBeforeUnmount, Ref } from 'vue';
import { IconCaretRight, IconCaretLeft, IconRightCircle, IconLeft, IconRight } from '@arco-design/web-vue/es/icon';
import { useRoute } from 'vue-router';
import TitleBlock from '../components/TitleBlock.vue';
import TopToolbar from '../components/TopToolbar.vue';
import WritingPaper from '../components/WritingPaper.vue';
import PopupMenu from '../components/widget/PopupMenu.vue';
import WebviewBlock from '../components/WebviewBlock.vue';
import PlotEditor from '../components/PlotEditor.vue';
import KeywordEditor from '../components/KeywordEditor.vue';
import DiagramEditor from '../components/DiagramEditor.vue';
import TimelineEditor from '../components/TimelineEditor.vue';
import MapContent from '../components/MapContent.vue';
import KeywordDetail from '../components/widget/KeywordDetail.vue';
import FloatTool from '../components/widget/FloatTool.vue';
import SearchBox from '../components/widget/SearchBox.vue';
import useCurrentInstance from '../utils/useCurrentInstance';
import { throttle } from '../utils/flowControl';
import genkeywordMarks from '../utils/genkeywordMarks';
import { useMainStore } from '../store/index';
import { saveTodaysCodewords } from '../hooks/db';
import { db } from '../db/db';
import { v4 } from 'uuid';
import '../style/writerPage.scss';

const { proxy } = useCurrentInstance();
const mainStore = useMainStore();
const $modal = proxy.$modal;
const $message = proxy.$message;
const route = useRoute();
const query_id = parseInt(<string>route.query.id);
const vid = ref(route.query.vid); // 缓存当前卷vid
const cid = ref(route.query.cid); // 缓存当前章cid
const paperRef = ref(); // 纸张
const topToolRef = ref(); // 顶部工具栏
const searchBoxRef = ref(); // 搜索框
const showIframeWrap = ref(false); // 遮罩
const keywordMarks: Ref<Array<Marker>> = ref([]);
loadListData();

// 转发纸张-->头部工具栏的数据
const sendPaperData = (data: Pagecount) => {
    topToolRef.value.getData(data);
}

// 左侧是否折叠
const isCollapse = ref(false);
const onCollapse = (val: boolean) => {
    isCollapse.value = val;
}

// 左栏展开更多操作
const editVid1 = ref(''), editVid2 = ref(''), editVid3 = ref('');
const showLeftMore = ref('');

// 点击左侧项目切换章节
const onClickMenuItem = (tvid: string, tcid: string) => {
    if (tcid !== cid.value) {
        vid.value = tvid;
        cid.value = tcid;
        paperRef.value.setId(tvid, tcid);

        // 加载新数据
        loadListData(() => {
            // 搜索框状态
            if (showSearchBox.value) {
                // 搜索框显示，重新搜索切换后页面的关键字
                mainStore.targetIndex = 1;
                searchBoxRef.value.toSearchKeyword();
            }
        });
    }
}

// 关闭搜索框
const showSearchBox = ref(false);
const closeSearch = () => {
    showSearchBox.value = false;
    db.opus.get(query_id).then(value => {
        if (value) paperRef.value.setBooksData(value, keywordMarks.value);
    })
}

// 卷章重命名
const isRename = ref(false), showName = ref('');
let temp_id: string, reType: string = '';
const showReName = (type: string, id: string, vname: string) => {
    isRename.value = true;
    reType = type; // 重命名类型
    temp_id = id;
    showName.value = vname;
}
const reName = () => {
    // 修改卷
    if (reType === 'v') {
        loadDB((item: Userdb) => {
            const len = item.data.length;
            for (let i = 0; i < len; i++) {
                if (item.data[i].vid === temp_id) {
                    item.data[i].volumeName = showName.value;
                    break;
                }
            }
        })
    }
    // 修改章
    else if (reType === 'c') {
        loadDB((item: Userdb) => {
            const len1 = item.data.length;
            for (let i = 0; i < len1; i++) {
                const len2 = item.data[i].volume.length;
                for (let j = 0; j < len2; j++) {
                    if (item.data[i].volume[j].cid === temp_id) {
                        item.data[i].volume[j].chapterName = showName.value;
                        break;
                    }
                }
            }
        })
    }

    // 局部方法
    function loadDB(cb: Function) {
        db.opus.where(':id').equals(query_id).modify(item => {
            cb(item);
        }).then(() => {
            isRename.value = false;
            loadListData();
        })
    }
}

// 删除卷（移至废纸篓）
const deleteVolume = (vid: string, vname: string) => {
    $modal.warning({
        title: "删除卷",
        content: `目标卷【${vname}】将放入废纸篓,并保留30天`,
        simple: true,
        onOk: () => {
            db.opus.where(':id').equals(query_id).modify(item => {
                const len = item.data.length;
                for (let i = 0; i < len; i++) {
                    if (item.data[i].vid === vid) {
                        item.data[i].discard = true;
                        item.data[i].discardTime = new Date().getTime();
                        break;
                    }
                }
            }).then(() => {
                loadListData();
                $message.success('删除成功!');
            })
        }
    })
}

// 删除章（移至废纸篓）
const deletedCid = ref('');
const deleteChapter = (dvid: string, dcid: string, cname: string) => {
    $modal.warning({
        title: "删除章",
        content: `目标章《${cname}》将放入废纸篓,并保留30天`,
        simple: true,
        onOk: () => {
            db.opus.where(':id').equals(query_id).modify(item => {
                const len1 = item.data.length
                for (let i = 0; i < len1; i++) {
                    if (item.data[i].vid === dvid) {
                        const len2 = item.data[i].volume.length;
                        for (let j = 0; j < len2; j++) {
                            if (item.data[i].volume[j].cid === dcid) {
                                item.data[i].volume[j].discard = true;
                                item.data[i].volume[j].discardTime = new Date().getTime();
                                break;
                            }
                        }
                        break;
                    }
                }
            }).then(() => {
                // 删除的目标是当前编辑的目标
                if (dvid === vid.value && dcid === cid.value) {
                    deletedCid.value = dcid;
                    paperRef.value.refreshPaper([{
                        type: "paragraph",
                        content: [{
                            type: "text",
                            text: ''
                        }]
                    }]);
                } else {
                    loadListData();
                }
                $message.success('删除成功!');
            })
        }
    })
}

// 点击添加章
const isNewChapter = ref(false), chapterName = ref('未命名章');
let volumeId: string; // 找到目标卷才能向里面push章
const newChapter = (vid: string) => {
    volumeId = vid;
    isNewChapter.value = true;
}
const addNewChapter = () => {
    db.opus.where(':id').equals(query_id).modify(item => {
        const len = item.data.length;
        for (let i = 0; i < len; i++) {
            if (item.data[i].vid === volumeId) {
                item.data[i].volume.push({
                    cid: v4(),
                    chapterName: chapterName.value,
                    updateTime: new Date().getTime(),
                    chapter: ['\u3000\u3000'] // 两个中文空格
                });
                break;
            }
        }
    }).then(() => {
        isNewChapter.value = false;
        loadListData();
        $message.success('添加成功!');
    })
}

// 点击添加卷
const isNewVolume = ref(false), volumeName = ref('未命名卷');
const addNewVolume = () => {
    db.opus.where(':id').equals(query_id).modify(item => {
        item.data.push({
            vid: v4(),
            volumeName: volumeName.value,
            updateTime: new Date().getTime(),
            volume: [{
                cid: v4(),
                chapterName: '未命名章',
                updateTime: new Date().getTime(),
                chapter: ['\u3000\u3000'] // 两个中文空格
            }]
        });
    }).then(() => {
        isNewVolume.value = false;
        loadListData();
        $message.success('添加成功!');
    })
}

// 右侧滚动条的样式设置
const scrollbarColor = ref('#ccc');
const showScroll = () => {
    scrollbarColor.value = 'var(--scrollbar-color)';
}
const closeScroll = () => {
    scrollbarColor.value = 'rgb(var(--my-bg-color))';
}

// 调整右侧小窗口大小
const ref_TimelineEditor = ref();
const resizeBoxMoving = () => {
    if (ref_TimelineEditor.value) ref_TimelineEditor.value.setSliderState();
    // 关闭悬浮卡片
    if (showkeywordDetail.value) showkeywordDetail.value = false;
}

// 右侧PopButton，选择并渲染对应组件
const showModular = ref('0');
if (localStorage.getItem('showModular') === null) {
    localStorage.setItem('showModular', '0');
} else {
    showModular.value = localStorage.getItem('showModular') ?? '0';
}
const choicePopButton = (key: string) => {
    showModular.value = key;
    localStorage.setItem('showModular', key);
}

const modify = () => {
    isRename.value = false;
    isNewVolume.value = false;
    isNewChapter.value = false;
}

// 关键字面板状态改变
const changeKeyWordState = () => {
    loadListData();
}

// 使用webview快捷搜索关键词
const webviewBlockRef = ref();
const toWebView = (str: string) => {
    showSiderRight.value = true;
    // 当前显示了webview
    if (webviewBlockRef.value) {
        webviewBlockRef.value.toSearch(str);
    }
    // 当前没有显示webview
    else {
        showModular.value = '0'; // 则显示
        nextTick(() => {
            webviewBlockRef.value.toSearch(str);
        })
    }
}

// 掠过关键词显示卡片
const showkeywordDetail = ref(false),
    keywordDetailRef = ref(), // 卡片组件实例
    keywordDetail = ref(); // 卡片根DOM
// 获得小卡片的根DOM元素
const getkeywordDetail = (tarDOM: HTMLElement) => {
    keywordDetail.value = tarDOM;
}
// 处理数据并显示卡片数据
let currentKid = '', currentIid = '';
const showSpanDetail = throttle((e: MouseEvent) => {
    // 确认目标
    if ((<HTMLElement>e.target).getAttribute('class') === 'keyWord') {
        showkeywordDetail.value = true; // 显示
        const targetText = (<HTMLElement>e.target).innerText;
        let posX: number, posY: number, domRect = (<HTMLElement>e.target).getBoundingClientRect();
        [posX, posY] = [domRect.x + domRect.width, domRect.y + domRect.height];
        // 获取目标数据
        keyWordArr.forEach(item => {
            const len = item.length;
            for (let i = 2; i < len; i++) {
                if (item[i] === targetText) {
                    [currentKid, currentIid] = [item[0], item[1]];
                    modifyDbforItem(item[0], item[1], (item: KeyWord) => {
                        // 将数据交给卡片组件
                        keywordDetailRef.value.getCurrentKeyword(item);
                    })
                    break;
                }
            }
        })
        nextTick(() => {
            keywordDetail.value.style.top = posY - keywordDetail.value.clientHeight / 2 - domRect.height / 2 + 'px';
            keywordDetail.value.style.left = posX + 10 + 'px';
            // 鼠标离开卡片，卡片消失
            keywordDetail.value.onmouseleave = (e: MouseEvent) => {
                showkeywordDetail.value = (<HTMLElement>e.relatedTarget).className === 'arco-trigger-content arco-popover-popup-content';
                const arco_trigger_popup = document.querySelector('.arco-trigger-popup');
                if (arco_trigger_popup) {
                    (<HTMLElement>arco_trigger_popup).onclick = (e: MouseEvent) => {
                        e.stopPropagation();
                    }
                }
            }
        })
    } else {
        showkeywordDetail.value = false;
    }
}, 50);

// 点击小飞机快速转到关键字面板
const keyWordRef = ref();
const displayKeyPanel = () => {
    // 显示关键词模块
    showModular.value = '2';
    nextTick(() => {
        // 关键词模块显示具体项目
        keyWordRef.value.needShowDetailPanel(currentKid, currentIid);
    })
}

// 控制全屏模式
const fullScreenState = ref(false);
//全屏状态，默认的核心区高度
const layoutWriteHeight = ref('calc(100vh - 80px)');
const turnfullScreen = (state: boolean) => {
    window.$API.ipcSend('fullscreen', state);
    window.$API.ipcOnce('isFullScreen', (state: boolean) => {
        // 能否全屏
        fullScreenState.value = state;
        // 若全屏，关闭右侧
        if (state) {
            stowTheSide();
        }
        // 否则开启右侧
        else {
            openTheSide();
        }

        // 若全屏，折叠左侧
        isCollapse.value = state;
        // 修正高度，隐藏顶栏
        if (state) {
            layoutWriteHeight.value = 'calc(100vh - 5px)';
        } else {
            layoutWriteHeight.value = 'calc(100vh - 80px)';
        }
    })
}

// 纸张组件"快捷添加"关键词时触发
const addKeyWord = () => {
    // 如果当前显示了关键字面板，则通知其刷新数据
    if (showModular.value === '2') {
        keyWordRef.value.loadKeyWodData();
    } else {
        loadListData();
    }
}

// 收起右侧伸缩栏
const resizeBoxWdith = ref(525), showSiderRight = ref(true);
const stowTheSide = () => {
    showSiderRight.value = false;
}
const openTheSide = () => {
    showSiderRight.value = true;
}

// 获取页面上下相对位置并保存
let tempScrollTop = 0; // 放在外面才能保证目前保存的是最新的
const getScrollTop = (e: Event) => {
    tempScrollTop = (<HTMLElement>e.target).scrollTop ?? 0;
    if (showkeywordDetail.value) showkeywordDetail.value = false; // 关闭悬浮卡片
    setScrollTop();
}
const setScrollTop = throttle(() => {
    db.opus.where(':id').equals(query_id).modify(item => {
        item.data.forEach(item => {
            if (item.vid === vid.value) {
                item.volume.forEach(it => {
                    if (it.cid === cid.value) it.scrollTop = tempScrollTop;
                })
            }
        })
    })
}, 500);

// 获取列表数据
const booksLists: { data: Array<Volume> } = reactive({ data: [] });
let keyWordArr: Array<Array<string>> = [];
function loadListData(cb?: Function): void {
    db.opus.get(query_id).then(value => {
        if (value) {
            // 加载关键词
            keyWordArr = [];
            value.theKeyWord.forEach(item => {
                let tempArr: Array<string> = [];
                item.data.forEach(it => {
                    tempArr = it.otherName;
                    // kid iid 有其它用处 genkeywordMarks会忽略
                    tempArr.unshift(item.kid, it.iid, it.itemName);
                    // 去重
                    keyWordArr.push([...new Set(tempArr)]);
                })
            })
            // 渲染关键词
            keywordMarks.value = genkeywordMarks(keyWordArr);
            (<Array<Marker>>mainStore.keywordMarks) = keywordMarks.value;
            paperRef.value.setBooksData(value, keywordMarks.value);

            // 加载卷章列表
            booksLists.data = value.data.filter((item: Volume) => {
                // 判断目标卷是否有删除标记
                return !item.discard;
            });
            booksLists.data.forEach((item: Volume) => {
                item.volume = item.volume.filter((it: Chapter) => {
                    // 判断目标章是否有删除标记
                    return !it.discard;
                })
            });

            // 设置默认的scrollTop
            const len1 = booksLists.data.length;
            for (let i = 0; i < len1; i++) {
                if (booksLists.data[i].vid === vid.value) {
                    const len2 = booksLists.data[i].volume.length;
                    for (let j = 0; j < len2; j++) {
                        if (booksLists.data[i].volume[j].cid === cid.value) {
                            (<HTMLElement>document.querySelector('.arco-layout-content')).scrollTop =
                                <number>booksLists.data[i].volume[j].scrollTop;
                            break;
                        }
                    }
                    break;
                }
            }
        }
    }).then(() => {
        if (typeof cb === 'function') cb();
    })
}

// 自定义全局快捷键
window.addEventListener('click', leftMoreControl);
function leftMoreControl(): void {
    showLeftMore.value = '';
}
window.addEventListener('keydown', shortcut);
function shortcut(e: KeyboardEvent) {
    if (deletedCid.value === cid.value) {
        // Ctrl+s
        if (e.ctrlKey === true && e.key === 's') $message.error('目标已被删除!');
    } else {
        // Ctrl+s
        if (e.ctrlKey === true && e.key === 's') paperRef.value.saveDocData('保存成功！');
        // Ctrl+f
        if (e.ctrlKey === true && e.key === 'f') {
            showSearchBox.value = true;
            nextTick(() => {
                // 把关键字标记和纸张ref给搜索框
                searchBoxRef.value.setData(keywordMarks, paperRef.value);
            })
        }
    }
    // 拉开/缩紧右侧栏 Ctrl+[/]
    if (e.ctrlKey === true && e.key === '[') {
        console.log('拉开');
        if (showSiderRight.value && resizeBoxWdith.value < window.innerWidth - 200) resizeBoxWdith.value += 100;
    }
    if (e.ctrlKey === true && e.key === ']') {
        console.log('关闭');
        if (showSiderRight.value && resizeBoxWdith.value > 250) resizeBoxWdith.value -= 100;
    }
    // 展开/关闭右侧栏 Ctrl+{/}(Ctrl+Shift+[/])
    if (e.ctrlKey === true && e.key === '{') {
        openTheSide();
    }
    if (e.ctrlKey === true && e.key === '}') {
        stowTheSide();
    }
    // 打开全屏模式
    if (e.key === 'F1') {
        turnfullScreen(true);
    }
    // 关闭全屏模式
    if (e.key === 'Escape') {
        turnfullScreen(false);
    }
}

// 找到关键字数据
function modifyDbforItem(t_kid: string, t_iid: string, hd: Function, cb?: Function): void {
    db.opus.where(':id').equals(query_id).modify(item => {
        item.theKeyWord.forEach(item => {
            if (item.kid === t_kid) {
                item.data.forEach(it => {
                    if (it.iid === t_iid) hd(it);
                })
            }
        })
    }).then(() => {
        if (cb) cb();
    })
}

// 生命周期 
onMounted(() => {
    // 将纸张的ref给头部工具栏
    topToolRef.value.getPaperRef(paperRef.value);
    // 显示关键字小卡片
    const mainEditor = document.getElementById('mainEditor-w');
    window.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.ctrlKey) mainEditor?.addEventListener('mousemove', showSpanDetail);
    });
    window.addEventListener('keyup', (e: KeyboardEvent) => {
        if (!e.ctrlKey) mainEditor?.removeEventListener('mousemove', showSpanDetail);
    })
    // 屏幕大小改变时关闭悬浮卡片
    window.onresize = () => {
        showkeywordDetail.value = false;
    }
    // 点击任意地方关闭悬浮卡片（目标卡片禁用冒泡
    window.addEventListener('click', () => {
        if (showkeywordDetail.value) showkeywordDetail.value = false;
    });
})
onBeforeUnmount(() => {
    // 更新继续写作对应的vid_cid
    db.opus.update(query_id, { historRecord: { vid: vid.value, cid: cid.value } });
    saveTodaysCodewords();
})
onUnmounted(() => {
    window.removeEventListener('keydown', shortcut);
    window.removeEventListener('click', leftMoreControl);
})

</script>

<style scoped>
::-webkit-scrollbar-track {
    box-shadow: none;
    border-radius: 0;
    border-left: 1px dashed var(--color-border);
}
::-webkit-scrollbar-thumb {
    background-color: v-bind(scrollbarColor);
    border-radius: 0;
    border-left: 1px dashed var(--color-border);
}
.trigger::-webkit-scrollbar-thumb {
    background-color: rgb(var(--my-bg2-color));
}
.layout-write :deep(.arco-layout-header) {
    height: 35px;
    border-bottom: 2px dashed var(--color-border);
    background-color: rgb(var(--my-bg-color));
}

.layout-write :deep(.arco-layout-content) {
    height: v-bind(layoutWriteHeight);
    min-width: 20px;
    background-color: rgb(var(--my-bg-color));
    overflow-y: scroll;
}
</style>