<template>
    <div id="paper-box-r">
        <main id="pEditor">
            <div id="mainEditor-r">
                <p v-for="item in fileData">{{ item }}</p>
            </div>
        </main>
    </div>
</template>

<script setup lang='ts'>
import { nextTick, ref, Ref } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '../db/db';
import { paperSize } from '../hooks/paperSize';
const route = useRoute(), query_id = parseInt(route.query.id as string);
const emit = defineEmits(['todata']);

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
// 读取文件数据
const fileData: Ref<Array<string>> = ref([]);
// 文件的总计数/当前计数
let totalWordCount = 0, totalCharCount = 0, totalParagraphs = 0;
const wordCount = ref(0), charCount = ref(0), paragraphs = ref(0);
function loadFileData() {
    db.ebooks.get(query_id).then(value => {
        const reader = new FileReader();
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
                    totalCharCount = (<string>ebookStr).length;
                    const ebookArr = (<string>ebookStr).replaceAll('\r', '').replaceAll('\t', '').split('\n');
                    totalParagraphs = ebookArr.length;
                    ebookArr.forEach(item => {
                        totalWordCount += item.trim().length;
                        fileData.value.push(item.trim());
                    })
                    // 发送统计数据
                    emit('todata', {
                        wordCount: totalWordCount,
                        charCount: totalCharCount,
                        paragraphs: totalParagraphs
                    });

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
    setTextIndent, setBgcColor, setShowborder, setRoundType, setPaperSize
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
    white-space: pre-wrap;
    white-space: break-spaces;
    -webkit-font-variant-ligatures: none;
    font-variant-ligatures: none;
    font-feature-settings: "liga" 0;
}
#mainEditor-r p {
    margin: 0;
    margin-top: v-bind(currentSpacing + "px");
    text-indent: v-bind(currentTextIndent + "em");
}
</style>