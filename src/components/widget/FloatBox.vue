<!-- 悬浮框 -->
<template>
    <div id="floatBox" ref="floatBox" @mousedown="moveStart">
        <div class="floatBox-header">
            <div class="header-title">{{ props.title }}</div>
            <div class="header-close" @click="modify" @mousedown.stop>
                <icon-close />
            </div>
        </div>
        <div class="floatBox-body" @mousedown.stop>
            <slot></slot>
        </div>
        <div class="floatBox-footer">
            <a-space size="large">
                <a-button @click="modify" @mousedown.stop>取消</a-button>
                <a-button
                    @click="determine"
                    @mousedown.stop
                    :disabled="determineDisabled"
                    type="primary"
                >{{ props.determine }}</a-button>
            </a-space>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
    IconClose
} from '@arco-design/web-vue/es/icon';
const props = defineProps<{
    title: string,
    determine: string,
    determineDisabled?: boolean
}>();

const emit = defineEmits(['toModify', 'toDetermine']);

// 关闭、取消键
const modify = () => { emit('toModify') }
// 确认、添加键
const determine = () => { emit('toDetermine') }

// 可拖动悬浮框事件
const floatBox = ref();
let floatBoxWidth = 0, floatBoxHeight = 0;
const moveStart = (e: MouseEvent) => {
    let x = e.clientX - floatBox.value.offsetLeft;
    let y = e.clientY - floatBox.value.offsetTop;
    floatBoxWidth = floatBox.value.clientWidth;
    floatBoxHeight = floatBox.value.clientHeight;

    floatBox.value.onmousemove = function (e: MouseEvent) {
        let left = e.clientX - x, top = e.clientY - y;
        // 左/上不越界
        left = left < 0 ? 0 : left;
        top = top < 0 ? 0 : top;
        // 右/下不越界
        left = left > (window.innerWidth - floatBoxWidth) ? (window.innerWidth - floatBoxWidth) : left;
        top = top > (window.innerHeight - floatBoxHeight) ? (window.innerHeight - floatBoxHeight) : top;
        floatBox.value.style.left = left + 'px';
        floatBox.value.style.top = top + 'px';
    }
    window.onmouseup = stopMoving;
    function stopMoving() {
        if (floatBox.value) floatBox.value.onmousemove = null;
    }
}

</script>

<style lang="scss" src="../../style/floatBox.scss" scoped>
</style>