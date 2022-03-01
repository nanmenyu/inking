<template>
    <div :class="`webviewBlock ${isShowWebview ? 'blockUpward' : ''}`">
        <div class="block-head">
            <div class="leftTool">
                <span @click="toHistory(-1)">
                    <icon-left />
                </span>
                <span @click="toHistory(1)">
                    <icon-right />
                </span>
                <span @click="toRefresh">
                    <icon-refresh :spin="needSpin" />
                </span>
            </div>
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
        <a-spin v-if="showLoading" class="loadingSpin" style="margin-top: 200px;" :size="20" dot />
        <div v-if="errorMsg.isErr" class="errorPage">
            <a-result status="error" :title="errorMsg.errorCode">
                <template #icon>
                    <IconFaceFrownFill />
                </template>
                <template #subtitle>{{ errorMsg.errorDescription }}</template>
                <template #extra>
                    <a-button type="primary" status="danger" shape="round">Refresh</a-button>
                </template>
            </a-result>
        </div>
        <webview
            v-if="isShowWebview"
            :style="showLoading ? 'opacity:0.5' : ''"
            class="webview"
            useragent="Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36"
            :src="webviewSrc"
        ></webview>
    </div>
</template>

<script setup lang='ts'>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import {
    IconLeft, IconRight, IconUser, IconFaceFrownFill, IconRefresh
} from '@arco-design/web-vue/es/icon';
const showLoading = ref(false), errorMsg = reactive({ isErr: false, errorCode: 0, errorDescription: '' });
const needSpin = ref(false); // 是否需要旋转刷新图标
const searchSite = { baidu: 'https://www.baidu.com/s?wd=', bing: 'https://cn.bing.com/search?q=', google: 'https://www.google.com/search?q=' };

// 使用搜索引擎搜索
const isShowWebview = ref(false), webviewSrc = ref('');
const searchData = ref('');
const toSearch = () => {
    console.log(searchData.value);
    toWebviewPage(searchSite.baidu + searchData.value);
}
const toSearch_enter = () => {
    console.log(searchData.value);
    toWebviewPage(searchSite.baidu + searchData.value);
}
// 历史跳转
let _webview: any;
const toHistory = (offset: 1 | -1) => {
    if (offset === -1) {
        _webview.goBack();
    } else if (offset === 1) {
        _webview.goForward();
    }
}
const toRefresh = () => {
    _webview.reload();
}

// 渲染webview
function toWebviewPage(src: string) {
    webviewSrc.value = src;
    isShowWebview.value = true;
    nextTick(() => {
        const webview = document.querySelector('webview');
        _webview = webview;
        if (webview) {
            webview.addEventListener('dom-ready', () => {
                // console.log(webview.getURL());
            })
            webview.addEventListener('did-start-loading', () => {
                needSpin.value = showLoading.value = true;
            })
            webview.addEventListener('did-stop-loading', () => {
                needSpin.value = showLoading.value = false;
            })
            webview.addEventListener('did-fail-load', (e: any) => {
                [errorMsg.isErr, errorMsg.errorCode, errorMsg.errorDescription] = [true, e.errorCode, e.errorDescription]
            })
        }
    })
}

onMounted(() => {

})
onBeforeUnmount(() => {

})
</script>

<style lang="scss" scoped>
.webviewBlock {
    position: relative;
    width: 100%;
    height: 100%;
    padding-top: 100px;
    .block-head {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 32px;
        border-bottom: 1px solid #ccc;
        .leftTool {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 32px;
            span {
                display: block;
                width: 20px;
                height: 20px;
                margin: 0 5px;
                border-radius: 50%;
                cursor: pointer;
            }
        }
        .search-input {
            height: 32px;
        }
    }
    .loadingSpin {
        position: absolute;
        top: 25%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .errorPage {
        margin-top: 100px;
    }
}
.blockUpward {
    animation: upward 0.3s ease-in-out forwards;
}
.webview {
    position: relative;
    width: 100%;
    height: 100%;
    // border: 1px solid red;
    border: none;
}

@keyframes upward {
    from {
        padding-top: 100px;
    }
    to {
        padding-top: 10px;
    }
}
</style>