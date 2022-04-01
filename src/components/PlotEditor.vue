<!-- 备忘录编辑模块 -->
<template>
    <PopupMenu
        v-if="isNewPlotGroup"
        :title="panelName_Plot"
        determine="确定"
        @toModify="modify"
        @toDetermine="plotReName"
        :determineDisabled="curPlotName.length === 0"
    >
        <a-form-item field="event" label="备忘录名">
            <a-input
                v-model="curPlotName"
                :max-length="20"
                placeholder="请填写备忘录名"
                allow-clear
                show-word-limit
            ></a-input>
        </a-form-item>
    </PopupMenu>
    <PopupMenu
        v-if="isGroupReName"
        :title="panelName_Group!"
        determine="确定"
        @toModify="modify"
        @toDetermine="groupReName"
        :determineDisabled="curGroupName.length === 0"
    >
        <a-form-item field="event" label="待办组名">
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
        :title="panelName_summary!"
        determine="确定"
        @toModify="modify"
        @toDetermine="editSummaryItem"
        :determineDisabled="summaryForm.title.length === 0"
    >
        <a-form :model="summaryForm" style="overflow: hidden;" layout="inline">
            <a-form-item field="imp" label="重要性">
                <a-rate v-model="summaryForm.imp" title="选择重要性(1-5)" :count="5">
                    <template #character>
                        <icon-fire />
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
                <div :class="[`resizebox-demo`, `resizebox-demo-${'vertical'}`]">
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
                                @click="showNewPlotGroup('rename')"
                                type="text"
                                size="small"
                                title="修改备忘录"
                            >Edit</a-button>
                            <a-button
                                @click="showNewPlotGroup('add')"
                                type="text"
                                size="small"
                                title="添加备忘录"
                            >Add</a-button>
                        </template>
                        <a-tab-pane v-for="item in tabsData" :key="item[0]" :title="item[1]"></a-tab-pane>
                    </a-tabs>
                </div>
                <details
                    v-if="thePlotData.data.length > 0"
                    v-for="item in thePlotData.data[nowPlotKey].summary"
                    :key="item.sid"
                >
                    <!-- 大标题 -->
                    <a-dropdown
                        trigger="contextMenu"
                        alignPoint
                        :style="{ display: 'block', fontSize: '14px' }"
                    >
                        <summary title="按住shift并点击可多项展开">
                            <span class="summary-title">{{ item.itemsName }}</span>
                        </summary>
                        <template #content>
                            <a-doption
                                @click="openEditSummaryItem(item.sid, null)"
                                class="iconfont"
                            >&#xe648;&nbsp;&nbsp;添加新条目</a-doption>
                            <a-doption
                                @click="openGroupReName(item.itemsName, item.sid, 'add')"
                                class="iconfont"
                            >&#xe616;&nbsp;&nbsp;添加新组</a-doption>
                            <a-doption
                                @click="openGroupReName(item.itemsName, item.sid, 'rename')"
                                class="iconfont"
                            >&#xe82a;&nbsp;&nbsp;重命名</a-doption>
                            <a-doption
                                @click="deleteGroup(item.itemsName, item.sid)"
                                class="iconfont"
                            >&#xe7f2;&nbsp;&nbsp;删除</a-doption>
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
                                    <span
                                        @click="openEditSummaryItem(item.sid, i)"
                                        class="edit-btn"
                                    >
                                        <icon-edit />
                                    </span>
                                    <span
                                        @click="deleteSummaryItem(it.title, item.sid, i)"
                                        class="edit-btn"
                                    >
                                        <icon-delete />
                                    </span>
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
import { IconFire, IconEdit, IconDelete } from '@arco-design/web-vue/es/icon';
import { computed, nextTick, reactive, ref, Ref } from 'vue';
import { useRoute } from 'vue-router';
import PopupMenu from './widget/PopupMenu.vue';
import useCurrentInstance from '../utils/useCurrentInstance';
import { db } from '../db/db';
import { v4 } from 'uuid';

const { proxy } = useCurrentInstance();
const route = useRoute();
const query_id = parseInt(<string>route.query.id);
const thePlotData: { data: Array<PlotGroup> } = reactive({ data: [] });
const tabsData: Ref<Array<Array<string>>> = ref([]);
const nowPlotKey = ref(0); // 当前渲染数据的索引

loadPlotData();

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

// 添加新备忘录
const isNewPlotGroup = ref(false), curPlotName = ref('');
const panelName_Plot = ref('新建备忘录');
const mode_plot: Ref<'add' | 'rename'> = ref('add');
const showNewPlotGroup = (mode: 'add' | 'rename') => {
    isNewPlotGroup.value = true;
    mode_plot.value = mode;
    if (mode === 'add') {
        panelName_Plot.value = '新建备忘录';
        curPlotName.value = '';
    } else if (mode === 'rename') {
        panelName_Plot.value = '修改备忘录';
        curPlotName.value = thePlotData.data[nowPlotKey.value].name;
    }
}
const plotReName = () => {
    if (mode_plot.value === 'add') {
        loadDB('添加新备忘录成功！', (item: Userdb) => {
            item.thePlot.push({
                id: v4(),
                name: curPlotName.value,
                summary: [{
                    sid: v4(),
                    itemsName: '自定义待办组',
                    items: []
                }]
            });
        })
    } else if (mode_plot.value === 'rename') {
        loadDB('修改备忘录成功！', (item: Userdb) => {
            item.thePlot[nowPlotKey.value].name = curPlotName.value;
        })
    }
    // 局部处理函数
    function loadDB(msg: string, cb: Function) {
        db.opus.where(':id').equals(query_id).modify(item => {
            cb(item);
        }).then(() => {
            isNewPlotGroup.value = false;
            proxy.$message.success(msg);
            loadPlotData();
        })
    }
}
// 删除备忘录
const deletePlotGroup = (key: string) => {
    if (thePlotData.data.length > 1) {
        for (let index in thePlotData.data) {
            if (thePlotData.data[index].id === key) {
                proxy.$modal.warning({
                    title: "删除备忘录",
                    content: `是否删除"${thePlotData.data[index].name}"? 该操作不可逆!`,
                    simple: true,
                    onOk: () => {
                        db.opus.where(':id').equals(query_id).modify(item => {
                            item.thePlot.splice(parseInt(index), 1);
                        }).then(() => {
                            proxy.$message.success('删除成功！');
                            if (key === thePlotData.data[nowPlotKey.value].id) nowPlotKey.value = 0;
                            loadPlotData();
                        })
                    }
                })
            }
        }
    } else {
        proxy.$message.error('最后一个无法删除！');
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
const mode_group: Ref<'add' | 'rename'> = ref('add');
const panelName_Group = computed(() => {
    if (mode_group.value === 'add') return '添加新组';
    if (mode_group.value === 'rename') return '重命名';
})
const openGroupReName = (name: string, sid: string, type: 'add' | 'rename') => {
    mode_group.value = type;
    [isGroupReName.value, curGroupName.value, curSid.value] = [true, name, sid]
}
// 待办组重命名/添加
const groupReName = () => {
    if (mode_group.value === 'rename') {
        loadDB('重命名成功！', (item: Userdb) => {
            item.thePlot[nowPlotKey.value].summary.forEach(it => {
                if (it.sid === curSid.value) it.itemsName = curGroupName.value;
            })
        })
    } else if (mode_group.value = 'add') {
        loadDB('添加组成功！', (item: Userdb) => {
            item.thePlot[nowPlotKey.value].summary.push({
                sid: v4(),
                itemsName: curGroupName.value,
                items: []
            })
        })
    }
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
}
// 删除目标待办组
const deleteGroup = (name: string, sid: string) => {
    proxy.$modal.warning({
        title: '删除待办组',
        content: `是否删除待办组"${name}"? 该操作不可逆!`,
        simple: true,
        onOk: () => {
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

/* ----------------------- 打开组内条目设置面板-----------------------*/
const isNewSummaryItem = ref(false);
const mode_item: Ref<'add' | 'edit'> = ref('add');
const summaryIndex: Ref<number | null> = ref(0);
const summaryForm = reactive({
    title: '',
    imp: 1,
    con: ''
});
const panelName_summary = computed(() => {
    if (mode_item.value === 'add') return '添加新条目';
    if (mode_item.value === 'edit') return '编辑选择条目';
})
// 打开条目面板
const openEditSummaryItem = (sid: string, index: number | null) => {
    if (index === null) {
        mode_item.value = 'add';
    } else {
        mode_item.value = 'edit';
        thePlotData.data[nowPlotKey.value].summary.forEach(item => {
            if (item.sid === sid) {
                summaryForm.title = item.items[index].title;
                summaryForm.imp = item.items[index].imp;
                summaryForm.con = item.items[index].con;
            }
        })
    }
    summaryIndex.value = index;
    isNewSummaryItem.value = true;
    curSid.value = sid;
}
const editSummaryItem = () => {
    if (mode_item.value === 'add') {
        loadDB('添加成功！', (it: Summary) => {
            it.items.push({
                title: summaryForm.title,
                imp: summaryForm.imp,
                con: summaryForm.con,
                complete: false
            })
        })
    } else if (mode_item.value === 'edit') {
        loadDB('修改成功！', (it: Summary) => {
            it.items[summaryIndex.value!].title = summaryForm.title;
            it.items[summaryIndex.value!].imp = summaryForm.imp;
            it.items[summaryIndex.value!].con = summaryForm.con;
        })
    }
    // 局部处理函数
    function loadDB(msg: string, cb: Function) {
        db.opus.where(':id').equals(query_id).modify(item => {
            item.thePlot[nowPlotKey.value].summary.forEach(it => {
                if (it.sid === curSid.value) {
                    cb(it);
                };
            })
        }).then(() => {
            isNewSummaryItem.value = false;
            proxy.$message.success(msg);
            loadPlotData();
        })
    }
}
// 删除目标条目
const deleteSummaryItem = (name: string, sid: string, index: number) => {
    proxy.$modal.warning({
        title: '删除条目',
        content: `是否删除目标条目"${name}"? 该操作不可逆!`,
        simple: true,
        onOk: () => {
            db.opus.where(':id').equals(query_id).modify(item => {
                item.thePlot[nowPlotKey.value].summary.forEach(it => {
                    if (it.sid === sid) it.items.splice(index, 1);
                })
            }).then(() => {
                proxy.$message.success('删除成功！');
                loadPlotData();
            })
        }
    })
}

const modify = () => {
    isNewPlotGroup.value = false;
    isGroupReName.value = false;
    isNewSummaryItem.value = false;
}

// 获取数据
function loadPlotData(): void {
    db.opus.get(query_id).then(value => {
        if (value) {
            thePlotData.data = value.thePlot;
            tabsData.value = thePlotData.data.map(item => [item.id, item.name]);
        };
    }).then(() => {
        nextTick(() => {
            let ds = [...document.querySelectorAll('details')];
            // 默认每次只能有一个展开
            ds.forEach(d => {
                d.addEventListener('click', e => {
                    // 按住shift可以展开多个
                    e.shiftKey || ds.filter(i => i != d).forEach(i => i.removeAttribute('open'))
                })
            })
        })
    })
}
</script>
<style src="../style/ploteditor.scss" lang="scss" scoped>
</style>
