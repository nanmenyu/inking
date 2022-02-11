// import { Keymap } from "prosemirror-commands";
// import { InputRule, inputRules } from "prosemirror-inputrules";
// import { schema } from "./schema";

// // WIP plugin to handle weird edge cases of the bold input rule

// // const boldPlugin = new Plugin<any, typeof schema>({
// //   appendTransaction: (trs, oldState, newState) => {
// //     // Get the current paragraph at the anchor, figure out how many stars there are
// //     // and for even, remove bold mark, for old, add it.

// //     // Although this feels pretty inefficient...
// //     let starCount =
// //       newState.selection.$anchor.parent
// //         .textBetween(0, newState.selection.anchor)
// //         .split("*").length - 1;

// //     if (starCount % 2 == 0 && ) {

// //     }
// //   },
// // });

// const bold = new InputRule<typeof schema>(
//     /\*([^\*.]+)\*$/,
//     (state, match, start, end) => {
//         const tr = state.tr;
//         if (schema.marks.bold.isInSet(state.doc.resolve(start).marks())) {
//             // The last asterisk is bolded, and this one is starting a new bold context
//             // So don't do anything
//             tr.insertText("*");
//             return tr;
//         } else {
//             tr.insertText("*");
//             tr.addMark(start, end + 1, schema.marks.bold.create());
//             tr.removeStoredMark(schema.marks.bold);
//             return tr;
//         }
//     }
// );

// // const toggleBold: Command<typeof schema> = (state, dispatch) => {
// //   if (dispatch) {
// //     const tr = state.tr;
// //     tr.insertText("*");
// //     dispatch(tr);
// //   }
// //   return false;
// // };

// const italic = new InputRule<typeof schema>(
//     /\_([^\_.]+)\_$/,
//     (state, _, start, end) => {
//         const tr = state.tr;
//         if (schema.marks.italic.isInSet(state.doc.resolve(start).marks())) {
//             tr.insertText("_");
//             return tr;
//         } else {
//             tr.insertText("_");
//             tr.addMark(start, end + 1, schema.marks.italic.create());
//             tr.removeStoredMark(schema.marks.italic);
//             return tr;
//         }
//     }
// );

// // const toggleItalic: Command<typeof schema> = (state, dispatch) => {
// //   if (dispatch) {
// //     dispatch(state.tr.removeStoredMark(schema.marks.italic));
// //   }
// //   return true;
// // };

// const code = new InputRule<typeof schema>(
//     /\`([^\`.]+)\`$/,
//     (state, _, start, end) => {
//         const tr = state.tr;
//         if (schema.marks.code.isInSet(state.doc.resolve(start).marks())) {
//             tr.insertText("`");
//             return tr;
//         } else {
//             tr.insertText("`");
//             tr.addMark(start, end + 1, schema.marks.code.create());
//             tr.removeStoredMark(schema.marks.code);
//             return tr;
//         }
//     }
// );

// export const markdownKeyBindings: Keymap<typeof schema> = {
//     // "Mod-b": toggleBold,
//     // "Mod-i": toggleItalic,
// };
// export const markdownInputRules = inputRules({ rules: [bold, italic, code] });
