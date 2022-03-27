import * as echarts from 'echarts';

interface TargetData {
    key: string;
    value: number
}
interface ItemValueObj {
    [key: string]: Array<number>;
}
interface Color {
    chartsColor: string;
    primaryColor: string;
    labelColor: string;
}

/**
 * 绘制面板雷达图
 */
export function setNumberChart(chartDom: HTMLElement, targetData: Array<TargetData>, itemValueObj: Array<ItemValueObj>, unit: string, curMax: number, color: Color) {
    let n_chart = echarts.getInstanceByDom(chartDom);
    if (n_chart == null) n_chart = echarts.init(chartDom);

    const indicatorData: Array<{ name: string, max: number }> = [],
        data_value: Array<number> = [];
    targetData.forEach(item => {
        data_value.push(item.value);
        indicatorData.push({
            name: item.key,
            max: curMax
        })
    });
    // 获得目标单位的每个关键字的数字总量
    const itemTotal: Array<number> = [];
    itemValueObj.forEach(item => {
        if (item[unit] !== undefined) {
            let num = 0;
            item[unit].forEach(it => {
                num += it;
            })
            itemTotal.push(num);
        }
    })
    // 大——>小排序
    itemTotal.sort(function (a, b) { return b - a });
    n_chart.setOption({
        color: [`rgb(${color.chartsColor})`],
        tooltip: {
            trigger: 'axis'
        },
        radar: {
            indicator: indicatorData,
            axisName: {
                formatter: function (params: string) {
                    // 限制name的长度,多余部分用省略号代替
                    return params.length > 10 ? params.slice(1, 10) + '...' : params;
                },
                color: `rgb(${color.primaryColor})`
            },
        },
        series: [{
            type: 'radar',
            tooltip: {
                trigger: 'item',
                formatter: function (params: any) {
                    let sum = 0
                    for (let i = 0; i < params.value.length; i++) {
                        sum = sum + params.value[i];
                    }
                    const ranking = itemTotal.indexOf(sum) + 1;
                    return '总量: ' + sum + '<br />' + '排名: ' + ranking + '/' + itemTotal.length;
                },
                textStyle: {
                    align: 'left'
                }
            },
            data: [{
                value: data_value,
                name: '数据可视化',
                symbol: 'rect',
                symbolSize: 4,
                areaStyle: {
                    color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                        {
                            color: `rgba(${color.chartsColor}, 0.1)`,
                            offset: 0
                        },
                        {
                            color: `rgba(${color.chartsColor}, 0.9)`,
                            offset: 1
                        }
                    ])
                },
                emphasis: {
                    areaStyle: {
                        color: `rgb(${color.chartsColor})`
                    }
                },
                label: {
                    show: true,
                    color: color.labelColor,
                    formatter: function (params: any) {
                        return params.value + unit;
                    }
                }
            }]
        }]
    });
}