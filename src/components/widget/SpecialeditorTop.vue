<template>
    <div class="head-item">
        <span @click="toSpecialEditor('plot')" :class="type === 'plot' ? 'checked' : ''">
            <object :data="svg_plot" type="image/svg+xml"></object> &nbsp;剧&nbsp;情
        </span>
        <span @click="toSpecialEditor('keyword')" :class="type === 'keyword' ? 'checked' : ''">
            <object :data="svg_keyword" type="image/svg+xml"></object> &nbsp;关键词
        </span>
        <span @click="toSpecialEditor('diagram')" :class="type === 'diagram' ? 'checked' : ''">
            <object :data="svg_diagram" type="image/svg+xml"></object> &nbsp;关系图
        </span>
        <span @click="toSpecialEditor('timeline')" :class="type === 'timeline' ? 'checked' : ''">
            <object :data="svg_timeline" type="image/svg+xml"></object> &nbsp;时间线
        </span>
        <span @click="toSpecialEditor('map')" :class="type === 'map' ? 'checked' : ''">
            <object :data="svg_map" type="image/svg+xml"></object> &nbsp;地&nbsp;图
        </span>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import svg_plot from '../../assets/svg/plot.svg';
import svg_keyword from '../../assets/svg/keyword.svg';
import svg_diagram from '../../assets/svg/diagram.svg';
import svg_timeline from '../../assets/svg/timeline.svg';
import svg_map from '../../assets/svg/map.svg';

const emit = defineEmits(['switchModular']);

const route = useRoute(), type = ref('');
type.value = <string>route.query.type;

// 调整模块
const toSpecialEditor = (_type: string) => {
    type.value = _type;
    emit('switchModular', _type);
}
</script>

<style scoped>
.head-item {
    float: right;
    width: 100%;
    user-select: none;
}

.head-item span {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    padding: 0 15px;
    color: #4e5969;
    border-radius: 2px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.head-item span:hover {
    background-color: #f2f3f5;
}
.checked {
    background-color: #f2f3f5;
}
</style>