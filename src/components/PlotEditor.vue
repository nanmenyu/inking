<!-- 剧情编辑模块 -->
<template>
    <PopupMenu
        v-if="isGroupReName"
        title="重命名"
        determine="确定"
        @toModify="modify"
        @toDetermine="groupReName"
    >
        <a-form-item field="event" label="剧情待办组名">
            <a-input
                v-model="groupName"
                :max-length="20"
                placeholder="请填写组名"
                allow-clear
                show-word-limit
            ></a-input>
        </a-form-item>
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
                            <a-doption>添加新条目</a-doption>
                            <a-doption @click="isGroupReName = true">重命名</a-doption>
                            <a-doption>删除</a-doption>
                        </template>
                    </a-dropdown>
                    <!-- 内容区 -->
                    <ul @click.stop>
                        <li v-for="(it, i) in item.items" :key="i">
                            <div class="summary-content">
                                <span class="title">
                                    <span
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
// import {
//     IconDown, IconUp
// } from '@arco-design/web-vue/es/icon';
import { onMounted, reactive, ref, Ref } from 'vue';
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
const isGroupReName = ref(false);
const groupName = ref(''); // 当前的目标组名

loadPlotData();

onMounted(() => {
    // 获得全部details的DOM块
    let ds = [...document.querySelectorAll('details')];
    ds.forEach(d => d.addEventListener('click', (e: MouseEvent) => {
        if (!e.ctrlKey) {
            ds.filter(i => i != d).forEach(i => i.removeAttribute('open'));
        }
    }))
})

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
                    content: `是否删除支线${index}? 该操作不可逆!`,
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

// 待办组重命名
const groupReName = () => {
    console.log('待办组重命名：', groupName.value);
}

const modify = () => {
    isGroupReName.value = false;
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