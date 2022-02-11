import { Node } from "prosemirror-model";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { schema } from "./schema";

const nodes = [
    { match: /^# (.*)$/g, class: "heading-1" },
    { match: /^## (.*)$/g, class: "heading-2" },
    { match: /^### (.*)$/g, class: "heading-3" },
    { match: /^---$/g, class: "divider" },
];

// const marks = [
//   { match: /\*([^\*]*)\*/g, class: "bold" },
//   { match: /\_([^\_]*)\_/g, class: "italic" },
//   { match: /\`([^\`]*)\`/g, class: "code" },
// ];

function highlightDocument(doc: Node<typeof schema>) {
    const content = doc.content;
    const highlights: Decoration[] = [];
    content.forEach((para, offset) => {
        const content = para.textContent;
        for (const node of nodes) {
            [...content.matchAll(node.match)].map((match) => {
                highlights.push(
                    Decoration.node(offset, offset + content.length + 2, {
                        class: node.class,
                    })
                );
            });
        }

        // for (const mark of marks) {
        //     [...content.matchAll(mark.match)].map((match) => {
        //         const from = match.index! + offset;
        //         const to = match[0].length + from + 1;
        //         highlights.push(
        //             Decoration.inline(from, to, {
        //                 class: mark.class,
        //             })
        //         );
        //     });
        // }
    });
    return highlights;
}

export const SyntaxHighlightPlugin: Plugin<
    DecorationSet<typeof schema>,
    typeof schema
> = new Plugin({
    state: {
        init(_, editorState) {
            return DecorationSet.create(
                editorState.doc,
                highlightDocument(editorState.doc)
            );
            // for (let pos = 1; pos < doc.content.size; pos += 4)
            //   speckles.push(
            //     Decoration.inline(pos - 1, pos, { style: "background: yellow" })
            //   );
            // return DecorationSet.create(doc, speckles);
        },
        apply(tr, highlights) {
            return DecorationSet.create(tr.doc, highlightDocument(tr.doc));
        },
    },
    props: {
        decorations(state) {
            return SyntaxHighlightPlugin.getState(state);
        },
    },
});
