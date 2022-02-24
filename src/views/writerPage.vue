<!-- 作品(纯文本)编写页 -->
<template>
    <TitleBlock></TitleBlock>
    <PopupMenu
        v-if="isRename"
        title="重命名"
        determine="确定"
        @toModify="modify"
        @toDetermine="reName"
        :determineDisabled="showName.length === 0"
    >
        <a-space>
            <a-form-item field="name" label="名称">
                <a-input
                    v-model.trim="showName"
                    style="width: 370px"
                    :max-length="25"
                    :error="showName.length === 0"
                    show-word-limit
                    allow-clear
                    placeholder="请输入章名..."
                />
            </a-form-item>
        </a-space>
    </PopupMenu>
    <PopupMenu
        v-if="isNewVolume"
        title="新增卷"
        determine="确定"
        @toModify="modify"
        @toDetermine="addNewVolume"
        :determineDisabled="volumeName.length === 0"
    >
        <a-space>
            <a-form-item field="name" label="卷名">
                <a-input
                    v-model.trim="volumeName"
                    style="width: 370px"
                    :max-length="25"
                    :error="volumeName.length === 0"
                    show-word-limit
                    allow-clear
                    placeholder="请输入卷名..."
                />
            </a-form-item>
        </a-space>
    </PopupMenu>
    <PopupMenu
        v-if="isNewChapter"
        title="新增章"
        determine="确定"
        @toModify="modify"
        @toDetermine="addNewChapter"
        :determineDisabled="chapterName.length === 0"
    >
        <a-space>
            <a-form-item field="name" label="章名">
                <a-input
                    v-model.trim="chapterName"
                    style="width: 370px"
                    :max-length="25"
                    :error="chapterName.length === 0"
                    show-word-limit
                    allow-clear
                    placeholder="请输入章名..."
                />
            </a-form-item>
        </a-space>
    </PopupMenu>
    <div class="layout-write">
        <a-layout>
            <a-layout-header>
                <div class="head-item">
                    <!-- 全屏洁净模式 -->
                    <a-tooltip background-color="#3491FA" mini content="全屏洁净模式(F1)">
                        <a-button class="headerBtn">
                            <icon-fullscreen />&nbsp;全屏
                        </a-button>
                    </a-tooltip>
                    <!-- 文字设置 -->
                    <a-dropdown trigger="hover">
                        <a-button class="headerBtn" style="padding-right: 0;">
                            <img :src="writtenwords" style="transform: translateY(2px)" />&nbsp;&nbsp;文字
                            <icon-down />
                        </a-button>
                        <template #content>
                            <a-trigger position="right" :popup-translate="[5, 16]">
                                <a-doption>
                                    <img :src="fontSizeIcon" style="transform: translateY(2px)" />&nbsp;&nbsp;字体大小
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
                                    <img :src="lineHeighIcon" style="transform: translateY(2px)" />&nbsp;&nbsp;字符行高
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
                                    <img :src="fontWeightIcon" style="transform: translateY(2px)" />&nbsp;&nbsp;文字粗细
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
                                    <img :src="fontFamilyIcon" style="transform: translateY(2px)" />&nbsp;&nbsp;选择字体
                                </a-doption>
                                <template #content>
                                    <ul
                                        class="trigger typeface"
                                        @scroll="fontlistScroll"
                                        ref="fontListNode"
                                    >
                                        <li
                                            class="typeface-head"
                                            title="点击恢复默认"
                                        >{{ uWritingOption.uFont }}</li>
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
                                    <img :src="fontColorIcon" style="transform: translateY(2px)" />&nbsp;&nbsp;文字颜色
                                </a-doption>
                                <template #content>
                                    <div class="trigger" style="margin-top: 24px;">
                                        <color-picker
                                            :isWidget="true"
                                            :format="'hex'"
                                            v-model:pureColor="fontColor"
                                            v-model:gradientColor="gradientColor"
                                            @pureColorChange="getColor"
                                        />
                                    </div>
                                </template>
                            </a-trigger>
                        </template>
                    </a-dropdown>
                    <!-- 段落设置 -->
                    <a-dropdown trigger="hover">
                        <a-button class="headerBtn" style="padding-right: 0;">
                            <img :src="paragraphIcon" style="transform: translateY(2px)" />&nbsp;&nbsp;段落
                            <icon-down />
                        </a-button>
                        <template #content>
                            <a-trigger position="right" :popup-translate="[5, 16]">
                                <a-doption>
                                    <img :src="segSpacingIcon" style="transform: translateY(2px)" />&nbsp;&nbsp;段落间距
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
                                    <img :src="textIndentIcon" style="transform: translateY(2px)" />&nbsp;&nbsp;段前缩进
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
                            <a-trigger position="right" :popup-translate="[5, 0]">
                                <a-doption>
                                    <img :src="paraFocusIcon" style="transform: translateY(2px)" />&nbsp;&nbsp;段落聚焦
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
                            <img :src="otherSettingIcon" style="transform: translateY(2px)" />&nbsp;&nbsp;其它
                            <icon-down />
                        </a-button>
                        <template #content>
                            <a-trigger position="right" :popup-translate="[5, 0]">
                                <a-doption>
                                    <img :src="paperColorIcon" style="transform: translateY(2px)" />&nbsp;&nbsp;纸张颜色
                                </a-doption>
                                <template #content>
                                    <div class="trigger" style="margin-top: 76px;">
                                        <color-picker
                                            :isWidget="true"
                                            v-model:pureColor="bgcColor"
                                            v-model:gradientColor="gradientColor"
                                            @pureColorChange="getBgcColor"
                                        />
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
                                            :style="item.now ? 'background-color: #3491fa;color: #fff;' : ''"
                                            @click="changePaperSize(item.type)"
                                        >
                                            <span>{{ item.type }}</span>
                                            <span>{{ item.size + 'px' }}</span>
                                        </li>
                                    </ul>
                                </template>
                            </a-trigger>
                            <a-trigger position="right" :popup-translate="[8, 0]">
                                <a-doption>
                                    <img :src="softThemeIcon" style="transform: translateY(2px)" />&nbsp;&nbsp;软件主题
                                </a-doption>
                                <template #content></template>
                            </a-trigger>
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
                            :style="wordCount >= 15000 ? 'color : #f53f3f' : ''"
                        >
                            <icon-book />
                            &nbsp;&nbsp;{{ showChoice }}
                            <icon-caret-down />
                        </a-button>
                        <template #content>
                            <a-doption
                                @click="choice(0)"
                                :style="choiceArr[0] ? 'color: #165dff;' : ''"
                            >
                                <icon-check-circle
                                    :style="choiceArr[0] ? '' : 'visibility:hidden'"
                                />
                                &nbsp;字数&nbsp;&nbsp;&nbsp;&nbsp;{{ wordCount }}字
                            </a-doption>
                            <a-doption
                                @click="choice(1)"
                                :style="choiceArr[1] ? 'color: #165dff;' : ''"
                            >
                                <icon-check-circle
                                    :style="choiceArr[1] ? '' : 'visibility:hidden'"
                                />
                                &nbsp;字符&nbsp;&nbsp;&nbsp;&nbsp;{{ charCount }}个
                            </a-doption>
                            <a-doption
                                @click="choice(2)"
                                :style="choiceArr[2] ? 'color: #165dff;' : ''"
                            >
                                <icon-check-circle
                                    :style="choiceArr[2] ? '' : 'visibility:hidden'"
                                />
                                &nbsp;段落&nbsp;&nbsp;&nbsp;&nbsp;{{ paragraphs }}段
                            </a-doption>
                        </template>
                    </a-dropdown>
                </div>
            </a-layout-header>
            <a-layout>
                <a-layout-sider collapsible class="siderLeft">
                    <a-menu
                        :default-open-keys="[vid]"
                        :default-selected-keys="[cid]"
                        :style="{ width: '100%', textAlign: 'left' }"
                    >
                        <button @click="isNewVolume = true" class="topBtn">
                            <!-- <img :src="addVolumeIcon" style="transform: translateY(4px)" /> -->
                            <span style="transform: translateY(4px)">📜</span>
                            <span>添加卷</span>
                        </button>
                        <a-sub-menu v-for="item in booksLists.data" :key="item.vid">
                            <template #title>
                                <icon-double-right
                                    @click.stop="showLeftMore = showLeftMore === item.vid ? '' : item.vid"
                                    class="siderLeft-btn"
                                />
                                <span title="删除卷">
                                    <svg
                                        v-if="showLeftMore === item.vid"
                                        viewBox="0 0 1024 1024"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        style="margin-bottom: -5px; margin-right: 5px;margin-left: 5px;"
                                        @mouseenter="editVid1 = item.vid"
                                        @mouseleave="editVid1 = ''"
                                        @click.stop="deleteVolume(item.vid, item.volumeName)"
                                    >
                                        <path
                                            p-id="3022"
                                            :fill="editVid1 === item.vid ? '#bf5e00' : '#ff7d00'"
                                        />
                                    </svg>
                                </span>
                                <span title="重命名">
                                    <svg
                                        v-if="showLeftMore === item.vid"
                                        viewBox="0 0 1024 1024"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        style="margin-bottom: -5px; margin-right: 5px;"
                                        @mouseenter="editVid2 = item.vid"
                                        @mouseleave="editVid2 = ''"
                                        @click.stop="showReName('v', item.vid, item.volumeName)"
                                    >
                                        <path
                                            :fill="editVid2 === item.vid ? '#276dbc' : '#3491fa'"
                                            p-id="3276"
                                        />
                                    </svg>
                                </span>
                                <span title="新增章">
                                    <svg
                                        v-if="showLeftMore === item.vid"
                                        viewBox="0 0 1024 1024"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        style="margin-bottom: -4px; margin-right: 5px;"
                                        @mouseenter="editVid3 = item.vid"
                                        @mouseleave="editVid3 = ''"
                                        @click.stop="newChapter(item.vid)"
                                    >
                                        <path
                                            p-id="1550"
                                            :fill="editVid3 === item.vid ? '#008720' : '#00b42a'"
                                        />
                                    </svg>
                                </span>
                                {{ item.volumeName }}
                            </template>
                            <a-dropdown
                                v-for="it in item.volume"
                                :key="it.cid"
                                trigger="contextMenu"
                                alignPoint
                                :style="{ display: 'block' }"
                            >
                                <a-menu-item
                                    :key="it.cid"
                                    @click="onClickMenuItem(item.vid, it.cid)"
                                    :style="deletedCid === it.cid ? 'color:#f53f3f;text-decoration:line-through;text-indent:10px;' : 'text-indent:10px;'"
                                    :title="it.chapterName"
                                >{{ it.chapterName }}</a-menu-item>
                                <template #content>
                                    <a-doption @click="showReName('c', it.cid, it.chapterName)">重命名</a-doption>
                                    <a-doption
                                        @click="deleteChapter(item.vid, it.cid, it.chapterName)"
                                    >删除章</a-doption>
                                </template>
                            </a-dropdown>
                        </a-sub-menu>
                    </a-menu>
                    <template #trigger="{ collapsed }">
                        <IconCaretRight v-if="collapsed"></IconCaretRight>
                        <IconCaretLeft v-else></IconCaretLeft>
                    </template>
                </a-layout-sider>
                <a-layout-content
                    @mouseover="showScroll"
                    @mouseout="closeScroll"
                    @scroll="getScrollTop"
                >
                    <div v-if="showSearchBox" class="search-box">
                        <a-space style="padding-bottom:5px;">
                            <span class="mini-btn" title="切换替换">
                                <icon-right />
                            </span>
                            <icon-search />
                            <input
                                v-model="searchData"
                                @input="toSearchKeyword"
                                type="text"
                                placeholder="查找"
                            />
                            <span>0/0</span>
                            <a-space size="mini">
                                <span class="mini-btn" title="上一个">
                                    <icon-arrow-up />
                                </span>
                                <span class="mini-btn" title="下一个">
                                    <icon-arrow-down />
                                </span>
                                <span @click="stopSearchKeyword" class="mini-btn" title="关闭">
                                    <icon-close />
                                </span>
                            </a-space>
                        </a-space>
                        <a-space
                            style="margin-left: -19px;padding-top: 5px;border-top: 1px solid #ccc;"
                        >
                            <icon-undo style="transform: rotateZ(180deg);" />
                            <input type="text" placeholder="替换" />
                            <span class="mini-btn" title="替换">
                                <svg
                                    viewBox="0 0 1024 1024"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    style="margin-bottom: -2px;"
                                >
                                    <path p-id="3277" />
                                </svg>
                            </span>
                            <span class="mini-btn" title="全部替换">
                                <svg
                                    viewBox="0 0 1024 1024"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    style="margin-bottom: -2px;"
                                >
                                    <path p-id="9876" />
                                </svg>
                            </span>
                        </a-space>
                    </div>
                    <WritingPaper @todata="getData" ref="myRef"></WritingPaper>
                </a-layout-content>
                <a-resize-box
                    @moving-start="showIframeWrap = true"
                    @moving-end="showIframeWrap = false"
                    :directions="['left']"
                    class="sider-right"
                    style="width: 100px;"
                >
                    <template #resize-trigger="{ direction }">
                        <div
                            :class="[
                                `resizebox-demo`,
                                `resizebox-demo-${direction === 'left' ? 'vertical' : 'horizontal'}`
                            ]"
                        >
                            <div class="resizebox-demo-line" />
                        </div>
                    </template>
                    <!-- <webview class="iframe" src="https://wantwords.net/"></webview> -->
                    <!-- <iframe class="iframe" src="https://wantwords.net/"></iframe> -->
                    <div v-if="showIframeWrap" class="iframe-Wrap"></div>
                </a-resize-box>
            </a-layout>
        </a-layout>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, reactive, onMounted, nextTick, onBeforeUnmount, watch } from 'vue';
import {
    IconDown, IconExport, IconCaretRight, IconCaretLeft,
    IconBook, IconCaretDown, IconCheckCircle, IconFullscreen,
    IconDoubleRight, IconRight, IconSearch, IconArrowUp,
    IconArrowDown, IconClose, IconUndo
} from '@arco-design/web-vue/es/icon';
import TitleBlock from '../components/TitleBlock.vue';
import WritingPaper from '../components/WritingPaper.vue';
import PopupMenu from '../components/widget/PopupMenu.vue';
import { useRoute, useRouter } from 'vue-router';
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import { throttle } from '../utils/flowControl';
import { db } from '../db/db';
import useCurrentInstance from '../utils/useCurrentInstance';
import { v4 } from 'uuid';
// import { setHighlightKeyword } from '../common/editor/syntax';
import { useMainStore } from '../store/index';
import writtenwords from '../assets/svg/writtenwords.svg';
import fontSizeIcon from '../assets/svg/fontSizeIcon.svg';
import lineHeighIcon from '../assets/svg/lineHeighIcon.svg';
import fontWeightIcon from '../assets/svg/fontWeightIcon.svg';
import fontFamilyIcon from '../assets/svg/fontFamilyIcon.svg';
import fontColorIcon from '../assets/svg/fontColorIcon.svg';
import paragraphIcon from '../assets/svg/paragraphIcon.svg';
import segSpacingIcon from '../assets/svg/segSpacingIcon.svg';
import textIndentIcon from '../assets/svg/textIndentIcon.svg';
import paraFocusIcon from '../assets/svg/paraFocusIcon.svg';
import otherSettingIcon from '../assets/svg/otherSettingIcon.svg';
import paperColorIcon from '../assets/svg/paperColorIcon.svg';
import paperSizeIcon from '../assets/svg/paperSizeIcon.svg';
import softThemeIcon from '../assets/svg/softThemeIcon.svg';
import expTXTIcon from '../assets/svg/expTXTIcon.svg';
import expDOCXIcon from '../assets/svg/expDOCXIcon.svg';
import expPDFIcon from '../assets/svg/expPDFIcon.svg';
// import addVolumeIcon from '../assets/svg/addVolumeIcon.svg';
import '../style/writerPage.scss';

const { proxy } = useCurrentInstance();
const $modal = proxy.$modal;
const $message = proxy.$message;
const route = useRoute();
const query_id = parseInt(<string>route.query.id);
const vid = ref(route.query.vid);
const cid = ref(route.query.cid);
const mainStore = useMainStore();
loadListData();

onMounted(() => {
    nextTick(() => {
        myRef.value.setFont(uWritingOption.value.uFont, true);
        myRef.value.setFontSize(uWritingOption.value.uFontSize, true);
        myRef.value.setLineHeight(uWritingOption.value.uLineHeight, true);
        myRef.value.setFontWeight(uWritingOption.value.uFontWeight, true);
        myRef.value.setSegSpacing(uWritingOption.value.uSpacing, true);
        myRef.value.setTextIndent(uWritingOption.value.uTextIndent, true);
        myRef.value.setColor(uWritingOption.value.uColor, true);
        myRef.value.setBgcColor(uWritingOption.value.uBgcColor, true);
        myRef.value.setPaperSize(uWritingOption.value.uPaperSize, true);
        myRef.value.setParaFocus(uWritingOption.value.uParaFocus, true);
    })
})
onBeforeUnmount(() => {
    setScrollTop(<string>vid.value, <string>cid.value);
    db.opus.update(query_id, { historRecord: { vid: vid.value, cid: cid.value } });
})

onUnmounted(() => {
    window.removeEventListener('keydown', shortcut);
    window.removeEventListener('click', leftMoreControl);
})
const showIframeWrap = ref(false), showSearchBox = ref(false);
// 关键词搜索、替换功能
const searchData = ref('');
watch(showSearchBox, value => {
    if (value && searchData.value !== '') toSearchKeyword();
})
// 关键字统计
let isHighlightCount = computed(() => mainStore.isHighlightCount);
watch(isHighlightCount, () => {
    if (showSearchBox.value && searchData.value !== '')
        console.log(searchData.value, ':', mainStore.highlightCount);
})
const toSearchKeyword = () => {
    db.opus.get(query_id).then(value => {
        if (value) {
            myRef.value.setBooksData(value, [{ match: new RegExp(searchData.value, 'g'), class: 'keyword_search' }]);
        }
    })
}
const stopSearchKeyword = () => {
    showSearchBox.value = false;
    db.opus.get(query_id).then(value => {
        if (value) myRef.value.setBooksData(value, []);
    })
}

/*----数据统计与初始化----*/
const wordCount = ref(0),
    charCount = ref(0),
    paragraphs = ref(0),
    fontList = ref(),
    paperSize = ref([
        { type: 'Max', size: 1280, now: false },
        { type: 'iPad Pro', size: 1024, now: false },
        { type: 'A4', size: 794, now: true },
        { type: 'iPad', size: 768, now: false },
        { type: 'Surface Duo', size: 540, now: false },
        { type: 'iPhone6/7/8 Plus', size: 414, now: false },
        { type: 'iPhone6/7/8 X', size: 375, now: false },
        { type: 'iPhone5/SE', size: 320, now: false },
        { type: 'Galaxy Fold', size: 280, now: false }]);

//获得子组件传递的记数
const getData = (data: Pagecount) => {
    wordCount.value = data.wordCount;
    charCount.value = data.charCount;
    paragraphs.value = data.paragraphs;
}

// 获取页面上下相对位置
let temp_scrollTop = 0;
const getScrollTop = (e: Event) => {
    temp_scrollTop = (<HTMLElement>e.target).scrollTop;
}

// 读取本地用户缓存设置(localStorage缓存状态)
const uWritingOption = ref({
    uFontSize: 22,
    uLineHeight: 1.5,
    uFontWeight: 'normal',
    uFont: 'KaiTi',
    uColor: '#333333',
    uSpacing: 10,
    uTextIndent: '0',
    uParaFocus: 'close',
    uBgcColor: '#ffffff',
    uPaperSize: 'A4'
});
const getuWritingOption = localStorage.getItem('uWritingOption');
if (getuWritingOption === null) {
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
} else {
    uWritingOption.value = JSON.parse(getuWritingOption);
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
// 导出文件
const myRef = ref();
const exp = (type: string) => {
    myRef.value.expFile(type);
}
// 设置字体
const selectFont = (i: number) => {
    myRef.value.setFont(fontList.value[i]);
    uWritingOption.value.uFont = fontList.value[i];
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
}
// 修改字体大小
const fontSize = ref(uWritingOption.value.uFontSize);
const changeFontSize = () => {
    myRef.value.setFontSize(fontSize.value);
    uWritingOption.value.uFontSize = fontSize.value;
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
}
// 修改字体行高
const lineHeight = ref(uWritingOption.value.uLineHeight);
const changeLineHeight = () => {
    myRef.value.setLineHeight(lineHeight.value);
    uWritingOption.value.uLineHeight = lineHeight.value;
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
}
// 修改字体粗细
const fontWeight = ref(uWritingOption.value.uFontWeight);
const changeFontWeight = () => {
    myRef.value.setFontWeight(fontWeight.value);
    uWritingOption.value.uFontWeight = fontWeight.value;
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
}
// 修改段落间距
const segSpacing = ref(uWritingOption.value.uSpacing);
const changeSegSpacing = () => {
    myRef.value.setSegSpacing(segSpacing.value);
    uWritingOption.value.uSpacing = segSpacing.value;
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
}
// 修改段前缩进
const textIndent = ref(uWritingOption.value.uTextIndent);
const changeTextIndent = () => {
    myRef.value.setTextIndent(textIndent.value);
    uWritingOption.value.uTextIndent = textIndent.value;
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
}

// 获得子组件选择的color并修改字体颜色
const fontColor = ref(uWritingOption.value.uColor), bgcColor = ref(uWritingOption.value.uBgcColor);
const gradientColor = ref("linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)");
const getColor = () => {
    myRef.value.setColor(fontColor.value);
    uWritingOption.value.uColor = fontColor.value;
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
}
// 获得子组件选择的color并修改纸张背景色
const getBgcColor = () => {
    myRef.value.setBgcColor(bgcColor.value);
    uWritingOption.value.uBgcColor = bgcColor.value;
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
}
// 设置纸张类型
for (let item in paperSize.value) {
    paperSize.value[item].now = false;
    if (paperSize.value[item].type === uWritingOption.value.uPaperSize) {
        paperSize.value[item].now = true;
    }
}
const changePaperSize = (type: string) => {
    paperSize.value.forEach(item => {
        item.now = false;
        item.type === type ? item.now = true : null;
    });
    myRef.value.setPaperSize(type);
    uWritingOption.value.uPaperSize = type;
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
}

// 设置聚焦模式
const paraFocus = ref(uWritingOption.value.uParaFocus);
const changeParaFocus = () => {
    myRef.value.setParaFocus(paraFocus.value);
    uWritingOption.value.uParaFocus = paraFocus.value;
    localStorage.setItem('uWritingOption', JSON.stringify(uWritingOption.value));
}

/*----左侧栏功能----*/
const onClickMenuItem = (tvid: string, tcid: string) => {
    if (tcid !== cid.value) {
        setScrollTop(<string>vid.value, <string>cid.value);
        vid.value = tvid;
        cid.value = tcid;
        myRef.value.setId(tvid, tcid);
        const toDisplay: Array<object> = [];
        db.opus.get(query_id).then(value => {
            if (value) {
                for (let i = 0; i < value.data.length; i++) {
                    if (value.data[i].vid === tvid) {
                        for (let j = 0; j < value.data[i].volume.length; j++) {
                            if (value.data[i].volume[j].cid === tcid) {
                                value.data[i].volume[j].chapter.forEach((item: string) => {
                                    toDisplay.push({
                                        type: "paragraph",
                                        content: [
                                            {
                                                type: "text",
                                                text: item
                                            }
                                        ]
                                    });
                                });
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            loadListData();
            if (showSearchBox.value) {
                toSearchKeyword();
            } else {
                myRef.value.refreshPaper(toDisplay, []);
            }
        })
    }
}

// 左栏展开更多操作
const editVid1 = ref(''), editVid2 = ref(''), editVid3 = ref(''), showLeftMore = ref('');

// 重命名
const isRename = ref(false), showName = ref('');
let temp_id: string, reType: string = '';
const showReName = (type: string, id: string, vname: string) => {
    isRename.value = true;
    reType = type; // 重命名类型
    temp_id = id;
    showName.value = vname;
}
const reName = () => {
    // 修改卷
    if (reType === 'v') {
        db.opus.where(':id').equals(query_id).modify(item => {
            for (let i = 0; i < item.data.length; i++) {
                if (item.data[i].vid === temp_id) {
                    item.data[i].volumeName = showName.value;
                    break;
                }
            }
        }).then(() => {
            isRename.value = false;
            loadListData();
        })
    }
    // 修改章
    else if (reType === 'c') {
        db.opus.where(':id').equals(query_id).modify(item => {
            for (let i = 0; i < item.data.length; i++) {
                for (let j = 0; j < item.data[i].volume.length; j++) {
                    if (item.data[i].volume[j].cid === temp_id) {
                        item.data[i].volume[j].chapterName = showName.value;
                        break;
                    }
                }
            }
        }).then(() => {
            isRename.value = false;
            loadListData();
        })
    }
}

// 删除章（移至废纸篓）
const deletedCid = ref('');
const deleteChapter = (dvid: string, dcid: string, cname: string) => {
    $modal.warning({
        title: "删除章",
        content: `目标章《${cname}》将放入废纸篓,并保留30天`,
        simple: true,
        onOk: () => {
            db.opus.where(':id').equals(query_id).modify(item => {
                for (let i = 0; i < item.data.length; i++) {
                    if (item.data[i].vid === dvid) {
                        for (let j = 0; j < item.data[i].volume.length; j++) {
                            if (item.data[i].volume[j].cid === dcid) {
                                item.data[i].volume[j].discard = true;
                                item.data[i].volume[j].discardTime = new Date().getTime();
                                break;
                            }
                        }
                        break;
                    }
                }
            }).then(() => {
                // 删除的目标是当前编辑的目标
                if (dvid === vid.value && dcid === cid.value) {
                    deletedCid.value = dcid;
                    myRef.value.refreshPaper([{
                        type: "paragraph",
                        content: [
                            {
                                type: "text",
                                text: ''
                            }
                        ]
                    }]);
                } else {
                    loadListData();
                }
                $message.success('删除成功!');
            })
        }
    })
}

// 删除卷（移至废纸篓）
const deleteVolume = (vid: string, vname: string) => {
    $modal.warning({
        title: "删除卷",
        content: `目标卷【${vname}】将放入废纸篓,并保留30天`,
        simple: true,
        onOk: () => {
            db.opus.where(':id').equals(query_id).modify(item => {
                for (let i = 0; i < item.data.length; i++) {
                    if (item.data[i].vid === vid) {
                        item.data[i].discard = true;
                        item.data[i].discardTime = new Date().getTime();
                        break;
                    }
                }
            }).then(() => {
                loadListData();
                $message.success('删除成功!');
            })
        }
    })
}

// 点击添加章
const isNewChapter = ref(false), chapterName = ref('未命名章');
let volumeId: string; // 找到目标卷才能向里面push章
const newChapter = (vid: string) => {
    volumeId = vid;
    isNewChapter.value = true;
}
const addNewChapter = () => {
    db.opus.where(':id').equals(query_id).modify(item => {
        for (let i = 0; i < item.data.length; i++) {
            if (item.data[i].vid === volumeId) {
                item.data[i].volume.push({
                    cid: v4(),
                    chapterName: chapterName.value,
                    updateTime: new Date().getTime(),
                    chapter: ['\u3000\u3000']
                });
                break;
            }
        }
    }).then(() => {
        isNewChapter.value = false;
        loadListData();
        $message.success('添加成功!');
    })
}

// 点击添加卷
const isNewVolume = ref(false), volumeName = ref('未命名卷');
const addNewVolume = () => {
    db.opus.where(':id').equals(query_id).modify(item => {
        item.data.push({
            vid: v4(),
            volumeName: volumeName.value,
            updateTime: new Date().getTime(),
            volume: [{
                cid: v4(),
                chapterName: '未命名章',
                updateTime: new Date().getTime(),
                chapter: ['\u3000\u3000']
            }]
        });
    }).then(() => {
        isNewVolume.value = false;
        loadListData();
        $message.success('添加成功!');
    })
}

/*----右侧滚动条的样式设置----*/
const scrollbarColor = ref('#ccc');
const showScroll = () => {
    scrollbarColor.value = '#ccc';
}
const closeScroll = () => {
    scrollbarColor.value = '#f5f5f5';
}

const modify = () => {
    isRename.value = false;
    isNewVolume.value = false;
    isNewChapter.value = false;
}

// 获取列表数据
const router = useRouter();
const booksLists: { data: Array<Volume> } = reactive({ data: [] });
function loadListData() {
    db.opus.get(query_id).then(value => {
        if (value) {
            myRef.value.setBooksData(value);
            booksLists.data = value.data.filter((item: Volume) => {
                // 判断目标卷是否有删除标记
                return !item.discard;
            });
            booksLists.data.forEach((item: Volume) => {
                item.volume = item.volume.filter((it: Chapter) => {
                    // 判断目标章是否有删除标记
                    return !it.discard;
                })
            });
            if (booksLists.data.length === 0) {
                router.push({
                    path: '/detail',
                    query: {
                        type: 'opus',
                        id: query_id
                    }
                })
            }
            for (let i = 0; i < booksLists.data.length; i++) {
                if (booksLists.data[i].vid === vid.value) {
                    for (let j = 0; j < booksLists.data[i].volume.length; j++) {
                        if (booksLists.data[i].volume[j].cid === cid.value) {
                            (<HTMLElement>document.querySelector('.arco-layout-content')).scrollTop =
                                <number>booksLists.data[i].volume[j].scrollTop;
                            break;
                        }
                    }
                    break;
                }
            }
        }

    })
}

// 设置纸张距离顶部的高度（用户跳转至编辑位置
function setScrollTop(tvid: string, tcid: string) {
    db.opus.where(':id').equals(query_id).modify(item => {
        for (let i = 0; i < item.data.length; i++) {
            if (item.data[i].vid === tvid) {
                for (let j = 0; j < item.data[i].volume.length; j++) {
                    if (item.data[i].volume[j].cid === tcid) {
                        item.data[i].volume[j].scrollTop = temp_scrollTop;
                        break;
                    }
                }
                break;
            }
        }
    })
}
/*----自定义全局快捷键----*/
//获取路由参数确定详情页显示的目标
window.addEventListener('keydown', shortcut);
window.addEventListener('click', leftMoreControl);

function shortcut(e: KeyboardEvent) {
    if (deletedCid.value === cid.value) {
        // Ctrl+S
        if (e.ctrlKey === true && e.key === 's') $message.error('目标已被删除!');
    } else {
        // Ctrl+S
        if (e.ctrlKey === true && e.key === 's') myRef.value.saveDocData(true);
        if (e.ctrlKey === true && e.key === 'f') showSearchBox.value = true;
    }
}

function leftMoreControl() {
    showLeftMore.value = '';
}

</script>

<style scoped>
::-webkit-scrollbar-track {
    box-shadow: none;
    border-radius: 0;
    border-left: 1px dashed #e5e6eb;
}
::-webkit-scrollbar-thumb {
    background-color: v-bind(scrollbarColor);
    border-radius: 0;
    border-left: 1px dashed #e5e6eb;
}
.trigger::-webkit-scrollbar-thumb {
    background-color: #f2f3f5;
}
.layout-write :deep(.arco-layout-header) {
    height: 35px;
    border-bottom: 2px dashed #e5e6eb;
    background-color: #fff;
}

.layout-write :deep(.arco-layout-content) {
    height: calc(100vh - 85px);
    min-width: 20px;
    background-color: #fff;
    overflow-y: scroll;
}
</style>