import { Fragment, MarkSpec, Schema } from "prosemirror-model";

// :: Object
// [Specs](#model.NodeSpec) for the nodes defined in this schema.
export const nodes = {
    // :: NodeSpec The top level document node.
    doc: {
        content: "block+",
    },
    // :: NodeSpec A plain paragraph textblock. Represented in the DOM
    // as a `<p>` element.
    paragraph: {
        content: "inline*",
        attrs: { type: { default: "base" } },
        group: "block",
        parseDOM: [{ tag: "p", attrs: { type: "base" } }],
        toDOM() {
            return ["p", 0] as const;
        },
    },
    // :: NodeSpec The text node.
    text: {
        group: "inline",
    },
};

// const getDelimContent = (delimiter: string) => (node: Node, schema: any) => {
//     if (
//         node.textContent?.startsWith(delimiter) &&
//         node.textContent?.endsWith(delimiter)
//     ) {
//         return Fragment.from(schema.text(node.textContent));
//     } else {
//         return Fragment.from(
//             schema.text(`${delimiter}${node.textContent}${delimiter}`)
//         );
//     }
// };

// :: Object [Specs](#model.MarkSpec) for the marks in the schema.
// export const marks = {
//     italic: {
//         parseDOM: [
//             {
//                 tag: "i",
//                 getContent: getDelimContent("_"),
//             },
//             {
//                 tag: "em",
//                 getContent: getDelimContent("_"),
//             },
//             {
//                 style: "font-style",
//                 getAttrs: (value: string) => value == "italic" && null,
//                 getContent: getDelimContent("_"),
//             },
//         ],
//         toDOM(): ["em"] {
//             return ["em"];
//         },
//     },
//     bold: {
//         parseDOM: [
//             {
//                 tag: "b",
//                 getContent: getDelimContent("*"),
//             },
//             {
//                 tag: "strong",
//                 getContent: getDelimContent("*"),
//             },
//             {
//                 style: "font-weight",
//                 getAttrs: (value) =>
//                     /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) && null,
//                 getContent: getDelimContent("*"),
//             },
//         ],
//         toDOM(): ["strong"] {
//             return ["strong"];
//         },
//     } as MarkSpec,
//     code: {
//         parseDOM: [
//             {
//                 tag: "code",
//                 getContent: getDelimContent("`"),
//             },
//         ],
//         toDOM(): ["code"] {
//             return ["code"];
//         },
//     },
// };

// type EditorSchema = Schema<
//     "doc" | "paragraph" | "text",
//     "italic" | "bold" | "code"
// >;
// type EditorSchema = Schema<
//     "doc" | "paragraph" | "text"
// >;

// :: Schema
// This schema roughly corresponds to the document schema used by
// [CommonMark](http://commonmark.org/), minus the list elements,
// which are defined in the [`prosemirror-schema-list`](#schema-list)
// module.
//
// To reuse elements from this schema, extend or read from its
// `spec.nodes` and `spec.marks` [properties](#model.Schema.spec).
export const schema: any = new Schema({
    nodes,
    // marks,
} as any);
