<template>
    <TitleBlock></TitleBlock>
    <iframe @load="iframeLoaded" id="pdf-container" :src="pdfFile" frameborder="0"></iframe>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import TitleBlock from '../components/TitleBlock.vue';
import { db } from '../db/db';
import { useThemeStore } from '../store';

const themeStore = useThemeStore();
const route = useRoute(), query_id = parseInt(route.query.id as string);
const pdfFile = ref('');
loadFileData();

// iframe加载完毕后获取其DOM
const iframeLoaded = () => {
    const frameDOM = (<HTMLIFrameElement>document.getElementById('pdf-container')).contentWindow!;
    // 修改主题
    if (themeStore.theme === 'dark') {
        frameDOM.document.body.setAttribute('theme', 'dark');
    }
}

function loadFileData() {
    db.ebooks.get(query_id).then(value => {
        // 将PDF的File对象转换为URL再导入
        pdfFile.value = './lib/pdfjs.min/web/viewer.html?file=' + URL.createObjectURL(value?.data!);
    })
}
</script>

<style lang="scss" scoped>
#pdf-container {
    width: 100%;
    height: calc(100vh - 45px);
}
</style>