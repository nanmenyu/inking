<!-- 左侧边栏 -->
<template>
    <div class="sidebar">
        <div class="sidebar-user">
            <router-link to="/user">
                <div class="user-info">
                    <a-avatar :size="45" :style="{ backgroundColor: 'transparent' }">
                        <svg
                            viewBox="0 0 1025 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            width="45"
                            height="45"
                        >
                            <path fill="rgb(var(--my-secondary-6))" p-id="40560" />
                            <path fill="rgb(var(--my-secondary-6))" p-id="40561" />
                            <path fill="rgb(var(--primary-6))" p-id="40562" />
                            <path fill="rgb(var(--primary-6))" p-id="40563" />
                        </svg>
                    </a-avatar>
                    <div class="user-item">数据中心</div>
                    <div class="icon-right">
                        <icon-right />
                    </div>
                </div>
            </router-link>
            <div class="user-target" ref="uChart"></div>
        </div>
        <div class="sidebar-model">
            <router-link to="/">
                <a-button :type="choicedType === 't1' ? 'primary' : 'text'" class="btn">
                    <span class="iconfont">&#xe60f;</span>
                    <span>写作模式</span>
                </a-button>
            </router-link>
            <router-link to="readingMode">
                <a-button :type="choicedType === 't2' ? 'primary' : 'text'" class="btn">
                    <span class="iconfont">&#xe60e;</span>
                    <span>阅读模式</span>
                </a-button>
            </router-link>
            <router-link to="recycle">
                <a-button :type="choicedType === 't3' ? 'primary' : 'text'" class="btn">
                    <span class="iconfont">&#xe7f2;</span>
                    <span>回收站</span>
                </a-button>
            </router-link>
        </div>
        <div class="sidebar-bottom">
            <div>
                <router-link to="setting">
                    <a-tooltip content="设置" mini>
                        <icon-settings />
                    </a-tooltip>
                </router-link>
            </div>
            <div @click="openWithBrowser('http://inkingapp.cn/')">
                <a-tooltip content="官网 inkingapp.cn" mini>
                    <icon-public />
                </a-tooltip>
            </div>
            <div @click="openWithBrowser('https://github.com/nanmenyu/inking')">
                <a-tooltip content="源码" mini>
                    <icon-github />
                </a-tooltip>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { IconRight, IconSettings, IconGithub, IconPublic } from '@arco-design/web-vue/es/icon';
import { useRoute } from 'vue-router';
import { useThemeStore, useMainStore } from '../store';
import { setChart } from '../hooks/sidebarLeft';

const themeStore = useThemeStore();
const mainStore = useMainStore();

const route = useRoute(), choicedType = ref(''), uChart = ref();
switch (route.path) {
    case '/':
        choicedType.value = 't1';
        break;
    case '/readingMode':
        choicedType.value = 't2';
        break;
    case '/recycle':
        choicedType.value = 't3';
        break;
}

// 用浏览器打开链接
const openWithBrowser = (url: string) => {
    window.$API.openExternalUrl(url);
}

// 检测主题变化修改颜色
const secondaryColor = ref(''), fontColor = ref('');
watch(computed(() => {
    return themeStore.theme;
}), () => {
    secondaryColor.value = themeStore.my_secondary_6;
    fontColor.value = themeStore.color_text_1;
    setChart(uChart.value, color.value, task.value);
})
// 检测副颜色是否发生改变
watch(computed(() => {
    return themeStore.my_secondary_6;
}), () => {
    secondaryColor.value = themeStore.my_secondary_6;
    fontColor.value = themeStore.color_text_1;
    setChart(uChart.value, color.value, task.value);
})

// 检测每日计划是否发生改变
watch(computed(() => {
    return mainStore.dailyPlan;
}), () => {
    setChart(uChart.value, color.value, task.value);
})

// 今日码字数量
const toDayCodeword = computed(() => {
    return mainStore.baseTotalNumber_today + mainStore.TotalNumber_thisTime - mainStore.contrastTotalNumber_thisTime;
})

// 图表颜色随主题色变换而变换
const color = computed(() => {
    return {
        fontColor: fontColor.value,
        secondaryColor: secondaryColor.value
    }
})

// 图表每日任务变化
const task = computed(() => {
    return {
        completed: toDayCodeword.value,
        incomplete: Math.floor(mainStore.dailyPlan) - toDayCodeword.value
    }
})

onMounted(() => {
    // 获得副主题色
    secondaryColor.value = getComputedStyle(document.body).getPropertyValue('--my-secondary-6');
    // 获取文字色
    fontColor.value = getComputedStyle(document.body).getPropertyValue('--color-text-1');
    // 初次进入时延时展示右侧每日任务动画,调整异步执行栈，解决打包后出现的BUG
    if (mainStore.firstEntry) {
        setChart(uChart.value, color.value, task.value);
    } else {
        setTimeout(() => {
            setChart(uChart.value, color.value, task.value);
        }, 100)
    }
});

</script>

<style lang="scss" src="../style/sidebarleft.scss" scoped>
</style>