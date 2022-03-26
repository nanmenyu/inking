<!-- 关系图编辑模块 -->
<template>
    <div @click="switchLayout" class="tool-bar">切换布局</div>
    <div class="content" ref="uChart"></div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '../db/db';
import { setDiagramChart } from '../hooks/diagramEditor';

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
const categorieData: { value: Array<CateData> } = reactive({ value: [] }); // 分类
const nodesData: { value: Array<NodeData> } = reactive({ value: [] }); // 节点数据
const linksData: { value: Array<LinkData> } = reactive({ value: [] }); // 节点的连线关系
const graph: { data: GraphData } = reactive({ data: { categories: [], nodes: [], links: [] } });
const uChart = ref();
let opusTitle = '';

db.opus.get(query_id).then(value => {
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
                    symbolSize: 15 + it.associated.length * 5,
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
}).then(() => {
    setDiagramChart(uChart.value, graph.data, opusTitle, layout.value);
})

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
    setDiagramChart(uChart.value, graph.data, opusTitle, layout.value);
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

</script>

<style lang="scss" src="../style/diagramEditor.scss" scoped>
</style>