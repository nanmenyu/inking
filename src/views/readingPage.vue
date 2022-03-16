<template>
    <TitleBlock></TitleBlock>
    <div class="layout-read">
        <a-layout>
            <a-layout-header>
                <TopToolbar ref="topToolRef"></TopToolbar>
            </a-layout-header>
            <a-layout>
                <a-layout-sider style="display: none;"></a-layout-sider>
                <a-layout-content
                    @mouseover="showScroll"
                    @mouseout="closeScroll"
                    @scroll="setScrollTop"
                >
                    <ReadingPaper @todata="sendPaperData" @toWebView="toWebView" ref="paperRef"></ReadingPaper>
                </a-layout-content>
                <a-resize-box
                    @moving-start="showIframeWrap = true"
                    @moving-end="showIframeWrap = false"
                    :directions="['left']"
                    class="sider-right"
                    style="width: 150px;"
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
import { ref, onMounted } from 'vue';
import TitleBlock from '../components/TitleBlock.vue';
import TopToolbar from '../components/TopToolbar.vue';
import ReadingPaper from '../components/ReadingPaper.vue';
import WebviewBlock from '../components/WebviewBlock.vue';
import { throttle } from '../utils/flowControl';
import { db } from '../db/db';
import { useRoute } from 'vue-router';
import '../style/readingPage.scss';

const route = useRoute();
const query_id = parseInt(<string>route.query.id);
const topToolRef = ref(), paperRef = ref(), ref_WebviewBlock = ref();
const showIframeWrap = ref(false);

// 转发纸张-->头部工具栏的数据
const sendPaperData = (data: Pagecount) => {
    topToolRef.value.getData(data);
}

/*----右侧滚动条的样式设置----*/
const scrollbarColor = ref('#ccc');
const showScroll = () => {
    scrollbarColor.value = '#ccc';
}
const closeScroll = () => {
    scrollbarColor.value = '#f5f5f5';
}

// 使用webview快捷搜索关键词
const toWebView = (str: string) => {
    ref_WebviewBlock.value.toSearch(str);
}

// 获取页面上下相对位置并保存
const setScrollTop = throttle((e: Event) => {
    db.ebooks.where(':id').equals(query_id).modify(item => {
        item.scrollTop = (<HTMLElement>e.target).scrollTop;
    })
}, 300)

onMounted(() => {
    topToolRef.value.getPaperRef(paperRef.value); // 将纸张的ref给头部
})
</script>

<style scoped>
::-webkit-scrollbar-track {
    box-shadow: none;
    border-radius: 0;
    border-left: 1px dashed #e5e6eb;
}
::-webkit-scrollbar-thumb {
    background-color: v-bind(scrollbarColor);
    border-radius: 0;
    border-left: 1px dashed #e5e6eb;
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
    height: calc(100vh - 85px);
    min-width: 20px;
    background-color: rgb(var(--my-bg-color));
    overflow-y: scroll;
}
</style>