import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list';
import { exampleSetup } from 'prosemirror-example-setup';

// 将 prosemirror-schema-list 和基本 schema 放在一起形成一个支持 list 的 schema
const mySchema = new Schema({
    nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
    marks: schema.spec.marks
})

export default function (editor: HTMLElement, content: HTMLElement) {

    window.view = new EditorView(editor, {
        state: EditorState.create({
            doc: DOMParser.fromSchema(mySchema).parse(content),
            plugins: exampleSetup({ schema: mySchema })
        })
    })

}
