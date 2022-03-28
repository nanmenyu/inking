import * as echarts from 'echarts';
import { useMainStore } from '../../store';

interface ChartColor {
    fontColor: string;
    secondaryColor: string
}

interface ChartTask {
    completed: number;
    incomplete: number
}

/**
 * 绘制左侧每日计划图表
 */
export function setChart(chartDom: HTMLElement, color: ChartColor, task: ChartTask): void {
    const mainStore = useMainStore();
    let myChart = echarts.getInstanceByDom(chartDom);
    if (myChart == null) myChart = echarts.init(chartDom);

    // 绘制图表
    myChart.setOption({
        title: [{
            text: `今日计划\n${mainStore.dailyPlan}字`,
            top: '25%',
            left: 'center',
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal',
                lineHeight: 21,
                color: `${color.fontColor}`
            }
        }],
        legend: {
            bottom: '5%',
            itemStyle: {
                borderWidth: 0
            },
            textStyle: {
                color: `${color.fontColor}`
            },
            itemWidth: 14
        },
        tooltip: {
            trigger: 'item'
        },
        series: [{
            name: '今日计划',
            type: 'pie',
            radius: ['60%', '75%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            labelLine: {
                show: false
            },
            data: [
                { value: task.completed, name: '已完成' },
                { value: task.incomplete, name: '未完成' }
            ]
        }],
        color: [`rgb(${color.secondaryColor})`, '#ccc']
    });
    window.onresize = function () {//自适应大小
        myChart!.resize();
    };
}