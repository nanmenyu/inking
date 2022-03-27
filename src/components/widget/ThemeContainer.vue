<!-- 主题选择器 -->
<template>
    <div class="theme-container">
        <div class="theme-container-header">
            <a-radio-group
                :model-value="themeMode"
                @change="changeTheme"
                type="button"
                style="border-radius: 10px;"
            >
                <a-radio style="border-radius: 10px;" value="light">
                    <icon-sun-fill />白昼
                </a-radio>
                <a-radio style="border-radius: 10px;" value="dark">
                    <icon-moon-fill />黑夜
                </a-radio>
            </a-radio-group>
            <a-radio-group
                :model-value="colorMode"
                @change="changeColorMode"
                style="margin-left: 10px;"
            >
                <a-radio value="main">主色</a-radio>
                <a-radio value="second">副色</a-radio>
            </a-radio-group>
        </div>
        <div class="theme-container-body">
            <ul>
                <li
                    v-for="color in themeColor"
                    :class="color === curChoiceColor ? 'li-checked' : ''"
                    @click="chooseThemeColor(color)"
                    :style="`background-color:${color}`"
                ></li>
            </ul>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { IconSunFill, IconMoonFill } from "@arco-design/web-vue/es/icon";
import { setSharedColor, setupMainThemes, setupSecondaryThemes } from '../../hooks/setupThemes';
import { themeColor } from '../../hooks/default';

const emit = defineEmits(['changePaperColor']);
const getLocalTheme = JSON.parse(localStorage.getItem('uTheme')!);
const themeMode = ref(getLocalTheme.mode),
    mainThemeColor = ref(getLocalTheme.mainColor),
    secondThemeColor = ref(getLocalTheme.secondColor);
const colorMode = ref('main');

const curChoiceColor = computed(() => {
    if (colorMode.value === 'main') {
        return mainThemeColor.value;
    } else {
        return secondThemeColor.value;
    }
})

// 快速更换主题模式
const changeTheme = (value: 'light' | 'dark') => {
    themeMode.value = value;
    if (value === 'light') {
        document.body.removeAttribute('arco-theme');
        emit('changePaperColor', ['#ffffff', '#333333']);
    } else if (value === 'dark') {
        document.body.setAttribute('arco-theme', 'dark');
        emit('changePaperColor', ['#17171a', '#e8e8e9']);
    }
    setSharedColor(value);
    // 存储主题设置
    localStorage.setItem('uTheme', JSON.stringify({
        mode: value,
        mainColor: mainThemeColor.value,
        secondColor: secondThemeColor.value
    }));
}

// 选择切换主副色按钮
const changeColorMode = (value: 'main' | 'second') => {
    colorMode.value = value;
}

// 选择主题颜色
const chooseThemeColor = (color: string) => {
    if (colorMode.value === 'main') {
        mainThemeColor.value = color;
        setupMainThemes(color);
    } else if (colorMode.value === 'second') {
        secondThemeColor.value = color;
        setupSecondaryThemes(color);
    }
    setSharedColor(themeMode.value);
    localStorage.setItem('uTheme', JSON.stringify({
        mode: document.body.getAttribute('arco-theme') === 'dark' ? 'dark' : 'light',
        mainColor: mainThemeColor.value,
        secondColor: secondThemeColor.value
    }));
}

</script>

<style lang="scss" scoped>
body[arco-theme="dark"] {
    .theme-container ul .li-checked {
        border: 2px solid #fff;
    }
}

.theme-container {
    padding: 10px;
    width: 330px;
    height: 140px;
    background-color: var(--color-bg-popup);
    border-radius: 10px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);

    .theme-container-header {
        width: 100%;
        height: 30px;
    }

    .theme-container-body {
        width: 100%;
        height: calc(100% - 40px);
        margin-top: 10px;
        border-radius: 10px;

        ul {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            list-style-type: none;

            li {
                box-sizing: border-box;
                width: 40px;
                height: 40px;
                margin: 0 6px;
                border: 2px solid transparent;
                border-radius: 15px;
                cursor: pointer;
            }

            .li-checked {
                border: 2px solid #444;
            }
        }
    }
}
</style>