<!-- 关键词掠过显示小卡片 -->
<template>
    <div @click.stop ref="keywordDetail" class="keyword-detail">
        <div class="keyword-head">
            <div class="head-left">
                <img :src="currentKeyword.data.itemImg" />
            </div>
            <div class="head-middle">
                <ul>
                    <li>🔸{{ currentKeyword.data.itemName }}</li>
                    <li v-for="item in currentKeyword.data.otherName.slice(0, 2)">🔸{{ item }}</li>
                </ul>
            </div>
            <div class="head-right">
                <a-space size="mini" direction="vertical">
                    <a-popover
                        style="max-width: 300px;"
                        trigger="click"
                        position="rt"
                        :title="currentKeyword.data.itemName + '/' + currentKeyword.data.otherName.join('/')"
                    >
                        <span title="查看更多">
                            <icon-apps />
                        </span>
                        <template #content>
                            <div class="popover-content">
                                <span>{{ currentKeyword.data.itemDesc }}</span>
                            </div>
                        </template>
                    </a-popover>
                    <span @click="nextPage(1)" title="下一页">
                        <icon-caret-right />
                    </span>
                    <span @click="nextPage(-1)" title="上一页">
                        <icon-caret-left />
                    </span>
                </a-space>
            </div>
        </div>
        <div class="keyword-middle">
            <a-space v-if="currentPage === 1" wrap size="mini">
                <a-tag
                    v-for="item in currentKeyword.data.itemString"
                    style="max-width: 200px;border-radius: 5px;"
                    color="arcoblue"
                >{{ item.key }}🔸{{ item.value }}</a-tag>
            </a-space>
            <a-space v-if="currentPage === 2" wrap size="mini">
                <a-tag
                    v-for="item in currentKeyword.data.itemNumber"
                    style="max-width: 200px;border-radius: 5px;"
                    color="green"
                >{{ item.key }}🔸{{ item.value + item.unit }}</a-tag>
            </a-space>
            <ul v-if="currentPage === 3" class="middle-associated">
                <li
                    v-for="item in currentKeyword.data.associated.sort((a, b) => b.value - a.value)"
                >
                    <a-tag
                        style="max-width: 100px;border-radius: 5px;"
                        color="magenta"
                    >{{ item.key }}</a-tag>
                    <span class="degree">{{ getAssociatedmark(item.value) }}</span>
                </li>
            </ul>
        </div>
        <div @click="displayKeyPanel" class="panel-btn" title="唤出关键字面板">🛩️</div>
    </div>
</template>

<script setup lang='ts'>
import { Ref, ref, reactive, onMounted } from 'vue';
import {
    IconCaretRight, IconCaretLeft, IconApps
} from '@arco-design/web-vue/es/icon';

const emit = defineEmits(['getkeywordDetail', 'displayKeyPanel']);

// 掠过关键字所在的span
const keywordDetail = ref();
const currentKeyword: { data: KeyWord } = reactive({
    data: {
        iid: '',
        itemDesc: '',
        itemImg: '',
        itemName: '',
        associated: [],
        itemNumber: [],
        itemString: [],
        otherName: []
    }
}); // 当前的关键字数据

const getCurrentKeyword = (data: KeyWord) => {
    console.log('getCurrentKeyword');
    currentKeyword.data = data;
}

// 点击右侧快捷键进行关键字翻页
const currentPage: Ref<number> = ref(1);// 1 2 3
const nextPage = (offset: 1 | -1) => {
    if (offset == 1) {
        currentPage.value = currentPage.value === 3 ? 1 : currentPage.value + 1;
    } else if (offset == -1) {
        currentPage.value = currentPage.value === 1 ? 3 : currentPage.value - 1;
    }
}

// 获得关联值标记
const getAssociatedmark = (value: number) => {
    let mark = '🔥';
    for (let i = 1; i < value; i++) {
        mark += '🔥';
    }
    return mark;
}

// 小飞机快速转到关键字面板
const displayKeyPanel = () => {
    emit('displayKeyPanel');
}

onMounted(() => {
    // 暴露dom
    emit('getkeywordDetail', keywordDetail.value);
})

defineExpose({ getCurrentKeyword })
</script>

<style lang="scss" scoped>
.keyword-detail {
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    width: 200px;
    padding: 10px;
    background-color: var(--color-bg-popup);
    border-radius: 6px;
    box-shadow: 0 2px 8px #00000026;

    &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        width: 8px;
        height: 8px;
        background-color: var(--color-bg-popup);
        border-top: none;
        border-right: none;
        transform: translate(-50%, -50%) rotate(45deg);
    }

    .keyword-head {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 100%;
        height: 60px;
        padding-bottom: 4px;
        border-bottom: 1px solid rgb(var(--my-bg2-color));

        .head-left {
            width: 60px;
            height: 100%;
            user-select: none;

            img {
                width: 100%;
                height: 100%;
                border-radius: 8px;
                box-shadow: 0 4px 10px #0000001a;
            }
        }

        .head-middle {
            width: 120px;
            height: 100%;
            border-right: 1px solid rgb(var(--my-bg2-color));

            ul {
                margin: 0;
                padding: 0;
                text-align: left;

                li {
                    list-style-type: none;
                    margin: 2px 0;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }

        .head-right {
            width: 20px;
            height: 100%;

            span {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                transition: color 0.2s;
                cursor: pointer;

                &:hover {
                    color: rgb(var(--primary-6));
                }

                &:active {
                    color: #ccc;
                }
            }
        }
    }

    .keyword-middle {
        width: 100%;
        // height: 100px;
        margin: 5px 0;

        .middle-associated {
            width: 100%;
            margin: 0;
            padding: 0;
            text-align: left;

            li {
                width: 100%;
                list-style-type: none;
                margin: 4px 0;

                .degree {
                    float: right;
                    display: block;
                    width: 100px;
                    height: 24px;
                    line-height: 24px;
                }
            }
        }
    }
    .panel-btn {
        position: absolute;
        right: 2px;
        bottom: 2px;
        width: 20px;
        height: 20px;
        border-radius: 6px 0 6px 0;
        transition: background-color 0.3s;
        cursor: pointer;
        user-select: none;

        &:hover {
            background-color: rgb(var(--my-bg2-color));
        }

        &:active {
            background-color: rgb(var(--my-bg-color));
        }
    }
}
</style>