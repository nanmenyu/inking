<template>
    <!-- 新建功能弹窗 -->
    <div v-if="addnew" id="addnew-box">
        <div class="box">
            <div class="box-header">
                <div class="header-title">新建选项</div>
                <div class="header-close" @click="addto">
                    <icon-close />
                </div>
            </div>
            <div class="box-body">
                <a-space size="large">
                    <a-space direction="vertical">
                        <a-typography-title :heading="6" type="primary">请选择根目录</a-typography-title>
                        <a-typography-paragraph>{{ explain }}</a-typography-paragraph>
                    </a-space>
                    <a-space direction="vertical">
                        <a-select v-model="optionValue">
                            <a-option>作品集</a-option>
                            <a-option>笔记本</a-option>
                            <a-option>Markdown</a-option>
                        </a-select>
                        <a-input
                            v-model="fileName"
                            placeholder="请填写文档名称..."
                            :max-length="25"
                            show-word-limit
                        />
                    </a-space>
                </a-space>
            </div>
            <div class="box-footer">
                <a-space size="large">
                    <a-button @click="addto">取消</a-button>
                    <a-button type="primary" @click="addFile" :disabled="fileName.length === 0">确定</a-button>
                </a-space>
            </div>
        </div>
    </div>
    <!-- 工具栏 -->
    <div class="toolbar">
        <div class="bar-left">
            <a-button
                :loading="iCloud"
                @click="handleSync"
                type="primary"
                style="margin-right: 2px;"
            >云同步</a-button>
            <a-dropdown>
                <a-button
                    type="primary"
                    style="padding: 5px;transform: translateY(1px);"
                    title="导入 | 新建"
                >
                    <icon-plus :style="{ fontSize: '18px' }" />
                </a-button>
                <template #content>
                    <a-doption @click="addto">
                        <template #icon>
                            <icon-plus />
                        </template>
                        <template #default>&nbsp;新 建</template>
                    </a-doption>
                    <a-doption>
                        <template #icon>
                            <icon-import />
                        </template>
                        <template #default>&nbsp;导 入</template>
                    </a-doption>
                </template>
            </a-dropdown>
        </div>
        <div class="bar-midd">
            <a-tooltip
                :content="isReverse ? '取消反转' : '反转顺序'"
                position="top"
                background-color="#3491fa"
                mini
            >
                <a-button
                    @click="reOrder"
                    :type="isReverse ? 'secondary' : 'text'"
                    :disabled="disableSort"
                >
                    <svg
                        t="1642600478490"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="2748"
                        width="14"
                        height="14"
                    >
                        <path
                            d="M158.5047493 423.62618732l353.4952507-353.49525069 353.4952507 353.49525069z m0 176.74762536l353.4952507 353.49525069 353.4952507-353.49525069z"
                            p-id="2749"
                            :fill="disableSort ? '#94bfff' : '#165dff'"
                        />
                    </svg>
                </a-button>
            </a-tooltip>
            <a-dropdown trigger="hover">
                <a-button type="text" :disabled="disableSort">
                    <icon-swap />
                </a-button>
                <template #content>
                    <a-doption
                        @click="toSort('1')"
                        :style="sortType === '1' ? 'background-color: #3491fa;color: #fff;' : ''"
                    >按创建时间排序</a-doption>
                    <a-doption
                        @click="toSort('2')"
                        :style="sortType === '2' ? 'background-color: #3491fa;color: #fff;' : ''"
                    >按编辑时间排序</a-doption>
                    <a-doption
                        @click="toSort('3')"
                        :style="sortType === '3' ? 'background-color: #3491fa;color: #fff;' : ''"
                    >按名称排序</a-doption>
                </template>
            </a-dropdown>
            <a-tooltip
                v-if="!showAllDelete"
                content="切换显示"
                position="top"
                background-color="#3491fa"
                mini
            >
                <a-button
                    v-if="displyBlock"
                    :disabled="disableSwitch"
                    @click="swDisplay"
                    type="text"
                >
                    <icon-apps />
                </a-button>
                <a-button v-else :disabled="disableSwitch" @click="swDisplay" type="text">
                    <icon-unordered-list />
                </a-button>
            </a-tooltip>
            <a-tooltip v-else content="全部清空" position="top" background-color="#3491fa" mini>
                <a-button @click="deleteAll" type="text">
                    <icon-delete />
                </a-button>
            </a-tooltip>
        </div>
        <div class="bar-right">
            <a-input-search
                :style="{ width: '320px' }"
                placeholder="Search for something"
                search-button
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    IconClose,
    IconPlus,
    IconImport,
    IconSwap,
    IconApps,
    IconUnorderedList,
    IconDelete
} from '@arco-design/web-vue/es/icon';
import { useRoute } from 'vue-router';
import { db } from '../../db/db';
import useCurrentInstance from '../../utils/useCurrentInstance';
import { v4 } from 'uuid';

const { proxy } = useCurrentInstance();
const $message = proxy.$message;
const emit = defineEmits(['onBack', 'refresh', 'toDeleteAll', 'toReverse', 'toSort']);

/*----点击触发云同步动画----*/
const iCloud = ref(false);
const handleSync = () => {
    iCloud.value = !iCloud.value;
}

/*.----根据路由选择是否禁用按键----*/
const route = useRoute();
//显示全部删除键（回收站页面用）
const showAllDelete = ref(false), disableSwitch = ref(false), disableSort = ref(false);
if (route.path === '/') {
    disableSwitch.value = false;
    disableSort.value = false;
} else {
    disableSwitch.value = true;
    disableSort.value = true;
    if (route.path === '/recycle') {
        showAllDelete.value = true;
    } else {
        showAllDelete.value = false;
    }
}

// 是否以作品封面的方式显示
const displyBlock = ref(true);
const getDisplyBlock = localStorage.getItem('displyBlock');
if (getDisplyBlock === null) {
    localStorage.setItem('displyBlock', 'true');
} else {
    displyBlock.value = getDisplyBlock === 'true' ? true : false;
}

//切换显示样式(封面/列表)
const swDisplay = () => {
    displyBlock.value = !displyBlock.value;
    console.log(displyBlock.value);
    // 将该值通过'onBack'事件传予父组件
    emit('onBack', displyBlock.value);
    localStorage.setItem('displyBlock', displyBlock.value.toString());
}

/*----新建|导入功能----*/
const addnew = ref(false),
    optionValue = ref('作品集'),
    optionExplain = ref(['小说等【纯文本】会归类于此目录', '笔记等【富文本】会归类于此目录', 'Markdown文档会归类于此目录']),
    fileName = ref('');
const addto = () => {
    addnew.value = !addnew.value;
}
const explain = computed(() => {
    let temp = '';
    switch (optionValue.value) {
        case '作品集':
            temp = optionExplain.value[0];
            break;
        case '笔记本':
            temp = optionExplain.value[1];
            break;
        case 'Markdown':
            temp = optionExplain.value[2];
            break;
    }
    return temp;
});

/*----添加作品的item到数据库----*/
const addFile = () => {
    // 选择数据仓库
    switch (optionValue.value) {
        // 向指定数据库追加条目
        case '作品集':
            db.opus.add({
                author: '用户1234',
                title: fileName.value,
                createTime: new Date().getTime(),
                updateTime: new Date().getTime(),
                categories: [],
                tag: [],
                desc: '',
                imgSrc: '/static/img/default-cover.jpg',
                data: [{
                    vid: v4(),
                    volumeName: '默认卷',
                    updateTime: new Date().getTime(),
                    volume: [{
                        cid: v4(),
                        chapterName: '未命名章',
                        chapterNum: 0,
                        scrollTop: 0,
                        updateTime: new Date().getTime(),
                        chapter: ['HELLO 用户1234']
                    }]
                }],
                discard: 'f', //因为boolean无法索引  f即false t即true
                historRecord: { vid: '', cid: '' },
                theKeyWord: [] // 关键词模块
            }).then(() => {
                emit('refresh');
            });
            addto();
            $message.success('创建成功');
            break;
        case '笔记本':
            // db.note
            break;
        case 'Markdown':
            //  db.markdown;
            break;
    }
}

// 点击全部删除
const deleteAll = () => {
    emit('toDeleteAll');
}

// 顺序反转
const isReverse = ref(false),
    getIsReverse = localStorage.getItem('isReverse');
if (getIsReverse === null) {
    localStorage.setItem('isReverse', 'false');
} else {
    isReverse.value = getIsReverse === 'true' ? true : false;
}
const reOrder = () => {
    isReverse.value = !isReverse.value;
    emit('toReverse');
    localStorage.setItem('isReverse', isReverse.value.toString());
}

// 控制排序
const sortType = ref('1'),
    getSortType = localStorage.getItem('sortType');
if (getSortType === null) {
    localStorage.setItem('sortType', '1');
} else {
    sortType.value = getSortType;
}
const toSort = (type: string) => {
    sortType.value = type;
    emit('toSort', type);
    localStorage.setItem('sortType', sortType.value);
}

</script>

<style scoped>
.toolbar {
    position: relative;
    width: 92%;
    height: 60px;
    padding: 20px 26px;
    font-size: 30px;
    color: #737373;
}

.bar-left {
    position: absolute;
    align-items: center;
    top: 0px;
    left: 28px;
    line-height: 80px;
}

.bar-midd {
    position: absolute;
    top: 20px;
    right: 400px;
}

.bar-right {
    position: absolute;
    top: 20px;
    right: 40px;
}

/* 弹窗 */
#addnew-box {
    z-index: 999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
}

#addnew-box .box {
    position: relative;
    top: 50%;
    width: 550px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 4px;
    transform: translateY(-50%);
    animation: spredModify 0.3s ease-out;
}

.box-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 40px;
    padding: 0 20px;
    border-bottom: 1px solid #e5e6eb;
}
.box-header .header-title {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    margin-top: 4px;
    color: #1d2129;
    font-weight: 500;
    font-size: 16px;
}
.box-header .header-close {
    margin-left: -12px;
    padding: 4px;
    color: #1d2129;
    font-size: 12px;
    cursor: pointer;
    border-radius: 50%;
}
.box-header .header-close:hover {
    background-color: #f2f3f5;
}

.box-body {
    position: relative;
    padding: 24px 20px;
    color: #1d2129;
    font-size: 14px;
}

.box-footer {
    box-sizing: border-box;
    width: 100%;
    padding: 16px 20px;
    text-align: right;
    border-top: 1px solid #e5e6eb;
}
@keyframes spredModify {
    0% {
        width: 0;
        opacity: 0;
    }
    30% {
        opacity: 0;
    }
    100% {
        width: 550px;
        opacity: 1;
    }
}
</style>