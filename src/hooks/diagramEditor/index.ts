import * as echarts from 'echarts';

interface CateData {
    name: string;
}
interface NodeData {
    id: string;
    name: string;
    value: number;
    symbolSize: number;
    category: string;
    associated: Array<Associated>;
    x?: number;
    y?: number;
    label?: {
        show: boolean;
    }
}
interface LinkData {
    source: string;
    target: string;
    value: number;
}
interface GraphData {
    categories: Array<CateData>;
    nodes: Array<NodeData>;
    links: Array<LinkData>;
}

/**
 * 绘制关系图的图表
 */
export function setDiagramChart(chartDom: HTMLElement, graph: GraphData, opusTitle: string, layout: string): void {
    let myChart = echarts.getInstanceByDom(chartDom);
    if (myChart == null) {
        myChart = echarts.init(chartDom);
    }
    const graphName: Array<{ id: string, name: string }> = [];
    graph.nodes.forEach(node => {
        node.label = {
            show: node.symbolSize >= 25 // 值大于等于25显示名称
        };
        graphName.push({ id: node.id, name: node.name });
    });

    // 绘制图表
    // const intensity = ref(1); //默认关联强度
    const textColor = getComputedStyle(document.body).getPropertyValue('--color-text-1');
    const option: any = {
        color: ['#3491fa', '#CC3399', '#FFCC99', '#FF6666', '#FF9999', '#FFCCCC', '#FF99CC', '#66CC99'],
        title: {
            text: opusTitle + '关系图',
            // subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
        },
        tooltip: {
            formatter: (param: any) => {
                // 边与点触发
                if (param.dataType === 'edge') {
                    let nameSource = '', nameTarget = '', intensityBlock = '🔥';
                    graphName.forEach(item => {
                        if (item.id === param.data.source) nameSource = item.name;
                        if (item.id === param.data.target) nameTarget = item.name;
                    })
                    for (let i = 1; i < param.data.value; i++) {
                        intensityBlock += '🔥';
                    }
                    return nameSource + ' ⬅️➡️ ' + nameTarget + '<br />'
                        + `关联度: <span >${intensityBlock}</span>`;
                } else if (param.dataType === 'node') {
                    let associatedItems = '';
                    param.data.associated.forEach((item: any) => {
                        associatedItems += '<li>👉' + item.key.split('🞂')[1] + '</li>'
                    })
                    return `名称: ${param.name}<br />关联(${param.value}): <br /> <ul style="margin:0;padding-left:1em;list-style-type:none;">${associatedItems}</ul>`;
                }
            },
            textStyle: {
                align: 'left',
            },
        },
        legend: [{
            top: 10,
            textStyle: {
                color: textColor
            },
        }],
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                type: 'graph',
                layout: layout,
                force: {
                    repulsion: 30
                },
                data: graph.nodes,
                links: graph.links,
                categories: graph.categories,
                roam: true,
                label: {
                    position: 'right',
                    textBorderWidth: '0',
                    color: textColor
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0.3 // 边的曲度
                },
                emphasis: {
                    focus: 'adjacency', //聚焦关系图中的邻接点和边的图形
                    lineStyle: {
                        width: 5
                    }
                }
            }
        ]
    }

    myChart.setOption(option);

    window.onresize = function () {
        //自适应大小
        myChart!.resize();
    };
}