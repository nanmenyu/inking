<template>
    <PopupMenu
        v-if="isCustQuickSearch"
        title="自定义快捷搜索"
        determine="添加"
        @toModify="modify"
        @toDetermine="addQuickSearch"
        :determineDisabled="quickSearchForm.title.length === 0 || quickSearchForm.url.length === 0 || urlDetection"
    >
        <a-form layout="vertical" :model="quickSearchForm">
            <a-form-item field="title" label="自定义快捷搜索名称">
                <a-input
                    v-model.trim="quickSearchForm.title"
                    :max-length="20"
                    show-word-limit
                    allow-clear
                    placeholder="请输入快捷搜索名称..."
                ></a-input>
            </a-form-item>
            <a-form-item field="url" label="链接请以https://或http://开头(搜索词会直接拼接在后面)">
                <a-input
                    v-model.trim="quickSearchForm.url"
                    :max-length="999"
                    :error="urlDetection"
                    show-word-limit
                    allow-clear
                    placeholder="请输入网站的搜索链接..."
                ></a-input>
            </a-form-item>
        </a-form>
    </PopupMenu>
    <div :class="`webviewBlock ${isShowWebview ? 'blockUpward' : ''}`">
        <div v-if="!isShowWebview && route.path !== '/reading'" class="block-statistics">
            <a-space size="mini">
                <a-statistic title="本次码字" :value="thisTimeCodeword" />
                <a-divider direction="vertical" />
                <a-statistic extra="今日码字" :value="toDayCodeword" />
                <a-divider direction="vertical" />
                <a-progress type="circle" title="今日计划完成度" :percent="0.4" />
            </a-space>
        </div>
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
                    @input="showPrefix"
                    @search="toSearch"
                    @press-enter="toSearch"
                    size="small"
                    :style="{ width: '300px' }"
                    :placeholder="`从${searchSiteName}上搜索`"
                >
                    <template #prefix>
                        <icon-public v-if="prefixType === 1" />
                        <icon-link v-if="prefixType === 2" />
                    </template>
                </a-input-search>
            </div>
            <div class="rightTool">
                <template v-if="isShowWebview">
                    <span
                        v-if="!collected"
                        @click="addToFavorites"
                        class="favorites-btn"
                        title="收藏该网页"
                    >
                        <icon-star :style="{ fontSize: '14px' }" />
                    </span>
                    <span
                        v-else
                        @click="deleteFavorite(currentSiteId, currentSiteTitle)"
                        class="favorites-btn"
                        title="取消收藏"
                    >
                        <icon-star-fill :style="{ fontSize: '14px' }" />
                    </span>
                </template>
                <a-dropdown @select="selectUA">
                    <span class="selectUA" title="选择UA">
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
        <div class="topChoice">
            <a-tabs
                @change="changeSearch"
                :default-active-key="defaultSiteKey"
                size="small"
                type="text"
            >
                <template #extra>
                    <a-button @click="custQuickSearch" type="text" shape="circle" title="自定义快捷搜索">
                        <icon-plus />
                    </a-button>
                </template>
                <a-tab-pane v-for="item in searchSiteList.data" :key="item.key" :title="item.title">
                    <div class="tab-content">
                        <span @click="moveQuickSearch(item.key, -1)" class="btn" title="左移">
                            <icon-caret-left />
                        </span>
                        <a-divider direction="vertical" />
                        <span style="user-select: text;">🔗&nbsp;{{ item.url }}</span>
                        <a-divider direction="vertical" />
                        <span
                            @click="deleteQuickSearch(item.title, item.key)"
                            class="btn"
                            title="删除"
                        >
                            <icon-delete />
                        </span>
                        <a-divider direction="vertical" />
                        <span @click="moveQuickSearch(item.key, 1)" class="btn" title="右移">
                            <icon-caret-right />
                        </span>
                    </div>
                </a-tab-pane>
            </a-tabs>
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
            <a-empty v-if="favoritesData.length === 0" style="margin-top: 100px;" />
            <div
                v-else
                v-for="item in favoritesData"
                @click="toLoadUrl(item.url)"
                :key="item.id"
                :title="item.title"
                class="tile"
            >
                <div @click.stop="deleteFavorite(item.id!, item.title)" class="delete-btn">
                    <icon-close :style="{ fontSize: '18px' }" :stroke-width="2" />
                </div>
                <div class="tile-icon">
                    <img
                        v-if="errorLoadImgId.indexOf(item.id!) === -1"
                        :src="item.favicon"
                        @error="imgLoadFailed(item.id!)"
                    />
                    <a-avatar v-else :style="{ backgroundColor: '#00d0b6' }">{{ item.title[0] }}</a-avatar>
                </div>
                <div class="tile-title">{{ item.title }}</div>
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
        <!-- :style="showLoading ? 'opacity:0.5' : ''" -->
    </div>
</template>

<script setup lang='ts'>
import { computed, nextTick, reactive, ref, Ref } from 'vue';
import {
    IconLeft, IconRight, IconRefresh, IconDown, IconHome, IconPlus, IconDelete,
    IconCaretLeft, IconCaretRight, IconStar, IconStarFill, IconPublic, IconLink,
    IconClose
} from '@arco-design/web-vue/es/icon';
import PopupMenu from './widget/PopupMenu.vue';
import useCurrentInstance from '../utils/useCurrentInstance';
import { useMainStore } from '../store/index';
import { db } from '../db/db';
import { useRoute } from 'vue-router';
import '../style/fine-tune-webview.scss';

const { proxy } = useCurrentInstance();
const route = useRoute();
const $modal = proxy.$modal;
const $message = proxy.$message;
const mainStore = useMainStore();
loadFavorites();
console.log(route.path);

const favoritesData: Ref<Array<Favorites>> = ref([]);
const currentURL = ref(''), currentSiteId = ref(0), currentSiteTitle = ref('');
const collected = computed(() => {
    let result = false;
    favoritesData.value.forEach(item => {
        if (item.url === currentURL.value) {
            currentSiteId.value = item.id!;
            currentSiteTitle.value = item.title;
            result = true;
        }
    })
    return result;
})
// 本次码字数量
const thisTimeCodeword = computed(() => {
    if (mainStore.TotalNumber_thisTime > mainStore.contrastTotalNumber_thisTime) {
        return mainStore.TotalNumber_thisTime - mainStore.contrastTotalNumber_thisTime;
    } else {
        mainStore.contrastTotalNumber_thisTime = mainStore.TotalNumber_thisTime;
        return 0;
    }
})
// 今日码字数量
const toDayCodeword = computed(() => {
    return mainStore.baseTotalNumber_today + mainStore.TotalNumber_thisTime - mainStore.contrastTotalNumber_thisTime;
})

const preloadFile = 'file://' + window.$API.__dirname + '/webview/preload.js';
// const errorMsg = reactive({ isErr: false, errorCode: 0, errorDescription: '' });
const needSpin = ref(false); // 是否需要旋转刷新图标
const searchSiteList = reactive({
    data: [{
        key: 1,
        title: '百度搜索',
        url: 'https://www.baidu.com/s?wd='
    }, {
        key: 2,
        title: '百度汉语',
        url: 'https://hanyu.baidu.com/s?wd='
    }, {
        key: 3,
        title: '必应搜索',
        url: 'https://cn.bing.com/search?q='
    }, {
        key: 4,
        title: '谷歌搜索',
        url: 'https://www.google.com/search?q='
    }, {
        key: 5,
        title: '维基百科(中)',
        url: 'https://zh.wikipedia.org/w/index.php?search='
    }, {
        key: 6,
        title: '维基百科(英)',
        url: 'https://en.wikipedia.org/w/index.php?search='
    }]
});
let defaultSiteKey = '1';

// 将搜索网站列表与默认的key缓存在local
const getSearchSiteList = localStorage.getItem('searchSiteList');
if (getSearchSiteList === null) localStorage.setItem('searchSiteList', JSON.stringify(searchSiteList.data));
else searchSiteList.data = JSON.parse(getSearchSiteList);

const getSearchSiteKey = localStorage.getItem('searchSiteKey');
if (getSearchSiteKey === null) localStorage.setItem('searchSiteKey', '1');
else defaultSiteKey = getSearchSiteKey;
// 修改搜索引擎项
const searchSite = ref('https://www.baidu.com/s?wd='), searchSiteName = ref('百度搜索');
setSiteList(defaultSiteKey);
const changeSearch = (key: string) => {
    setSiteList(key)
    toSearch();
    localStorage.setItem('searchSiteKey', key);
}
function setSiteList(key: string) {
    searchSiteList.data.forEach(item => {
        if (item.key === parseInt(key)) {
            searchSiteName.value = item.title;
            searchSite.value = item.url;
        }
    })
}

// 使用搜索引擎搜索
const isShowWebview = ref(false), webviewSrc = ref('');
const searchData = ref(''), prefixType = ref(1);
const showPrefix = () => {
    const reg = new RegExp('^https{0,1}://');
    if (reg.test(searchData.value)) {
        prefixType.value = 2;
    } else {
        prefixType.value = 1;
    }
}
const toSearch = () => {
    if (searchData.value !== '') {
        const reg = new RegExp('^https{0,1}://');
        let targetUrl = '';
        // 验证是否是网址
        if (reg.test(searchData.value)) targetUrl = searchData.value;
        else targetUrl = searchSite.value + searchData.value;
        // 加载页面
        if (_webview) _webview.loadURL(targetUrl);
        else toWebviewPage(targetUrl);
        isShowWebview.value = true;
    }
}

// 自定义快捷搜索项目
const isCustQuickSearch = ref(false);
const quickSearchForm = reactive({
    title: '',
    url: ''
})
// 匹配url的格式是否正确（http://或https://开头
const urlDetection = computed(() => {
    const reg = new RegExp('^https{0,1}://');
    return !reg.test(quickSearchForm.url);
})
// 添加自定义搜索链接
const custQuickSearch = () => {
    isCustQuickSearch.value = true;
}
const addQuickSearch = () => {
    let flag = true;
    // 查看是否重名
    searchSiteList.data.forEach(item => {
        if (item.title === quickSearchForm.title) flag = false;
    })
    if (flag) {
        searchSiteList.data.push({
            key: Math.max(...searchSiteList.data.map(item => item.key)) + 1,
            title: quickSearchForm.title,
            url: quickSearchForm.url
        });
        isCustQuickSearch.value = false;
        localStorage.setItem('searchSiteList', JSON.stringify(searchSiteList.data));
    } else {
        $message.warning('名称不能重复！');
    }

}
const deleteQuickSearch = (title: string, key: number) => {
    $modal.warning({
        title: "删除快捷搜索",
        content: `是否删除"${title}"? `,
        simple: true,
        onOk: () => {
            searchSiteList.data.forEach((item, index) => {
                if (item.key === key) searchSiteList.data.splice(index, 1);
            })
            localStorage.setItem('searchSiteList', JSON.stringify(searchSiteList.data));
        }
    })
}
const moveQuickSearch = (key: number, offset: 1 | -1) => {
    let index;
    searchSiteList.data.forEach((item, i) => {
        if (item.key === key) {
            if (offset === -1) {
                if (i === 0) $message.warning('已经到头了！');
                else index = i;
            } else if (offset === 1) {
                if (i === searchSiteList.data.length - 1) $message.warning('已经到头了！');
                else index = i;
            }
        }
    })
    if (index !== undefined) {
        elChangeExForArray(index, index + offset, searchSiteList.data);
        localStorage.setItem('searchSiteList', JSON.stringify(searchSiteList.data));
    };
    // 数组交换
    function elChangeExForArray(index1: number, index2: number, array: Array<any>) {
        let temp = array[index1];
        array[index1] = array[index2];
        array[index2] = temp;
    }
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
    if (_webview) {
        _webview.reload();
        isShowWebview.value = true;
    }
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
// 添加当前网页至收藏夹
const addToFavorites = () => {
    if (_webview) _webview.send('getFavicon');
}
// 打开收藏网页
const toLoadUrl = (url: string) => {
    if (_webview) _webview.loadURL(url);
    else toWebviewPage(url);
    isShowWebview.value = true;
}
// 删除目标收藏
const deleteFavorite = (id: number, title: string) => {
    $modal.warning({
        title: "删除快捷收藏",
        content: `是否删除"${title}"? `,
        simple: true,
        onOk: () => {
            db.favorites.delete(id).then(() => {
                loadFavorites();
            })
        }
    })
}
// 加载错误的图片所属数据id
let errorLoadImgId: Ref<Array<number>> = ref([]);
const imgLoadFailed = (id: number) => {
    errorLoadImgId.value.push(id);
}

const modify = () => {
    isCustQuickSearch.value = false;
}

// 需要注入的CSS和JS代码
const CSSToInject = `
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: rgba(229,230,235,0.6);
        border-radius: 5px;
    }
`;
const JSToInject = `
    if(window.isInjected === undefined){
        window.$API.ipcOn('getFavicon',()=>{
            window.$API.ipcSendToH('getFavicon_suc',document.querySelector('link[rel*="icon"]').href);
        })
        window.isInjected=true;
    }
`;

// 渲染webview
function toWebviewPage(src: string) {
    webviewSrc.value = src;
    nextTick(() => {
        const webview: any = document.querySelector('webview');
        _webview = webview;
        if (webview) {
            webview.setAttribute('preload', preloadFile); // 设置注入用preload
            webview.addEventListener('dom-ready', () => {
                _webview.insertCSS(CSSToInject);
                _webview.executeJavaScript(JSToInject);
                // _webview.openDevTools(); // 新窗口打开webview内的调试工具
                currentURL.value = _webview.getURL();
            })
            webview.addEventListener('did-start-loading', () => {
                needSpin.value = true;
            })
            webview.addEventListener('did-stop-loading', () => {
                needSpin.value = false;
                // webview.executeJavaScript(`console.log(document)`);
            })
            webview.addEventListener('did-fail-load', (e: any) => {
                // console.log(e);
                // [errorMsg.isErr, errorMsg.errorCode, errorMsg.errorDescription] = [true, e.errorCode, e.errorDescription]
            })
            // 新开窗口时原地打开链接
            webview.addEventListener('new-window', (e: any) => {
                webview.loadURL(e.url);
            })
            webview.addEventListener('ipc-message', (e: any) => {
                // 获得favicon的链接
                if (e.channel === 'getFavicon_suc') {
                    const favicon = e.args[0], title = webview.getTitle(), url = webview.getURL();
                    if (!collected.value) {
                        const reg = new RegExp('^https{0,1}://');
                        // 匹配favicon是否是http或https开头
                        if (reg.test(favicon)) {
                            db.favorites.add({
                                title, url, favicon
                            }).then(() => {
                                loadFavorites();
                            })
                        } else {
                            // 如果不是，则将其拼接在url后
                            const domain = url.split('/');
                            db.favorites.add({
                                title, url,
                                favicon: domain[0] + '//' + domain[2] + favicon
                            }).then(() => {
                                loadFavorites();
                            })
                        }

                    }
                }
            })

        }
    })
}
// 获取收藏夹的数据
function loadFavorites() {
    db.favorites.where(':id').between(1, Infinity).toArray().then(value => {
        // console.log(value);
        favoritesData.value = value;
    })

}
</script>

<style src="../style/webviewblock.scss" lang="scss" scoped>
</style>