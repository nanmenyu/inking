<!-- 左侧边栏 -->
<template>
    <div class="sidebar">
        <div class="sidebar-user">
            <div class="user-info">
                <a-avatar
                    :size="45"
                    :trigger-icon-style="{ color: '#3491FA' }"
                    :auto-fix-font-size="false"
                    :style="{ backgroundColor: '#168CFF' }"
                >
                    南
                    <template #trigger-icon>
                        <IconEdit />
                    </template>
                </a-avatar>
                <div class="user-item">南门玉</div>
                <div class="icon-right">
                    <icon-right />
                </div>
            </div>
            <div class="user-target" ref="uChart"></div>
        </div>
        <div class="sidebar-model">
            <router-link to="/">
                <a-button :type="choicedType === 't1' ? 'text' : 'secondary'" class="btn">
                    <icon-edit />&nbsp;写作模式
                </a-button>
            </router-link>
            <router-link to="readingMode">
                <a-button :type="choicedType === 't2' ? 'text' : 'secondary'" class="btn">
                    <icon-book />&nbsp;阅读模式
                </a-button>
            </router-link>
            <router-link to="bigworld">
                <a-button :type="choicedType === 't3' ? 'text' : 'secondary'" class="btn">
                    <icon-sun />&nbsp;大世界
                </a-button>
            </router-link>
            <router-link to="recycle">
                <a-button :type="choicedType === 't4' ? 'text' : 'secondary'" class="btn">
                    <icon-delete />&nbsp;回收站
                </a-button>
            </router-link>
        </div>
        <div class="sidebar-bottom">
            <div>
                <a-tooltip background-color="#3491fa" content="设置">
                    <icon-settings />
                </a-tooltip>
            </div>
            <div>
                <a-tooltip background-color="#3491fa" content="消息通知">
                    <a-badge :count="9" :offset="[2, -2]">
                        <icon-notification />
                    </a-badge>
                </a-tooltip>
            </div>
            <div>
                <a-tooltip background-color="#3491fa" content="帮助反馈">
                    <icon-question-circle />
                </a-tooltip>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
    IconRight,
    IconBook,
    IconSun,
    IconDelete,
    IconEdit,
    IconSettings,
    IconQuestionCircle,
    IconNotification
} from '@arco-design/web-vue/es/icon';
import { useRoute } from 'vue-router';
import * as echarts from 'echarts';

const route = useRoute(),
    choicedType = ref('t1'),
    uChart = ref();
switch (route.path) {
    case '/':
        choicedType.value = 't1';
        break;
    case '/readingMode':
        choicedType.value = 't2';
        break;
    case '/bigworld':
        choicedType.value = 't3';
        break;
    case '/recycle':
        choicedType.value = 't4';
        break;
}

onMounted(() => {
    //需要获取到element,所以是onMounted的Hook
    let myChart = echarts.init(uChart.value);
    // 绘制图表
    myChart.setOption({
        title: [{
            text: '今日计划\n2000字',
            top: '25%',
            left: 'center',
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal',
                fontFamily: 'Microsoft YaHei',
                lineHeight: 21
            }
        }],
        legend: {
            bottom: '5%',
            itemStyle: {
                borderWidth: 0
            },
            itemWidth: 14
        },
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                name: '今日计划',
                type: 'pie',
                radius: ['60%', '75%'],
                center: ['50%', '40%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderColor: '#fff',
                },
                label: {
                    show: false,
                    position: 'center'
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 1500, name: '已完成' },
                    { value: 500, name: '未完成' }
                ]
            }
        ],
        color: ['#3491fa', '#ccc']
    });
    window.onresize = function () {//自适应大小
        myChart.resize();
    };
});

</script>

<style lang="scss" src="../style/sidebarleft.scss" scoped>
</style>