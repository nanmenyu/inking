<!-- 顶部多选处理框 -->
<template>
    <div class="multiplebar">
        <a-space size="large" class="bar">
            <span>
                共
                <em style="color:#f53f3f">{{ totalNum }}</em>&nbsp;个项目&nbsp;&nbsp;-&nbsp;&nbsp;已选择
                <em style="color:#f53f3f">{{ selectedNum }}</em>&nbsp;个项目
            </span>
            <a-button
                v-if="isHomePage"
                @click="putSelectinRecycle"
                type="primary"
                shape="round"
                size="small"
                status="warning"
            >
                <template #icon>
                    <icon-delete :style="{ fontSize: '16px' }" />
                </template>
                置入回收站
            </a-button>
            <a-button
                v-if="!isHomePage"
                @click="deleteSelect"
                type="primary"
                shape="round"
                size="small"
                status="danger"
            >
                <template #icon>
                    <icon-delete :style="{ fontSize: '16px' }" />
                </template>
                删除
            </a-button>
            <a-button
                v-if="!isHomePage"
                @click="restoreSelect"
                type="primary"
                shape="round"
                size="small"
                status="success"
            >
                <template #icon>
                    <icon-refresh :style="{ fontSize: '16px' }" />
                </template>
                还原
            </a-button>
            <div class="separate"></div>
            <a-button @click="selectAll" type="primary" shape="round" size="small">
                <template #icon>
                    <icon-select-all :style="{ fontSize: '16px' }" />
                </template>
                全选
            </a-button>
            <a-button @click="complete" type="primary" shape="round" size="small">
                <template #icon>
                    <icon-check-circle :style="{ fontSize: '16px' }" />
                </template>完成
            </a-button>
        </a-space>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
    IconDelete,
    IconRefresh,
    IconSelectAll,
    IconCheckCircle
} from '@arco-design/web-vue/es/icon';
import { useRoute } from 'vue-router';

const emit = defineEmits(['toPutSelectinRecycle', 'toDeleteSelect', 'toRestoreSelect', 'toComplete', 'toSelectAll']);

// 通过路由判断当前页面
const isHomePage = ref(false), route = useRoute();
if (route.path === '/') {
    isHomePage.value = true;
} else {
    isHomePage.value = false;
}

// 获取选中的数量
const totalNum = ref(0), selectedNum = ref(0);
const getData = (total: number, selected: number) => {
    totalNum.value = total;
    selectedNum.value = selected;
}

// 置入选中到回收站
const putSelectinRecycle = () => {
    emit('toPutSelectinRecycle');
}
//删除选中
const deleteSelect = () => {
    emit('toDeleteSelect');
}
// 还原选中
const restoreSelect = () => {
    emit('toRestoreSelect');
}
// 全选按钮
const selectAll = () => {
    emit('toSelectAll');
}
// 完成按钮
const complete = () => {
    emit('toComplete');
}

defineExpose({
    getData
})

</script>

<style scoped>
.multiplebar {
    position: relative;
    width: 92%;
    height: 60px;
    padding: 20px 26px;
    color: #333;
}
.bar {
    width: 100%;
    height: 100%;
}

.bar span {
    font-size: 20px;
    font-weight: bold;
    margin-right: 40px;
}
.separate {
    width: 2px;
    height: 25px;
    background-color: #ccc;
}
</style>