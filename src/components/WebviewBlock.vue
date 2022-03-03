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
                    :style="{ width: '300px' }"
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
        <!-- <div v-if="errorMsg.isErr" class="errorPage">
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
        </div>-->
        <div v-show="!isShowWebview" class="favorites">
            <div
                v-for="item in [1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1,]"
                class="tile"
            >
                <div class="tile-icon">
                    <img />
                </div>
                <div class="tile-title">百度翻译百度翻译百度翻译百度翻译</div>
            </div>
        </div>
        <webview
            v-show="isShowWebview"
            class="webview"
            :src="webviewSrc"
            :useragent="defaultUA"
            disablewebsecurity
            nodeintegration
        ></webview>
        <!-- useragent="Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36" -->
        <!-- :style="showLoading ? 'opacity:0.5' : ''" -->
    </div>
</template>

<script setup lang='ts'>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import {
    IconLeft, IconRight, IconUser, IconRefresh, IconDown, IconHome
} from '@arco-design/web-vue/es/icon';

const preloadFile = 'file://' + window.$API.__dirname + '/webview/preload.js';
// const errorMsg = reactive({ isErr: false, errorCode: 0, errorDescription: '' });
const needSpin = ref(false); // 是否需要旋转刷新图标
const searchSite = {
    baidu: 'https://www.baidu.com/s?wd=',
    baidu_hanyu: 'https://hanyu.baidu.com/s?wd=',
    bing: 'https://cn.bing.com/search?q=',
    google: 'https://www.google.com/search?q=',
    wikipedia_zh: 'https://zh.wikipedia.org/w/index.php?search=',
    wikipedia_en: 'https://en.wikipedia.org/w/index.php?search=',
};

// 使用搜索引擎搜索
const isShowWebview = ref(false), webviewSrc = ref('');
const searchData = ref('');
const toSearch = () => {
    toWebviewPage(searchSite.baidu + searchData.value);
}
const toSearch_enter = () => {
    toWebviewPage(searchSite.baidu + searchData.value);
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
const goHome = () => { isShowWebview.value = false; }

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
        }
        defaultUA.value = phoneUA;
    } else if (currentUaType.value !== '电脑' && value === '电脑') {
        if (_webview) {
            _webview.setUserAgent(pcUA);
            toRefresh();
        }
        defaultUA.value = pcUA;
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
const JSToInject = `
    console.log('进入');
    document.oncontextmenu = function () {
    //点击右键后要执行的代码
    window.$API.ipcSendToH('oncontextmenu')
    } 
`;

// 渲染webview
function toWebviewPage(src: string) {
    webviewSrc.value = src;
    isShowWebview.value = true;
    nextTick(() => {
        const webview: any = document.querySelector('webview');
        // console.log(preloadFile);
        webview.setAttribute('preload', preloadFile); // 设置注入用preload
        _webview = webview;
        if (webview) {
            webview.addEventListener('dom-ready', () => {
                // 新窗体打开转换为当前页打开
                webview.insertCSS(CSSToInject);
                webview.executeJavaScript(JSToInject);
                webview.openDevTools(); // 新窗口打开webview内的调试工具
            })
            webview.addEventListener('did-start-loading', () => {
                needSpin.value = true;
            })
            webview.addEventListener('did-stop-loading', () => {
                needSpin.value = false;
                // webview.executeJavaScript(`console.log(document)`);
                webview.send('ping')
            })
            webview.addEventListener('did-fail-load', (e: any) => {
                console.log(e);
                // [errorMsg.isErr, errorMsg.errorCode, errorMsg.errorDescription] = [true, e.errorCode, e.errorDescription]
            })
            // 新开窗口时原地打开链接
            webview.addEventListener('new-window', (e: any) => {
                webview.loadURL(e.url);
            })
            webview.addEventListener('ipc-message', (e: any) => {
                console.log(e);
                if (e.channel === 'oncontextmenu') {
                    alert('子页面点击了右键')
                }
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
.favorites {
    width: 100%;
    max-height: calc(100vh - 132px - 91px);
    overflow-y: scroll;
    padding: 2px;
    .tile {
        box-sizing: border-box;
        float: left;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100px;
        height: 100px;
        border-radius: 4px;
        transition: background-color 0.3s ease-in-out;
        &:hover {
            background-color: #f2f3f5;
        }
        .tile-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 48px;
            height: 48px;
            border-radius: 50%;

            img {
                height: 24px;
                width: 24px;
            }
        }
        .tile-title {
            width: 80px;
            height: 35px;
            margin-top: 4px;
            font-weight: lighter;
            line-height: 18px;
            text-align: center;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2; /*显示的行数*/
            overflow: hidden;
        }
    }
}
.webview {
    position: relative;
    width: 100%;
    height: calc(100% - 42px);
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