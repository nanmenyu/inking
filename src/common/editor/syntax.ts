import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { useMainStore } from '../../store/index';
// 使用pinia 
const mainStore = useMainStore();

// 设置要包裹的关键词
export const setHighlightKeyword = (keyMarks: Array<{ match: RegExp, class: string, style: string }>) => {
    marks = keyMarks;
}

export const ParagraphFocusPlugin = new Plugin({
    state: {
        init(_: any, editorState: any) {
            return DecorationSet.create(
                editorState.doc,
                highlightDocument(editorState.doc)
            );
        },
        apply(tr: any) {
            return DecorationSet.create(tr.doc, highlightDocument(tr.doc));
        },
    },
    props: {
        decorations(state: any) {
            return ParagraphFocusPlugin.getState(state);
        },
    },
});

export const highlightKeywordPlugin = new Plugin({
    state: {
        init(_: any, editorState: any) {
            return DecorationSet.create(
                editorState.doc,
                highlightKeyword(editorState.doc)
            );
        },
        apply(tr: any) {
            return DecorationSet.create(tr.doc, highlightKeyword(tr.doc));
        },
    },
    props: {
        decorations(state: any) {
            return highlightKeywordPlugin.getState(state);
        },
    },
});

/* --------------------------段落聚焦功能----------------------*/
function highlightDocument(doc: any) {
    const content = doc.content, highlights: any = [];
    const proseMirror = document.querySelector('.ProseMirror')!;
    let targetNode2: any;

    if (proseMirror) {
        // 获取光标所在字符串
        let targetString: string;
        if (window.getSelection()!.anchorNode) {
            const range = window.getSelection()!.getRangeAt(0),
                start = range.startContainer;
            if (typeof start.nodeValue === 'string') {
                let element = start.parentElement;
                while (true) {
                    if (element && (element.tagName !== 'P')) element = element.parentElement;
                    else break;
                }
                for (let i = 0; i < proseMirror.children.length; i++) {
                    if (element === proseMirror.children.item(i)) {
                        targetNode2 = content.content[i];
                        break;
                    };
                }
            }
        }
        // 从content中找到目标字符串
        content.forEach((para: any, offset: number) => {
            if (para === targetNode2) {
                // 添加高亮class
                highlights.push(Decoration.node(offset, offset + para.textContent.length + 2, { class: 'onfocused', }));
            }
        });
    }
    return highlights;
}

/* --------------------------关键字高亮功能----------------------*/
let marks: Array<{ match: RegExp, class: string, style: string }>;
function highlightKeyword(doc: any) {
    const content = doc.content, highlights: any = [];
    if (marks) {
        // 寻找全文每段对应的匹配关键字数组
        let count = 0, matchArray: Array<Array<any>> = [];
        content.forEach((para: any, offset: number) => {
            const content = para.textContent; // 表示每一段的字符串
            let tempArr: Array<any> = [];
            for (const mark of marks) {
                // 匹配出一段中的所有关键字
                const matchItem = [...content.matchAll(mark.match)];
                if (matchItem.length > 0) {
                    // 格式重塑
                    matchItem.forEach(item => {
                        item.mark = { class: mark.class, style: mark.style };
                        item.offset = offset;
                        tempArr.push(item);
                    })
                }
            }
            if (tempArr.length > 0) matchArray.push(tempArr);
        });
        // 数据整形获得二维新数组，其中每一个数组表示一个段落
        const targetMatchArray: Array<any> = [];
        matchArray.forEach(item => {
            const tempArr: Array<any> = [];
            item.forEach(it => {
                // 格式重塑
                tempArr.push({
                    keyWord: it[0], index: it.index,
                    mark: it.mark, offset: it.offset
                })
            })
            targetMatchArray.push(tempArr);
        })
        // 前项匹配，匹配最长的关键词，例如AB+ABC=ABC
        targetMatchArray.forEach((item, index) => {
            if (item.length > 1) {
                // 统计每个index对应的数据索引
                const tempObj: { [key: number]: any } = {}, tempArr = [];
                item.forEach((it: any, i: number) => {
                    if (!tempObj[it.index]) tempObj[it.index] = [];
                    tempObj[it.index].push(i);
                })
                // 遍历对象查看是否有长度大于1的情况
                for (let key in tempObj) {
                    if (tempObj[key].length > 1) {
                        // 找出同一段，同一起始位中，字符长度最长的数据
                        let maxOne, maxLen = 0;
                        tempObj[key].forEach((it: number) => {
                            if (item[it].keyWord.length > maxLen) {
                                [maxOne, maxLen] = [item[it], item[it].keyWord.length];
                            }
                        })
                        tempArr.push(maxOne);
                    } else {
                        tempArr.push(item[tempObj[key][0]]);
                    }
                    // 替换原数据
                    targetMatchArray[index] = tempArr;
                }
            }
        })
        // 后项匹配，匹配最长的关键词，例如BC+ABC=ABC
        targetMatchArray.forEach((item, index) => {
            if (item.length > 1) {
                // 统计每个index+length对应的数据索引
                const tempObj: { [key: number]: any } = {}, tempArr = [];
                item.forEach((it: any, i: number) => {
                    if (!tempObj[it.index + it.keyWord.length]) tempObj[it.index + it.keyWord.length] = [];
                    tempObj[it.index + it.keyWord.length].push(i);
                })
                // 遍历对象查看是否有长度大于1的情况
                for (let key in tempObj) {
                    if (tempObj[key].length > 1) {
                        // 找出同一段，同一起始位中，字符长度最长的数据
                        let maxOne, maxLen = 0;
                        tempObj[key].forEach((it: number) => {
                            if (item[it].keyWord.length > maxLen) {
                                [maxOne, maxLen] = [item[it], item[it].keyWord.length];
                            }
                        })
                        tempArr.push(maxOne);
                    } else {
                        tempArr.push(item[tempObj[key][0]]);
                    }
                    // 替换原数据
                    targetMatchArray[index] = tempArr;
                }
            }
        })
        const newMatchArray = [].concat.apply([], <any>targetMatchArray); // 数组降维
        newMatchArray.forEach((match: any) => {
            const from = match.index + match.offset + 1;
            const to = match.keyWord.length + from;
            // 添加装饰器
            count++;
            if (mainStore.isInSearch && count === mainStore.targetIndex) {
                // 将当前选中关键字更加高亮并添加自定义锚点属性'data-nowhere'
                highlights.push(
                    Decoration.inline(from, to, { class: match.mark.class, style: 'background-color: #f93;', id: 'search-anchor' })
                );
            } else {
                highlights.push(
                    Decoration.inline(from, to, { class: match.mark.class, style: match.mark.style })
                );
            }
        })
        mainStore.isHighlightCount = !mainStore.isHighlightCount;
        mainStore.highlightCount = count;
    }
    return highlights;
}

