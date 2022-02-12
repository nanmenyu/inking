/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module '*.ts';
declare module '*.js';
declare module 'uuid';
declare module 'prosemirror-schema-basic';
declare module 'prosemirror-commands';
declare module 'prosemirror-history';
declare module 'prosemirror-keymap';
declare module 'prosemirror-model';
declare module 'prosemirror-state';
declare module 'prosemirror-view';

declare interface Window {
  $API: any
}

interface NodeDOC {
  type: 'doc',
  content: Array<NodePara>
}
interface NodePara {
  type: 'paragraph',
  content: Array<{
    type: "text",
    text: string
  }>
}

// 页面记数
interface Pagecount {
  paperHeight: string;
  wordCount: number;
  charCount: number;
  paragraphs: number;
}

// 作品
interface Userdb {
  id?: number;
  author: string;
  title: string;
  createTime: number;
  updateTime: number;
  categories: Array<string>;
  tag: Array<string>;
  desc: string;
  imgSrc: string;
  data: Array<Volume>;
  discard: string;
  discardTime?: number;
  historRecord: { vid: string, cid: string };
  theKeyWord: Array<KeyWordGroup>;
  checked?: boolean;
}

// 每卷
declare interface Volume {
  updateTime: number;
  vid: string;
  volumeName: string;
  discard?: boolean;
  volume: Array<Chapter>;
  discardTime?: number;
}
// 每章
declare interface Chapter {
  cid: string;
  updateTime: number;
  chapterName: string;
  chapterNum?: number;
  scrollTop?: number;
  discard?: boolean;
  chapter: Array<string>;
  discardTime?: number;
}

// 关键词组
declare interface KeyWordGroup {
  cardImg: string;
  kGroupDesc: string;
  kGroupName: string;
  kid: string;
  maxNamLen?: number;
  maxTempLen?: number;
  data: Array<KeyWord>;
  template: Array<Template>
}
// 关键词
declare interface KeyWord {
  iid: string;
  itemDesc: string;
  itemImg: string;
  itemName: string;
  associated: Array<Associated>;
  itemNumber: Array<{ key: string; unit: string; value: number }>;
  itemString: Array<{ key: string; value: string; }>;
  otherName: Array<string>;
}
// interface ItemNumber {
//   key: string;
//   unit: string;
//   value: number
// }
// interface ItemString {
//   key: string;
//   value: string;
// }
// 关联项
interface Associated {
  iid: string;
  key: string;
  kid: string;
  value: number;
}
// 关键词模板
interface Template {
  checked: boolean;
  numberKey: string;
  stringKey: string;
  title: string;
}