<!-- 漂浮工具栏 -->
<template>
    <a-trigger
        :trigger="['click']"
        clickToClose
        position="bottom"
        v-model:popupVisible="popupVisible"
    >
        <div
            @contextmenu="showFloatToolMenu()"
            ref="buttonTrigger"
            class="button-trigger"
            :style="floatToolPosition[position]"
            title="右键更换位置"
        >
            <!-- 漂浮工具栏的菜单 -->
            <div
                @click.stop
                v-if="isFloatToolMenu"
                ref="floatToolMenu"
                class="floatTool-menu"
                :style="floatToolMenuPositon[position]"
            >
                <ul>
                    <li
                        v-for="(item, i) in textPrompt[position]"
                        @click="moveFloatTool(item)"
                        :key="i"
                    >到{{ item }}角</li>
                </ul>
            </div>
            <IconClose v-if="popupVisible" />
            <IconMessage v-else />
        </div>
        <template #content>
            <a-menu
                mode="popButton"
                :tooltipProps="{ position: 'left', mini: true }"
                showCollapseButton
                @menu-item-click="choicePopButton"
            >
                <a-menu-item style="margin: 10px 0;" key="0">
                    <template #icon>
                        <icon-public />
                    </template>
                    WebView
                </a-menu-item>
                <a-menu-item style="margin: 10px 0;" key="1" class="iconfont">
                    <template #icon>&#xe620;</template>
                    备忘
                </a-menu-item>
                <a-menu-item style="margin: 10px 0;" key="2" class="iconfont">
                    <template #icon>&#xe669;</template>
                    关键字
                </a-menu-item>
                <a-menu-item style="margin: 10px 0;" key="3" class="iconfont">
                    <template #icon>&#xe703;</template>
                    关系图
                </a-menu-item>
                <a-menu-item style="margin: 10px 0;" key="4" class="iconfont">
                    <template #icon>&#xe6b5;</template>
                    时间线
                </a-menu-item>
                <a-menu-item style="margin: 10px 0;" key="5" class="iconfont">
                    <template #icon>&#xe655;</template>
                    地图
                </a-menu-item>
            </a-menu>
        </template>
    </a-trigger>
</template>

<script setup lang='ts'>
import { ref, onUnmounted } from 'vue';
import { IconClose, IconMessage, IconPublic } from '@arco-design/web-vue/es/icon';

const emit = defineEmits(['choiceItem']);
const popupVisible = ref(false);

// 显示漂浮工具栏的菜单修改位置
const isFloatToolMenu = ref(false), floatToolMenu = ref(), buttonTrigger = ref();
//四个位置四种状态
const floatToolPosition = ['top:0;left:4px;', 'top:0;right:4px;', 'bottom:15px;right:4px;', 'bottom:15px;left:4px;'];
const floatToolMenuPositon = ['top:20px;left:20px', 'top:20px;right:20px', 'bottom:20px;right:20px', 'bottom:20px;left:20px'];
const textPrompt = [['右上', '右下', '左下'], ['左上', '左下', '右下'], ['左下', '左上', '右上'], ['左上', '右上', '右下']];
const position = ref(0); // 某个状态的索引
// 读取缓存
const getFloatToolPosition = localStorage.getItem('floatToolPosition');
if (getFloatToolPosition === null) {
    localStorage.setItem('floatToolPosition', '0');
} else {
    position.value = parseInt(getFloatToolPosition);
}
// 显示与切换
const showFloatToolMenu = () => {
    isFloatToolMenu.value = true;
    popupVisible.value = false;
}
const moveFloatTool = (type: string) => {
    textPrompt.forEach((item, index) => {
        if (item.indexOf(type) === -1) {
            position.value = index;
            localStorage.setItem('floatToolPosition', index.toString());
        }
    })
    isFloatToolMenu.value = false;
}

// 选择具体项
const choicePopButton = (key: string) => {
    emit('choiceItem', key);
}

// 点击页面的任意位置关闭菜单
window.addEventListener('click', closeFloatToolMenu);
function closeFloatToolMenu() {
    isFloatToolMenu.value = false;
}
onUnmounted(() => {
    window.removeEventListener('click', closeFloatToolMenu);
})
</script>

<style lang="scss" scoped>
.button-trigger {
    position: absolute;
    z-index: 9;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    color: var(--color-white);
    background-color: rgb(var(--primary-6));
    box-shadow: 0 4px 10px rgb(0 0 0 / 10%);
    font-size: 14px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.1s;

    .floatTool-menu {
        box-sizing: border-box;
        position: absolute;
        width: 85px;
        height: 118px;
        z-index: 12;
        padding: 4px 0;
        background-color: rgb(var(--my-bg-color));
        border: 1px solid #e5e6eb;
        border-radius: 4px;
        box-shadow: 0 4px 10px #0000001a;

        ul {
            margin-top: 0;
            margin-bottom: 0;
            padding-left: 0;
            list-style: none;

            li {
                box-sizing: border-box;
                width: 100%;
                padding: 0 12px;
                display: flex;
                align-items: center;
                color: #1d2129;
                line-height: 36px;
                text-align: center;
                cursor: pointer;
                transition: background-color 0.2s;

                &:hover {
                    background-color: rgb(var(--my-bg2-color));
                }
            }
        }
    }
}
</style>