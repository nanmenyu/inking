<template>
    <div class="user-content">
        <h2>用户数据中心</h2>
        <a-page-header title="码字数统计" subtitle="近7天码字数统计" :show-back="false">
            <template #extra>
                <a-radio-group style="border-radius:10px" type="button">
                    <a-radio style="border-radius: 10px;" value="mini">近7天</a-radio>
                    <a-radio style="border-radius: 10px;" value="small">近30天</a-radio>
                    <a-radio style="border-radius: 10px;" value="large">近365天</a-radio>
                </a-radio-group>
            </template>
            <div class="chart-content">
                <div class="chart" ref="chart_ref"></div>
                <div class="bar"></div>
            </div>
        </a-page-header>
    </div>
</template>

<script setup lang='ts'>
import { ref, watch, computed, onMounted } from 'vue';
import * as echarts from 'echarts';

const chart_ref = ref();
onMounted(() => {
    let myChart = echarts.getInstanceByDom(chart_ref.value);
    if (myChart == null) myChart = echarts.init(chart_ref.value);

    myChart.setOption({
        xAxis: {
            type: 'category',
            data: ['-6', '-5', '-4', '-3', '-2', '-1', '今天'],
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'value'
        },
        tooltip: {
            trigger: 'axis'
        },
        series: [
            {
                data: [1050, 2300, 4224, 1218, 4135, 147, 2060],
                type: 'line',
                smooth: true,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        },
                        {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }
                    ])
                },
            },
            {
                data: [2000, 2000, 2000, 2000, 2000, 2000, 2000],
                type: 'line',
                showSymbol: false
            }
        ]
    })

    window.onresize = function () {//自适应大小
        myChart!.resize();
    };
})
</script>

<style lang="scss" src="../style/usercontent.scss" scoped>
</style>