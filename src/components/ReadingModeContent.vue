<!-- 右侧阅读页面 -->
<template>
    <div class="reading-content">
        <Toolbar @toImport="toImport"></Toolbar>
        <div class="content">
            <a-empty
                v-if="filesList.list.length === 0"
                style="margin-top: 100px;"
                description="暂无数据,左上角导入"
            />
            <div v-else v-for="item in filesList.list" :key="item.id">
                <a-dropdown trigger="contextMenu" alignPoint :style="{ display: 'block' }">
                    <div
                        :title="item.title"
                        @click="routerLink(item.id, item.type)"
                        class="book-cover"
                    >
                        <img v-if="item.type === 'txt'" :src="txtFile" />
                        <img v-else-if="item.type === 'pdf'" :src="pdfFile" />
                        <div class="title">{{ item.title }}</div>
                    </div>
                    <template #content>
                        <a-doption @click="deleteFile(item.id, item.title)">移除</a-doption>
                    </template>
                </a-dropdown>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import Toolbar from "./widget/Toolbar.vue";
import { db } from '../db/db';
import { useRouter } from 'vue-router';
import useCurrentInstance from '../utils/useCurrentInstance';
import txtFile from '../assets/svg_cover/txtFile.svg';
import pdfFile from '../assets/svg_cover/pdfFile.svg';

const { proxy } = useCurrentInstance();
const $modal = proxy.$modal;
const $message = proxy.$message;

const filesList: {
    list: Array<{
        id: number, creationTime: number, title: string, type: string
    }>
} = reactive({
    list: []
});
loadFileLiset();

const router = useRouter();
const routerLink = (id: number, type: string) => {
    let tempPath = '';
    if (type === 'txt') tempPath = '/reading';
    else if (type === 'pdf') tempPath = '/pdfreading';
    router.push({
        path: tempPath,
        query: {
            id: id
        }
    })
}
const toImport = () => {
    loadFileLiset();
}

const deleteFile = (id: number, title: string) => {
    $modal.warning({
        title: "删除导入的文件",
        content: `目标文件【${title}】将从软件中移除, 该过程不可逆`,
        simple: true,
        onOk: () => {
            db.ebooks.delete(id).then(() => {
                loadFileLiset();
                $message.success('删除成功!');
            })
        }
    })
}

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
    })
}

</script>

<style lang="scss" src="../style/readingcontent.scss" scoped></style>