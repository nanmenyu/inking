<!-- 剧情编辑模块 -->
<template>
    <div class="plot">
        <a-resize-box :directions="['left', 'right']" class="resize-box">
            <template #resize-trigger="{ direction }">
                <div
                    :class="[
                        `resizebox-demo`,
                        `resizebox-demo-${'vertical'}`
                    ]"
                >
                    <div class="resizebox-demo-line" />
                </div>
            </template>
            <container>
                <div class="head">
                    <a-tabs type="text" :editable="true" default-active-key="0">
                        <template #extra>
                            <a-button type="text">Add</a-button>
                        </template>
                        <a-tab-pane key="0" title="主线"></a-tab-pane>
                        <a-tab-pane key="1" title="支线1"></a-tab-pane>
                        <a-tab-pane key="2" title="支线2"></a-tab-pane>
                        <a-tab-pane key="3" title="支线3"></a-tab-pane>
                        <a-tab-pane key="4" title="支线4"></a-tab-pane>
                    </a-tabs>
                </div>
                <details v-for="(item, i) in testData" :open="i === 0">
                    <!-- 大标题 -->
                    <summary title="按住shift并点击可多项展开">
                        <span class="summary-title">带有自定义箭头的细节元素！</span>
                    </summary>
                    <!-- 内容区 -->
                    <ul>
                        <li>
                            <div class="summary-content">
                                <span class="title">吃主人的食物</span>
                                <span class="status">🔥</span>
                            </div>
                        </li>
                        <li>
                            <div class="summary-content">
                                <span class="title">喵喵叫</span>
                                <span class="status">🔥🔥🔥🔥🔥</span>
                                <span
                                    class="info"
                                >给我注意或面对我爪子的愤怒给我注意或面对我爪子的愤怒假装不是邪恶的猫为了统治世界总是想要食物。吃主人的食物，玩羊毛球和喵喵叫，然后走开，然后呕吐 我的皮球真的把房间连在一起了。拥抱不拥抱拥抱爱抓抓猫</span>
                            </div>
                        </li>
                        <li>
                            <div class="summary-content">
                                <span class="title">爪子的愤怒</span>
                                <span class="status">🔥🔥</span>
                            </div>
                        </li>
                    </ul>
                </details>
            </container>
        </a-resize-box>
    </div>
</template>

<script setup lang="ts">
import {
    IconDown, IconUp
} from '@arco-design/web-vue/es/icon';
import { onMounted, reactive, ref } from 'vue';

const testData = ref(10);
const fakeData = reactive({
    data: [{
        id: '1',
        name: '主线',
        items: [
            {
                title: '吃主人的食物',
                imp: 1,
                con: '项目one thing on a list of things to buy, do, talk about, etc.Whats the next item on the agenda?议程的下一项是什么？'
            },
            {
                title: '喵喵叫',
                imp: 5,
                con: '给我注意或面对我爪子的愤怒给我注意或面对我爪子的愤怒假装不是邪恶的猫为了统治世界总是想要食物。吃主人的食物，玩羊毛球和喵喵叫，然后走开，然后呕吐 我的皮球真的把房间连在一起了。拥抱不拥抱拥抱爱抓抓猫'
            },
            {
                title: '爪子的愤怒',
                imp: 2,
                con: ''
            }
        ]
    }, {
        id: '2',
        name: '支线1',
    }]
})

onMounted(() => {
    // 获得全部details的DOM块
    let ds = [...document.querySelectorAll('details')];
    ds.forEach(d => d.addEventListener('click', (e: MouseEvent) => {
        if (!e.shiftKey) {
            ds.filter(i => i != d).forEach(i => i.removeAttribute('open'));
        }
    }))
})


</script>

<style src="../style/ploteditor.scss" lang="scss" scoped>
</style>