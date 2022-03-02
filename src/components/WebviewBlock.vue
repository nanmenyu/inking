<template>
    <div :class="`webviewBlock ${isShowWebview ? 'blockUpward' : 'blockDown'}`">
        <div class="block-head">
            <div class="leftTool">
                <span @click="toHistory(-1)" title="后退">
                    <icon-left />
                </span>
                <span @click="toHistory(1)" title="前进">
                    <icon-right />
                </span>
                <span @click="goHome" title="首页">
                    <icon-home />
                </span>
                <span @click="toRefresh" title="刷新">
                    <icon-refresh :spin="needSpin && isShowWebview" />
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
            <div class="rightTool">
                <a-dropdown @select="selectUA">
                    <span title="选择UA">
                        {{ currentUaType }}
                        <icon-down />
                    </span>
                    <template #content>
                        <a-doption>电脑</a-doption>
                        <a-doption>手机</a-doption>
                    </template>
                </a-dropdown>
            </div>
        </div>
        <!-- <a-spin v-if="showLoading" class="loadingSpin" style="margin-top: 200px;" :size="20" dot /> -->
        <div v-if="errorMsg.isErr" class="errorPage">
            <a-result status="error" :title="errorMsg.errorCode">
                <template #icon>
                    <IconFaceFrownFill />
                </template>
                <template #subtitle>{{ errorMsg.errorDescription }}</template>
                <template #extra>
                    <a-button
                        @click="toRefresh"
                        type="primary"
                        status="danger"
                        shape="round"
                    >Refresh</a-button>
                </template>
            </a-result>
        </div>
        <webview v-show="isShowWebview" class="webview" :src="webviewSrc" :useragent="defaultUA"></webview>
        <!-- useragent="Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36" -->
        <!-- :style="showLoading ? 'opacity:0.5' : ''" -->
    </div>
</template>

<script setup lang='ts'>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import {
    IconLeft, IconRight, IconUser, IconFaceFrownFill, IconRefresh, IconDown,
    IconHome
} from '@arco-design/web-vue/es/icon';
const errorMsg = reactive({ isErr: false, errorCode: 0, errorDescription: '' });
const needSpin = ref(false); // 是否需要旋转刷新图标
const searchSite = {
    baidu: 'https://www.baidu.com/s?wd=',
    bing: 'https://cn.bing.com/search?q=',
    google: 'https://www.google.com/search?q=',
    wikipedia_zh: 'https://zh.wikipedia.org/w/index.php?search=',
    wikipedia_en: 'https://en.wikipedia.org/w/index.php?search='
};

// 使用搜索引擎搜索
const isShowWebview = ref(false), webviewSrc = ref('');
const searchData = ref('');
const toSearch = () => {
    toWebviewPage(searchSite.wikipedia_en + searchData.value);
}
const toSearch_enter = () => {
    toWebviewPage(searchSite.wikipedia_en + searchData.value);
}
// 历史跳转
let _webview: any;
const toHistory = (offset: 1 | -1) => {
    // webview显示了才跳转，没显示就直接显示
    if (isShowWebview.value) {
        if (offset === -1) {
            _webview.goBack();
        } else if (offset === 1) {
            _webview.goForward();
        }
    } else {
        isShowWebview.value = true;
    }
}
const toRefresh = () => {
    // 只有非加载时才能reload页面
    // if (!showLoading.value)
    _webview.reload();
}
const goHome = () => {

    isShowWebview.value = false;
}

// watch(showLoading, value => {
//     // 加载时不允许出现错误信息
//     if (value) errorMsg.isErr = false;
// })

// 选择目前的UA类型
const pcUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36';
const phoneUA = 'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36';
const currentUaType = ref('手机'),
    defaultUA = ref(phoneUA);
const selectUA = (value: string) => {
    if (currentUaType.value !== '手机' && value === '手机') {
        if (_webview) {
            _webview.setUserAgent(phoneUA);
            toRefresh();
        } else {
            defaultUA.value = phoneUA;
        }
    } else if (currentUaType.value !== '电脑' && value === '电脑') {
        if (_webview) {
            _webview.setUserAgent(pcUA);
            toRefresh();
        } else {
            defaultUA.value = pcUA;
        }
    }
    currentUaType.value = value;
}

// 需要注入的CSS代码
const CSSToInject = `
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #e5e6eb;
        border-radius: 5px;
    }
`;

// 渲染webview
function toWebviewPage(src: string) {
    webviewSrc.value = src;
    isShowWebview.value = true;
    nextTick(() => {
        const webview: any = document.querySelector('webview');
        _webview = webview;
        if (webview) {
            webview.addEventListener('dom-ready', () => {
                // 新窗体打开转换为当前页打开
                // console.dir(webview);
                // console.log(webview.getWebContentsId());
                webview.insertCSS(CSSToInject);
            })
            webview.addEventListener('did-start-loading', () => {
                needSpin.value = true;
            })
            webview.addEventListener('did-stop-loading', () => {
                needSpin.value = false;
                // webview.executeJavaScript(`console.log(document)`);
            })
            webview.addEventListener('did-fail-load', (e: any) => {
                console.log(e);
                [errorMsg.isErr, errorMsg.errorCode, errorMsg.errorDescription] = [true, e.errorCode, e.errorDescription]
            })
            webview.addEventListener('console-message', () => {
                // console.dir(e.message)
            })
            // 新开窗口时原地打开链接
            webview.addEventListener('new-window', (e: any) => {
                webview.loadURL(e.url);
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
                &:hover {
                    color: #165dff;
                }
            }
        }
        .search-input {
            height: 32px;
        }
        .rightTool {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 32px;
            font-size: 12px;
            user-select: none;
            span {
                margin: 0 5px;
                cursor: pointer;
                &:hover {
                    color: #165dff;
                }
            }
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
        span {
            margin: 0 4px;
        }
    }
}
.blockUpward {
    animation: upward 0.3s ease-in-out forwards;
}
.blockDown {
    animation: -upward 0.3s ease-in-out forwards;
}
.webview {
    position: relative;
    width: 100%;
    height: 100%;
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
@keyframes -upward {
    from {
        padding-top: 10px;
    }
    to {
        padding-top: 100px;
    }
}
</style>