import * as echarts from 'echarts';
import { useThemeStore } from '../../store';

/**
 * 绘制码字数统计(柱状图)
 */
export function drawCodewordChart(chartDom: HTMLElement, xAxisData: any, seriesData: any): void {
    const themeStore = useThemeStore();
    let myChart = echarts.getInstanceByDom(chartDom);
    if (myChart) myChart!.dispose();
    myChart = echarts.init(chartDom);

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
            },
            formatter: (param: any) => {
                return `${param[0].axisValue}<br />${param[0].marker}   ${param[0].value}字`;
            }
        },
        grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },
        dataZoom: [{
            type: 'inside'
        }, {
            type: 'slider',
            show: false
        }],
        series: [{
            data: seriesData,
            type: 'bar',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: `rgba(${themeStore.my_secondary_6},0.3)` },
                    { offset: 1, color: `rgba(${themeStore.my_secondary_6},1)` }
                ]),
                barBorderRadius: [0, 20, 20, 0]
            }
        }]
    })

    //自适应大小
    window.onresize = function () {
        myChart!.resize();
    }
}

/**
 * 绘制码字数统计(折线图 365天时)
 */
export function drawLineChart(chartDom: HTMLElement, xAxisData: Array<string>, seriesData: any): void {
    const themeStore = useThemeStore();
    let myChart = echarts.getInstanceByDom(chartDom);
    if (myChart) myChart!.dispose();
    myChart = echarts.init(chartDom);

    myChart.setOption({
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData
        },
        tooltip: {
            trigger: 'axis'
        },
        yAxis: {
            type: 'value'
        },
        dataZoom: [{
            type: 'inside'
        }, {
            type: 'slider',
            show: false
        }],
        series: [{
            data: seriesData,
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: {
                color: 'rgba(255,255,255,0)'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: `rgb(${themeStore.my_secondary_6})` },
                    { offset: 1, color: `rgb(${themeStore.primary_6})` }
                ])
            }
        }]
    })

    window.onresize = function () {
        myChart!.resize();
    }
}

/**
 * 关键词词频分析(散点图)
 */
export function drawScatterChart(chartDom: HTMLElement, xAxisData: any, yAxisData: any, scatterData: any): void {
    const themeStore = useThemeStore();
    let myChart = echarts.getInstanceByDom(chartDom);
    if (myChart) myChart!.dispose(); // 避免重复option
    myChart = echarts.init(chartDom);

    myChart.setOption({
        color: [`rgb(${themeStore.primary_6})`],
        tooltip: {
            position: 'top',
            formatter: (param: any) => {
                return `${param.name}<br />${param.marker} ${yAxisData[param.value[1]]}  ${param.value[2]}次`
            }
        },
        grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            top: '0%',
            containLabel: true
        },
        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 100,
                show: true
            },
            {
                show: true,
                start: 0,
                end: (() => {
                    if (yAxisData.length < 10) return 100;
                    else if (yAxisData.length < 20) return 50;
                    else return 25;
                })(),
                yAxisIndex: 0,
                width: 20,
                showDataShadow: false,
                brushSelect: false // 关闭刷选
            }
        ],
        xAxis: {
            type: 'category',
            data: xAxisData,
            boundaryGap: false,
            splitLine: {
                show: true
            },
            axisLine: {
                show: false
            }
        },
        yAxis: {
            type: 'category',
            data: yAxisData,
            axisLine: {
                show: false
            }
        },
        series: [{
            type: 'scatter',
            symbolSize: function (val: any) {
                if (val[2] <= 6 && val[2] > 0) return 6;
                else return val[2];
            },
            data: scatterData,
            animationDelay: function (idx: number) {
                return idx * 5;
            }
        }]
    })

    window.onresize = function () {
        myChart!.resize();
    }
}

/**
 * 关键词词频总览(饼图)
 */
export function drawPieChart(chartDom: HTMLElement, pieData: any, otherPieData: Array<string>): void {
    const themeStore = useThemeStore();
    let myChart = echarts.getInstanceByDom(chartDom);
    if (myChart) myChart!.dispose(); // 避免重复option
    myChart = echarts.init(chartDom);

    const otherPie = otherPieData.map(item => {
        return {
            value: 1,
            name: item
        }
    })

    myChart.setOption({
        title: [{
            text: '前20个关键词',
            left: '25%',
            bottom: '10%',
            textAlign: 'center',
            textStyle: {
                color: `rgb(${themeStore.my_secondary_6})`
            }
        }, {
            text: '后20个关键词',
            left: '75%',
            bottom: '10%',
            textAlign: 'center',
            textStyle: {
                color: `rgb(${themeStore.my_secondary_6})`
            }
        }, , {
            text: '频率为零的关键词',
            left: '50%',
            top: '0',
            textAlign: 'center',
            textStyle: {
                color: `rgb(${themeStore.my_secondary_6})`
            }
        }],
        tooltip: {
            trigger: 'item',
        },
        series: [{
            name: '前20个关键词',
            type: 'pie',
            radius: [50, 250],
            center: ['25%', '50%'],
            roseType: 'area',
            label: {
                show: false
            },
            itemStyle: {
                borderRadius: 8
            },
            data: pieData.slice(0, 20)
        }, {
            name: '后20个关键词',
            type: 'pie',
            radius: [50, 250],
            center: ['75%', '50%'],
            roseType: 'area',
            label: {
                show: false
            },
            itemStyle: {
                borderRadius: 8
            },
            data: pieData.slice(-20)
        }, {
            name: '频率为零的关键词',
            type: 'pie',
            radius: [20, 50],
            center: ['50%', '11%'],
            label: {
                show: false
            },
            itemStyle: {
                borderRadius: 8
            },
            data: otherPie,
            tooltip: {
                formatter: (param: any) => {
                    return `${param.seriesName}<br />${param.marker}    ${param.name}`;
                }
            }
        }]
    })

    window.onresize = function () {//自适应大小
        myChart!.resize();
    }
}

/**
 * 关键词词频趋势（折线）
 */
export function drawLinesChart(chartDom: HTMLElement, xAxisData: any, lineSeriesData: any): void {
    let myChart = echarts.getInstanceByDom(chartDom);
    if (myChart) myChart!.dispose(); // 避免重复option
    myChart = echarts.init(chartDom);

    myChart.setOption({
        xAxis: {
            type: 'category',
            data: xAxisData
        },
        yAxis: {
            type: 'value'
        },
        dataZoom: [{
            type: 'inside'
        }, {
            type: 'slider',
            show: false
        }],
        tooltip: {
            order: 'valueDesc',
            trigger: 'axis',
            textStyle: {
                align: 'left'
            }
        },
        series: lineSeriesData
    })

    window.onresize = function () {//自适应大小
        myChart!.resize();
    }
}