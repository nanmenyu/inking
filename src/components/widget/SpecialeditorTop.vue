<template>
    <div class="head-item">
        <span @click="toSpecialEditor('plot')" :class="type === 'plot' ? 'checked' : ''">
            <img :src="svg_plot" style="vertical-align:middle" />&nbsp;剧&nbsp;情
        </span>
        <span @click="toSpecialEditor('keyword')" :class="type === 'keyword' ? 'checked' : ''">
            <img :src="svg_keyword" style="vertical-align:middle" />&nbsp;关键词
        </span>
        <span @click="toSpecialEditor('diagram')" :class="type === 'diagram' ? 'checked' : ''">
            <img :src="svg_diagram" style="vertical-align:middle" />&nbsp;关系图
        </span>
        <span @click="toSpecialEditor('timeline')" :class="type === 'timeline' ? 'checked' : ''">
            <img :src="svg_timeline" style="vertical-align:middle" />&nbsp;时间线
        </span>
        <span @click="toSpecialEditor('map')" :class="type === 'map' ? 'checked' : ''">
            <img :src="svg_map" style="vertical-align:middle" />&nbsp;地&nbsp;图
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

<style lang="scss" src="../../style/specialeditorTop.scss" scoped>
</style>