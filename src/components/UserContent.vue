<template>
    <div class="user-content">
        <h2>用户数据中心</h2>
        <a-page-header title="码字数统计" subtitle="近7天码字数统计" :show-back="false">
            <template #extra>
                <a-radio-group
                    @change="choiceCodewordRange"
                    :default-value="'7'"
                    type="button"
                    style="border-radius:10px"
                >
                    <a-radio value="7" style="border-radius: 10px;">近7天</a-radio>
                    <a-radio value="30" style="border-radius: 10px;">近30天</a-radio>
                    <a-radio value="365" style="border-radius: 10px;">近365天</a-radio>
                </a-radio-group>
            </template>
            <div class="chart-content">
                <div class="chart" ref="chart_ref"></div>
                <!-- <div class="bar"></div> -->
            </div>
        </a-page-header>
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, onMounted, reactive } from 'vue';
import { useThemeStore } from '../store';
import * as echarts from 'echarts';

const themeStore = useThemeStore();
const chart_ref = ref();

const codewordsData: {
    data: Array<{ codewords: number, creationTime: string }>
} = reactive({ data: [] });
const dailyPlan = ref(2000);
const xAxisData: Ref<Array<string>> = ref([]);
const seriesData: Ref<Array<any>> = ref([]);
loadCodewordData();

// 选则要渲染的码字数的时间范围
const choiceCodewordRange = (value: string) => {
    console.log(value);
    const range = -1 * parseInt(value); // 倒数几个数据
    // 整理数据并切割
    xAxisData.value = codewordsData.data.map(item => item.creationTime).slice(range);
    seriesData.value = codewordsData.data.map(item => {
        if (item.codewords < dailyPlan.value) {
            return item.codewords
        } else {
            return {
                value: item.codewords,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: `rgba(${themeStore.primary_6},0.5)` },
                        { offset: 1, color: `rgba(${themeStore.primary_6},1)` }
                    ])
                }
            }
        }
    }).slice(range);
    drawCodewordChart(xAxisData.value, seriesData.value);
}

onMounted(() => {
    choiceCodewordRange('7');
})

function loadCodewordData() {
    // 模拟读取数据库
    for (let i = 0; i < 365; i++) {
        codewordsData.data.push({
            codewords: randomNum(0, 6000),
            creationTime: '2022/3/20'
        })
    }
}

// 绘制码字数统计(柱状图)
function drawCodewordChart(xAxisData: any, seriesData: any) {
    let myChart = echarts.getInstanceByDom(chart_ref.value);
    if (myChart == null) myChart = echarts.init(chart_ref.value);

    myChart.setOption({
        xAxis: {
            type: 'category',
            data: xAxisData
        },
        yAxis: {
            type: 'value'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '0%',
            right: '0%',
            bottom: '3%',
            containLabel: true
        },
        dataZoom: [
            {
                type: 'inside'
            },
            {
                type: 'slider',
                show: false
            }
        ],
        series: [
            {
                data: seriesData,
                type: 'bar',
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: `rgba(${themeStore.my_secondary_6},0.5)` },
                        { offset: 1, color: `rgba(${themeStore.my_secondary_6},1)` }
                    ])
                }
            }
        ]
    })

    window.onresize = function () {//自适应大小
        myChart!.resize();
    };
}

// 绘制码字数统计(折线图 365天时)
function drawLineChart() {
    let myChart = echarts.getInstanceByDom(chart_ref.value);
    if (myChart == null) myChart = echarts.init(chart_ref.value);
    myChart.setOption()
    window.onresize = function () {//自适应大小
        myChart!.resize();
    };
}

//生成从minNum到maxNum的随机数
function randomNum(minNum: number, maxNum: number) {
    switch (arguments.length) {
        case 1:
            return Math.floor(Math.random() * minNum + 1, 10);
        case 2:
            return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        default:
            return 0;
    }
}

</script>

<style lang="scss" src="../style/usercontent.scss" scoped>
</style>