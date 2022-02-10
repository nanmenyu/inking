 <!-- 写作纸张 -->
 <template>
    <div id="paper-box" ref="pBox">
        <main @keyup="getData" @keydown="adaHeight" id="pEditor" ref="editor">
            <div id="mainEditor" ref="mEditor"></div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import getStyle from '../utils/getStyle';
import { throttle } from '../utils/flowControl';
import hexToRgba from '../utils/hexToRgba';
import pureTextEditor from '../common/pEditor/index.js';
import { db } from '../db/db';
import html2pdf from 'html2pdf.js';
import { useRoute } from 'vue-router';
import { saveAs } from 'file-saver';
// import htmlDocx from 'html-docx-js/dist/html-docx';
import useCurrentInstance from '../utils/useCurrentInstance';

/*----初始化----*/
const emit = defineEmits(['todata']), { proxy } = useCurrentInstance();
const $modal = proxy.$modal;
const $message = proxy.$message;

// 纸张的宽度 = 内容区 + 40px的左右边距
const paperSize: { [key: string]: number } = {
    'Max': 1280,
    'iPad Pro': 1024,
    'A4': 794,
    'iPad': 768,
    'Surface Duo': 540,
    'iPhone6/7/8 Plus': 414,
    'iPhone6/7/8 X': 375,
    'iPhone5/SE': 320,
    'Galaxy Fold': 280
};
const boxWidth = ref(paperSize['A4']), // 纸张宽度
    boxHeight = ref(1000); // 纸张高度

// 数据库取值相关
const route = useRoute(),
    query_id = parseInt(route.query.id as string);

// 刷新当前所在章id
let vid = route.query.vid;
let cid = route.query.cid;
const setId = (newVid: string, newCid: string) => {
    vid = newVid;
    cid = newCid;
}

/*----监视纸张----*/
const editor = ref();
let maxCount = 15000, data: Pagecount, chapterNumber = 0;
// 监视输入框中的各项数值
const getData = () => {
    chapterNumber = editor.value.innerText.replaceAll('\n', '').replaceAll(' ', '').length; // 字数统计
    data = {
        paperHeight: getStyle(editor.value, 'height'), // 输入框的高度
        wordCount: chapterNumber,
        charCount: editor.value.innerText.replaceAll('\n', '').length, // 字符数（不包含换行）
        paragraphs: editor.value.children[0].children[0].children.length // 段落数
    }
    // 适应纸张高度
    adaHeight();
    // 节流
    emit_throttle();
}
const adaHeight = () => {
    // 纸张高度紧随编辑框的变化
    boxHeight.value = parseInt(data.paperHeight.replace('px', '')) >= 1000 ? parseInt(data.paperHeight.replace('px', '')) : 1000;
}
// 具体节流项目
const emit_throttle = throttle(() => {
    emit('todata', data);
    // 字数提示
    if (data.charCount >= maxCount) {
        $modal.warning({
            title: '单章字数过多',
            content: '单章字符数不宜过多(不多于15000),因为也许会影响性能'
        })
        maxCount += 500;
    }
    if (data.charCount >= 17000) {
        console.log('禁止字数增加')
    }
}, 300);

// 保存数据至数据库
const saveDocData = () => {
    const editorData = editor.value.firstElementChild.firstElementChild.children, dataArr: Array<string> = [];
    for (let i = 0; i < editorData.length; i++) {
        dataArr.push(editorData[i].innerText);
    }
    // 直接修改
    db.opus
        .where(':id')
        .equals(query_id)
        .modify(value => {
            for (let i = 0; i < value.data.length; i++) {
                if (value.data[i].vid === vid) {
                    for (let j = 0; j < value.data[i].volume.length; j++) {
                        if (value.data[i].volume[j].cid === cid) {
                            value.data[i].volume[j].chapter = dataArr;
                            value.data[i].volume[j].chapterNum = chapterNumber;
                            value.data[i].volume[j].updateTime = new Date().getTime();
                            value.updateTime = new Date().getTime();// 更新修改时间;
                            break;
                        }
                    }
                    break;
                }
            }
        }).then(() => {
            $message.success('保存成功');
        })
}

/*----另存为文件----*/
let currentChapter = '未命名章', paperType, converted;
const pBox = ref();
const expFile = (type: string) => {
    switch (type) {
        case 'txt':
            saveAs(new Blob([editor.value.innerText], { type: 'text/plain;charset=utf-8' }), currentChapter + '.txt');
            break;
        case 'docx':
            // converted = htmlDocx.asBlob('<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>' + pBox.value.outerHTML + '</body></html>');
            // saveAs(converted, currentChapter + '.docx');
            break;
        case 'pdf':
            paperType = JSON.parse((localStorage.getItem('uWritingOption') as string)).uPaperSize;
            if (paperType === 'Max' || paperType === 'iPad Pro') {
                $modal.warning({
                    title: "导出警告",
                    content: `当纸张宽度大于A4纸时, 部分内容会做裁剪处理`,
                    simple: true,
                    onOk: () => {
                        exportPDF();
                    }
                })
            } else {
                exportPDF();
            }
            break;
    }
}

// 导出为PDF
function exportPDF() {
    // 单章17k字左右的极限~~~15K
    // 输出配置项 见：https://ekoopmans.github.io/html2pdf.js/
    html2pdf().set({
        // Margin ,[vMargin, hMargin] ,[top, left, bottom, right]
        margin: [0.3, 0, 0.3, 0],
        // 默认文件名
        filename: currentChapter + '.pdf',
        // 开启智能分页
        pagebreak: {
            mode: 'avoid-all'
        },
        // PDF中的链接是否有效
        enableLinks: true,
        html2canvas: {
            scale: 2,
            backgroundColor: '#fff' //默认白色（如果DOM中未指定）
        },
        jsPDF: {
            unit: 'in',
            format: 'a4',
            orientation: 'portrait'
        }
    }).from(pBox.value).save();
    $message.loading({ content: '正在渲染...', duration: 2000 });
}

/*----修改文字、段落相关----*/
let currentFont = ref('KaiTi'),
    currentFontSize = ref(22),
    currentLineHeight = ref(1.5),
    currentFontWeight = ref('normal'),
    currentColor = ref('#333333'),
    currentSpacing = ref(10),
    currentTextIndent = ref(0),
    currentBgcColor = ref('#ffffff');

const setFont = (font: string, isInit: boolean) => {
    currentFont.value = font;
    if (!isInit) getData();
}
const setFontSize = (size: number, isInit: boolean) => {
    currentFontSize.value = size;
    if (!isInit) getData();
}
const setLineHeight = (height: number, isInit: boolean) => {
    currentLineHeight.value = height;
    if (!isInit) getData();
}
const setFontWeight = (weight: string, isInit: boolean) => {
    currentFontWeight.value = weight;
    if (!isInit) getData();
}

// 聚焦模式时存储当前的字体hex码
let focusColor = '';
const setColor = (color: string, isInit: boolean) => {
    focusColor = color;
    currentColor.value = color;
    if (!isInit) getData();
}
const setSegSpacing = (spacing: number, isInit: boolean) => {
    currentSpacing.value = spacing;
    if (!isInit) getData();
}
const setTextIndent = (indent: number, isInit: boolean) => {
    currentTextIndent.value = indent;
    if (!isInit) getData();
}
const setBgcColor = (color: string, isInit: boolean) => {
    currentBgcColor.value = color;
    if (!isInit) getData();
}
const setPaperSize = (type: string, isInit: boolean) => {
    boxWidth.value = paperSize[type];
    if (!isInit) getData();
}
const paraFocus = ref('close');
const setParaFocus = (type: string, isInit: boolean) => {
    paraFocus.value = type;
    if (!isInit) getData();
}

const setBooksData = (value: Userdb) => {
    const toDisplay: Array<object> = [];
    for (let i = 0; i < value.data.length; i++) {
        if (value.data[i].vid === vid) {
            for (let j = 0; j < value.data[i].volume.length; j++) {
                if (value.data[i].volume[j].cid === cid) {
                    currentChapter = value.data[i].volume[j].chapterName;
                    value.data[i].volume[j].chapter.forEach(item => {
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
    refreshPaper(toDisplay);
    getData();
}

// 刷新纸张内容
// 读取数据并显示在当前页面
const mEditor = ref();
const refreshPaper = (toDisplay: Array<object>) => {
    mEditor.value.innerHTML = '';
    pureTextEditor({
        type: "doc",
        content: toDisplay
    });
    // 屏蔽自带的拼写检查
    mEditor.value.firstElementChild.setAttribute('spellcheck', 'false');
}

// 修改键盘控制
onMounted(() => {
    editor.value.addEventListener('keydown', insertSpace);
    editor.value.addEventListener('keyup', () => {
        paraFocus.value === 'open' ?
            ParagraphFocus() :
            currentColor.value = focusColor;
    });
    editor.value.addEventListener('click', () => {
        paraFocus.value === 'open' ?
            ParagraphFocus() :
            currentColor.value = focusColor;
    });
})

// TAB键插入两个中文空格
function insertSpace(e: KeyboardEvent) {
    const selection = window.getSelection(),
        range = selection!.getRangeAt(0),
        start = range.startContainer;
    if (e.key === 'Tab') {
        e.preventDefault();
        if (start.nodeType === 1) {
            // 新换行时
            (<HTMLElement>start).innerText = '\u3000\u3000';
            moveCursor(selection!, range, start.firstChild!, 2);
        } else if (start.nodeType === 3) {
            // 在原文段中添加
            (<Text>start).replaceData(range.startOffset, range.endOffset - range.startOffset, '\u3000\u3000');
            moveCursor(selection!, range, start, range.startOffset + 2);
        }
    }
}

// 段落聚焦功能
let oldElement: HTMLElement;
function ParagraphFocus() {
    const selection = window.getSelection(),
        range = selection!.getRangeAt(0),
        start = range.startContainer;
    const targetElement = (<HTMLElement>start.parentElement).tagName === 'P' ? start.parentElement : (<HTMLElement>start.parentElement).parentElement;

    if (oldElement !== targetElement) {
        // 将当前选择的文字颜色变为透明的rgba
        currentColor.value = hexToRgba(focusColor, 0.3);
        // 创建迭代器
        let iterator = document.createNodeIterator(mEditor.value, NodeFilter.SHOW_ELEMENT, null);
        // 用循环反复调用节点迭代器对象的nextNode().跳向下一个节点
        let node;
        while ((node = iterator.nextNode()) != null) {
            (<HTMLElement>node).removeAttribute('style'); //清除其它元素的style
        }
        targetElement!.style.color = focusColor;
        oldElement = targetElement!;
    }
}

// 移动光标到指定位置
function moveCursor(selection: Selection, range: Range, startNode: Node, startOffset: number) {
    range.setStart(startNode, startOffset);
    range.setEnd(startNode, startOffset);
    selection.removeAllRanges();
    selection.addRange(range);
}


defineExpose({
    saveDocData, expFile, setFont, setFontSize, setLineHeight, setFontWeight, setColor, setSegSpacing, setTextIndent, setBgcColor, setPaperSize, setParaFocus, setBooksData, refreshPaper, setId
})
</script>

<!-- 文字：字号 字色 字体 粗细 行高-->
<!-- 段落：段间距 每段首行缩进 段聚焦-->
<!-- 其它：纸张颜色 软件主题 纸张大小-->
<style>
#paper-box {
    width: v-bind(boxWidth + "px");
    height: v-bind(boxHeight + "px");
    margin: 20px auto;
    background-color: v-bind(currentBgcColor);
    box-shadow: 1px 2px 4px rgb(0 0 0 / 20%);
    /* background: url("/static/temp/bg_04.gif"); */
    /* border-top: 1px solid #e0e0e0;
    border-left: 1px solid #e0e0e0; */
}

[contenteditable]:focus {
    /* outline: #ccc dashed thin; */
    outline: none;
}

/* @import url("../assets/lib/pEditor/style.css"); */
#mainEditor .ProseMirror {
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
#mainEditor .ProseMirror p {
    margin: 0;
    margin-top: v-bind(currentSpacing + "px");
    text-indent: v-bind(currentTextIndent + "em");
}
</style>