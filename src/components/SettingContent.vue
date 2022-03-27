<template>
    <div class="setting-content">
        <h2>设置 (v{{ config.version }})</h2>
        <ul class="list">
            <li title="选择页面的主题与配色">
                <span>系统主题</span>
                <a-space>
                    <a-trigger trigger="click" :popup-translate="[0, 10]">
                        <a-button type="outline">点击修改</a-button>
                        <template #content>
                            <ThemeContainer></ThemeContainer>
                        </template>
                    </a-trigger>
                    <a-trigger trigger="click" :popup-translate="[0, 0]">
                        <a-button type="outline">自定义色板</a-button>
                        <template #content>
                            <div class="theme-container-body" title="点击孔位修改颜色">
                                <div class="left-Sketch">
                                    <Sketch v-model="curColor" />
                                </div>
                                <ul>
                                    <li
                                        v-for="(color, i) in themeColor"
                                        :class="i === curColorIndex ? 'li-checked' : ''"
                                        @click="chooseColor(i, color)"
                                        :style="`background-color:${color}`"
                                    ></li>
                                </ul>
                            </div>
                        </template>
                    </a-trigger>
                </a-space>
            </li>
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
            <li title="设定每日的目标码字数">
                <span>每日计划</span>
                <a-input-number
                    :default-value="uDailyPlan"
                    @change="changeDailyPlan"
                    :style="{ width: '250px' }"
                    :min="1"
                    :max="100000"
                />
            </li>
            <li title="数据中心-关键词分析-趋势中每页的数据条数">
                <span>趋势分析每页显示数</span>
                <a-input-number
                    :default-value="uNumPerpage"
                    @change="changeNumPerpage"
                    :style="{ width: '250px' }"
                    :min="1"
                    :max="20"
                />
            </li>
            <li title="快捷查词默认的引擎">
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
            <li style="height: 100px;">
                <span>敏感词词典</span>
                <a-textarea
                    :default-value="sensitiveWords"
                    @input="getSensitiveWords"
                    @clear="getSensitiveWords('')"
                    placeholder="添加自定义敏感词，每个词用'/'分开,例如: 词A/词B/词C"
                    :max-length="1000"
                    style="width:70%;overflow: hidden;"
                    :auto-size="{
                        minRows: 4,
                        maxRows: 4
                    }"
                    allow-clear
                    show-word-limit
                />
            </li>
            <li style="height: 100px;">
                <span>非敏感词</span>
                <a-textarea
                    :default-value="noneSensitiveWords"
                    @input="getNoneSensitiveWords"
                    @clear="getNoneSensitiveWords('')"
                    placeholder="声明非敏感词，用于忽略默认的敏感词，用法同上"
                    :max-length="1000"
                    style="width:70%;overflow: hidden;"
                    :auto-size="{
                        minRows: 4,
                        maxRows: 4
                    }"
                    allow-clear
                    show-word-limit
                />
            </li>
            <li>
                <span>检测更新</span>
                <a-button @click="detectNewversion" type="outline" :loading="loading">点击检测</a-button>
            </li>
        </ul>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref, Ref } from 'vue';
import ThemeContainer from '../components/widget/ThemeContainer.vue';
import { useMainStore } from '../store';
import config from '../../package.json';
import toupdate from '../hooks/toupdate';
import useCurrentInstance from '../utils/useCurrentInstance';
import { Sketch } from '@ckpack/vue-color';
import { themeColor } from '../hooks/default';

const mainStore = useMainStore();
const { proxy } = useCurrentInstance();
let element_app: HTMLElement | null = null;

// 调整色版
const curColorIndex = ref(0), curColor = ref(themeColor[0]);
const chooseColor = (index: number, color: string) => {
    curColor.value = color;
    curColorIndex.value = index;
}

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
const changeDailyPlan = (value: number) => {
    if (value) {
        localStorage.setItem('uDailyPlan', value.toString());
        mainStore.dailyPlan = value;
    }
}
// 趋势分析每页显示数
const uNumPerpage = ref(mainStore.numPerpage);
const changeNumPerpage = (value: number) => {
    if (value) {
        localStorage.setItem('uNumPerpage', value.toString());
        mainStore.numPerpage = value;
    }
}

// 设置查词引擎
const searchEngine = ref(mainStore.searchEngine);
const changeSearchEngine = (value: string) => {
    searchEngine.value = value;
    localStorage.setItem('uSearchEngine', value);
    mainStore.searchEngine = value;
}

// 检测更新
const loading = ref(false);
const detectNewversion = () => {
    loading.value = true;
    toupdate(proxy, true, () => {
        // 加载结束
        loading.value = false;
    });
}

// 自定义敏感词和非敏感词
const sensitiveWords = ref(localStorage.getItem('sWords') ?? '');
const noneSensitiveWords = ref(localStorage.getItem('noneSWords') ?? '');
const getSensitiveWords = (value: string) => {
    localStorage.setItem('sWords', value);
}
const getNoneSensitiveWords = (value: string) => {
    localStorage.setItem('noneSWords', value);
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