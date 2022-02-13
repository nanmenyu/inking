<template>
    <!-- 悬浮框 -->
    <div id="floatBox" ref="floatBox" @mousedown="moveStart($event)">
        <div class="floatBox-header">
            <div class="header-title">新建选项</div>
            <div class="header-close" @mousedown.stop>
                <icon-close />
            </div>
        </div>
        <div class="floatBox-body" @mousedown.stop>
            <slot></slot>
        </div>
    </div>
    <!-- 悬浮框 -->
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
    IconClose
} from '@arco-design/web-vue/es/icon';

// 可拖动悬浮框事件
const floatBox = ref();
const moveStart = (e: MouseEvent) => {
    let x = e.clientX - floatBox.value.offsetLeft;
    let y = e.clientY - floatBox.value.offsetTop;
    floatBox.value.onmousemove = function (e: MouseEvent) {
        floatBox.value.style.left = e.clientX - x + 'px';
        floatBox.value.style.top = e.clientY - y + 'px';
    }
    window.onmouseup = stopMoving;
    function stopMoving() {
        floatBox.value.onmousemove = null;
    }
}

</script>

<style lang="scss" src="../../style/floatBox.scss" scoped>
</style>