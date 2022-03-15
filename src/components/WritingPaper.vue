 <!-- 写作纸张 -->
 <template>
    <ContextMenu
        mode="writing"
        :menuItem="['随机取名', '文章续写']"
        @choice="choiceContextMenuItem"
        ref="contextMenu_ref"
    ></ContextMenu>
    <div id="paper-box-w" ref="pBox">
        <main @keydown="adaHeight" @keyup="getData(), input_saveDocData($event);" ref="editor">
            <div id="mainEditor-w" ref="mEditor"></div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch, reactive, Ref, nextTick } from 'vue';
import ContextMenu from './widget/ContextMenu.vue'
import getStyle from '../utils/getStyle';
import { throttle } from '../utils/flowControl';
import { hexToRgba } from '../utils/colorChange';
import pureTextEditor from '../common/editor';
import { setHighlightKeyword } from '../common/editor/syntax';
import { db } from '../db/db';
// import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min.js';
import { useRoute } from 'vue-router';
import useCurrentInstance from '../utils/useCurrentInstance';
import { useMainStore } from '../store/index';
import { setContentTipPos, setHTMLdata, setTranslationContent } from '../hooks/contentTip';
import { v4 } from 'uuid';
// import axios from 'axios';
import { paperSize } from '../hooks/paperSize';
import { exportTXT, exportDOCX, exportPDF } from '../hooks/paper';
import prohibitedWords from '../assets/json/prohibitedWords.json';
import '../style/toolTip.scss';

const emit = defineEmits(['todata', 'addKeyWord', 'toWebView']), { proxy } = useCurrentInstance();
const $modal = proxy.$modal;
const $message = proxy.$message;
const mainStore = useMainStore();
const contextMenu_ref = ref();

onMounted(() => {
    editor.value.addEventListener('keydown', insertSpace);
    contextMenu_ref.value.setContainer(editor.value);
})
onBeforeUnmount(() => {
    clearInterval(timer);
})

const boxWidth = ref(paperSize['A4']), boxHeight = ref(1000); // 纸张宽度，纸张高度

// 数据库取值相关
const route = useRoute(), query_id = parseInt(route.query.id as string);

// 刷新当前所在章id
let vid = route.query.vid;
let cid = route.query.cid;
const setId = (newVid: string, newCid: string) => {
    [vid, cid] = [newVid, newCid];
}

/*----监视纸张和字数变化----*/
const editor = ref();
let data: Pagecount, chapterNumber = 0;
let timer: any = null; // 定时器用于测速
// 监视输入框中的各项数值
const getData = () => {
    chapterNumber = editor.value.innerText.replaceAll('\n', '').replaceAll('\u0020', '').replaceAll('\u3000', '').length; // 字数统计
    data = {
        paperHeight: getStyle(editor.value, 'height'), // 输入框的高度
        wordCount: chapterNumber,
        charCount: editor.value.innerText.replaceAll('\n', '').length, // 字符数（不包含换行）
        paragraphs: editor.value.children[0].children[0].children.length // 段落数
    };
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
    if (data.charCount >= 15000) {
        $modal.warning({
            title: '单章字数过多',
            content: '单章字符数不宜过多(>15000),因为可能会影响导出PDF的性能(不导出就随意)'
        })
    }
}, 300);

// 键盘抬起时保存
const input_saveDocData = (e: KeyboardEvent) => {
    // 忽略一些键再保存
    const keyToIgnore = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'Shift', 'Meta', 'Alt', 'Control', 'CapsLock', 'PageUp', 'PageDown', 'Escape',
        'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
    if (keyToIgnore.indexOf(e.key) === -1) saveDocData(false);
}

// 保存数据至数据库
const saveDocData = throttle((showMsg: boolean) => {
    // console.log('save');
    const editorData = editor.value.firstElementChild.firstElementChild.children, dataArr: Array<string> = [];
    for (let i = 0; i < editorData.length; i++) {
        dataArr.push(editorData[i].innerText);
    }
    // 直接修改
    let totalNumber = 0;
    db.opus.where(':id').equals(query_id).modify(value => {
        value.data.forEach(item => {
            if (item.vid === vid) {
                item.volume.forEach(it => {
                    if (it.cid === cid) {
                        it.chapter = dataArr;
                        it.chapterNum = chapterNumber;
                        it.updateTime = new Date().getTime();
                        value.updateTime = new Date().getTime();// 更新修改时间;
                    }
                    // 顺便更新作品的总字数
                    if (!it.discard) totalNumber += it.chapterNum ?? 0;
                })
            }
        })
    }).then(() => {
        if (showMsg) $message.success('保存成功');
        // 更新总字数数据
        db.opus.update(query_id, { opusNumber: totalNumber }).then(() => {
            // 获取改变后的总字数
            let cout_temp = 0;
            db.opus.where(':id').between(1, Infinity).toArray().then(value => {
                value.forEach(opus => {
                    cout_temp += opus.opusNumber;
                })
            }).then(() => {
                mainStore.TotalNumber_thisTime = cout_temp;
            })
        })
    })
}, 500);

/*----修改文字、段落相关----*/
let currentFont = ref('KaiTi'), currentFontSize = ref(22), currentLineHeight = ref(1.5),
    currentFontWeight = ref('normal'), currentColor = ref('#333333'), currentSpacing = ref(10),
    currentTextIndent = ref(0), currentBgcColor = ref('#ffffff'),
    currentBorderType = ref('1px 2px 4px rgb(0 0 0 / 20%)'), currentRadius = ref(0);

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
const focusColor = ref('');
const setColor = (color: string, isInit: boolean) => {
    focusColor.value = color;
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
const setShowborder = (type: string, isInit: boolean) => {
    if (type === 'open') currentBorderType.value = '1px 2px 4px rgb(0 0 0 / 20%)';
    else if (type === 'close') currentBorderType.value = '';
    if (!isInit) getData();
}
const setRoundType = (type: string, isInit: boolean) => {
    if (type === 'none') currentRadius.value = 0;
    else if (type === 'have') currentRadius.value = 10;
    else if (type === 'bigger') currentRadius.value = 20;
    if (!isInit) getData();
}
const setPaperSize = (type: string, isInit: boolean) => {
    boxWidth.value = paperSize[type];
    if (!isInit) getData();
}
const setParaFocus = (type: string, isInit: boolean) => {
    if (type === 'open') {
        // 将当前选择的文字颜色变为透明的rgba
        currentColor.value = hexToRgba(focusColor.value, 0.3);
    } else {
        // 文字颜色恢复原状
        currentColor.value = focusColor.value;
    }
    if (!isInit) getData();
}

/*----另存为文件----*/
let currentChapter = '未命名章';
const pBox = ref();
const expFile = (type: string) => {
    switch (type) {
        case 'txt':
            exportTXT(currentChapter, editor.value);
            break;
        case 'docx':
            exportDOCX(currentChapter, pBox.value);
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
                        exportPDF(currentChapter, pBox.value);
                    }
                })
            } else {
                $message.loading({ content: '正在渲染...', duration: 2000 });
                exportPDF(currentChapter, pBox.value);
            }
            break;
    }
}

// 违禁词查询
const sensitiveRetrieval = () => {
    const words: { [key: string]: Array<string> } = prohibitedWords;// 导入敏感词库
    const appearWords: Array<string> = [], appearMarks: Array<Marker> = [];
    for (let i in words) {
        words[i].forEach(item => {
            if (editor.value.innerText.includes(item)) {
                appearWords.push(item);
                appearMarks.push({ match: new RegExp(item, 'g'), class: 'prohibitedWord', style: '' });
            }
        })
    }
    if (appearMarks.length === 0) {
        $message.success('未发现敏感词');
    } else {
        db.opus.get(query_id).then(value => {
            if (value) setBooksData(value, (<Array<Marker>>mainStore.keywordMarks).concat(appearMarks));
            $message.success(`发现${document.querySelectorAll('.prohibitedWord').length}处敏感词:包括${appearWords.join('、')}`);
        })
    }
}

const theKeyWordData: { data: Array<KeyWordGroup> } = reactive({ data: [] });
const allNameArr: Ref<Array<string>> = ref([]); // 全部关键词名称数组
const setBooksData = (value: Userdb, keyMarks?: Array<Marker>) => {
    theKeyWordData.data = value.theKeyWord;
    const toDisplay: Array<NodePara> = [];
    // toDisplay = []; // 清空
    value.data.forEach(item => {
        //获取本章数据
        if (item.vid === vid) {
            item.volume.forEach(it => {
                if (it.cid === cid) {
                    currentChapter = it.chapterName;
                    chapterNumber = it.chapterNum ?? 0;
                    it.chapter.forEach(item => {
                        toDisplay.push({
                            type: "paragraph",
                            content: [{ type: "text", text: item }]
                        });
                    });
                }
            })
        }
    })
    refreshPaper(toDisplay, keyMarks);
    getData();
    // 读取关键字全部名称
    db.opus.get(query_id).then(value => {
        if (value) {
            allNameArr.value = [];
            value.theKeyWord.forEach(item => {
                item.data.forEach(it => {
                    if (it.itemName !== '') allNameArr.value.push(it.itemName);
                    if (it.otherName.length > 0) allNameArr.value = allNameArr.value.concat(it.otherName);
                })
            })
        }
    })
}

// 刷新纸张内容
// 读取数据并显示在当前页面
const mEditor = ref();
const refreshPaper = (displayData: Array<NodePara>, keyMarks?: Array<Marker>) => {
    mEditor.value.innerHTML = '';
    if (keyMarks) setHighlightKeyword(keyMarks);
    pureTextEditor({
        type: "doc",
        content: displayData
    });
    // 屏蔽自带的拼写检查
    mEditor.value.firstElementChild.setAttribute('spellcheck', 'false');
}

// 监视选中文字的变化 设置选中文字时的工具栏
const currentText = ref('');
let searchType = 'wordSearch_baidu';// 默认搜索类型
watch(computed(() => {
    return mainStore.curSelectedText;
}), text => {
    const contentTip1 = <HTMLElement>document.querySelector('.contentTip[data-belong=btn1]');
    const contentTip2 = <HTMLElement>document.querySelector('.contentTip[data-belong=btn2]');
    const contentTip3 = <HTMLElement>document.querySelector('.contentTip[data-belong=btn3]');
    const toolTip = <HTMLElement>document.querySelector('#mainEditor-w .toolTip');
    const mainEditor_w = <HTMLElement>document.querySelector('#mainEditor-w');
    contentTip1.style.display = contentTip2.style.display = contentTip3.style.display = 'none';
    currentText.value = text.trim();

    // 添加选中文字到关键字
    const btn1 = <HTMLElement>document.querySelector('.btn1');
    btn1.onclick = function () {
        // 字数检测
        if (currentText.value.length > 10) {
            $message.warning('字数太多了(>10)');
        } else {
            const fragment = document.createDocumentFragment();
            // 整理关键字组
            theKeyWordData.data.map(item => item.kGroupName).forEach(item => {
                const div = document.createElement('div');
                div.className = 'group-name';
                div.innerText = item;
                fragment.append(div);
            })
            // 清空容器并append新元素
            contentTip1.innerHTML = '';
            contentTip1.append(fragment);
            contentTip2.style.display = contentTip3.style.display = 'none';
            setContentTipPos(toolTip, contentTip1, mainEditor_w);
            // 当点击某一组时
            contentTip1.onclick = function (e: MouseEvent) {
                const target = <HTMLElement>e.target;
                // 查看事件委托下触发的元素是否是目标元素
                if (target.className === 'group-name') {
                    const groupName = target.innerText;
                    // 避免全部关键字名重复
                    if (allNameArr.value.indexOf(currentText.value) === -1) {
                        db.opus.where(':id').equals(query_id).modify(item => {
                            item.theKeyWord.forEach(item => {
                                // 通过组名匹配
                                if (item.kGroupName === groupName) {
                                    item.data.push({
                                        iid: v4(),
                                        itemImg: '/static/img/default.png',
                                        itemName: currentText.value,
                                        otherName: [],
                                        itemDesc: '点击左侧修改介绍',
                                        associated: [],
                                        itemString: [],
                                        itemNumber: []
                                    });
                                }
                            })
                        }).then(() => {
                            emit('addKeyWord');
                            $message.success('添加关键词成功！');
                        })
                    } else {
                        $message.warning('关键词不能重复！');
                    }
                }
            }
        }
    }
    // 选中文字快速查词
    const btn2 = <HTMLElement>document.querySelector('.btn2')!;
    btn2.onclick = function () {
        if (currentText.value.length > 10) {
            $message.warning('字数太多了(>10)');
        } else {
            // 点击按钮显示/关闭
            contentTip1.style.display = contentTip3.style.display = 'none';
            setContentTipPos(toolTip, contentTip2, mainEditor_w);
            // 配置并搜索项
            getHTMLdata({
                type: searchType,
                word: currentText.value
            });
        }
    }
    // 选中文字快速翻译
    const btn3 = <HTMLElement>document.querySelector('.btn3')!;
    btn3.onclick = function () {
        contentTip1.style.display = contentTip2.style.display = 'none';
        setContentTipPos(toolTip, contentTip3, mainEditor_w);
        setTranslationContent(contentTip3, currentText.value); // 设置翻译内容
    }
    // 右侧使用webview打开
    const btn4 = <HTMLElement>document.querySelector('.btn4')!;
    btn4.onclick = function () {
        emit('toWebView', currentText.value);
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
                    getHTMLdata({ type: searchType, word: currentText.value });
                }
            }
        })
    }
})

// 右侧菜单栏触发
const choiceContextMenuItem = (data: { item: string, select?: string }) => {
    console.log('&', data.item);
}

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

// 移动光标到指定位置
function moveCursor(selection: Selection, range: Range, startNode: Node, startOffset: number) {
    range.setStart(startNode, startOffset);
    range.setEnd(startNode, startOffset);
    selection.removeAllRanges();
    selection.addRange(range);
}

defineExpose({
    saveDocData, setFont, setFontSize, setLineHeight, setFontWeight, setColor, setSegSpacing, setTextIndent,
    setBgcColor, setShowborder, setRoundType, setPaperSize, setParaFocus, expFile, sensitiveRetrieval, setBooksData,
    refreshPaper, setId
})
</script>

<!-- 文字：字号 字色 字体 粗细 行高-->
<!-- 段落：段间距 每段首行缩进 段聚焦-->
<!-- 其它：纸张颜色 软件主题 纸张大小-->
<style>
#paper-box-w {
    width: v-bind(boxWidth + "px");
    height: v-bind(boxHeight + "px");
    margin: 20px auto;
    background-color: v-bind(currentBgcColor);
    box-shadow: v-bind(currentBorderType);
    border-radius: v-bind(currentRadius + "px");
}

[contenteditable]:focus {
    outline: none;
}

#mainEditor-w {
    position: relative;
}

#mainEditor-w .ProseMirror {
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
#mainEditor-w .ProseMirror p {
    margin: 0;
    margin-top: v-bind(currentSpacing + "px");
    text-indent: v-bind(currentTextIndent + "em");
}
#mainEditor-w .ProseMirror .onfocused {
    color: v-bind(focusColor);
}
#mainEditor-w .ProseMirror .keyWord {
    position: relative;
    border-radius: 6px;
    cursor: pointer;
}
#mainEditor-w .ProseMirror .keyWord::before {
    content: "";
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: rgb(var(--my-secondary-6));
    visibility: hidden;
    transform: scaleX(0);
    transition: all 0.3s ease-in-out 0s;
}
#mainEditor-w .ProseMirror .keyWord:hover::before {
    visibility: visible;
    transform: scaleX(1);
}
#mainEditor-w .ProseMirror .prohibitedWord {
    text-decoration: line-through;
    text-decoration-color: red;
}
#mainEditor-w .ProseMirror .keyword_search {
    border-radius: 25%;
    background-color: #ff0;
}
</style>