<template>
    <div class="user-content">
        <h2>用户数据中心</h2>
        <a-page-header :title="headerTitle" :subtitle="subtitle" :show-back="false">
            <template #extra>
                <a-space class="iconfont" style="margin: 0 10px;">
                    <a-tooltip content="码字数统计" mini>
                        <a-button
                            @click="changeCurrentState('s1')"
                            :type="currentState === 's1' ? 'primary' : 'outline'"
                            shape="circle"
                            size="mini"
                        >&#xe8bf;</a-button>
                    </a-tooltip>
                    <a-tooltip content="关键词分析" mini>
                        <a-button
                            @click="changeCurrentState('s2')"
                            :type="currentState === 's2' ? 'primary' : 'outline'"
                            shape="circle"
                            size="mini"
                        >&#xe669;</a-button>
                    </a-tooltip>
                </a-space>
                <!-- 码字统计模块 -->
                <a-radio-group
                    v-if="currentState === 's1'"
                    @change="choiceCodewordRange"
                    :default-value="timeFrame"
                    type="button"
                    style="border-radius:10px"
                >
                    <a-radio value="7" style="border-radius: 10px;">近7天</a-radio>
                    <a-radio value="30" style="border-radius: 10px;">近30天</a-radio>
                    <a-radio value="365" style="border-radius: 10px;">近365天</a-radio>
                </a-radio-group>

                <!-- 关键词模块 -->
                <a-radio-group
                    v-if="currentState === 's2'"
                    @change="choiceAnalysisMode"
                    :default-value="keMode"
                    type="button"
                    style="border-radius:10px"
                >
                    <a-radio value="m1" style="border-radius: 10px;">详细</a-radio>
                    <a-radio value="m2" style="border-radius: 10px;">总览</a-radio>
                    <a-radio value="m3" style="border-radius: 10px;">趋势</a-radio>
                    <a-dropdown>
                        <a-button type="text" style="border-radius: 10px;">{{ currentOpus }}</a-button>
                        <template #content>
                            <a-doption
                                v-for="item in opusList"
                                @click="selectOpus(item[0], item[1])"
                                :key="item[0]"
                            >{{ item[1] }}</a-doption>
                        </template>
                    </a-dropdown>
                </a-radio-group>
            </template>
            <div class="chart-content">
                <div class="chart" ref="chart_ref"></div>
                <div v-if="showChartBtn" class="chart-btn">
                    <a-button-group>
                        <a-button type="primary" size="small">
                            <icon-left />上页
                        </a-button>
                        <a-button type="primary" size="small">
                            下页
                            <icon-right />
                        </a-button>
                    </a-button-group>
                </div>
            </div>
        </a-page-header>
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, onMounted, reactive, computed } from 'vue';
import { IconLeft, IconRight } from '@arco-design/web-vue/es/icon';
import { useThemeStore } from '../store';
import { db } from '../db/db';
import * as echarts from 'echarts';

const themeStore = useThemeStore();
const chart_ref = ref();
const codewordsData: {
    data: Array<{ codewords: number, creationTime: string }>
} = reactive({ data: [] });
const currentState = ref('s1');
const dailyPlan = ref(2000);

loadCodewordData();

const headerTitle = computed(() => {
    if (currentState.value === 's1')
        return '码字数统计';
    else if (currentState.value === 's2')
        return '关键词分析';
})
const subtitle = computed(() => {
    if (currentState.value === 's1')
        return `近${timeFrame.value}天码字数统计`;
    else if (currentState.value === 's2')
        return '关键词频率分析';
})

// 改变显示模块
const changeCurrentState = (state: 's1' | 's2') => {
    currentState.value = state;
    showChartBtn.value = false;
    if (state === 's1') {
        choiceCodewordRange(timeFrame.value);
    } else if (state === 's2') {
        choiceAnalysisMode(keMode.value);
    }
}

// 选择要渲染的码字数的时间范围
const timeFrame = ref('7');
const choiceCodewordRange = (value: string) => {
    const range = -1 * parseInt(value); // 倒数几个数据
    timeFrame.value = value;
    // 整理数据并切割
    const xAxisData = codewordsData.data.map(item => item.creationTime).slice(range);
    const seriesData = codewordsData.data.map(item => {
        if (item.codewords < dailyPlan.value) {
            return item.codewords;
        } else {
            return {
                value: item.codewords,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: `rgba(${themeStore.primary_6},0.5)` },
                        { offset: 1, color: `rgba(${themeStore.primary_6},1)` }
                    ])
                }
            };
        }
    }).slice(range);

    if (value === '365') {
        drawLineChart(xAxisData, seriesData);
    } else {
        drawCodewordChart(xAxisData, seriesData);
    }
}

// 选择要分析的作品
const opusList: Ref<Array<[number, string]>> = ref([]);
const currentOpusKey = ref(1);
const currentOpus = ref('')
const selectOpus = (key: number, value: string) => {
    currentOpus.value = value;
    currentOpusKey.value = key;
    choiceAnalysisMode(keMode.value);
}

// 选择关键词分析模式
const keMode = ref('m1');
const showChartBtn = ref(false);
const choiceAnalysisMode = (mode: string) => {
    keMode.value = mode;
    showChartBtn.value = false;
    db.opus.get(currentOpusKey.value).then(value => {
        if (value) {
            const keyWordArr: Array<Array<string>> = [];
            value.theKeyWord.forEach(item => {
                let tempArr: Array<string> = [];
                item.data.forEach(it => {
                    tempArr = it.otherName;
                    tempArr.unshift(it.itemName);
                    keyWordArr.push([...new Set(tempArr)]);// 去重
                })
            })
            // 章名称数组
            const xAxisData: Array<string> = [];
            // 关键字主名数组
            const yAxisData: Array<string> = keyWordArr.map(item => item[0]);
            // 散点图数据
            const scatterData: Array<Array<number>> = [];
            value.data.forEach(item => {
                item.volume.forEach((it, index) => {
                    if (!it.discard) {
                        // 每一章
                        const chapter = it.chapter.join('');
                        keyWordArr.forEach((key, i) => {
                            let num = 0;
                            key.forEach(name => {
                                // 计算主名及别名的总频率
                                num += patch(name, chapter);
                            });
                            // console.log(key, [index, i, num]);
                            scatterData.push([index, i, num]);
                        })
                        xAxisData.push(it.chapterName);
                    }
                })
            })

            if (mode === 'm1') {
                drawScatterChart(xAxisData, yAxisData, scatterData);
            } else if (mode === 'm2') {
                const tempData: { [key: string]: number } = {};
                // 计算总频次
                scatterData.forEach(item => {
                    if (!tempData[yAxisData[item[1]]]) tempData[yAxisData[item[1]]] = 0;
                    tempData[yAxisData[item[1]]] += item[2];
                })
                // 饼图数据
                const pieData: Array<{ value: number, name: string }> = [];
                const otherPieData: Array<string> = []; // 值为0的数据名称
                for (let key in tempData) {
                    if (tempData[key] > 0) {
                        pieData.push({
                            value: tempData[key],
                            name: key
                        });
                    } else {
                        otherPieData.push(key);
                    }
                }
                drawPieChart(pieData, otherPieData);
            } else if (mode === 'm3') {
                const tempData: { [key: string]: Array<number> } = {};
                scatterData.forEach(item => {
                    if (!tempData[yAxisData[item[1]]]) tempData[yAxisData[item[1]]] = [];
                    tempData[yAxisData[item[1]]].push(item[2]);
                })
                const lineSeriesData = [];
                for (let key in tempData) {
                    lineSeriesData.push({
                        name: key,
                        data: tempData[key],
                        type: 'line',
                        smooth: true
                    })
                }
                if (lineSeriesData.length <= 3) {
                    drawLinesChart(xAxisData, lineSeriesData);
                } else {
                    // 显示翻页按钮进行分页渲染图标
                    showChartBtn.value = true;
                    drawLinesChart(xAxisData, lineSeriesData);
                }
            }
        }
    })
    // 计算一个字符串中某个字符串出现的次数
    function patch(str: string, tarStr: string) {
        const re = new RegExp(str, 'ig');
        return (tarStr.match(re) ?? []).length;
    }
}

function loadCodewordData() {
    // 读取用户数据
    db.user.where(':id').between(1, Infinity).toArray().then(value => {
        value.forEach(item => {
            codewordsData.data.push({
                codewords: item.codewords + randomNum(1000, 4000),
                creationTime: item.creationYear + '/' + item.creationMonth + '/' + item.creationDay
            })
        })
    }).then(() => {
        choiceCodewordRange('7');
        // drawScatterChart()
    })
    // 读取所有作品列表
    db.opus.where(':id').between(1, Infinity).toArray().then(value => {
        opusList.value = value.filter(item => item.discard === 'f').map(item => {
            return [item.id!, item.title];
        });
        currentOpusKey.value = opusList.value[0][0];
        currentOpus.value = opusList.value[0][1];
    })
}

// 绘制码字数统计(柱状图)
function drawCodewordChart(xAxisData: any, seriesData: any) {
    let myChart = echarts.getInstanceByDom(chart_ref.value);
    if (myChart) myChart!.dispose();
    myChart = echarts.init(chart_ref.value);

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

    window.onresize = function () {//自适应大小
        myChart!.resize();
    }
}

// 绘制码字数统计(折线图 365天时)
function drawLineChart(xAxisData: Array<string>, seriesData: any) {
    let myChart = echarts.getInstanceByDom(chart_ref.value);
    if (myChart) myChart!.dispose();
    myChart = echarts.init(chart_ref.value);

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
    window.onresize = function () {//自适应大小
        myChart!.resize();
    }
}

// 关键词词频分析(散点图)
function drawScatterChart(xAxisData: any, yAxisData: any, scatterData: any) {
    let myChart = echarts.getInstanceByDom(chart_ref.value);
    if (myChart) myChart!.dispose(); // 避免重复option
    myChart = echarts.init(chart_ref.value);

    myChart.setOption({
        color: [`rgb(${themeStore.primary_6})`],
        tooltip: {
            position: 'top',
            formatter: (param: any) => {
                return `${param.marker} ${yAxisData[param.value[1]]}  ${param.value[2]}次`
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
                // filterMode: 'empty',
                width: 20,
                // height: '100%',
                showDataShadow: false,
                // left: '93%',
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

    window.onresize = function () {//自适应大小
        myChart!.resize();
    }
}

// 关键词词频总览(饼图)
function drawPieChart(pieData: any, otherPieData: Array<string>) {
    let myChart = echarts.getInstanceByDom(chart_ref.value);
    if (myChart) myChart!.dispose(); // 避免重复option
    myChart = echarts.init(chart_ref.value);

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

// 关键词词频趋势（折线）
function drawLinesChart(xAxisData: any, lineSeriesData: any) {
    let myChart = echarts.getInstanceByDom(chart_ref.value);
    if (myChart) myChart!.dispose(); // 避免重复option
    myChart = echarts.init(chart_ref.value);

    myChart.setOption({
        xAxis: {
            type: 'category',
            data: xAxisData
        },
        yAxis: {
            type: 'value'
        },
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

//生成从minNum到maxNum的随机数
function randomNum(minNum: number, maxNum: number) {
    switch (arguments.length) {
        case 1:
            return parseInt((Math.random() * minNum + 1).toString(), 10);
        case 2:
            return parseInt((Math.random() * (maxNum - minNum + 1) + minNum).toString(), 10);
        default:
            return 0;
    }
}

</script>

<style lang="scss" src="../style/usercontent.scss" scoped>
</style>