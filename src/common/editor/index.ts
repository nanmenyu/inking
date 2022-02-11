import { baseKeymap } from "prosemirror-commands";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { Node } from "prosemirror-model";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView, Decoration } from "prosemirror-view";
import { Schema } from "prosemirror-model";

// export let main: HTMLElement;

export default function (initializationData: object) {
    // 初始化
    const nodes = {
        doc: {
            content: "block+",
        },
        paragraph: {
            content: "inline*",
            attrs: { type: { default: "base" } },
            group: "block",
            parseDOM: [{ tag: "p", attrs: { type: "base" } }],
            toDOM() {
                return ["p", 0] as const;
            },
        },
        text: {
            group: "inline",
        },
    };
    const schema = new Schema({ nodes });
    const main = document.querySelector("#mainEditor")!;
    const state = EditorState.create({
        doc: Node.fromJSON(schema, initializationData),
        schema,
        plugins: [
            history(),
            keymap({
                "Mod-z": undo,
                "Mod-y": redo,
                // ...markdownKeyBindings,
            }),
            keymap(baseKeymap),
            // SyntaxHighlightPlugin,
            // markdownInputRules,
            // CursorPlugin,
        ],
    });
    const view = new EditorView(main, {
        state,
    });
    // view.focus();
};

// const SyntaxHighlightPlugin = new Plugin({
//     state: {
//         init(_, editorState) {
//             // return DecorationSet.create(
//             //     editorState.doc,
//             //     highlightDocument(editorState.doc)
//             // );
//             const content = editorState.doc.content;
//             // content.forEach((para, offset) => {
//             //     console.log(para.textContent);
//             //     console.log(offset);
//             // })
//             Decoration.node(0, 5, {
//                 style: 'color:red',
//             })
//         }
//     }
// })