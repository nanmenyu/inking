import { baseKeymap } from "prosemirror-commands";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { Node } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema } from "prosemirror-model";
import { SyntaxHighlightPlugin } from "./syntax";

export default function (initData: NodeDOC) {
    // 初始化
    const nodes = {
        doc: {
            content: "block+",
        },
        paragraph: {
            content: "inline*",
            attrs: { type: { default: "base" } },
            group: "block",
            parseDOM: [
                { tag: "p", attrs: { type: "base" } }
            ],
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
        doc: Node.fromJSON(schema, initData),
        schema,
        plugins: [
            history(),
            keymap({
                "Mod-z": undo,
                "Mod-y": redo,
            }),
            keymap(baseKeymap),
            SyntaxHighlightPlugin
        ],
    });
    const view = new EditorView(main, {
        state,
        dispatchTransaction(transaction: object) { // 每一个变化都会有一个 transaction 被创建,
            // console.log(transaction);
            // console.log("Document size went from", transaction.before.content.size,
            //     "to", transaction.doc.content.size)
            //每次的 state 更新最终都需要执行 updateState 方法
            const newState = view.state.apply(transaction)
            view.updateState(newState)
        }
    });
};