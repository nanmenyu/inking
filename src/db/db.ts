// db.ts
import Dexie, { Table } from 'dexie';

export interface Userdb {
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
    theTimeLine: Array<TimeLineGroup>,
    thePlot: Array<PlotGroup>,
    theMaps: Array<Maps>,
    opusNumber: number
}

export interface User {
    id?: number;
    creationTime: number;
    creationYear: number;
    creationMonth: number;
    creationDay: number;
    codewords: number;
}

export interface Favorites {
    id?: number;
    title: string;
    url: string;
    favicon: string;
}

export interface Ebooks {
    id?: number;
    data: File;
    type: string;
    title: string;
    creationTime: number;
    scrollTop?: number;
}

export class MySubClassedDexie extends Dexie {
    opus!: Table<Userdb>; // 用户作品
    user!: Table<User>; // 用户每日数据
    favorites!: Table<Favorites>; // 用户收藏夹
    ebooks!: Table<Ebooks>; // 用户电子书
    // note!: Table<Userdb>;
    // markdown!: Table<Userdb>;

    constructor() {
        super('uDatabase');
        this.version(3.2).stores({
            // 作品集
            opus: '++id, author, title, discard',
            user: '++id',
            favorites: '++id',
            ebooks: '++id'
            // 笔记集
            // note: '++id, author, title',
            // markdown
            // markdown: '++id, author, title'
        });
    }

}

export const db = new MySubClassedDexie();