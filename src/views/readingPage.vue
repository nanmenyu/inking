<template>
    <TitleBlock></TitleBlock>
    <div class="layout-read">
        <a-layout>
            <a-layout-header>
                <TopToolbar ref="topToolRef"></TopToolbar>
            </a-layout-header>
            <a-layout>
                <a-layout-content @mouseover="showScroll" @mouseout="closeScroll"></a-layout-content>
                <a-resize-box
                    @moving-start="showIframeWrap = true"
                    @moving-end="showIframeWrap = false"
                    :directions="['left']"
                    class="sider-right"
                    style="width: 510px;"
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
                        <WebviewBlock></WebviewBlock>
                        <div v-if="showIframeWrap" class="right-Wrap"></div>
                    </div>
                </a-resize-box>
            </a-layout>
        </a-layout>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import TitleBlock from '../components/TitleBlock.vue';
import WebviewBlock from '../components/WebviewBlock.vue';
import '../style/readingPage.scss';

const showIframeWrap = ref(false);

/*----右侧滚动条的样式设置----*/
const scrollbarColor = ref('#ccc');
const showScroll = () => {
    scrollbarColor.value = '#ccc';
}
const closeScroll = () => {
    scrollbarColor.value = '#f5f5f5';
}
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
    background-color: #f2f3f5;
}
.layout-read :deep(.arco-layout-header) {
    height: 35px;
    border-bottom: 2px dashed #e5e6eb;
    background-color: #fff;
}

.layout-read :deep(.arco-layout-content) {
    height: calc(100vh - 85px);
    min-width: 20px;
    background-color: #fff;
    overflow-y: scroll;
}
</style>