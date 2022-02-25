import { baseKeymap } from 'prosemirror-commands';
import { history, redo, undo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { ParagraphFocusPlugin, highlightKeywordPlugin, setHighlightKeyword } from './syntax';
import { selectionSizePlugin } from './tooltip';
import { useMainStore } from '../../store/index';

// 使用pinia 
const mainStore = useMainStore();

export default function (initData: NodeDOC, keyMarks?: Array<{ match: RegExp, class: string, style: string }>) {
    // 初始化
    const nodes = {
        doc: {
            content: 'block+',
        },
        paragraph: {
            content: 'inline*',
            attrs: { type: { default: 'base' } },
            group: 'block',
            parseDOM: [
                { tag: 'p', attrs: { type: 'base' } }
            ],
            toDOM() {
                return ['p', 0] as const;
            },
        },
        text: {
            group: 'inline',
        },
    };
    const schema = new Schema({ nodes });
    const main = document.querySelector('#mainEditor')!;
    if (keyMarks) setHighlightKeyword(keyMarks); // 设置要高亮的关键字 [{ match: /男人/g, class: 'keyword' }]
    const state = EditorState.create({
        doc: Node.fromJSON(schema, initData),
        schema,
        plugins: [
            history(),
            keymap({
                'Mod-z': undo,
                'Mod-y': redo,
            }),
            keymap(baseKeymap),
            ParagraphFocusPlugin, // 段落聚焦插件
            highlightKeywordPlugin, // 关键字高亮
            selectionSizePlugin, // 文字选中小工具
        ],
    });
    const view = new EditorView(main, {
        state,
        dispatchTransaction(transaction: any) { // 每一个变化都会有一个 transaction 被创建,
            // console.log('Document size went from', transaction.before.content.size,
            //     'to', transaction.doc.content.size)
            //每次的 state 更新最终都需要执行 updateState 方法
            // 控制保存页面内容
            if (transaction.updated === 5) mainStore.needSaveDocData = true;
            const newState = view.state.apply(transaction);
            view.updateState(newState);
        }
    });
};