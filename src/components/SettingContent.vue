<template>
    <div class="setting-content">
        <h2>设置 (v{{ config.version }})</h2>
        <ul class="list">
            <li title="选择从系统中获取的字体">
                <span>系统字体</span>
                <a-select
                    @change="setFont"
                    :style="{ width: '250px' }"
                    v-model="currentFont"
                    :options="fonList"
                    :placeholder="currentFont"
                    :virtual-list-props="{ height: 200 }"
                />
            </li>
            <li>
                <span>系统主题</span>
                <a-trigger trigger="click" :popup-translate="[0, 10]" show-arrow>
                    <a-button type="outline">点击修改</a-button>
                    <template #content>
                        <ThemeContainer></ThemeContainer>
                    </template>
                </a-trigger>
            </li>
            <li>
                <span>每日计划</span>
                <a-input-number
                    v-model="uDailyPlan"
                    :style="{ width: '250px' }"
                    :min="1"
                    :max="100000"
                />
            </li>
            <li>
                <span>默认查词引擎</span>
                <a-radio-group
                    @change="changeSearchEngine"
                    :model-value="searchEngine"
                    type="button"
                >
                    <a-radio value="wordSearch_baidu">百度汉语</a-radio>
                    <a-radio value="wordSearch_zdic">汉典</a-radio>
                </a-radio-group>
            </li>
            <li>
                <span>检测更新</span>
            </li>
        </ul>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref, Ref, watch } from 'vue';
import ThemeContainer from '../components/widget/ThemeContainer.vue';
import { useMainStore } from '../store';
import config from '../../package.json';

const mainStore = useMainStore();
let element_app: HTMLElement | null = null;

// 获取字体列表
const currentFont = ref('默认字体');
const fonList: Ref<Array<string>> = ref([]);
window.$API.ipcSend('count-fonts-item');
window.$API.ipcOnce('get-fonts-item', (data: Array<string>) => {
    // 这里可以通过分析内容是中文还是英文选择是否逆序
    fonList.value = data.reverse();
    fonList.value.unshift('默认字体');
});

// 设置系统字体
const setFont = () => {
    if (currentFont.value === '默认字体') {
        element_app?.removeAttribute('style');
        localStorage.setItem('uSystemFont', '');
    } else {
        element_app?.setAttribute('style', `font-family:${currentFont.value};`);
        localStorage.setItem('uSystemFont', currentFont.value);
    }
}

// 设置每日计划
const uDailyPlan = ref(mainStore.dailyPlan);
watch(uDailyPlan, value => {
    localStorage.setItem('uDailyPlan', value);
    mainStore.dailyPlan = value;
})

// 设置查词引擎
const searchEngine = ref(mainStore.searchEngine);
const changeSearchEngine = (value: string) => {
    searchEngine.value = value;
    localStorage.setItem('uSearchEngine', value);
    mainStore.searchEngine = value;
}

onMounted(() => {
    element_app = document.getElementById('app');
    if (element_app && element_app.style.fontFamily !== '') {
        currentFont.value = element_app.style.fontFamily;
    } else {
        currentFont.value = '默认字体';
    }
})
</script>

<style lang="scss" src="../style/settingcontent.scss" scoped>
</style>