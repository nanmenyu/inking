<!-- 剧情编辑模块 -->
<template>
    <PopupMenu
        v-if="isGroupReName"
        :title="panelName_Group!"
        determine="确定"
        @toModify="modify"
        @toDetermine="groupReName"
        :determineDisabled="curGroupName.length === 0"
    >
        <a-form-item field="event" label="剧情待办组名">
            <a-input
                v-model="curGroupName"
                :max-length="20"
                placeholder="请填写组名"
                allow-clear
                show-word-limit
            ></a-input>
        </a-form-item>
    </PopupMenu>

    <PopupMenu
        v-if="isNewSummaryItem"
        title="添加新剧情项"
        determine="确定"
        @toModify="modify"
        @toDetermine="addNewSummaryItem"
    >
        <a-form :model="summaryForm" layout="inline">
            <a-form-item field="imp" label="重要性">
                <a-rate v-model="summaryForm.imp" title="选择重要性(1-5)">
                    <template #character="index">
                        <icon-fire v-if="index >= 0" />
                    </template>
                </a-rate>
            </a-form-item>
            <a-form-item field="title" label="标题">
                <a-input
                    :max-length="15"
                    v-model="summaryForm.title"
                    placeholder="请填写事项标题"
                    size="samll"
                    style="width: 200px;"
                    allow-clear
                    show-word-limit
                />
            </a-form-item>
            <a-form-item field="con" label="描述">
                <a-textarea
                    v-model="summaryForm.con"
                    placeholder="填写事项描述"
                    :auto-size="{
                        minRows: 5,
                        maxRows: 5
                    }"
                    style="width: 450px;"
                    :max-length="500"
                    show-word-limit
                    allow-clear
                />
            </a-form-item>
        </a-form>
    </PopupMenu>

    <div class="plot">
        <a-resize-box :directions="['left', 'right']" class="resize-box">
            <template #resize-trigger="{ direction }">
                <div
                    :class="[
                        `resizebox-demo`,
                        `resizebox-demo-${'vertical'}`
                    ]"
                >
                    <div class="resizebox-demo-line" />
                </div>
            </template>
            <div class="container">
                <div class="head">
                    <a-tabs
                        v-if="tabsData.length > 0"
                        type="text"
                        @change="chocieTab"
                        @delete="deletePlotGroup"
                        :editable="true"
                    >
                        <template #extra>
                            <a-button
                                @click="addNewPlotGroup"
                                type="text"
                                size="small"
                                title="添加剧情线"
                            >Add</a-button>
                        </template>
                        <a-tab-pane v-for="item in tabsData" :key="item[0]" :title="item[1]"></a-tab-pane>
                    </a-tabs>
                </div>
                <details
                    v-if="thePlotData.data.length > 0"
                    v-for="(item, index) in thePlotData.data[nowPlotKey].summary"
                    :key="item.sid"
                    :open="index === 0"
                >
                    <!-- 大标题 -->
                    <a-dropdown trigger="contextMenu" alignPoint :style="{ display: 'block' }">
                        <summary title="按住shift并点击可多项展开">
                            <span class="summary-title">{{ item.itemsName }}</span>
                        </summary>
                        <template #content>
                            <a-doption @click="openNewSummaryItem(item.sid)">添加新条目</a-doption>
                            <a-doption
                                @click="openGroupReName(item.itemsName, item.sid, 'add')"
                            >添加新组</a-doption>
                            <a-doption
                                @click="openGroupReName(item.itemsName, item.sid, 'rename')"
                            >重命名</a-doption>
                            <a-doption @click="deleteGroup(item.itemsName, item.sid)">删除</a-doption>
                        </template>
                    </a-dropdown>
                    <!-- 内容区 -->
                    <ul @click.stop>
                        <li v-for="(it, i) in item.items" :key="i">
                            <div class="summary-content">
                                <span class="title">
                                    <span
                                        @click="switchComStatu(item.sid, i)"
                                        style="display: inline;cursor: pointer;"
                                        :title="it.complete ? '已完成' : '待完成'"
                                    >{{ it.complete ? '✅' : '🔴' }}</span>
                                    {{ it.title }}
                                </span>
                                <span class="status">{{ statusGenerat(it.imp) }}</span>
                                <span class="info">{{ it.con }}</span>
                            </div>
                        </li>
                    </ul>
                </details>
            </div>
        </a-resize-box>
    </div>
</template>

<script setup lang="ts">
import {
    IconFire
} from '@arco-design/web-vue/es/icon';
import { computed, nextTick, onMounted, reactive, ref, Ref } from 'vue';
import { useRoute } from 'vue-router';
import PopupMenu from './widget/PopupMenu.vue';
import { db } from '../db/db';
import { v4 } from 'uuid';
import useCurrentInstance from '../utils/useCurrentInstance';

const { proxy } = useCurrentInstance();
const route = useRoute();
const query_id = parseInt(<string>route.query.id);
const thePlotData: { data: Array<PlotGroup> } = reactive({ data: [] });
const tabsData: Ref<Array<Array<string>>> = ref([]);
const nowPlotKey = ref(0); // 当前渲染数据的索引

loadPlotData();

onMounted(() => {
    // 获得全部details的DOM块?????????????

    // let ds = [...document.querySelectorAll('details')];
    // ds.forEach(d => d.addEventListener('click', (e: MouseEvent) => {
    //     if (!e.ctrlKey) {
    //         ds.filter(i => i != d).forEach(i => i.removeAttribute('open'));
    //     }
    // }))
    // nextTick(() => {
    //     let ds = [...document.querySelectorAll('details')];
    //     console.log(ds);

    //     ds.forEach(d => d.addEventListener('click', e => e.shiftKey || ds.filter(i => i != d).forEach(i => i.removeAttribute('open'))))
    // })
})

/* ----------------------- tab及内容相关-----------------------*/
// 计算重要性字符个数
const statusGenerat = (qua: number) => {
    let str = '';
    for (let i = 0; i < qua; i++) {
        str += '🔥';
    }
    return str;
}
// 选择tab切换线
const chocieTab = (key: string) => {
    thePlotData.data.forEach((item, index) => {
        if (item.id === key) nowPlotKey.value = index;
    })
}
// 添加新支线
const addNewPlotGroup = () => {
    db.opus.where(':id').equals(query_id).modify(item => {
        item.thePlot.push({
            id: v4(),
            name: '支线' + item.thePlot.length,
            summary: [{
                sid: v4(),
                itemsName: '自定义支线剧情待办组',
                items: []
            }]
        });
    }).then(() => {
        proxy.$message.success('添加新支线成功！');
        loadPlotData();
    })
}
// 删除剧情线
const deletePlotGroup = (key: string) => {
    if (key !== thePlotData.data[0].id) {
        for (let index in thePlotData.data) {
            if (thePlotData.data[index].id === key) {
                proxy.$modal.warning({
                    title: "删除支线",
                    content: `是否删除"支线${index}"? 该操作不可逆!`,
                    simple: true,
                    onOk: () => {
                        db.opus.where(':id').equals(query_id).modify(item => {
                            item.thePlot.splice(parseInt(index), 1);
                            // 全部支线重命名填充被删除的位置
                            for (let i = 1; i < item.thePlot.length; i++) {
                                item.thePlot[i].name = '支线' + i;
                            }
                        }).then(() => {
                            proxy.$message.success('删除成功！');
                            loadPlotData();
                        })
                    }
                })
            }
        }
    }
}
// 切换完成状态
const switchComStatu = (sid: string, i: number) => {
    db.opus.where(':id').equals(query_id).modify(item => {
        item.thePlot[nowPlotKey.value].summary.forEach(it => {
            if (it.sid === sid) it.items[i].complete = !it.items[i].complete;
        })
    }).then(() => {
        loadPlotData();
    })
}

/* ----------------------- 打开待办组重命名面板-----------------------*/
const isGroupReName = ref(false);
const curGroupName = ref(''), curSid = ref(''); // 当前的目标组名及其对应sid
const mode: Ref<'add' | 'rename'> = ref('add');
const panelName_Group = computed(() => {
    if (mode.value === 'add') return '添加新组';
    if (mode.value === 'rename') return '重命名';
})
const openGroupReName = (name: string, sid: string, type: 'add' | 'rename') => {
    mode.value = type;
    [isGroupReName.value, curGroupName.value, curSid.value] = [true, name, sid]
}
// 待办组重命名/添加
const groupReName = () => {
    // 局部处理函数
    function loadDB(msg: string, cb: Function) {
        db.opus.where(':id').equals(query_id).modify(item => {
            cb(item);
        }).then(() => {
            isGroupReName.value = false;
            proxy.$message.success(msg);
            loadPlotData();
        })
    }

    if (mode.value === 'rename') {
        loadDB('重命名成功！', (item: Userdb) => {
            item.thePlot[nowPlotKey.value].summary.forEach(it => {
                if (it.sid === curSid.value) it.itemsName = curGroupName.value;
            })
        })
    } else if (mode.value = 'add') {
        loadDB('添加组成功！', (item: Userdb) => {
            item.thePlot[nowPlotKey.value].summary.push({
                sid: v4(),
                itemsName: curGroupName.value,
                items: []
            })
        })
    }
}
// 删除目标待办组
const deleteGroup = (name: string, sid: string) => {
    proxy.$modal.warning({
        title: '删除待办组',
        content: `是否删除待办组"${name}"? 该操作不可逆!`,
        simple: true,
        onOk: () => {
            console.log('删除');
            db.opus.where(':id').equals(query_id).modify(item => {
                item.thePlot[nowPlotKey.value].summary.forEach((it, index) => {
                    if (it.sid === sid) item.thePlot[nowPlotKey.value].summary.splice(index, 1);
                })
            }).then(() => {
                proxy.$message.success('删除成功！');
                loadPlotData();
            })
        }
    })
}

/* ----------------------- 打开组内项目设置面板-----------------------*/
const isNewSummaryItem = ref(false);
const summaryForm = reactive({
    title: '',
    imp: 1,
    con: ''
})
const openNewSummaryItem = (sid: string) => {
    isNewSummaryItem.value = true;
    curSid.value = sid;
}
const addNewSummaryItem = () => {
    db.opus.where(':id').equals(query_id).modify(item => {
        item.thePlot[nowPlotKey.value].summary.forEach(it => {
            if (it.sid === curSid.value) {
                it.items.push({
                    title: summaryForm.title,
                    imp: summaryForm.imp,
                    con: summaryForm.con,
                    complete: false
                })
            };
        })
    }).then(() => {
        isNewSummaryItem.value = false;
        proxy.$message.success('添加成功！');
        loadPlotData();
    })
}


const modify = () => {
    isGroupReName.value = false;
    isNewSummaryItem.value = false;
}

// 获取数据
function loadPlotData() {
    db.opus.get(query_id).then(value => {
        if (value) {
            thePlotData.data = value.thePlot;
            tabsData.value = thePlotData.data.map(item => [item.id, item.name]);
        };
    })
}
</script>
<style src="../style/ploteditor.scss" lang="scss" scoped>
</style>
