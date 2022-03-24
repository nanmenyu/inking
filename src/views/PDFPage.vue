<template>
    <TitleBlock></TitleBlock>
    <!-- <webview id="pdf-container" :src="pdfFile"></webview> -->
    <iframe id="pdf-container-temp" :src="pdfFile" frameborder="0"></iframe>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import TitleBlock from '../components/TitleBlock.vue';
import { db } from '../db/db';

console.log();
const route = useRoute(), query_id = parseInt(route.query.id as string);

const pdfFile = ref('');
loadFileData();

function loadFileData() {
    db.ebooks.get(query_id).then(value => {
        // 将PDF的File对象转换为URL再导入
        pdfFile.value = './lib/pdfjs.min/web/viewer.html?file=' + URL.createObjectURL(value?.data!);
    })
}
onMounted(() => {
    // const webview: any = document.querySelector('webview');
    // webview.addEventListener('dom-ready', () => {
    //     // webview.openDevTools(); // 新窗口打开webview内的调试工具
    // })
})
</script>

<style lang="scss" scoped>
#pdf-container {
    height: calc(100vh - 45px);
}
#pdf-container-temp {
    // width: 100vw;
    width: 100%;
    height: calc(100vh - 45px);
}
</style>