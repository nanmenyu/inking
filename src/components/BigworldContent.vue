<!-- 右侧大世界页面 -->
<template>
    <div class="bigworld-content">
        <Toolbar></Toolbar>
        <!-- <div id="rich-text-editor" ref="editor"></div>
        <div id="rich-text-content" ref="content"></div>-->
        <div id="test" ref="test"></div>
        <input v-model.trim="word" type="text" />
        <button @click="search">查词</button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Toolbar from "./widget/Toolbar.vue";

const word = ref(''), test = ref();
const search = () => {
    // 测试API代码
    const config = {
        type: 'wordSearch',
        url: 'https://hanyu.baidu.com/s',
        params: {
            wd: word.value
        }
    }
    window.$API.ipcSend('reptile', config);
    window.$API.ipcOnce('getReptileData', (data: any) => {
        console.log(data);
        let temp = '<div class="basicmean">' + data.basicmean + '</div>'
            + '<div class="detailmean">' + data.detailmean + '</div>'
            + '<div class="source">' + data.source + '</div>'
            + '<div class="liju">' + data.liju + '</div>'
            + '<div class="synonym">' + data.synonym + '</div>'
            + '<div class="antonym">' + data.antonym + '</div>';

        test.value.innerHTML = temp;
    })
}




// import richEditor from '../common/editor_rich/index';
// import '../style/pureeditor.scss';

// const editor = ref(), content = ref();
// onMounted(() => {
//     richEditor(editor.value, content.value);
// })
</script>

<style lang="scss" src="../style/bigworldcontent.scss" scoped></style>