<!-- 测试用组件，无功能 -->
<template>
    <KeywordDetail
        v-if="showkeywordDetail"
        @getkeywordDetail="getkeywordDetail"
        ref="keywordDetail_ref"
    ></KeywordDetail>

    <button @click="showSpanDetail">模拟掠过</button>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import KeywordDetail from '../components/widget/KeywordDetail.vue'
const showkeywordDetail = ref(false);
const keywordDetail = ref();
const showSpanDetail = () => {
    showkeywordDetail.value = true;
}

const getkeywordDetail = (tarRef: HTMLElement) => {
    console.log(tarRef);
    console.log(keywordDetail.value);
    // keywordDetail.value = tarRef;
    // keywordDetail.value.getCurrentKeyword({
    //     iid: '12',
    //     itemDesc: '打发士大夫十分',
    //     itemImg: '',
    //     itemName: '二二',
    //     associated: [],
    //     itemNumber: [],
    //     itemString: [],
    //     otherName: []
    // });
}

</script>

<style scoped>
</style>