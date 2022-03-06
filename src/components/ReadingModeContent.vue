<!-- 右侧阅读页面 -->
<template>
    <div class="reading-content">
        <Toolbar></Toolbar>
        <div class="content">
            <a-empty
                v-if="filesList.list.length === 0"
                style="margin-top: 100px;"
                description="暂无数据,左上角导入"
            />
            <div
                v-else
                v-for="item in filesList.list"
                :key="item.id"
                :title="item.title"
                @click="routerLink(item.id)"
                class="book-cover"
            >
                <img :src="txtFile" />
                <div class="title">{{ item.title }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import Toolbar from "./widget/Toolbar.vue";
import { db } from '../db/db';
import { useRouter } from 'vue-router';
// import jschardet from 'jschardet/dist/jschardet.min.js';
import txtFile from '../assets/svg_cover/txtFile.svg';

const filesList: {
    list: Array<{
        id: number, creationTime: number, title: string, type: string
    }>
} = reactive({
    list: []
});
loadFileLiset();

const router = useRouter();
const routerLink = (id: number) => {
    router.push({
        path: '/reading',
        query: {
            id: id
        }
    })
}

// const choiceOneFile = (id: number) => {
//     db.ebooks.get(id).then(value => {
//         const reader = new FileReader();
//         reader.readAsText(value!.data, 'utf-8');
//         reader.readAsArrayBuffer(value!.data);
//         // reader.readAsDataURL(value!.data);
//         reader.onload = function () {
//             const ebookStr = reader.result;
//             // let str = '';
//             // const viewBuf = new Uint8Array(<ArrayBuffer>ebookStr);   //此时data为ArrayBuffer
//             // for (let i = 0; i < 10; i++) {
//             //     str += String.fromCharCode(viewBuf[i]);
//             // }
//             // console.log(jschardet.detect(str));

//         };
//     })
// }


function loadFileLiset() {
    db.ebooks.where(':id').between(1, Infinity).toArray().then(value => {
        filesList.list = value.map(item => {
            return {
                id: item.id!,
                creationTime: item.creationTime,
                title: item.title,
                type: item.type
            }
        });
        console.log(filesList.list);
    })
}

</script>

<style lang="scss" src="../style/readingcontent.scss" scoped></style>