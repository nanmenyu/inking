<!-- 右侧大世界页面 -->
<template>
    <div class="bigworld-content">
        <Toolbar></Toolbar>
        <div id="rich-text-editor" ref="editor"></div>
        <div id="rich-text-content" ref="content"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Toolbar from "./widget/Toolbar.vue";
import richEditor from '../common/editor_rich/index';
import '../style/pureeditor.scss';

const editor = ref(), content = ref();
onMounted(() => {
    richEditor(editor.value, content.value);
})
</script>

<style lang="scss" src="../style/bigworldcontent.scss" scoped></style>