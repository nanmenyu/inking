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
                    :default-value="keMode"
                    type="button"
                    style="border-radius:10px"
                >
                    <a-radio
                        value="m1"
                        @click="choiceAnalysisMode('m1', currentKGroup)"
                        style="border-radius: 10px;"
                    >详细</a-radio>
                    <a-radio
                        value="m2"
                        @click="choiceAnalysisMode('m2', currentKGroup)"
                        style="border-radius: 10px;"
                    >总览</a-radio>
                    <a-radio
                        value="m3"
                        @click="choiceAnalysisMode('m3', currentKGroup)"
                        style="border-radius: 10px;"
                    >趋势{{ keMode === 'm3' && numberOfPages !== 0 ? (currentPage + '/' + numberOfPages) : '' }}</a-radio>
                    <!-- 作品和分组 -->
                    <a-dropdown>
                        <a-button
                            type="text"
                            style="border-radius: 10px;"
                            :disabled="keMode === 'm2'"
                            title="选择关键词组"
                        >{{ currentKGroup === '' ? '全部' : currentKGroup }}</a-button>
                        <template #content>
                            <a-doption @click="selectKGroup('')">全部</a-doption>
                            <a-doption
                                v-for="(item, i) in keyWordGroup"
                                @click="selectKGroup(item)"
                                :key="i"
                            >{{ item }}</a-doption>
                        </template>
                    </a-dropdown>
                    <a-dropdown>
                        <a-button
                            type="text"
                            style="border-radius: 10px;"
                            title="选择作品"
                        >{{ currentOpus }}</a-button>
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
                        <a-button
                            @click="lineChartTurning(-1)"
                            type="primary"
                            size="small"
                            style="border-radius: 10px 0 0 10px;"
                        >
                            <icon-left />上页
                        </a-button>
                        <a-button
                            @click="lineChartTurning(1)"
                            type="primary"
                            size="small"
                            style="border-radius: 0 10px 10px 0;"
                        >
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
import { ref, Ref, reactive, computed } from 'vue';
import { IconLeft, IconRight } from '@arco-design/web-vue/es/icon';
import { useMainStore, useThemeStore } from '../store';
import { drawCodewordChart, drawLineChart, drawScatterChart, drawPieChart, drawLinesChart } from '../hooks/userContent';
import { db } from '../db/db';
import * as echarts from 'echarts';

const themeStore = useThemeStore();
const mainStore = useMainStore();
const chart_ref = ref();
const codewordsData: {
    data: Array<{ codewords: number, creationTime: string }>
} = reactive({ data: [] });
const currentState = ref('s1');
const dailyPlan = ref(2000);

loadCodewordData();

const headerTitle = computed(() => {
    if (currentState.value === 's1') {
        return '码字数统计';
    } else if (currentState.value === 's2') {
        return '关键词分析';
    }
})
const subtitle = computed(() => {
    if (currentState.value === 's1') {
        return `近${timeFrame.value}天码字数统计`;
    } else if (currentState.value === 's2') {
        return '关键词频率分析(只显示主名，但别名也参与统计)';
    }
})

// 改变显示模块
const changeCurrentState = (state: 's1' | 's2') => {
    currentState.value = state;
    showChartBtn.value = false;
    if (state === 's1') {
        choiceCodewordRange(timeFrame.value);
    } else if (state === 's2') {
        choiceAnalysisMode(keMode.value, '');
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
        // 绘制码字数统计(折线图)
        drawLineChart(chart_ref.value, xAxisData, seriesData);
    } else {
        // 绘制码字数统计(柱状图)
        drawCodewordChart(chart_ref.value, xAxisData, seriesData);
    }
}

// 选择要分析的作品
const opusList: Ref<Array<[number, string]>> = ref([]);
const currentOpusKey = ref(1);
const currentOpus = ref('');
const selectOpus = (key: number, value: string) => {
    currentOpus.value = value;
    currentOpusKey.value = key;
    currentKGroup.value = '';
    choiceAnalysisMode(keMode.value, '');
}

// 选择要展示的分组
const keyWordGroup: Ref<Array<string>> = ref([]);
const currentKGroup = ref('');
const selectKGroup = (gname: string) => {
    currentKGroup.value = gname;
    choiceAnalysisMode(keMode.value, gname);
}

// 选择关键词分析模式
const keMode = ref('m1');
const showChartBtn = ref(false);
const currentPage = ref(1);
const numberOfPages = ref(0);
const lineXAxisData: Ref<Array<string>> = ref([]);
const lineSeriesData: Ref<Array<{
    name: string,
    data: Array<number>,
    type: 'line',
    symbol: 'none',
    smooth: true
}>> = ref([]);
const numberPerPage = mainStore.numPerpage; // 每页多少条数据
const choiceAnalysisMode = (mode: string, group: string) => {
    keMode.value = mode;
    showChartBtn.value = false;
    db.opus.get(currentOpusKey.value).then(value => {
        if (value) {
            const keyWordArr: Array<Array<string>> = [];
            keyWordGroup.value = []; // 清空关键词组名数组 
            value.theKeyWord.forEach(item => {
                let tempArr: Array<string> = [];
                // 关键词组名数组
                keyWordGroup.value.push(item.kGroupName);
                item.data.forEach(it => {
                    // 过滤掉名称数组中可能的假值（如空字符串）
                    tempArr = it.otherName.filter(name => name);
                    if (it.itemName) tempArr.unshift(it.itemName);
                    if (tempArr.length > 0) {
                        tempArr.unshift(item.kGroupName); // 首位放置组名
                        keyWordArr.push([...new Set(tempArr)]);// 去重
                    }
                })
            })
            // 章名称数组
            const xAxisData: Array<string> = [];
            // 关键字主名数组
            let newKeyWordArr: Array<Array<string>> = [];
            if (group !== '') {
                newKeyWordArr = keyWordArr.filter(item => {
                    return item[0] === group;
                })
            } else {
                newKeyWordArr = keyWordArr;
            }
            // 获得y轴名称数组
            const yAxisData: Array<string> = newKeyWordArr.map(item => item[1]);
            newKeyWordArr.forEach(item => item.shift()); // 去重首位分组标记
            // 散点图数据
            const scatterData: Array<Array<number>> = [];// x y num
            let indexNum = 0; // x轴的索引,章索引
            value.data.forEach(item => {
                item.volume.forEach(it => {
                    if (!it.discard) {
                        indexNum++;
                        // 每一章
                        const chapter = it.chapter.join('');
                        newKeyWordArr.forEach((key, i) => {
                            let num = 0;
                            key.forEach(name => {
                                // 计算主名及别名的总频率
                                num += patch(name, chapter);
                            });
                            scatterData.push([indexNum - 1, i, num]);
                        })
                        xAxisData.push(it.chapterName);
                    }
                })
            })
            // 根据类别绘图
            // 关键词词频分析(散点图)
            if (mode === 'm1') {
                drawScatterChart(chart_ref.value, xAxisData, yAxisData, scatterData);
            }
            // 关键词词频总览(饼图)
            else if (mode === 'm2') {
                const tempData: { [key: string]: number } = {};
                // 这里不需要按组分类
                const yAxisData = keyWordArr.map(item => item[0]);
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
                pieData.sort((a, b) => b.value - a.value); // 排序
                drawPieChart(chart_ref.value, pieData, otherPieData);
            }
            // 关键词词频趋势（折线）
            else if (mode === 'm3') {
                const tempData: { [key: string]: Array<number> } = {};
                // 散点转坐标
                scatterData.forEach(item => {
                    if (!tempData[yAxisData[item[1]]]) tempData[yAxisData[item[1]]] = [];
                    // 当yAxisData[item[1]]不为undefined时
                    if (yAxisData[item[1]]) tempData[yAxisData[item[1]]].push(item[2]);
                })
                // 暴露总数据
                lineSeriesData.value = [];//先清空旧数据
                // 格式化
                for (let key in tempData) {
                    if (key) {
                        lineSeriesData.value.push({
                            name: key,
                            data: tempData[key],
                            symbol: 'none',
                            type: 'line',
                            smooth: true
                        })
                    }
                }
                lineXAxisData.value = xAxisData; // 暴露x轴数据
                // 分页(10页)
                if (lineSeriesData.value.length <= numberPerPage) {
                    showChartBtn.value = false;
                    drawLinesChart(chart_ref.value, lineXAxisData.value, lineSeriesData.value);
                } else {
                    // 显示翻页按钮进行分页渲染图标
                    showChartBtn.value = true;
                    // 计算需要的页数
                    numberOfPages.value = Math.ceil(lineSeriesData.value.length / numberPerPage);
                    // 默认渲染第一页的数据，即currentPage为1
                    const tempSeriesData = lineSeriesData.value.slice(numberPerPage * (currentPage.value - 1), numberPerPage * currentPage.value);
                    drawLinesChart(chart_ref.value, lineXAxisData.value, tempSeriesData);
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

// 词频趋势数据翻页
const lineChartTurning = (offset: 1 | -1) => {
    if (currentPage.value === 1 && offset === -1) {
        currentPage.value = numberOfPages.value;
    } else if (currentPage.value === numberOfPages.value && offset === 1) {
        currentPage.value = 1;
    } else {
        currentPage.value += offset;
    }
    const tempSeriesData = lineSeriesData.value.slice(numberPerPage * (currentPage.value - 1), numberPerPage * currentPage.value);
    drawLinesChart(chart_ref.value, lineXAxisData.value, tempSeriesData);
}

function loadCodewordData(): void {
    // 读取用户数据
    db.user.where(':id').between(1, Infinity).toArray().then(value => {
        const currentTime = new Date().getTime();
        const len = value.length;
        let targetIndex = 0;

        for (let i = 0; i < len; i++) {
            // 时间戳对应同一天
            if (new Date(currentTime).toDateString() === new Date(value[i].cTime).toDateString()) {
                targetIndex = i; // 获得今天对应数据的索引
                break;
            }
        }

        // 以今天的数据为尾元素，向前切出最多365条数据
        let newValue = [];
        if (targetIndex < 365) {
            newValue = value.slice(0, targetIndex + 1);
        } else {
            newValue = value.slice(targetIndex + 1 - 365, targetIndex + 1);
        }

        // 数据整形
        newValue.forEach(item => {
            const y = new Date(item.cTime).getFullYear();
            const m = new Date(item.cTime).getMonth() + 1;
            const d = new Date(item.cTime).getDate();
            codewordsData.data.push({
                codewords: item.cWords,
                creationTime: y + '/' + m + '/' + d
            })
        })

    }).then(() => {
        choiceCodewordRange('7');
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

</script>

<style lang="scss" src="../style/usercontent.scss" scoped>
</style>