import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { useMainStore } from '../../store/index';
// 使用pinia 
const mainStore = useMainStore();

// 设置要包裹的关键词
export const setHighlightKeyword = (keyMarks: Array<{ match: RegExp, class: string }>) => {
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


// 段落聚焦功能
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

// 关键字高亮
let marks: Array<{ match: RegExp, class: string }>;
function highlightKeyword(doc: any) {
    const content = doc.content, highlights: any = [];

    if (marks) {
        let count = 0;
        content.forEach((para: any, offset: number) => {
            const content = para.textContent;
            for (const mark of marks) {
                [...content.matchAll(mark.match)].map((match, i) => {
                    const from = match.index + offset + 1;
                    const to = match[0].length + from;
                    count++;
                    if (count === mainStore.targetIndex) {
                        // 将当前选中关键字更加高亮并添加自定义锚点属性'data-nowhere'
                        highlights.push(
                            Decoration.inline(from, to, { class: mark.class, style: 'background-color: #f93;', id: 'search-anchor' })
                        );
                    } else {
                        highlights.push(
                            Decoration.inline(from, to, { class: mark.class })
                        );
                    }
                })
            }
        });
        mainStore.isHighlightCount = !mainStore.isHighlightCount;
        mainStore.highlightCount = count;
    }
    return highlights;
}

