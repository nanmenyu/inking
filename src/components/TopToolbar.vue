<template>
    <div class="head-item">
        <!-- 全屏洁净模式 -->
        <a-tooltip position="bottom" mini content="全屏洁净模式(F1)">
            <a-button @click="turnFullScreen" class="headerBtn">
                <icon-fullscreen />&nbsp;全屏
            </a-button>
        </a-tooltip>
        <!-- 文字设置 -->
        <a-dropdown trigger="hover">
            <a-button class="headerBtn" style="padding-right: 0;">
                <svg
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                >
                    <path id="1" />
                    <path id="2" />
                </svg>&nbsp;&nbsp;文字
                <icon-down />
            </a-button>
            <template #content>
                <a-trigger position="right" :popup-translate="[5, 16]">
                    <a-doption>
                        <svg
                            viewBox="0 0 1024 1024"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                        >
                            <path id="3" />
                            <path id="4" />
                        </svg>&nbsp;&nbsp;字体大小
                    </a-doption>
                    <template #content>
                        <a-space class="trigger" style="padding:0 10px;">
                            <a-input-number
                                v-model="fontSize"
                                :min="1"
                                :max="50"
                                mode="button"
                                style="width:108px"
                                @change="changeFontSize()"
                            />
                            <a-slider
                                v-model="fontSize"
                                :step="1"
                                :min="1"
                                :max="50"
                                :marks="{ 1: '1px', 22: '22px', 50: '50px' }"
                                :format-tooltip="(value: number) => {
                                    return `${value}px`;
                                }"
                                :style="{ width: '280px', transform: 'translateY(4px)' }"
                                @change="changeFontSize()"
                            />
                        </a-space>
                    </template>
                </a-trigger>
                <a-trigger position="right" :popup-translate="[5, 0]">
                    <a-doption>
                        <svg
                            viewBox="0 0 1024 1024"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                        >
                            <path id="5" />
                        </svg>&nbsp;&nbsp;字符行高
                    </a-doption>
                    <template #content>
                        <a-space class="trigger" style="padding:0 10px;">
                            <a-input-number
                                v-model="lineHeight"
                                :step="0.05"
                                :min="0"
                                :max="5"
                                mode="button"
                                :style="{ width: '108px' }"
                                @change="changeLineHeight()"
                            />
                            <a-slider
                                v-model="lineHeight"
                                :step="0.05"
                                :min="0"
                                :max="5"
                                :marks="{ 0: '0em', 1.5: '1.5em', 5: '5em' }"
                                :format-tooltip="(value: number) => {
                                    return `${value}em`;
                                }"
                                :style="{ width: '280px', transform: 'translateY(4px)' }"
                                @change="changeLineHeight()"
                            />
                        </a-space>
                    </template>
                </a-trigger>
                <a-trigger position="right" :popup-translate="[5, 0]">
                    <a-doption>
                        <svg
                            viewBox="0 0 1024 1024"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                        >
                            <path id="6" />
                            <path id="7" />
                        </svg>&nbsp;&nbsp;文字粗细
                    </a-doption>
                    <template #content>
                        <a-space class="trigger" style="padding: 10px 20px;">
                            <a-radio-group
                                v-model="fontWeight"
                                @change="changeFontWeight"
                                direction="vertical"
                            >
                                <a-radio value="lighter">lighter</a-radio>
                                <a-radio value="normal">normal</a-radio>
                                <a-radio value="bold">bold</a-radio>
                            </a-radio-group>
                        </a-space>
                    </template>
                </a-trigger>
                <a-trigger position="right" :popup-translate="[5, 0]">
                    <a-doption>
                        <svg
                            viewBox="0 0 1024 1024"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                        >
                            <path id="8" />
                        </svg>&nbsp;&nbsp;选择字体
                    </a-doption>
                    <template #content>
                        <ul class="trigger typeface" @scroll="fontlistScroll" ref="fontListNode">
                            <li class="typeface-head">{{ uLocalOption.uFont }}</li>
                            <li
                                v-for="(item, i) in fontList"
                                :key="i"
                                :title="item"
                                :style="{ fontFamily: item }"
                                @click="selectFont(i)"
                            >{{ item }}</li>
                        </ul>
                    </template>
                </a-trigger>
                <a-trigger position="right" :popup-translate="[5, 0]">
                    <a-doption>
                        <svg
                            viewBox="0 0 1024 1024"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                        >
                            <path id="9" />
                            <path id="10" />
                        </svg>&nbsp;&nbsp;文字颜色
                    </a-doption>
                    <template #content>
                        <div class="trigger" style="margin-top: 24px;">
                            <Sketch v-model="fontColor" />
                        </div>
                    </template>
                </a-trigger>
            </template>
        </a-dropdown>
        <!-- 段落设置 -->
        <a-dropdown trigger="hover">
            <a-button class="headerBtn" style="padding-right: 0;">
                <svg
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                >
                    <path id="11" />
                    <path id="12" />
                </svg>&nbsp;&nbsp;段落
                <icon-down />
            </a-button>
            <template #content>
                <a-trigger position="right" :popup-translate="[5, 16]">
                    <a-doption>
                        <svg
                            viewBox="0 0 1024 1024"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                        >
                            <path id="13" />
                            <path id="14" />
                            <path id="15" />
                        </svg>&nbsp;&nbsp;段落间距
                    </a-doption>
                    <template #content>
                        <a-space class="trigger" style="padding: 0 10px;">
                            <a-input-number
                                v-model="segSpacing"
                                :min="0"
                                :max="100"
                                mode="button"
                                :style="{ width: '108px' }"
                                @change="changeSegSpacing()"
                            />
                            <a-slider
                                v-model="segSpacing"
                                :min="0"
                                :max="100"
                                :marks="{ 0: '0px', 10: '10px', 100: '100px' }"
                                :format-tooltip="(value: number) => {
                                    return `${value}px`;
                                }"
                                :style="{ width: '280px', transform: 'translateY(4px)' }"
                                @change="changeSegSpacing()"
                            />
                        </a-space>
                    </template>
                </a-trigger>
                <a-trigger position="right" :popup-translate="[5, 30]">
                    <a-doption>
                        <svg
                            viewBox="0 0 1024 1024"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                        >
                            <path id="16" />
                        </svg>&nbsp;&nbsp;段前缩进
                    </a-doption>
                    <template #content>
                        <a-space class="trigger" style="padding: 10px 20px;">
                            <a-radio-group
                                v-model="textIndent"
                                @change="changeTextIndent"
                                direction="vertical"
                            >
                                <a-radio value="0">0em</a-radio>
                                <a-radio value="1">1em</a-radio>
                                <a-radio value="2">2em</a-radio>
                                <a-radio value="3">3em</a-radio>
                                <a-radio value="4">4em</a-radio>
                            </a-radio-group>
                        </a-space>
                    </template>
                </a-trigger>
                <a-trigger
                    v-if="query_path === '/writer'"
                    position="right"
                    :popup-translate="[5, 0]"
                >
                    <a-doption>
                        <svg
                            viewBox="0 0 1024 1024"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                        >
                            <path id="17" />
                        </svg>&nbsp;&nbsp;段落聚焦
                    </a-doption>
                    <template #content>
                        <a-space class="trigger" style="padding: 10px 20px;">
                            <a-radio-group
                                v-model="paraFocus"
                                @change="changeParaFocus"
                                direction="vertical"
                            >
                                <a-radio value="open">开启</a-radio>
                                <a-radio value="close">关闭</a-radio>
                            </a-radio-group>
                        </a-space>
                    </template>
                </a-trigger>
            </template>
        </a-dropdown>
        <!-- 其它设置 -->
        <a-dropdown trigger="hover">
            <a-button class="headerBtn">
                <svg
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                >
                    <path id="18" />
                    <path id="19" />
                </svg>&nbsp;&nbsp;其它
                <icon-down />
            </a-button>
            <template #content>
                <a-trigger position="right" :popup-translate="[5, 0]">
                    <a-doption>
                        <img :src="paperColorIcon" style="transform: translateY(2px)" />&nbsp;&nbsp;纸张颜色
                    </a-doption>
                    <template #content>
                        <div class="trigger" style="margin-top: 76px;">
                            <Sketch v-model="bgcColor" />
                        </div>
                    </template>
                </a-trigger>
                <a-trigger position="right" :popup-translate="[5, 0]">
                    <a-doption>
                        <img :src="paperBorderIcon" style="transform: translateY(2px)" />&nbsp;&nbsp;纸张边框
                    </a-doption>
                    <template #content>
                        <div class="trigger">
                            <a-space class="trigger" style="padding: 10px 20px;">
                                <a-switch
                                    @change="showBorder"
                                    :model-value="isShowBorder"
                                    style="transform: rotateZ(90deg);"
                                >
                                    <template #checked-icon>
                                        <icon-check />
                                    </template>
                                    <template #unchecked-icon>
                                        <icon-close />
                                    </template>
                                </a-switch>
                                <a-radio-group
                                    v-model="roundType"
                                    @change="changeBorderRadius"
                                    direction="vertical"
                                >
                                    <a-radio value="none">none</a-radio>
                                    <a-radio value="have">have</a-radio>
                                    <a-radio value="bigger">bigger</a-radio>
                                </a-radio-group>
                            </a-space>
                        </div>
                    </template>
                </a-trigger>
                <a-trigger position="right" :popup-translate="[5, 0]">
                    <a-doption>
                        <img :src="paperSizeIcon" style="transform: translateY(2px)" />&nbsp;&nbsp;纸张大小
                    </a-doption>
                    <template #content>
                        <ul class="trigger typeface paper-size">
                            <li
                                v-for="item in paperSize"
                                :key="item.type"
                                :style="item.now ? 'background-color: rgb(var(--my-secondary-6));color: #fff' : ''"
                                @click="changePaperSize(item.type)"
                            >
                                <span>{{ item.type }}</span>
                                <span>{{ item.size + 'px' }}</span>
                            </li>
                        </ul>
                    </template>
                </a-trigger>
                <a-trigger position="right" :popup-translate="[5, 0]">
                    <a-doption>
                        <img :src="softThemeIcon" style="transform: translateY(2px)" />&nbsp;&nbsp;软件主题
                    </a-doption>
                    <template #content>
                        <ThemeContainer @changePaperColor="themeColorChange"></ThemeContainer>
                    </template>
                </a-trigger>
            </template>
        </a-dropdown>
        <!-- 工具 -->
        <a-dropdown v-if="query_path === '/writer'" trigger="hover">
            <a-button class="headerBtn" style="padding-right: 0;">
                <icon-tool />&nbsp;&nbsp;工具
                <icon-caret-down />
            </a-button>
            <template #content>
                <a-doption @click="sensitiveRetrieval">
                    <img :src="sensitiveWords" style="transform: translateY(4px)" />&nbsp;&nbsp;敏感词检索
                </a-doption>
            </template>
        </a-dropdown>
        <!-- 导出 -->
        <a-dropdown trigger="hover">
            <a-button class="headerBtn" style="padding-right: 0;">
                <icon-export />&nbsp;&nbsp;导出
                <icon-caret-down />
            </a-button>
            <template #content>
                <a-doption @click="exp('txt')">
                    <img :src="expTXTIcon" style="transform: translateY(4px)" />&nbsp;&nbsp;导出为&nbsp;&nbsp;TXT
                </a-doption>
                <a-doption @click="exp('docx')">
                    <img :src="expDOCXIcon" style="transform: translateY(4px)" />&nbsp;&nbsp;导出为&nbsp;&nbsp;DOCX
                </a-doption>
                <a-doption @click="exp('pdf')">
                    <img :src="expPDFIcon" style="transform: translateY(4px)" />&nbsp;&nbsp;导出为&nbsp;&nbsp;PDF
                </a-doption>
            </template>
        </a-dropdown>
        <!-- 字数统计 -->
        <a-dropdown trigger="hover">
            <a-button
                class="headerBtn"
                :style="query_path === 'writer' && wordCount >= 15000 ? 'color : #f53f3f' : ''"
            >
                <icon-book />
                &nbsp;&nbsp;{{ showChoice }}
                <icon-caret-down />
            </a-button>
            <template #content>
                <a-doption
                    @click="choice(0)"
                    :style="choiceArr[0] ? 'color: rgb(var(--primary-6));' : ''"
                >
                    <icon-check-circle :style="choiceArr[0] ? '' : 'visibility:hidden'" />
                    &nbsp;字数&nbsp;&nbsp;&nbsp;&nbsp;{{ wordCount }}字
                </a-doption>
                <a-doption
                    @click="choice(1)"
                    :style="choiceArr[1] ? 'color: rgb(var(--primary-6));' : ''"
                >
                    <icon-check-circle :style="choiceArr[1] ? '' : 'visibility:hidden'" />
                    &nbsp;字符&nbsp;&nbsp;&nbsp;&nbsp;{{ charCount }}个
                </a-doption>
                <a-doption
                    @click="choice(2)"
                    :style="choiceArr[2] ? 'color: rgb(var(--primary-6));' : ''"
                >
                    <icon-check-circle :style="choiceArr[2] ? '' : 'visibility:hidden'" />
                    &nbsp;段落&nbsp;&nbsp;&nbsp;&nbsp;{{ paragraphs }}段
                </a-doption>
            </template>
        </a-dropdown>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed, onMounted, nextTick, watch, Ref } from 'vue';
import {
    IconDown, IconExport, IconBook, IconCaretDown, IconCheckCircle, IconFullscreen,
    IconCheck, IconClose, IconTool
} from '@arco-design/web-vue/es/icon';
import { throttle } from '../utils/flowControl';
import { useRoute } from 'vue-router';
import { Sketch } from '@ckpack/vue-color';
import ThemeContainer from './widget/ThemeContainer.vue';
import { useThemeStore } from '../store';
// import writtenwords from '../assets/svg/writtenwords.svg';
// import fontSizeIcon from '../assets/svg/fontSizeIcon.svg';
// import lineHeighIcon from '../assets/svg/lineHeighIcon.svg';
// import fontWeightIcon from '../assets/svg/fontWeightIcon.svg';
// import fontFamilyIcon from '../assets/svg/fontFamilyIcon.svg';
// import fontColorIcon from '../assets/svg/fontColorIcon.svg';
// import paragraphIcon from '../assets/svg/paragraphIcon.svg';
// import segSpacingIcon from '../assets/svg/segSpacingIcon.svg';
// import textIndentIcon from '../assets/svg/textIndentIcon.svg';
// import paraFocusIcon from '../assets/svg/paraFocusIcon.svg';
// import otherSettingIcon from '../assets/svg/otherSettingIcon.svg';
import paperColorIcon from '../assets/svg/paperColorIcon.svg';
import paperBorderIcon from '../assets/svg/paperBorderIcon.svg';
import paperSizeIcon from '../assets/svg/paperSizeIcon.svg';
import softThemeIcon from '../assets/svg/softThemeIcon.svg';
import expTXTIcon from '../assets/svg/expTXTIcon.svg';
import expDOCXIcon from '../assets/svg/expDOCXIcon.svg';
import expPDFIcon from '../assets/svg/expPDFIcon.svg';
import sensitiveWords from '../assets/svg/sensitiveWords.svg';
const route = useRoute(), query_path = route.path;
const themeStore = useThemeStore();
/*-------------数据统计与初始化-------------*/
const wordCount = ref(0), charCount = ref(0), paragraphs = ref(0), fontList = ref(), paperSize = ref([
    { type: 'Max', size: 1280, now: false },
    { type: 'iPad Pro', size: 1024, now: false },
    { type: 'A4', size: 794, now: true },
    { type: 'iPad', size: 768, now: false },
    { type: 'Surface Duo', size: 540, now: false },
    { type: 'iPhone6/7/8 Plus', size: 414, now: false },
    { type: 'iPhone6/7/8 X', size: 375, now: false },
    { type: 'iPhone5/SE', size: 320, now: false },
    { type: 'Galaxy Fold', size: 280, now: false }]
);

//获得子组件传递的记数
const getData = (data: Pagecount) => {
    wordCount.value = data.wordCount;
    charCount.value = data.charCount;
    paragraphs.value = data.paragraphs;
}
// 获得纸张组件
const paperRef = ref();
const getPaperRef = (pRef: any) => {
    paperRef.value = pRef;
}

// 读取本地用户缓存设置(localStorage缓存状态)
const uLocalOption = ref({
    uFontSize: 22,
    uLineHeight: 1.5,
    uFontWeight: 'normal',
    uFont: 'KaiTi',
    uColor: themeStore.theme === 'light' ? '#333333ff' : '#ffffffff',
    uSpacing: 10,
    uTextIndent: '0',
    uParaFocus: 'close',
    uShowBorder: 'open',
    uBgcColor: themeStore.theme === 'light' ? '#ffffffff' : '#17171aff',
    uRoundType: 'none',
    uPaperSize: 'A4'
});
if (query_path === '/writer') {
    const getuWritingOption = localStorage.getItem('uWritingOption');
    if (getuWritingOption === null) localStorage.setItem('uWritingOption', JSON.stringify(uLocalOption.value));
    else uLocalOption.value = JSON.parse(getuWritingOption);
} else if (query_path === '/reading') {
    const getuReadingOption = localStorage.getItem('uReadingOption');
    if (getuReadingOption === null) localStorage.setItem('uReadingOption', JSON.stringify(uLocalOption.value));
    else uLocalOption.value = JSON.parse(getuReadingOption);
}

/*----获取系统字体列表备用----*/
let _fontList: Array<string>, slideDown: number = 1;
window.$API.ipcSend('count-fonts-item');
window.$API.ipcOn('get-fonts-item', (data: Array<string>) => {
    // 这里可以通过分析内容是中文还是英文选择是否逆序
    _fontList = data.reverse();
    if (data.length > 20) {
        // 列表拆分为20一组
        slideDown = data.length % 20 === 0 ? data.length / 20 : Math.floor(data.length / 20);
        // 首先渲染20个
        fontList.value = _fontList.slice(1, 20);
    } else {
        fontList.value = _fontList;
    }
});

/*----通过Scroll滚动事件懒加载字字体列表----*/
const fontListNode = ref();
let count = 0, countSlideDown = 1, scrollTop: Array<number> = [];
// 触发节流函数
const fontlistScroll = throttle(() => {
    count++;
    if (count === 1) {
        scrollTop[0] = fontListNode.value.scrollTop;
    } else if (count === 2) {
        scrollTop[1] = fontListNode.value.scrollTop;
        count = 0;
        // 下滑操作时加载新字体列表
        if (scrollTop[1] > scrollTop[0]) {
            if (countSlideDown <= slideDown) {
                for (let i = 0; i < 20; i++) {
                    if (_fontList[i + countSlideDown * 20] === undefined) break;
                    fontList.value.push(_fontList[i + countSlideDown * 20])
                }
            }
            countSlideDown++;
        }
    }
}, 100);

/*----字数统计选择----*/
const choiceArr = ref([true, false, false]);
const choice = (order: number) => {
    choiceArr.value = [false, false, false];
    choiceArr.value[order] = !choiceArr.value[order];
}
const showChoice = computed(() => {
    let tempStr = '';
    if (choiceArr.value[0]) tempStr = wordCount.value + ' 字';
    if (choiceArr.value[1]) tempStr = charCount.value + ' 个';
    if (choiceArr.value[2]) tempStr = paragraphs.value + ' 段';
    return tempStr;
})

/*----父组件调用子组件的方法----*/
// 设置字体
const selectFont = (i: number) => {
    paperRef.value.setFont(fontList.value[i]);
    uLocalOption.value.uFont = fontList.value[i];
    setLocalStorage();
}
// 修改字体大小
const fontSize = ref(uLocalOption.value.uFontSize);
const changeFontSize = () => {
    paperRef.value.setFontSize(fontSize.value);
    uLocalOption.value.uFontSize = fontSize.value;
    setLocalStorage();
}
// 修改字体行高
const lineHeight = ref(uLocalOption.value.uLineHeight);
const changeLineHeight = () => {
    paperRef.value.setLineHeight(lineHeight.value);
    uLocalOption.value.uLineHeight = lineHeight.value;
    setLocalStorage();
}
// 修改字体粗细
const fontWeight = ref(uLocalOption.value.uFontWeight);
const changeFontWeight = () => {
    paperRef.value.setFontWeight(fontWeight.value);
    uLocalOption.value.uFontWeight = fontWeight.value;
    setLocalStorage();
}
// 修改段落间距
const segSpacing = ref(uLocalOption.value.uSpacing);
const changeSegSpacing = () => {
    paperRef.value.setSegSpacing(segSpacing.value);
    uLocalOption.value.uSpacing = segSpacing.value;
    setLocalStorage();
}
// 修改段前缩进
const textIndent = ref(uLocalOption.value.uTextIndent);
const changeTextIndent = () => {
    paperRef.value.setTextIndent(textIndent.value);
    uLocalOption.value.uTextIndent = textIndent.value;
    setLocalStorage();
}

// 获得子组件选择的color并修改字体颜色
const fontColor: Ref<any> = ref(uLocalOption.value.uColor);
watch(fontColor, () => {
    changeFontColor(fontColor.value.hex8);
})
// 获得子组件选择的color并修改纸张背景色
const bgcColor: Ref<any> = ref(uLocalOption.value.uBgcColor);
watch(bgcColor, () => {
    changeBgcColor(bgcColor.value.hex8)
})
const changeFontColor = (color: string) => {
    paperRef.value.setColor(color);
    uLocalOption.value.uColor = color;
    // 聚焦模式下选择新颜色
    if (query_path === '/writer' && paraFocus.value === 'open') paperRef.value.setParaFocus(paraFocus.value);
    setLocalStorage();
}
const changeBgcColor = (color: string) => {
    paperRef.value.setBgcColor(color);
    uLocalOption.value.uBgcColor = color;
    setLocalStorage();
}
// 子组件主题切换暗亮时重新设置纸张文字颜色
const themeColorChange = (color: [string, string]) => {
    changeBgcColor(color[0]);
    changeFontColor(color[1]);
}

// 改变纸张边框
const isShowBorder = ref(true);
const showBorderType = ref(uLocalOption.value.uShowBorder);
if (showBorderType.value === 'open') isShowBorder.value = true;
else isShowBorder.value = false;

const showBorder = (value: boolean) => {
    isShowBorder.value = value;
    if (value) showBorderType.value = 'open';
    else showBorderType.value = 'close';

    paperRef.value.setShowborder(showBorderType.value);
    uLocalOption.value.uShowBorder = showBorderType.value;
    setLocalStorage();
}
// 纸张边框圆角大小
const roundType = ref(uLocalOption.value.uRoundType);
const changeBorderRadius = () => {
    paperRef.value.setRoundType(roundType.value);
    uLocalOption.value.uRoundType = roundType.value;
    setLocalStorage();
}

// 设置纸张类型
for (let item in paperSize.value) {
    paperSize.value[item].now = false;
    if (paperSize.value[item].type === uLocalOption.value.uPaperSize) {
        paperSize.value[item].now = true;
    }
}
const changePaperSize = (type: string) => {
    paperSize.value.forEach(item => {
        item.now = false;
        item.type === type ? item.now = true : null;
    });
    paperRef.value.setPaperSize(type);
    uLocalOption.value.uPaperSize = type;
    setLocalStorage();
}

// 设置聚焦模式
const paraFocus = ref(uLocalOption.value.uParaFocus);
const changeParaFocus = () => {
    if (query_path === '/writer') {
        paperRef.value.setParaFocus(paraFocus.value);
        uLocalOption.value.uParaFocus = paraFocus.value;
        localStorage.setItem('uWritingOption', JSON.stringify(uLocalOption.value));
    }
}

// 设置全屏模式
const turnFullScreen = () => {
    window.$API.ipcSend('fullscreen', true);
}

// 导出文件
const exp = (type: string) => {
    paperRef.value.expFile(type);
}

// 敏感词检索功能
const sensitiveRetrieval = () => {
    paperRef.value.sensitiveRetrieval();
}

// 生命周期
onMounted(() => {
    nextTick(() => {
        if (query_path === '/writer') {
            paperRef.value.setFont(uLocalOption.value.uFont, true);
            paperRef.value.setFontSize(uLocalOption.value.uFontSize, true);
            paperRef.value.setLineHeight(uLocalOption.value.uLineHeight, true);
            paperRef.value.setFontWeight(uLocalOption.value.uFontWeight, true);
            paperRef.value.setSegSpacing(uLocalOption.value.uSpacing, true);
            paperRef.value.setTextIndent(uLocalOption.value.uTextIndent, true);
            paperRef.value.setColor(uLocalOption.value.uColor, true);
            paperRef.value.setBgcColor(uLocalOption.value.uBgcColor, true);
            paperRef.value.setShowborder(uLocalOption.value.uShowBorder, true);
            paperRef.value.setRoundType(uLocalOption.value.uRoundType, true);
            paperRef.value.setPaperSize(uLocalOption.value.uPaperSize, true);
            paperRef.value.setParaFocus(uLocalOption.value.uParaFocus, true);
        } else if (query_path === '/reading') {
            paperRef.value.setFont(uLocalOption.value.uFont);
            paperRef.value.setFontSize(uLocalOption.value.uFontSize);
            paperRef.value.setLineHeight(uLocalOption.value.uLineHeight);
            paperRef.value.setFontWeight(uLocalOption.value.uFontWeight);
            paperRef.value.setSegSpacing(uLocalOption.value.uSpacing);
            paperRef.value.setTextIndent(uLocalOption.value.uTextIndent);
            paperRef.value.setColor(uLocalOption.value.uColor);
            paperRef.value.setBgcColor(uLocalOption.value.uBgcColor);
            paperRef.value.setShowborder(uLocalOption.value.uShowBorder);
            paperRef.value.setRoundType(uLocalOption.value.uRoundType);
            paperRef.value.setPaperSize(uLocalOption.value.uPaperSize);
        }
    })
})

function setLocalStorage() {
    if (query_path === '/writer') {
        localStorage.setItem('uWritingOption', JSON.stringify(uLocalOption.value));
    } else if (query_path === '/reading') {
        localStorage.setItem('uReadingOption', JSON.stringify(uLocalOption.value));
    }
}

defineExpose({
    getData, getPaperRef
})

</script>

<style lang="scss" src="../style/toptoolbar.scss"  scoped>
</style>
