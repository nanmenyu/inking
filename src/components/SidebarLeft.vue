<!-- 左侧边栏 -->
<template>
    <div class="sidebar">
        <div class="sidebar-user">
            <router-link to="/user">
                <div class="user-info">
                    <a-avatar
                        :size="45"
                        :trigger-icon-style="{ color: 'rgb(var(--my-secondary-6))' }"
                        :auto-fix-font-size="false"
                        :style="{ backgroundColor: 'rgb(var(--my-secondary-6))' }"
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
            </router-link>
            <div class="user-target" ref="uChart"></div>
        </div>
        <div class="sidebar-model">
            <router-link to="/">
                <a-button :type="choicedType === 't1' ? 'primary' : 'text'" class="btn">
                    <span class="iconfont">&#xe60f;</span>
                    <span>写作模式</span>
                </a-button>
            </router-link>
            <router-link to="readingMode">
                <a-button :type="choicedType === 't2' ? 'primary' : 'text'" class="btn">
                    <span class="iconfont">&#xe60e;</span>
                    <span>阅读模式</span>
                </a-button>
            </router-link>
            <router-link to="bigworld">
                <a-button :type="choicedType === 't3' ? 'primary' : 'text'" class="btn">
                    <span class="iconfont">&#xe609;</span>
                    <span>大世界</span>
                </a-button>
            </router-link>
            <router-link to="recycle">
                <a-button :type="choicedType === 't4' ? 'primary' : 'text'" class="btn">
                    <span class="iconfont">&#xe7f2;</span>
                    <span>回收站</span>
                </a-button>
            </router-link>
        </div>
        <div class="sidebar-bottom">
            <div>
                <router-link to="setting">
                    <a-tooltip content="设置">
                        <icon-settings />
                    </a-tooltip>
                </router-link>
            </div>
            <div>
                <a-tooltip content="消息通知">
                    <a-badge :count="9" :offset="[2, -2]">
                        <icon-notification />
                    </a-badge>
                </a-tooltip>
            </div>
            <div>
                <a-tooltip content="帮助反馈">
                    <icon-question-circle />
                </a-tooltip>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import {
    IconRight, IconEdit, IconSettings, IconQuestionCircle, IconNotification
} from '@arco-design/web-vue/es/icon';
import { useRoute } from 'vue-router';
import { useThemeStore } from '../store';
import * as echarts from 'echarts';

const themeStore = useThemeStore();
const route = useRoute(), choicedType = ref(''), uChart = ref();
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

// 检测主题变化修改颜色
const secondaryColor = ref(''), fontColor = ref('');
watch(computed(() => {
    return themeStore.theme;
}), () => {
    secondaryColor.value = themeStore.my_secondary_6;
    fontColor.value = themeStore.color_text_1;
    setChart();
})

// 检测副颜色是否发生改变
watch(computed(() => {
    return themeStore.my_secondary_6;
}), () => {
    secondaryColor.value = themeStore.my_secondary_6;
    fontColor.value = themeStore.color_text_1;
    setChart();
})

onMounted(() => {
    // 获得副主题色
    secondaryColor.value = getComputedStyle(document.body).getPropertyValue('--my-secondary-6');
    // 获取文字色
    fontColor.value = getComputedStyle(document.body).getPropertyValue('--color-text-1');
    setChart();
});

function setChart() {
    let myChart = echarts.getInstanceByDom(uChart.value);
    if (myChart == null) myChart = echarts.init(uChart.value);

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
                lineHeight: 21,
                color: `${fontColor.value}`
            }
        }],
        legend: {
            bottom: '5%',
            itemStyle: {
                borderWidth: 0
            },
            textStyle: {
                color: `${fontColor.value}`
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
        color: [`rgb(${secondaryColor.value})`, '#ccc']
    });
    window.onresize = function () {//自适应大小
        myChart!.resize();
    };
}

</script>

<style lang="scss" src="../style/sidebarleft.scss" scoped>
</style>