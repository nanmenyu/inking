<!-- 时间线编辑模块 -->
<template>
    <div class="timeline">
        <section @scroll="sectionScroll" ref="timelineSection" class="timeline__section">
            <div class="timeline__nav">
                <ul ref="timelineUl">
                    <li v-for="item in tempData.data" :key="item.id" :id="'nav_' + item.id">
                        <a
                            @click.prevent="toAnchor('con_' + item.id)"
                            :class="checkedId === ('con_' + item.id) ? 'active' : ''"
                            :href="'#' + item.id"
                        >{{ item.timeSlot }}</a>
                    </li>
                </ul>
            </div>
            <div class="wrapper">
                <a-timeline>
                    <a-timeline-item
                        v-for="item in tempData.data"
                        :key="item.id"
                        :id="'con_' + item.id"
                    >
                        <h2>{{ item.timeSlot }}</h2>
                        <p>
                            <img
                                width="40"
                                :style="{ marginRight: '16px', marginBottom: '12px' }"
                                src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/b5d834b83708a269b4562924436eac48.png~tplv-uwbnlip3yd-png.png"
                            />
                            {{ item.desc }}
                        </p>
                    </a-timeline-item>
                </a-timeline>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, Ref, onMounted } from 'vue';
import { throttle } from '../utils/flowControl';

const tempData = reactive({
    data: [
        { id: 1, timeSlot: 999999, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 2, timeSlot: 1994, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 3, timeSlot: 1995, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 4, timeSlot: 1996, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 5, timeSlot: 1997, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 6, timeSlot: 1998, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 7, timeSlot: 1999, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 8, timeSlot: 2000, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 9, timeSlot: 2001, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 10, timeSlot: 2002, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 11, timeSlot: 2003, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 12, timeSlot: 2004, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 13, timeSlot: 2005, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 14, timeSlot: 2006, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 15, timeSlot: 2007, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 16, timeSlot: 2008, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 17, timeSlot: 2009, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 18, timeSlot: 2010, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 19, timeSlot: 2011, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 20, timeSlot: 2012, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 21, timeSlot: 2013, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 22, timeSlot: 2014, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 23, timeSlot: 2015, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 24, timeSlot: 2016, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 25, timeSlot: 2017, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 26, timeSlot: 2018, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 27, timeSlot: 2019, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' },
        { id: 28, timeSlot: 2020, title: 'xxxxx', desc: 'По сути, стратегия позиционирования определяет рекламный макет. Маркетинговая активность отражает медиаплан, не считаясь с затратами. Общество потребления переворачивает ролевой поведенческий таргетинг.' }]
})

// 初始化
const offsetTop_el: { data: Array<{ id: string, offsetTop: number }> } = reactive({ data: [] });
onMounted(() => {
    calculateOffsetTop();
})

// 锚点跳转
const checkedId = ref('con_1');
const toAnchor = (id: string) => {
    checkedId.value = id;
    const targetAnchor = document.getElementById(id);
    if (targetAnchor) targetAnchor.scrollIntoView({ behavior: "smooth" });
    toNavCenter();
}

// 内容滚动标记当前元素
const timelineSection: Ref<HTMLElement | undefined> = ref();
const sectionScroll = throttle(() => {
    const curScrollTop: number | undefined = timelineSection.value?.scrollTop;
    if (curScrollTop === 0) {
        checkedId.value = 'con_1';
    }
    if (curScrollTop) {
        for (let i in offsetTop_el.data) {
            if (offsetTop_el.data[i].offsetTop >= curScrollTop) {
                checkedId.value = offsetTop_el.data[i].id;
                break;
            }
        }
    }
    toNavCenter();
}, 30);

// 计算每个元素距离父元素顶部的大小
function calculateOffsetTop() {
    let targetElement: HTMLElement;
    offsetTop_el.data = tempData.data.map(item => {
        targetElement = document.getElementById('con_' + item.id)!;
        return {
            id: 'con_' + item.id,
            offsetTop: targetElement.offsetTop
        }
    })
}
// 计算nav中已checked元素高度
const timelineUl: Ref<HTMLElement | undefined> = ref();
const timelineUl_tran: Ref<string> = ref('0px');
function toNavCenter() {
    const currentElement = document.getElementById(checkedId.value.replace('con_', 'nav_'));
    if (currentElement) {
        timelineUl_tran.value = (274 - currentElement.offsetTop) + 'px';
    }
}

</script>

<style lang="scss" scoped>
.timeline {
    width: 100%;
    height: calc(100vh - 90px);
    padding: 0;
    text-align: left;
    overflow: hidden;

    .timeline__section {
        position: relative;
        float: right;
        width: 500px;
        height: 100%;
        margin-right: 100px;
        overflow: scroll;
        &::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0);
        }
        .wrapper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            h2 {
                margin: 0;
            }
            p {
                margin: 0;
            }
        }
        .timeline__nav {
            position: fixed;
            right: 20px;
            top: calc(50% + 20px);
            width: 55px;
            max-height: 600px;
            padding: 0 10px;
            transform: translateY(-50%);
            user-select: none;
            text-align: center;
            overflow: hidden;
            ul {
                width: 100%;
                padding: 0;
                margin: 0;
                list-style-type: none;
                transform: translateY(v-bind(timelineUl_tran));
                transition: all 0.4s ease-in;
                li {
                    margin: 15px 0;
                    padding-left: 0;
                    list-style-type: none;
                    border-bottom: 1px dotted rgba(0, 0, 0, 0.3);
                    cursor: pointer;
                    &:first-child {
                        margin-top: 0;
                    }
                    &:last-child {
                        margin-bottom: 0;
                    }
                    a {
                        text-decoration: none;
                        font-size: 16px;
                        color: #bfc1c3;
                        font-style: italic;
                        &.active {
                            font-size: 18px;
                            font-weight: bold;
                            color: #165dff;
                            border-bottom: 1px dotted transparent;
                            transform: scale(1.2);
                            transition: color 0.2s ease-out;
                        }
                    }
                }
            }

            .active {
                font-weight: bold;
                color: #f94125;
                border-bottom: 1px dotted transparent;
                transform: scale(1.2);
            }
        }
    }
}
</style>
