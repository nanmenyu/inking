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
declare module 'vue-pdf';
declare module 'prosemirror-schema-basic';
declare module 'prosemirror-commands';
declare module 'prosemirror-history';
declare module 'prosemirror-keymap';
declare module 'prosemirror-model';
declare module 'prosemirror-state';
declare module 'prosemirror-view';
declare module 'prosemirror-schema-list';
declare module 'prosemirror-example-setup';
declare module 'pdfjs-dist/build/pdf.worker.entry';
declare module '@ckpack/vue-color';

// electron暴露的接口
declare interface Window {
  $API: any
}

// 文档类型
interface NodeDOC {
  type: 'doc',
  content: Array<NodePara>
}
// 段落类型
interface NodePara {
  type: 'paragraph',
  content: Array<{
    type: "text",
    text: string
  }>
}

// 页面记数
interface Pagecount {
  paperHeight: string; // 纸张高度
  wordCount: number; // 字数
  charCount: number; // 字符数
  paragraphs: number; // 段落数
}

interface User {
  id?: number;
  cTime: Date; // 时间戳
  // creationYear: number;
  // creationMonth: number;
  // creationDay: number;
  cWords: number; // 码字数
}

interface Ebooks {
  id?: number;
  data: File;
  type: string;
  title: string;
  creationTime: number;
  scrollTop?: number;
}

// 作品
interface Userdb {
  id?: number; // id
  author: string; // 作者
  title: string; // 作品名称
  createTime: number; // 创建时间
  updateTime: number; // 更新时间
  categories: Array<string>; // 分类
  tag: Array<string>; // 标签
  desc: string; // 简介
  imgSrc: string; // 封面
  data: Array<Volume>; // 内容数据
  discard: string; // 是否被置入回收站
  discardTime?: number; // 置入回收站的时间
  historRecord: { vid: string, cid: string }; // 历史浏览(编写)对应的章节
  theKeyWord: Array<KeyWordGroup>; // 关键字模块
  checked?: boolean;
  theTimeLine: Array<TimeLineGroup>; // 时间线模块
  thePlot: Array<PlotGroup>; // 备忘录模块
  theMaps: Array<Maps>; // 地图模块
  opusNumber: number; // 作品总字数
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
  kid: string; // id
  cardImg: string; // 关键词组描述图
  kGroupDesc: string; // 组描述
  kGroupName: string; // 组名
  maxNamLen?: number; // 用于默认关键字取名的递增后缀
  maxTempLen?: number; // 用于默认模板取名的递增后缀
  data: Array<KeyWord>; // 内容数据
  template: Array<Template> // 关键字模板数据
}
// 关键词
declare interface KeyWord {
  iid: string; // id
  itemDesc: string; // 关键字的描述
  itemImg: string;  // 关键字的头图
  itemName: string; // 关键字的主名
  associated: Array<Associated>; // 关联项
  itemNumber: Array<{ key: string; unit: string; value: number }>; // 数字项-键值-单位对
  itemString: Array<{ key: string; value: string; }>;// 字符项-键值对
  otherName: Array<string>; // 关键字的别名
}
// 关联项
interface Associated {
  iid: string; // 关联关键字的iid
  key: string; // 关联项的名称
  kid: string; // 关联关键字所属组的kid
  value: number; // 关联度
}
// 关键词模板
interface Template {
  checked: boolean; // 关键字模板是否被选择
  numberKey: string; // 数字项
  stringKey: string; // 字符项
  title: string; // 模板名
}
// 时间线组
declare interface TimeLineGroup {
  [key: string]: any;
  tid: string; // id
  name: string; // 时间线名称
  max: number; // 跨度最大值
  min: number; // 跨度最小值
  eveYear: Array<Eveyear>; // 对应某个年的数据
  eveMonth: Array<Evemonth>; // 对应某个年-月的数据
  eveDay: Array<Eveday>; // 对应某个年-月-日的数据
}
interface Eveyear {
  yid: string; // id
  timeSlot: number; // 年份
  data: { title: string, desc: string }; // 标题和描述
}
interface Evemonth {
  mid: string; // id
  yearSlot: number; // 年份
  timeSlot: number; // 月份
  data: { title: string, desc: string };// 标题和描述
}
interface Eveday {
  did: string; // id
  yearSlot: number; // 年份
  monthSlot: number; // 月份
  timeSlot: number; // 日份
  data: { title: string, desc: string };// 标题和描述
}
// 备忘录
declare interface PlotGroup {
  id: string; // id
  name: string; // 备忘录的名称
  summary: Array<Summary> // 该备忘录下对应的条目数据
}
declare interface Summary {
  sid: string; // id
  itemsName: string; // 备忘录下的一个组的组名
  items: Array<{ title: string, imp: number, complete: boolean, con: string }> // 组内的数据 标题-重要性-完成度-内容
}

declare interface Favorites {
  id?: number; // id
  title: string; // 收藏网址标题
  url: string; // 收藏网址url
  favicon: string; // 收藏网址图标url
}

declare interface Marker {
  match: RegExp; // 标记对应正则表达式
  class: string; // 标记所属的css-class
  style: string; // 标记拥有的css-style
}

// 地图模块
declare interface Maps {
  id: string; // id
  mapName: string; // 地图名称
  mapDesc: string; // 地图描述
  // mapImg: File | string | null; // 地图背景
  mapImg: string | null;
  posInfor: Array<PosInfor> // 地图坐标信息
}

declare interface PosInfor {
  id: string;// 数据id
  kid: string; // 放置关键字的kid
  iid: string; // 放置关键字的iid
  name: string; // 地点名
  desc: string; // 地点描述
  coordX: number; // 坐标x
  coordY: number; // 坐标y
  // keywords: Array<[string, string]>; // 关联的关键词[kid,iid]
}