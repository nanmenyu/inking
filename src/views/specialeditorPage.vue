<template>
    <TitleBlock></TitleBlock>
    <div class="content-box">
        <a-layout>
            <a-layout-header>
                <SpecialeditorTop @switchModular="switchModular"></SpecialeditorTop>
            </a-layout-header>
            <a-layout>
                <a-layout-content>
                    <PlotEditor v-if="showModular === 'plot'"></PlotEditor>
                    <KeywordEditor v-if="showModular === 'keyword'"></KeywordEditor>
                    <DiagramEditor v-if="showModular === 'diagram'"></DiagramEditor>
                    <TimelineEditor v-if="showModular === 'timeline'"></TimelineEditor>
                    <MapEditor v-if="showModular === 'map'"></MapEditor>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </div>
</template>

<script setup lang="ts">
import { ref, defineExpose } from 'vue';
import TitleBlock from '../components/TitleBlock.vue';
import SpecialeditorTop from '../components/widget/SpecialeditorTop.vue';
import PlotEditor from '../components/PlotEditor.vue';
import KeywordEditor from '../components/KeywordEditor.vue';
import DiagramEditor from '../components/DiagramEditor.vue';
import TimelineEditor from '../components/TimelineEditor.vue';
import MapEditor from '../components/MapEditor.vue';
import { useRoute } from 'vue-router';

// 通过route参数显示模块
const route = useRoute(), showModular = ref('');
showModular.value = route.query.type as string;

const switchModular = (type: string) => {
    showModular.value = type;
}

defineExpose({ switchModular });

</script>

<style scoped>
.content-box {
    box-sizing: border-box;
    position: relative;
    width: 100vw;
    height: calc(100vh - 40px);
    border-radius: 4px 0 0 0;
    background-color: rgb(var(--my-bg-color));
}

.content-box :deep(.arco-layout-header) {
    height: 35px;
    border-bottom: 2px dashed #e5e6eb;
    background-color: rgb(var(--my-bg-color));
}

.content-box :deep(.arco-layout-header) h2 {
    margin: 0;
    color: rgb(var(--primary-6));
}

.content-box :deep(.arco-layout-content) {
    /* overflow-y: scroll; */
}

.bar-left {
    position: absolute;
    top: 50%;
    left: 0;
    list-style-type: none;
    margin: 0;
    padding: 0;
    transform: translateY(-50%);
}
.bar-left li {
    width: 80px;
    height: 30px;
    margin: 10px;
    margin-left: 0;
    padding: 0 10px;
    font-size: 14px;
    text-align: right;
    line-height: 30px;
    color: rgb(var(--my-bg-color));
    background-color: rgb(var(--primary-6));
    cursor: pointer;
    border-radius: 0 8px 8px 0;
}

.bar-left li:hover {
    background-color: #4080ff;
}
</style>