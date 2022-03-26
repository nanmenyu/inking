<!-- 顶部模块栏 -->
<template>
    <div class="head-item">
        <span
            @click="toSpecialEditor('plot')"
            :class="type === 'plot' ? 'checked iconfont' : 'iconfont'"
        >&#xe620;&nbsp;备&nbsp;忘</span>
        <span
            @click="toSpecialEditor('keyword')"
            :class="type === 'keyword' ? 'checked iconfont' : 'iconfont'"
        >&#xe669;&nbsp;关键词</span>
        <span
            @click="toSpecialEditor('diagram')"
            :class="type === 'diagram' ? 'checked iconfont' : 'iconfont'"
        >&#xe703;&nbsp;关系图</span>
        <span
            @click="toSpecialEditor('timeline')"
            :class="type === 'timeline' ? 'checked iconfont' : 'iconfont'"
        >&#xe6b5;&nbsp;时间线</span>
        <span
            @click="toSpecialEditor('map')"
            :class="type === 'map' ? 'checked iconfont' : 'iconfont'"
        >&#xe655;&nbsp;地&nbsp;图</span>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

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