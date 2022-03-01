<template>
    <div class="webviewBlock">
        <div class="block-head">
            <div class="search-input">
                <a-input-search
                    v-model="searchData"
                    @search="toSearch"
                    @press-enter="toSearch_enter"
                    size="small"
                    :style="{ width: '320px' }"
                    placeholder="从百度上搜索"
                >
                    <template #prefix>
                        <icon-user />
                    </template>
                </a-input-search>
            </div>
        </div>
    </div>
    <!-- <webview class="webview" src="https://wantwords.net/"></webview> -->
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import {
    IconUser
} from '@arco-design/web-vue/es/icon';

const searchData = ref('');
const toSearch = () => {
    console.log(searchData.value);
}
const toSearch_enter = () => {
    console.log(searchData.value);
}

</script>

<style lang="scss" scoped>
.webviewBlock {
    width: 100%;
    height: 100%;
    padding-top: 100px;
    .block-head {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #ccc;
        .search-input {
            height: 32px;
        }
    }
}
.webview {
    position: relative;
    width: 100%;
    height: 100%;
    // border: 1px solid red;
    border: none;
}
</style>