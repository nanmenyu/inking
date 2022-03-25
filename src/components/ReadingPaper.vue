<template>
    <div id="paper-box-r" ref="pBox">
        <main id="pEditor" ref="editor">
            <div id="mainEditor-r" ref="mainEditor"></div>
        </main>
    </div>
</template>

<script setup lang='ts'>
import { nextTick, onMounted, ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '../db/db';
import { paperSize } from '../hooks/paperSize';
import pureTextEditor from '../common/editor';
import useCurrentInstance from '../utils/useCurrentInstance';
import { useMainStore } from '../store/index';
import { exportTXT, exportDOCX, exportPDF } from '../hooks/paper';
import { setContentTipPos, setHTMLdata, setTranslationContent } from '../hooks/contentTip';
import '../style/toolTip.scss';

const route = useRoute(), query_id = parseInt(route.query.id as string), { proxy } = useCurrentInstance();
const $modal = proxy.$modal;
const $message = proxy.$message;
const emit = defineEmits(['todata', 'toWebView']);
const mainStore = useMainStore();
const mainEditor = ref(), editor = ref(), pBox = ref();
loadFileData();

// 纸张宽度，纸张高度
const boxWidth = ref(paperSize['A4']);
let currentFont = ref('KaiTi'), currentFontSize = ref(22),
    currentLineHeight = ref(1.5), currentFontWeight = ref('normal'),
    currentColor = ref('#333333'), currentSpacing = ref(10),
    currentTextIndent = ref(0), currentBgcColor = ref('#ffffff'),
    currentBorderType = ref('1px 2px 4px rgb(0 0 0 / 20%)'),
    currentRadius = ref(0);

const setFont = (font: string) => {
    currentFont.value = font;
}
const setFontSize = (size: number) => {
    currentFontSize.value = size;
}
const setLineHeight = (height: number) => {
    currentLineHeight.value = height;
}
const setFontWeight = (weight: string) => {
    currentFontWeight.value = weight;
}
const setColor = (color: string) => {
    currentColor.value = color;
}
const setSegSpacing = (spacing: number) => {
    currentSpacing.value = spacing;
}
const setTextIndent = (indent: number) => {
    currentTextIndent.value = indent;
}
const setBgcColor = (color: string) => {
    currentBgcColor.value = color;
}
const setShowborder = (type: string) => {
    if (type === 'open') currentBorderType.value = '1px 2px 4px rgb(0 0 0 / 20%)';
    else if (type === 'close') currentBorderType.value = '';
}
const setRoundType = (type: string) => {
    if (type === 'none') currentRadius.value = 0;
    else if (type === 'have') currentRadius.value = 10;
    else if (type === 'bigger') currentRadius.value = 20;
}
const setPaperSize = (type: string) => {
    boxWidth.value = paperSize[type];
}

const expFile = (type: string) => {
    switch (type) {
        case 'txt':
            $message.warning('已经是txt文件了！');
            break;
        case 'docx':
            exportDOCX(bookTitle, pBox.value);
            break;
        case 'pdf':
            const paperType = JSON.parse((localStorage.getItem('uWritingOption') as string)).uPaperSize;
            if (paperType === 'Max' || paperType === 'iPad Pro') {
                $modal.warning({
                    title: "导出警告",
                    content: `当纸张宽度大于A4纸时, 部分内容会做裁剪处理`,
                    simple: true,
                    onOk: () => {
                        $message.loading({ content: '正在渲染...', duration: 2000 });
                        exportPDF(bookTitle, pBox.value);
                    }
                })
            } else {
                $message.loading({ content: '正在渲染...', duration: 2000 });
                exportPDF(bookTitle, pBox.value);
            }
            break;
    }
}
// 右侧菜单栏触发
let searchType = 'wordSearch_baidu';// 默认搜索类型
watch(computed(() => {
    return mainStore.curSelectedText;
}), text => {
    const contentTip2 = <HTMLElement>document.querySelector('.contentTip[data-belong=btn2]');
    const contentTip3 = <HTMLElement>document.querySelector('.contentTip[data-belong=btn3]');
    const toolTip = <HTMLElement>document.querySelector('#mainEditor-r .toolTip');
    const mainEditor_r = <HTMLElement>document.querySelector('#mainEditor-r');
    const currentText = text.trim();
    contentTip2.style.display = contentTip3.style.display = 'none';
    (<HTMLElement>document.querySelector('.btn1'))?.remove();

    // 快速查词
    const btn2 = <HTMLElement>document.querySelector('.btn2')!;
    btn2.onclick = function () {
        console.log('查词');
        if (currentText.length > 10) {
            $message.warning('字数太多了(>10)');
        } else {
            // 点击按钮显示/关闭
            contentTip3.style.display = 'none';
            setContentTipPos(toolTip, contentTip2, mainEditor_r);
            // 配置并搜索项
            getHTMLdata({
                type: searchType,
                word: currentText
            });
        }

    }
    // 快速翻译
    const btn3 = <HTMLElement>document.querySelector('.btn3')!;
    btn3.onclick = function () {
        console.log('翻译');
        contentTip2.style.display = 'none';
        setContentTipPos(toolTip, contentTip3, mainEditor_r);
        setTranslationContent(contentTip3, currentText);
    }
    //右侧搜索
    const btn4 = <HTMLElement>document.querySelector('.btn4')!;
    btn4.onclick = function () {
        emit('toWebView', currentText);
    }

    function getHTMLdata(config: { type: string, word: string }) {
        contentTip2.innerHTML = '<div class="word-loading"><div class="word-loading-img"></div></div>';
        window.$API.ipcSend('reptile', config);
        window.$API.ipcOnce('getReptileData', (data: any) => {
            if (setHTMLdata(contentTip2, data)) {
                const rightTopBtn = <HTMLElement>document.getElementById('source-website');
                // 点击更换搜索网站
                rightTopBtn.onclick = () => {
                    if (searchType === 'wordSearch_baidu') searchType = 'wordSearch_zdic';
                    else if (searchType === 'wordSearch_zdic') searchType = 'wordSearch_baidu';
                    getHTMLdata({ type: searchType, word: currentText });
                }
            }
        })
    }

})


// 读取文件数据
// const fileData: Ref<Array<string>> = ref([]);
// 文件的总计数/当前计数
let bookTitle = '', totalWordCount = 0, totalCharCount = 0, totalParagraphs = 0;
function loadFileData() {
    db.ebooks.get(query_id).then(value => {
        const reader = new FileReader();
        bookTitle = value?.title.replace('.txt', '') ?? '';
        // UTF-8 GB2312
        reader.readAsArrayBuffer(value!.data);
        reader.onload = function () {
            const ebookArrayBuf = reader.result;
            console.log('正在分析文件编码...');
            // 拆分一部分样本交由node检测编码
            let str = '';
            const viewBuf = new Uint8Array(<ArrayBuffer>ebookArrayBuf);   //此时data为ArrayBuffer
            for (let i = 0; i < 100; i++) {
                str += String.fromCharCode(viewBuf[i]);
            }
            window.$API.ipcSend('needChardet', str);
            // 获得文件编码再读取文件
            window.$API.ipcOnce('getChardetResult', (data: any) => {
                if (data.encoding) {
                    reader.readAsText(value!.data, data.encoding);
                } else {
                    reader.readAsText(value!.data);
                }
                reader.onload = function () {
                    const ebookStr = reader.result;
                    const ebookArr = (<string>ebookStr).replaceAll('\r', '').replaceAll('\t', '').split('\n');
                    const displayData: Array<NodePara> = [];
                    // 整理数据
                    totalCharCount = (<string>ebookStr).length;
                    totalParagraphs = ebookArr.length;
                    ebookArr.forEach(item => {
                        totalWordCount += item.trim().length;
                        if (item.trim() !== '') {
                            displayData.push({
                                type: "paragraph",
                                content: [{ type: "text", text: item.trim() }]
                            })
                        }
                    })
                    // 发送统计数据
                    emit('todata', {
                        wordCount: totalWordCount,
                        charCount: totalCharCount,
                        paragraphs: totalParagraphs
                    });
                    // 渲染到页面
                    pureTextEditor({
                        type: "doc",
                        content: displayData
                    }, [], false); // 无高亮 禁用编辑

                    // 回到上次的位置
                    nextTick(() => {
                        if (value) (<HTMLElement>document.querySelector('.arco-layout-content')).scrollTop = value.scrollTop ?? 0;
                    })
                }
            })
        };
    })
}

defineExpose({
    setFont, setFontSize, setLineHeight, setFontWeight, setColor, setSegSpacing,
    setTextIndent, setBgcColor, setShowborder, setRoundType, setPaperSize, expFile
})
</script>

<style>
#paper-box-r {
    width: v-bind(boxWidth + "px");
    min-height: 1000px;
    margin: 20px auto;
    background-color: v-bind(currentBgcColor);
    box-shadow: v-bind(currentBorderType);
    border-radius: v-bind(currentRadius + "px");
}
#mainEditor-r {
    position: relative;
}
#mainEditor-r .ProseMirror {
    font-family: v-bind(currentFont);
    box-sizing: border-box;
    text-align: left;
    padding: 40px;
    font-size: v-bind(currentFontSize + "px");
    line-height: v-bind(currentLineHeight + "em");
    font-weight: v-bind(currentFontWeight);
    color: v-bind(currentColor);
    cursor: text;
    word-wrap: break-word;
    /* white-space: pre-wrap; */
    white-space: break-spaces;
    -webkit-font-variant-ligatures: none;
    font-variant-ligatures: none;
    font-feature-settings: "liga" 0;
}
#mainEditor-r .ProseMirror p {
    margin: 0;
    margin-top: v-bind(currentSpacing + "px");
    text-indent: v-bind(currentTextIndent + "em");
}
</style>