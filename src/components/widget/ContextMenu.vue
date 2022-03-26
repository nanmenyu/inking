<!-- 右键菜单 -->
<template>
    <div v-if="showContextmenu" id="content-contextmenu" ref="contextmenu">
        <div
            v-for="item in props.menuItem"
            @mousedown="choiceItem(item)"
            id="contextmenu-item"
        >{{ item }}</div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, nextTick } from 'vue';
const props = defineProps<{
    mode: 'reading' | 'writing',
    menuItem: Array<string>
}>();
const emit = defineEmits(['choice']);

// 设置将要设置的容器
// const container = ref();
// 右键菜单栏相关
const contextmenu = ref(), showContextmenu = ref(false);
const setContainer = (container: HTMLElement) => {
    container.addEventListener('contextmenu', (e: MouseEvent) => {
        showContextmenu.value = true;
        const posX = e.screenX, posY = e.screenY;
        nextTick(() => {
            contextmenu.value.style.left = posX + 8 + 'px';
            contextmenu.value.style.top = posY + 4 + 'px';
        })
    })
}

const choiceItem = (item: string) => {
    // 写作模式——返回选中的项目名称
    if (props.mode === 'writing') {
        emit('choice', { item });
    }
    // 阅读模式--获取选中的文字
    else if (props.mode === 'reading') {
        emit('choice', { item, select: window.getSelection()!.toString() });
    }
}

onMounted(() => {
    // 右键呼出菜单
    window.addEventListener('click', (e: MouseEvent) => {
        // 点击屏幕中除了菜单意外的地方时关闭菜单
        if ((<HTMLElement>e.target).id !== 'content-contextmenu' || (<HTMLElement>e.target).id !== 'contextmenu-item') {
            showContextmenu.value = false;
        }
    })
})

defineExpose({
    setContainer
})
</script>

<style lang="scss" scoped>
#content-contextmenu {
    box-sizing: border-box;
    z-index: 9;
    position: fixed;
    top: 0;
    right: 0;
    width: 90px;
    padding: 4px 0;
    border: 1px solid var(--color-fill-3);
    border-radius: 4px;
    background-color: var(--color-bg-popup);
    box-shadow: 0 4px 10px #0000001a;
    #contextmenu-item {
        box-sizing: border-box;
        width: 100%;
        padding: 0 12px;
        color: var(--color-text-1);
        font-size: 12px;
        line-height: 36px;
        text-align: center;
        background-color: transparent;
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &:hover {
            background-color: var(--color-fill-2);
        }
    }
}
</style>