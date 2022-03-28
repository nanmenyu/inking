<template>
    <!-- 新建功能弹窗 -->
    <PopupMenu
        v-if="addnew"
        title="新建选项"
        determine="确定"
        @toModify="addto"
        @toDetermine="addFile"
        :determineDisabled="fileName.length === 0"
    >
        <a-space size="large">
            <a-space direction="vertical">
                <a-typography-title :heading="6" type="primary">请选择根目录</a-typography-title>
                <a-typography-paragraph>{{ explain }}</a-typography-paragraph>
            </a-space>
            <a-space direction="vertical">
                <a-select v-model="optionValue">
                    <a-option>作品集</a-option>
                    <!-- <a-option>笔记本</a-option> -->
                    <!-- <a-option>Markdown</a-option> -->
                </a-select>
                <a-input
                    v-model="fileName"
                    placeholder="请填写文档名称..."
                    :max-length="25"
                    show-word-limit
                />
            </a-space>
        </a-space>
    </PopupMenu>
    <!-- 工具栏 -->
    <div class="toolbar">
        <div class="bar-left">
            <a-space size="mini">
                <a-dropdown>
                    <a-button type="primary" class="iconfont">&#xe689;&nbsp;数据备份</a-button>
                    <template #content>
                        <a-doption @click="exportBackup">
                            <template #icon>
                                <icon-export />
                            </template>
                            <template #default>&nbsp;导出作品备份</template>
                        </a-doption>
                        <a-doption @click="importBackup">
                            <template #icon>
                                <icon-import />
                            </template>
                            <template #default>&nbsp;导入作品备份</template>
                        </a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown>
                    <a-button
                        type="primary"
                        class="iconfont"
                        style="font-size: 16px;"
                        title="导入 | 新建"
                    >
                        <template #icon>&#xe610;</template>
                    </a-button>
                    <template #content>
                        <a-doption @click="addto">
                            <template #icon>
                                <icon-plus />
                            </template>
                            <template #default>&nbsp;新建作品</template>
                        </a-doption>
                        <a-doption @click="importFile">
                            <template #icon>
                                <icon-import />
                            </template>
                            <template #default>&nbsp;导入书籍</template>
                        </a-doption>
                    </template>
                </a-dropdown>
            </a-space>
        </div>
        <div class="bar-midd">
            <a-tooltip content="反转顺序" position="top" mini>
                <a-button type="text" @click="reOrder" :disabled="disableSort">
                    <icon-swap />
                </a-button>
            </a-tooltip>
            <a-dropdown trigger="hover">
                <a-button type="text" :disabled="disableSort">
                    <icon-swap style="transform:rotateZ(90deg)" />
                </a-button>
                <template #content>
                    <a-doption
                        @click="toSort('1')"
                        :style="sortType === '1' ? 'background-color: rgb(var(--my-secondary-6));color:#fff' : ';'"
                    >按创建时间排序</a-doption>
                    <a-doption
                        @click="toSort('2')"
                        :style="sortType === '2' ? 'background-color: rgb(var(--my-secondary-6));color: #fff;' : ''"
                    >按编辑时间排序</a-doption>
                    <a-doption
                        @click="toSort('3')"
                        :style="sortType === '3' ? 'background-color: rgb(var(--my-secondary-6));color:#fff;' : ''"
                    >按名称排序</a-doption>
                </template>
            </a-dropdown>
            <a-tooltip v-if="!showAllDelete" content="切换显示" position="top" mini>
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
            <a-tooltip v-else content="全部清空" position="top" mini>
                <a-button @click="deleteAll" type="text">
                    <icon-delete />
                </a-button>
            </a-tooltip>
        </div>
        <div class="bar-right">
            <a-input-search
                @input="getSearchWord"
                @focus="toSearch"
                @blur="findSearchResult = _findSearchResult = false"
                :style="{ width: '320px' }"
                placeholder="Search for something"
                search-button
            />
            <div @mousedown.prevent v-if="findSearchResult" class="search-result">
                <div
                    v-for="item in opusData"
                    :key="item.id"
                    @click="routerLink('/detail', item.id)"
                    class="result-item iconfont"
                >{{ '&#xe60f;&nbsp;&nbsp;&nbsp;&nbsp;' + item.title }}</div>
                <div
                    v-for="item in ebooks"
                    :key="item.id"
                    @click="routerLink('', item.id, item.type)"
                    class="result-item iconfont"
                >{{ '&#xe60e;&nbsp;&nbsp;&nbsp;&nbsp;' + item.title }}</div>
            </div>
            <a-empty v-if="_findSearchResult" class="search-result"></a-empty>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref, computed, watch } from 'vue';
import {
    IconPlus, IconImport, IconSwap, IconExport,
    IconApps, IconUnorderedList, IconDelete
} from '@arco-design/web-vue/es/icon';
import PopupMenu from './PopupMenu.vue';
import { useRoute, useRouter } from 'vue-router';
import useCurrentInstance from '../../utils/useCurrentInstance';
import { throttle } from '../../utils/flowControl';
import { exportOpusBackup } from '../../hooks/exportOpus';
import { db } from '../../db/db';
import { v4 } from 'uuid';

const { proxy } = useCurrentInstance();
const $message = proxy.$message;
const emit = defineEmits(['onBack', 'refresh', 'toDeleteAll', 'toReverse', 'toSort', 'toImport']);

// 根据路由选择是否禁用按键
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

// 搜索项快捷跳转
const router = useRouter();
const routerLink = (path: string, id: number, type?: string) => {
    let tempPath = '';
    if (path !== '') {
        tempPath = path;
    } else {
        if (type === 'txt') tempPath = '/reading';
        else if (type === 'pdf') tempPath = '/pdfreading';
        else if (type === 'epub') tempPath = '/epubreading';
    }
    router.push({
        path: tempPath,
        query: { id: id }
    })
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
    // 将该值通过'onBack'事件传予父组件
    emit('onBack', displyBlock.value);
    localStorage.setItem('displyBlock', displyBlock.value.toString());
}

// ----新建|导入功能----
const addnew = ref(false), fileName = ref('');
const optionValue = ref('作品集'),
    optionExplain = ref(['小说等【纯文本】会归类于此目录', '笔记等【富文本】会归类于此目录', 'Markdown文档会归类于此目录']);

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

// 导入图书
const importFile = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.txt,.pdf,.epub');
    input.click();
    input.onchange = () => {
        if (input.files) {
            const fileName = input.files![0].name,
                fileNames = fileName.split('.'),
                fileType = fileNames[fileNames.length - 1];
            db.ebooks.put({
                data: input.files![0],
                type: fileType,
                title: fileName,
                creationTime: new Date().getTime()
            }).then(() => {
                $message.success(`导入${fileType}成功,请到阅读模式下查看`);
                emit('toImport');
            })
        }
    }
}

// 添加作品的item到数据库
const addFile = () => {
    // 选择数据仓库
    switch (optionValue.value) {
        // 向指定数据库追加条目
        case '作品集':
            db.opus.add({
                author: '佚名',
                title: fileName.value,
                createTime: new Date().getTime(),
                updateTime: new Date().getTime(),
                categories: [],
                tag: [],
                desc: '',
                imgSrc: '',
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
                        chapter: ['\u3000\u3000']
                    }]
                }],
                discard: 'f', //因为boolean无法索引  f即false t即true
                historRecord: { vid: '', cid: '' },
                theKeyWord: [], // 关键词模块
                theTimeLine: [{
                    tid: v4(),
                    name: '默认线',
                    max: 5000,
                    min: -5000,
                    eveYear: [],
                    eveMonth: [],
                    eveDay: []
                }],// 时间线模块
                thePlot: [{
                    id: v4(),
                    name: '剧情备忘',
                    summary: [{
                        sid: v4(),
                        itemsName: '自定义剧情相关待办组',
                        items: [{
                            title: '待办条目1',
                            imp: 3,
                            complete: false,
                            con: '标题左侧的红点表示"待完成", 单击可变为"已完成"状态, importance表示该项的重要性(取值:1-5);'
                        }]
                    }]
                }, {
                    id: v4(),
                    name: '灵感备忘',
                    summary: [{
                        sid: v4(),
                        itemsName: '自定义灵感相关待办组',
                        items: [{
                            title: '待办条目1',
                            imp: 5,
                            complete: false,
                            con: '标题左侧的红点表示"待完成", 单击可变为"已完成"状态, importance表示该项的重要性(取值:1-5)'
                        }]
                    }]
                }], // 大纲备忘模块
                theMaps: [], // 地图模块
                opusNumber: 0 // 两个中文空格不算字
            }).then(() => {
                emit('refresh');
            });
            addto();
            $message.success('创建成功');
            break;
        case '笔记本':
            console.log('笔记本');
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
const reOrder = () => {
    emit('toReverse');
}

// 控制排序
const sortType = ref('1'), getSortType = localStorage.getItem('sortType');
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

// 搜索功能
let searchWord = '';
const getSearchWord = (value: string) => {
    searchWord = value.trim();
    if (searchWord !== '') {
        // 节流搜索
        toSearch();
    } else {
        findSearchResult.value = _findSearchResult.value = false;
    }
}
const findSearchResult = ref(false), _findSearchResult = ref(false);
const opusData: Ref<Array<{ id: number, title: string }>> = ref([]);
const ebooks: Ref<Array<{ id: number, title: string, type: string }>> = ref([]);
const toSearch = throttle(async () => {
    if (searchWord !== '') {
        opusData.value = [];
        ebooks.value = [];
        await db.opus.where(':id').between(1, Infinity).toArray().then(data => {
            data.forEach(item => {
                if (item.title.indexOf(searchWord) !== -1) {
                    opusData.value.push({
                        id: item.id!,
                        title: item.title
                    });
                }
            })
        });
        await db.ebooks.where(':id').between(1, Infinity).toArray().then(data => {
            data.forEach(item => {
                if (item.title.indexOf(searchWord) !== -1) {
                    ebooks.value.push({
                        id: item.id!,
                        title: item.title,
                        type: item.type
                    });
                }
            })
        });
        // 查看是否匹配到了关键字
        if (opusData.value.length > 0 || ebooks.value.length > 0) {
            findSearchResult.value = true;
            _findSearchResult.value = false;
        } else {
            findSearchResult.value = false;
            _findSearchResult.value = true;
        }
    }
}, 500);


// 导出作品的备份数据
const exportBackup = async () => {
    // 全部数据库数据
    exportOpusBackup(() => {
        window.$API.ipcOnce('expFile-result', (data: 'success' | 'err') => {
            if (data === 'success') $message.success('导出成功!');
            else if (data === 'err') $message.error('导出失败!');
        });
    })
}

// 导入作品备份
const importBackup = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.json');
    input.click();
    input.onchange = () => {
        if (input.files) {
            const reader = new FileReader();
            reader.readAsText(input.files[0]);
            reader.onload = function (evt) {
                let newOpus: Array<Userdb>;
                try {
                    newOpus = JSON.parse(evt.target!.result as string);
                } catch (error) {
                    $message.error('解析出现错误！');
                    return;
                }
                // 去除旧id
                newOpus.forEach(item => {
                    delete item.id;
                })
                db.opus.bulkAdd(newOpus).then(() => {
                    emit('refresh');
                    $message.success('数据导入成功！');
                })
            }
        }
    }
}
</script>

<style lang="scss" src="../../style/toolbar.scss" scoped>
</style>