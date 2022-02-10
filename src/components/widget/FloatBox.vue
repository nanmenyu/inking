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

<style scoped>
/* 悬浮框样式 */

#floatBox {
    z-index: 999;
    position: fixed;
    top: 300px;
    left: 500px;
    width: 300px;
    height: 250px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 4px 10px #0000001a;
}
.floatBox-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 40px;
    padding: 0 20px;
    border-bottom: 1px solid #e5e6eb;
    cursor: move;
}
.floatBox-header .header-title {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    margin-top: 4px;
    color: #1d2129;
    font-weight: 500;
    font-size: 16px;
}
.floatBox-header .header-close {
    margin-left: -12px;
    padding: 4px;
    color: #1d2129;
    font-size: 12px;
    cursor: pointer;
    border-radius: 50%;
}
.floatBox-header .header-close:hover {
    background-color: #f2f3f5;
}

.floatBox-body {
    box-sizing: border-box;
    width: 80%;
    height: 70%;
    background-color: pink;
    margin: 0 auto;
}
</style>