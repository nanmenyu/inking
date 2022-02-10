<!-- 关系图编辑模块 -->
<template>
    <div @click="switchLayout" class="tool-bar">切换布局</div>
    <div class="content" ref="uChart"></div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import * as echarts from 'echarts';
import { db } from '../db/db';

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
const route = useRoute(), query_id = parseInt(<string>route.query.id);
const categorieData: { value: Array<CateData> } = reactive({ value: [] });
const nodesData: { value: Array<NodeData> } = reactive({ value: [] });
const linksData: { value: Array<LinkData> } = reactive({ value: [] });
const graph: { data: GraphData } = reactive({ data: { categories: [], nodes: [], links: [] } });
let opusTitle = '';

if (route.query.category === 'opus') {
    db.opus.get(query_id)
        .then(value => {
            if (value) {
                const categorieCount: { [key: string]: number } = {};
                const categorieCoord: { [key: string]: Array<[number, number]> } = {};
                opusTitle = value.title;

                value.theKeyWord.forEach(item => {
                    categorieData.value.push({ name: item.kGroupName });
                    item.data.forEach(it => {
                        categorieCount[item.kGroupName] = (categorieCount[item.kGroupName] || 0) + 1;
                        nodesData.value.push({
                            id: it.iid,
                            name: it.itemName,
                            value: it.associated.length,
                            symbolSize: 15 + it.associated.length * 10,
                            category: item.kGroupName,
                            associated: it.associated
                        })
                        if (it.associated.length > 0) {
                            it.associated.forEach(a => {
                                linksData.value.push({
                                    source: it.iid,
                                    target: a.iid,
                                    value: a.value
                                })
                            })
                        }
                    })
                })
                // 生成对应数量的圆环坐标
                let tempCount = 0;
                for (let i in categorieCount) {
                    // 坐标只是确定相对位置,并非屏幕上的准确位置
                    // ( n%3,-1*paseInt(n/3)) 生成3*n网格偏移布局
                    // console.log((tempCount % 3) * 100, parseInt(tempCount / 3) * 100);
                    categorieCoord[i] = generateCirculCoord((tempCount % 3) * 120, Math.floor(tempCount / 3) * 120, 50, categorieCount[i]);
                    tempCount++;
                }
                tempCount = 0;
                // 添加坐标
                nodesData.value.forEach(item => {
                    item.x = categorieCoord[item.category][categorieCount[item.category] - 1][0];
                    item.y = categorieCoord[item.category][categorieCount[item.category] - 1][1];
                    categorieCount[item.category]--;
                })
                // 去除正反方向重复链接
                linksData.value.forEach(item => {
                    linksData.value.forEach((it, i) => {
                        if (item.source === it.target && item.target === it.source) {
                            linksData.value.splice(i, 1);
                        }
                    })
                })
                graph.data.nodes = nodesData.value;
                graph.data.links = linksData.value;
                graph.data.categories = categorieData.value;
            }
        })
        .then(() => {
            setDiagramChart(graph.data);
        })
}

// 切换显示布局
const layout = ref('none');
const switchLayout = () => {
    if (layout.value === 'none') {
        layout.value = 'circular';
    } else if (layout.value === 'circular') {
        layout.value = 'force';
    } else if (layout.value === 'force') {
        layout.value = 'none';
    }
    setDiagramChart(graph.data);
}
// 绘制圆边坐标
function generateCirculCoord(xOffset: number, yOffset: number, radius: number, quantity: number): Array<[number, number]> {
    const coord = [], sita = (2 * Math.PI) / quantity, r = radius;
    for (let i = 0; i < quantity; i++) {
        coord.push([Math.round(r * Math.cos(i * sita)), Math.round(r * Math.sin(i * sita))]);
    }
    return coord.map(item => {
        return [item[0] + xOffset, item[1] + yOffset];
    });
}
// 绘制关系图
const uChart = ref();
function setDiagramChart(graph: GraphData) {
    let myChart = echarts.getInstanceByDom(uChart.value);
    if (myChart == null) {
        myChart = echarts.init(uChart.value);
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
                align: 'left'
            },
        },
        legend: [
            {
                top: 10,

            }
        ],
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                type: 'graph',
                layout: layout.value,
                force: {
                    repulsion: 30
                },
                data: graph.nodes,
                links: graph.links,
                categories: graph.categories,
                roam: true,
                label: {
                    position: 'right'
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

</script>

<style src="../style/DiagramEditor.css" scoped>
</style>