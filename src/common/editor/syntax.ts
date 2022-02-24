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

    // 获取光标所在字符串
    let targetString: string;
    if (window.getSelection()!.anchorNode) {
        const range = window.getSelection()!.getRangeAt(0),
            start = range.startContainer;
        if (typeof start.nodeValue === 'string') {
            targetString = start.nodeValue;
        }
    }
    // 从content中找到目标字符串
    content.forEach((para: any, offset: number) => {
        const content = para.textContent;
        if (content === targetString) {
            // 添加高亮class
            highlights.push(Decoration.node(offset, offset + content.length + 2, { class: 'onfocused', }));
        }
    });
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
                [...content.matchAll(mark.match)].map(match => {
                    const from = match.index + offset + 1;
                    const to = match[0].length + from;
                    count++;
                    highlights.push(
                        Decoration.inline(from, to, { class: mark.class })
                    );
                })
            }
        });
        mainStore.isHighlightCount = !mainStore.isHighlightCount;
        mainStore.highlightCount = count;
    }
    return highlights;
}

