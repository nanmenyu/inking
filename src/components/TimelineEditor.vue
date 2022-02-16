<!-- 时间线编辑模块 -->
<template>
    <div v-if="isAddEvent" id="modify-box">
        <div class="box">
            <div class="box-header">
                <div class="header-title">添加历史事件</div>
                <div class="header-close" @click="modify">
                    <icon-close />
                </div>
            </div>
            <div class="box-body" style="padding: 0 0 0 20px;overflow: hidden;">
                <a-tabs type="text" @change="chocieTab" default-active-key="1">
                    <a-tab-pane key="1" title="年事件"></a-tab-pane>
                    <a-tab-pane key="2" title="*月事件"></a-tab-pane>
                    <a-tab-pane key="3" title="*日事件"></a-tab-pane>
                </a-tabs>
                <div class="tab-content">
                    <a-space style="width: 100%;margin: 0 0 0 15px;cursor: pointer;" wrap>
                        <a-tag color="#7816ff">
                            123
                            <span class="tag-close" title="删除">
                                <icon-close />
                            </span>
                        </a-tag>
                        <a-tag color="#7816ff">
                            123
                            <span class="tag-close" title="删除">
                                <icon-close />
                            </span>
                        </a-tag>
                        <a-tag color="#7816ff">
                            123
                            <span class="tag-close" title="删除">
                                <icon-close />
                            </span>
                        </a-tag>
                        <a-tag color="#7816ff">
                            123sgxdhfghhhhhhhhhhhhhhhhhhhhh
                            <span class="tag-close" title="删除">
                                <icon-close />
                            </span>
                        </a-tag>
                        <a-tag color="#7816ff">
                            123
                            <span class="tag-close" title="删除">
                                <icon-close />
                            </span>
                        </a-tag>
                    </a-space>
                    <a-form layout="inline" style="margin: 10px 0 50px 0;">
                        <a-form-item field="time" label="选择年份">
                            <a-input-number
                                :default-value="currentYear"
                                @change="confirmPosition"
                                size="samll"
                                style="width: 100px;"
                            />
                        </a-form-item>
                        <a-form-item field="event" label="事件名">
                            <a-
                                :max-length="15"
                                placeholder="请填写事件名"
                                size="samll"
                                style="width: 200px;"
                                allow-clear
                            />
                        </a-form-item>
                        <a-form-item field="eventdesc" label="事件描述">
                            <a-textarea
                                placeholder="填写事件的相关描述"
                                :auto-size="{
                                    minRows: 5,
                                    maxRows: 5
                                }"
                                style="width: 420px;"
                                :max-length="500"
                                show-word-limit
                                allow-clear
                            />
                        </a-form-item>
                    </a-form>
                </div>
            </div>
            <div class="box-footer">
                <a-space size="large">
                    <a-button @click="modify">取消</a-button>
                    <a-button type="primary">添加</a-button>
                </a-space>
            </div>
        </div>
    </div>
    <div class="timeline">
        <div class="timeline__block">
            <div class="slider-box" ref="sliderBox">
                <div class="slider-lable">
                    <a-progress type="circle" size="mini" status="normal" :percent="percentYear" />
                    当前:&nbsp;{{ currentYear }}年
                </div>
                <div @mousemove.stop class="slider-tools">
                    <a-space size="mini">
                        <a-button @click="addHistoryEvent" type="text" size="mini" title="添加历史事件">
                            <template #icon>
                                <icon-plus-circle :style="{ fontSize: '18px' }" />
                            </template>
                        </a-button>
                        <a-button @click="positionTimePoint" type="text" size="mini" title="定位时间点">
                            <template #icon>
                                <icon-location :style="{ fontSize: '18px' }" />
                            </template>
                        </a-button>
                        <a-input-number
                            v-show="isPosition"
                            size="mini"
                            :default-value="currentYear"
                            style="width: 100px;"
                            @change="confirmPosition"
                        />
                        <a-button type="text" size="mini" title="前一个事件">
                            <template #icon>
                                <icon-to-left :style="{ fontSize: '18px' }" />
                            </template>
                        </a-button>
                        <a-button
                            @click="controlScaling('enlarge')"
                            type="text"
                            size="mini"
                            title="放大视图"
                        >
                            <template #icon>
                                <icon-zoom-in :style="{ fontSize: '18px' }" />
                            </template>
                        </a-button>
                        <a-button
                            @click="controlScaling('reduce')"
                            type="text"
                            size="mini"
                            title="缩小视图"
                        >
                            <template #icon>
                                <icon-zoom-out :style="{ fontSize: '18px' }" />
                            </template>
                        </a-button>
                        <a-button type="text" size="mini" title="后一个事件">
                            <template #icon>
                                <icon-to-right :style="{ fontSize: '18px' }" />
                            </template>
                        </a-button>
                    </a-space>
                </div>
                <div class="slider" :style="{ width: sliderWidth + 'px' }" ref="slider">
                    <a-slider
                        v-model="currentYear"
                        @mousedown.stop
                        :min="timeLine.min"
                        :max="timeLine.max"
                        :step="1"
                        style="width: 100%;margin: 0 ;padding:0;margin-top: 100px;"
                        :marks="timeLineMarks"
                        :format-tooltip="(value: number) => {
                            if (value === 0) {
                                return '数学零点(无意义)';
                            } else {
                                return value + '年';
                            }
                        }"
                    />
                </div>
            </div>
            <div class="time-spiral" ref="spiralChart"></div>
        </div>
        <section @scroll="sectionScroll" ref="timelineSection" class="timeline__section">
            <div class="timeline__nav">
                <ul ref="timelineUl">
                    <li v-for="item in tempData.data" :key="item.id" :id="'nav_' + item.id">
                        <a
                            @click.prevent="toAnchor('con_' + item.id)"
                            :class="checkedId === ('con_' + item.id) ? 'active' : ''"
                            :href="'#' + item.id"
                            :title="item.timeSlot.toString()"
                        >{{ timeSlot_format(item.timeSlot) }}</a>
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
                        <h2>
                            {{ item.timeSlot }}
                            <span style="font-size: 16px;">黑暗圣经事件</span>
                        </h2>
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
import { ref, reactive, Ref, onMounted, computed, nextTick } from 'vue';
import {
    IconPlusCircle,
    IconLocation,
    IconZoomIn,
    IconZoomOut,
    IconToLeft,
    IconToRight,
    IconClose
} from '@arco-design/web-vue/es/icon';
import { throttle } from '../utils/flowControl';
import * as echarts from 'echarts';
import '../style/fine-tune-timeLine.scss';// 局部组件库样式微调
// import { nextTick } from 'process';
import useCurrentInstance from '../utils/useCurrentInstance';
const { proxy } = useCurrentInstance();

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
const timeLine = reactive({ min: -5000, max: 5000 });
// 当前年份
const currentYear = ref(2022);
// 当前年份占总时间轴的长度比例
const percentYear = computed(() => {
    return (currentYear.value - timeLine.min) / (timeLine.max - timeLine.min);
})
// 时间轴和步长的缩放比例
const scaleFactor = ref(1);
// 时间轴的长度'px'
const sliderWidth = computed(() => {
    return Math.round(scaleFactor.value * ((timeLine.max - timeLine.min) / 10));
})
// 时间轴刻度的步长
// const stepValue = computed(() => {
//     const timeLength = timeLine.max - timeLine.min;
//     return Math.round(timeLength / 40);
//     //5000->125 10000->250 20000->500...
// })
// 等分时间轴添加标度
const timeLineMarks = computed(() => {
    let division = 1;
    if (scaleFactor.value < 4) {
        division = 1;
    } else if (scaleFactor.value < 6) {
        division = 2;
    } else if (scaleFactor.value < 8) {
        division = 4;
    } else if (scaleFactor.value < 10) {
        division = 8;
    } else {
        division = 16;
    }
    const stepArr = [], stepObj = { [timeLine.min]: timeLine.min };
    const timeLength = timeLine.max - timeLine.min;
    let stepOne = Math.round(timeLength / 20 / division), step = timeLine.min;
    while (1) {
        if (step <= timeLine.max) {
            stepArr.push(step);
            step += stepOne;
        } else {
            break;
        }
    }
    stepArr.forEach(item => {
        stepObj[item] = item;
    })
    if (timeLine.min < 0) {
        stepObj[0] = 0;
    }
    return stepObj;
})

/*
跨度：(-999999<year<+999999) 默认：-5000<year<+5000
时间格式：年-月-日 (剔除0值)
    年份：(-999999<year<+999999) 自定义单位(默认: >=1公元 / <0公元前 )
    月份：(-999<month<+999) 自定义单位(默认: >=1月 / <0未定义 )
    日：(-999<day<999) 自定义单位(默认: >=1日 / <0 未定义)
*/
// const myData = {
//     max: 5000,
//     min: -5000,
//     remarks: { // 范围备注
//         year: [
//             {
//                 name: '公元前',
//                 range: [-999999, -1]
//             }, {
//                 name: '公元',
//                 range: [1, -999999]
//             }
//         ],
//         month: [],
//         day: []
//     },
//     eveYear: [{
//         id: 1,
//         timeSlot: -100, // 公元前100年
//         title: '',
//         desc: '',
//         eveMonth: [
//             {
//                 timeSlot: 7, // 7月
//                 title: '',
//                 desc: '',
//                 eveDay: [{
//                     timeSlot: 3, // 3日
//                     title: '',
//                     desc: '',
//                 }]
//             },
//             {
//                 timeSlot: 12 // 12月
//             },
//             {
//                 timeSlot: 19 // 19月
//             }
//         ]
//     }, {
//         id: 1,
//         timeSlot: 1999, // 公元1999年
//     }, {
//         id: 1,
//         timeSlot: 2000,
//     }]
// }

const offsetTop_el: { data: Array<{ id: string, offsetTop: number }> } = reactive({ data: [] });
const slider = ref(), sliderBox = ref(), spiralChart = ref();
onMounted(() => {
    calculateOffsetTop();
    setSpiralChart();
    setSliderState();
    // 左右滑动时间轴
    sliderBox.value.onmousedown = slidingTimeline;
    sliderBox.value.addEventListener('mouseleave', () => {
        // 主动触发mouseup避免滑块越界
        const evt = new Event('mouseup', { "bubbles": true, "cancelable": true });
        document.body.dispatchEvent(evt);
    })
    // 窗口大小改变时自动适应时间轴右侧
    window.addEventListener('resize', () => {
        // const sliderLeft = parseInt(slider.value.style.left) || 0;
        // const distance = sliderBox.value.clientWidth - (sliderWidth.value + sliderLeft);
        // if (distance > 0) slider.value.style.left = sliderLeft + distance + 'px';
        // if (slider.value.clientWidth < sliderBox.value.clientWidth) {
        //     //     slider.value.style.left = '0px';
        //     // } else {
        //     slider.value.style.left = 0.5 * (sliderBox.value.clientWidth - slider.value.clientWidth) + 'px';
        // }
        setSliderState();
    })
})

// 裁切太长的数字以省略号表示
const timeSlot_format = (timeSlot: number): number | string => {
    return timeSlot > 99999 ? timeSlot.toString().slice(0, 5) + '...' : timeSlot;
}

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

// 控制时间轴长度缩放
const controlScaling = (type: string) => {
    // 最大25倍
    if (scaleFactor.value <= 25 && type === 'enlarge') {
        scaleFactor.value += 1;
    } else if (scaleFactor.value > 0.5 && type === 'reduce') {
        scaleFactor.value -= 0.5;
    }
    setSliderState();
}
// 定位时间点
const isPosition = ref(false);
const positionTimePoint = () => {
    isPosition.value = !isPosition.value;
}
// 设置快捷跳转
const confirmPosition = (value: number) => {
    if (value === 0) {
        proxy.$message.error('0年是无意义的!');
    } else if (value < timeLine.min || value > timeLine.max) {
        proxy.$message.error('年份越界!');
    } else {
        currentYear.value = value;
        setSliderState();
    }
}
// 添加历史事件
const isAddEvent = ref(false);
const addHistoryEvent = () => {
    isAddEvent.value = true;
}
const modify = () => {
    isPosition.value = false;
    isAddEvent.value = false;
}
// 选择标签页
const curTabType = ref('y');
const formData = reactive({
    time: 0,
    event: '',
    eventdesc: ''
});
const chocieTab = (type: string) => {
    curTabType.value = type;
}

// 时间轴状态设置
function setSliderState() {
    nextTick(() => {
        const boxWidth = sliderBox.value.clientWidth, sliderWidth = slider.value.clientWidth;
        // 判断slider与视口的宽度并卸载/添加滑动事件
        if (sliderWidth > boxWidth) {
            // 获取滑块位置占比
            const proportion = parseFloat((<HTMLElement>document.querySelector('.arco-slider-btn')).style.left);
            if (sliderBox.value.onmousedown === null) sliderBox.value.onmousedown = slidingTimeline;
            slider.value.style.left = proportion * (boxWidth - sliderWidth) / 100 + 'px';
        } else {
            if (sliderBox.value.onmousedown !== null) sliderBox.value.onmousedown = null;
            slider.value.style.left = 0.5 * (boxWidth - sliderWidth) + 'px';
        }
    })
}
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
function setSpiralChart() {
    let myChart = echarts.getInstanceByDom(spiralChart.value);
    if (myChart == null) {
        myChart = echarts.init(spiralChart.value);
    }
    const data = [];
    for (let i = 0; i <= 100; i++) {
        let theta = (i / 100) * 360;
        let r = i * theta;
        data.push([r, theta]);
    }
    const option = {
        title: {
            text: 'Two Value-Axes in Polar'
        },
        legend: {
            data: ['line']
        },
        polar: {},
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        angleAxis: {
            type: 'value',
            startAngle: 0
        },
        radiusAxis: {},
        series: [
            {
                coordinateSystem: 'polar',
                name: 'line',
                type: 'line',
                data: data
            }
        ]
    };
    myChart.setOption(option);
    window.onresize = function () {
        //自适应大小
        myChart!.resize();
    };
}
// 滑动时间轴
function slidingTimeline(e: MouseEvent) {
    const x = e.pageX - slider.value.offsetLeft;
    sliderBox.value.onmousemove = fn;
    document.onmouseup = function () {
        sliderBox.value.onmousemove = null;
    }
    function fn(e: MouseEvent) {
        // 时间轴宽度  - 时间轴视口宽度
        const max = sliderWidth.value - sliderBox.value.offsetWidth;
        let targetX = e.pageX - x;
        targetX > 0 ? targetX = 0 : null;
        targetX < -1 * max ? targetX = -1 * max : null;
        slider.value.style.left = targetX + 'px';
    }
}
</script>

<style lang="scss" scoped>
/* 弹窗 */
#modify-box {
    @include popupBase;
    .tab-content {
        // box-sizing: border-box;
        width: 100%;
        height: 300px;
        overflow: hidden;
        overflow-y: scroll;
    }
}
.timeline {
    width: 100%;
    height: calc(100vh - 90px);
    padding: 0;
    text-align: left;
    overflow: hidden;
    .timeline__block {
        float: left;
        width: calc(100% - 600px);
        height: 100%;
        .slider-box {
            box-sizing: border-box;
            position: relative;
            width: 100%;
            height: 150px;
            overflow: hidden;
            user-select: none;
            cursor: move;
            border-bottom: 2px dotted #f2f3f5;
            .slider-lable {
                position: absolute;
                top: 5px;
                right: 50%;
                color: #165dff;
                z-index: 99;
            }
            .slider-tools {
                position: absolute;
                top: 5px;
                right: 10px;
                cursor: pointer;
                z-index: 99;
            }
            .slider {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
            }
        }
        .time-spiral {
            width: 100%;
            height: calc(100% - 150px);
        }
    }
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
.tag-close {
    margin-left: 4px;
    padding: 2px 3px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0);
    transition: border 0.2s;

    &:hover {
        border: 1px solid #fff;
    }
}
@keyframes spredModify {
    0% {
        width: 0;
        opacity: 0;
    }

    30% {
        opacity: 0;
    }

    100% {
        width: 550px;
        opacity: 1;
    }
}
</style>
