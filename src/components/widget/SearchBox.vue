<template>
    <div class="search-box">
        <a-space direction="vertical" align="start" size="mini" style="padding:0 4px;">
            <a-space style="padding-bottom: 4px;border-bottom:1px solid #ccc;">
                <icon-search />
                <input
                    v-model="searchData"
                    ref="searchInput"
                    @input="toSearchKeyword"
                    type="text"
                    placeholder="查找"
                />
                <span
                    class="show-keywordCount"
                >{{ keyWordPos > 9999 ? '9999+' : keyWordPos }}/{{ totalKeyWord > 9999 ? '9999+' : totalKeyWord }}</span>
                <a-space size="mini">
                    <span
                        @click="mainStore.updateTargetIndex(-1), toSearchKeyword()"
                        class="mini-btn"
                        title="上一个"
                    >
                        <icon-arrow-up />
                    </span>
                    <span
                        @click="mainStore.updateTargetIndex(1), toSearchKeyword()"
                        class="mini-btn"
                        title="下一个"
                    >
                        <icon-arrow-down />
                    </span>
                    <span @click="stopSearchKeyword" class="mini-btn" title="关闭">
                        <icon-close />
                    </span>
                </a-space>
            </a-space>
            <a-space>
                <icon-undo style="transform: rotateZ(180deg);" />
                <input v-model="replaceData" type="text" placeholder="替换" />
                <span @click="replaceKeyword('single')" class="mini-btn" title="替换">
                    <svg
                        viewBox="0 0 1024 1024"
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        style="margin-bottom: -2px;"
                    >
                        <path p-id="3277" />
                    </svg>
                </span>
                <span @click="replaceKeyword('whole')" class="mini-btn" title="全部替换">
                    <svg
                        viewBox="0 0 1024 1024"
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        style="margin-bottom: -2px;"
                    >
                        <path p-id="9876" />
                    </svg>
                </span>
            </a-space>
        </a-space>
    </div>
</template>

<script setup lang='ts'>
import { Ref, ref, watch, computed, onMounted } from 'vue';
import { IconClose, IconUndo, IconSearch, IconArrowUp, IconArrowDown } from '@arco-design/web-vue/es/icon';
import { useRoute } from 'vue-router';
import { db } from '../../db/db'
import { useMainStore } from '../../store';

const emit = defineEmits(['close'])
const mainStore = useMainStore();
const query_id = parseInt(<string>useRoute().query.id);
const searchInput = ref();
const paperRef = ref(); // 纸张

// 关键词搜索、替换功能
const keywordMarks: Ref<Array<Marker>> = ref([]);
const searchData = ref(''), replaceData = ref(''),
    totalKeyWord = ref(0), keyWordPos = ref(0);

// 关键字统计
let isHighlightCount = computed(() => mainStore.isHighlightCount);
watch(isHighlightCount, () => {
    if (searchData.value !== '') {
        totalKeyWord.value = mainStore.highlightCount;
        if (totalKeyWord.value === 0) {
            keyWordPos.value = 0;
        } else {
            keyWordPos.value = mainStore.targetIndex;
        }
    } else {
        keyWordPos.value = totalKeyWord.value = 0;
    }
})
watch(searchData, () => {
    mainStore.targetIndex = 1;
})
const toSearchKeyword = () => {
    db.opus.get(query_id).then(value => {
        if (value) paperRef.value.setBooksData(value, [{ match: new RegExp(searchData.value, 'g'), class: 'keyword_search' }]);
        [...document.querySelectorAll('.keyword_search')].forEach(el => {
            if (el.id === 'search-anchor') {
                const viewportHeight = document.querySelector('.arco-layout-content')?.clientHeight!;
                // 锚点链接跳转到当前高亮关键字
                const distanceFromViewport = el.getBoundingClientRect().top - 75;
                if (distanceFromViewport > viewportHeight || distanceFromViewport < 0) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        })
    })
}
// 替换关键字
const replaceKeyword = (type: 'single' | 'whole') => {
    if (type === 'single') {
        [...document.querySelectorAll('.keyword_search')].forEach(el => {
            if (el.id === 'search-anchor' && replaceData.value !== '') {
                (<HTMLElement>el).innerText = replaceData.value;
                paperRef.value.saveDocData('');
            }
        })
    } else if (type === 'whole') {
        [...document.querySelectorAll('.keyword_search')].forEach(el => {
            (<HTMLElement>el).innerText = replaceData.value;
            paperRef.value.saveDocData('');
        })
    }
}
const stopSearchKeyword = () => {
    mainStore.isInSearch = false;
    emit('close');
}

const setData = (maker: Array<Marker>, paper: HTMLElement) => {
    keywordMarks.value = maker;
    paperRef.value = paper;
}

// 如果searchData有残留的值就直接搜索
if (searchData.value !== '') toSearchKeyword();

onMounted(() => {
    // 处于搜索状态
    mainStore.isInSearch = true;
    // 打开就获得焦点
    searchInput.value.focus();
})

defineExpose({ toSearchKeyword, setData });
</script>

<style lang="scss" scoped>
.search-box {
    position: fixed;
    top: 90px;
    left: 50%;
    z-index: 9;
    // width: 320px;
    padding: 6px 0 6px 2px;
    transform: translateX(-50%);
    background-color: var(--color-bg-popup);
    border: 1px solid var(--color-fill-3);
    border-radius: 4px;
    box-shadow: 0 4px 10px #0000001a;
    user-select: none;

    input {
        outline: none;
        border: none;
        color: var(--color-text-1);
        background-color: var(--color-bg-popup);
        border-right: 1px solid var(--color-fill-3);
    }

    .show-keywordCount {
        display: block;
        max-width: 100px;
        overflow: hidden;
    }

    .mini-btn {
        padding: 0 1px;
        text-align: center;
        border-radius: 50%;
        cursor: pointer;

        &:hover {
            color: rgb(var(--my-bg-color));
            background-color: #ccc;

            path[p-id="3277"],
            path[p-id="9876"] {
                fill: rgb(var(--my-bg-color));
            }
        }

        &:active {
            color: #ccc;

            path[p-id="3277"],
            path[p-id="9876"] {
                fill: #ccc;
            }
        }
    }

    path[p-id="3277"] {
        d: path(
            "M785.4592 212.1728c54.1696 54.1696 94.8224 117.4016 112.896 189.6448 63.1808 225.7408-76.8 451.4816-302.4896 514.6624-27.136 4.5568-49.664-9.0112-58.7264-31.5904-4.5056-9.0112-4.5056-36.096-4.5056-45.1584v-234.752c0-27.136 22.5792-45.1584 49.664-45.1584 27.136 0 49.664 22.528 49.664 45.1584v203.1616c144.4864-67.7376 221.2352-225.792 180.5824-379.2384-13.5168-58.7264-45.1072-108.3904-90.2656-148.992a49.1008 49.1008 0 0 1 0-67.7376 43.6224 43.6224 0 0 1 63.1808 0z m-302.4896-76.8c4.5056 13.568 4.5056 40.6528 4.5056 45.2096v234.752c0 27.136-22.528 45.1584-49.664 45.1584-27.0848 0-49.664-22.5792-49.664-45.1584V212.1728C243.712 279.9104 166.9632 437.9136 207.5648 591.36c13.568 58.7264 45.1584 108.3904 90.3168 148.992a49.1008 49.1008 0 0 1 0 67.7376 49.1008 49.1008 0 0 1-67.7376 0c-54.1696-54.1696-94.8224-117.4016-112.896-189.6448-58.6752-225.7408 76.8-451.4816 307.0464-514.6624 22.528-4.5568 49.664 13.5168 58.6752 31.5904z"
        );
        fill: var(--color-text-1);
    }

    path[p-id="9876"] {
        d: path(
            "M251.2 142.4h620.8c59.2 0 99.2 27.2 121.6 72 11.2 24 16 49.6 16 67.2l-1.6 9.6-102.4 360c-4.8 19.2-24 28.8-43.2 24-19.2-4.8-28.8-24-24-43.2L940.8 272l-1.6 9.6c0-8-1.6-22.4-8-35.2-9.6-20.8-27.2-32-57.6-32H246.4l49.6 49.6c14.4 14.4 14.4 36.8 0 49.6-14.4 14.4-36.8 14.4-49.6 0l-107.2-107.2c-14.4-14.4-14.4-36.8 0-49.6L246.4 48c14.4-14.4 36.8-14.4 49.6 0 14.4 14.4 14.4 36.8 0 49.6l-44.8 44.8z m-62.4 60.8c0 1.6 1.6 1.6 0 0v0zM784 881.6H163.2c-59.2 0-99.2-27.2-121.6-72-11.2-24-16-49.6-16-67.2l1.6-9.6 102.4-360c4.8-19.2 24-28.8 43.2-24 19.2 4.8 28.8 24 24 43.2L96 752l1.6-9.6c0 8 1.6 22.4 8 35.2 9.6 20.8 27.2 32 57.6 32h627.2l-49.6-49.6c-14.4-14.4-14.4-36.8 0-49.6 14.4-14.4 36.8-14.4 49.6 0l107.2 107.2c14.4 14.4 14.4 36.8 0 49.6L788.8 976c-14.4 14.4-36.8 14.4-49.6 0-14.4-14.4-14.4-36.8 0-49.6l44.8-44.8z m64-60.8c0-1.6-1.6-1.6 0 0v-1.6 1.6z m-100.8-376c19.2 0 35.2-16 35.2-35.2 0-19.2-16-35.2-35.2-35.2H390.4c-19.2 0-35.2 16-35.2 35.2 0 19.2 16 35.2 35.2 35.2h356.8z m-102.4 204.8c19.2 0 35.2-16 35.2-35.2 0-19.2-16-35.2-35.2-35.2H289.6c-19.2 0-35.2 16-35.2 35.2 0 19.2 16 35.2 35.2 35.2h355.2z"
        );
        fill: var(--color-text-1);
    }
}
</style>