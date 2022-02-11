// // A file for initial content loading into the document. Checks if we're on about page or not, and returns the appropriate content

// const welcomes = [
//     "What's on your mind?",
//     "Hey, welcome to Gem :)",
//     "Hello, hello!",
//     "Why, welcome.",
//     "A long, long time ago...",
//     "Go ahead, try me >:)",
//     "Just type it out.",
// ];
// const about = {
//     type: "doc",
//     content: [
//         {
//             type: "paragraph",
//             attrs: { type: "base" },
//             content: [
//                 {
//                     type: "text",
//                     text: "Hello! Welcome to Gem. Gem is a light-weight, performant, and minimal editor designed to be aesthetic and fun. ",
//                 },
//             ],
//         },
//         { type: "paragraph", attrs: { type: "base" } },
//         {
//             type: "paragraph",
//             attrs: { type: "base" },
//             content: [
//                 {
//                     type: "text",
//                     text: "It's entirely local: your notes don't get sent anywhere, and if you close the tab, they're gone forever.",
//                 },
//             ],
//         },
//         { type: "paragraph", attrs: { type: "base" } },
//         {
//             type: "paragraph",
//             attrs: { type: "base" },
//             content: [
//                 {
//                     type: "text",
//                     text: "It currently supports some limited Markdown-like functionality like ",
//                 },
//                 { type: "text", marks: [{ type: "bold" }], text: "*bold*" },
//                 { type: "text", text: ", " },
//                 { type: "text", marks: [{ type: "italic" }], text: "_italic_," },
//                 { type: "text", text: " and " },
//                 { type: "text", marks: [{ type: "code" }], text: "`code`" },
//                 {
//                     type: "text",
//                     text: " although they can be a little buggy. There's plans to add more elements with more robust support.",
//                 },
//             ],
//         },
//         { type: "paragraph", attrs: { type: "base" } },
//         {
//             type: "paragraph",
//             attrs: { type: "base" },
//             content: [
//                 {
//                     type: "text",
//                     text: "It's being developed by [Tanishq Kancharla](https://moonrise.tk) (me!) and open-sourced on [Github](https://github.com/moonrise-tk/gem). Have a look at the README for more information.",
//                 },
//             ],
//         },
//         { type: "paragraph", attrs: { type: "base" } },
//         {
//             type: "paragraph",
//             attrs: { type: "base" },
//             content: [
//                 {
//                     type: "text",
//                     text: "Please reach out to me if you like Gem, or have any ideas for features!",
//                 },
//             ],
//         },
//         { type: "paragraph", attrs: { type: "base" } },
//         { type: "paragraph", attrs: { type: "base" } },
//     ],
// };
// export const initalContent =
//     window.location.pathname === "/about"
//         ? about
//         : {
//             type: "doc",
//             content: [
//                 {
//                     type: "paragraph",
//                     content: [
//                         {
//                             type: "text",
//                             text: welcomes[Math.floor(Math.random() * welcomes.length)],
//                         },
//                     ],
//                 },
//             ],
//         };
