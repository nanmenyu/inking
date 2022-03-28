<template>
    <TitleBlock v-show="!fullScreenState"></TitleBlock>
    <div class="layout-read">
        <a-layout>
            <a-layout-header v-show="!fullScreenState">
                <TopToolbar @fullscreen="turnfullScreen" ref="topToolRef"></TopToolbar>
            </a-layout-header>
            <a-layout>
                <a-layout-sider style="display: none;"></a-layout-sider>
                <a-layout-content
                    @mouseover="showScroll"
                    @mouseout="closeScroll"
                    @scroll="setScrollTop"
                >
                    <div
                        v-if="!showSiderRight"
                        @click="openTheSide"
                        class="open-button"
                        title="展开右侧 Ctrl+Shift+["
                    >
                        <icon-left :stroke-width="2" />
                    </div>
                    <ReadingPaper @todata="sendPaperData" @toWebView="toWebView" ref="paperRef"></ReadingPaper>
                </a-layout-content>
                <a-resize-box
                    @moving-start="showIframeWrap = true"
                    @moving-end="showIframeWrap = false"
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
                        <div
                            v-if="showSiderRight"
                            @click="stowTheSide"
                            class="fold-button"
                            title="收起右侧 Ctrl+Shift+]"
                        >
                            <icon-right :stroke-width="2" />
                        </div>
                        <!-- 各个需要显示的组件 -->
                        <WebviewBlock ref="ref_WebviewBlock"></WebviewBlock>
                        <div v-if="showIframeWrap" class="right-Wrap"></div>
                    </div>
                </a-resize-box>
            </a-layout>
        </a-layout>
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, onUnmounted } from 'vue';
import { IconLeft, IconRight } from '@arco-design/web-vue/es/icon';
import { useRoute } from 'vue-router';
import TitleBlock from '../components/TitleBlock.vue';
import TopToolbar from '../components/TopToolbar.vue';
import ReadingPaper from '../components/ReadingPaper.vue';
import WebviewBlock from '../components/WebviewBlock.vue';
import { throttle } from '../utils/flowControl';
import { db } from '../db/db';
import '../style/readingPage.scss';

const route = useRoute();
const query_id = parseInt(<string>route.query.id);
const topToolRef = ref(), paperRef = ref(), ref_WebviewBlock = ref();
const showIframeWrap = ref(false); // 遮罩显示

// 转发纸张-->头部工具栏的数据
const sendPaperData = (data: Pagecount) => {
    topToolRef.value.getData(data);
}

/*----右侧滚动条的样式设置----*/
const scrollbarColor = ref('#ccc');
const showScroll = () => {
    scrollbarColor.value = 'var(--scrollbar-color)';
}
const closeScroll = () => {
    scrollbarColor.value = 'rgb(var(--my-bg-color))';
}

// 使用webview快捷搜索关键词
const toWebView = (str: string) => {
    ref_WebviewBlock.value.toSearch(str);
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
const setScrollTop = throttle((e: Event) => {
    db.ebooks.where(':id').equals(query_id).modify(item => {
        item.scrollTop = (<HTMLElement>e.target).scrollTop;
    })
}, 300)

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
        // 修正高度，隐藏顶栏
        if (state) {
            layoutWriteHeight.value = 'calc(100vh - 5px)';
        } else {
            layoutWriteHeight.value = 'calc(100vh - 80px)';
        }
    })
}


// 自定义全局快捷键
window.addEventListener('keydown', shortcut);
function shortcut(e: KeyboardEvent) {
    // 拉开/缩紧右侧栏 Ctrl+[/]
    if (e.ctrlKey === true && e.key === '[') {
        if (showSiderRight.value && resizeBoxWdith.value < window.innerWidth - 200) resizeBoxWdith.value += 100;
    }
    if (e.ctrlKey === true && e.key === ']') {
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

onMounted(() => {
    topToolRef.value.getPaperRef(paperRef.value); // 将纸张的ref给头部
})

onUnmounted(() => {
    window.removeEventListener('keydown', shortcut);
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
.layout-read :deep(.arco-layout-header) {
    height: 35px;
    border-bottom: 2px dashed var(--color-border);
    background-color: rgb(var(--my-bg-color));
}

.layout-read :deep(.arco-layout-content) {
    /* height: calc(100vh - 85px); */
    height: v-bind(layoutWriteHeight);
    min-width: 20px;
    background-color: rgb(var(--my-bg-color));
    overflow-y: scroll;
}
</style>