import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

// 段落聚焦功能
function highlightDocument(doc: any) {
    const content = doc.content;
    const highlights: any = [];

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

export const SyntaxHighlightPlugin = new Plugin({
    state: {
        init(_: any, editorState: any) {
            return DecorationSet.create(
                editorState.doc,
                highlightDocument(editorState.doc)
            );
        },
        apply(tr: any, highlights: any) {
            return DecorationSet.create(tr.doc, highlightDocument(tr.doc));
        },
    },
    props: {
        decorations(state: any) {
            return SyntaxHighlightPlugin.getState(state);
        },
    },
});
