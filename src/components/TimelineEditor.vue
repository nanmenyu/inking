<!-- 时间线编辑模块 -->
<template>
    <PopupMenu
        v-if="isAddEvent"
        title="添加历史事件"
        determine="添加"
        @toModify="modify"
        @toDetermine="addHistoryEvent"
    >
        <a-tabs type="text" @change="chocieTab" :default-active-key="curTabType">
            <a-tab-pane key="eveYear" title="年事件"></a-tab-pane>
            <a-tab-pane key="eveMonth" title="*月事件"></a-tab-pane>
            <a-tab-pane key="eveDay" title="*日事件"></a-tab-pane>
        </a-tabs>
        <div class="tab-content">
            <a-form :model="formData" layout="inline">
                <a-form-item v-if="curTabType === 'eveYear'" field="year" label="选择何年">
                    <a-input-number
                        :default-value="currentYear"
                        @change="confirmPosition"
                        :min="timeLine.min"
                        :max="timeLine.max"
                        size="samll"
                        style="width: 100px;"
                    />
                </a-form-item>
                <a-form-item
                    v-if="curTabType === 'eveMonth' || curTabType === 'eveDay'"
                    field="month"
                    label="选择何月"
                >
                    <a-input-number
                        v-model="formData.month"
                        :min="-999"
                        :max="999"
                        size="samll"
                        style="width: 100px;"
                    />
                </a-form-item>
                <a-form-item v-if="curTabType === 'eveDay'" field="day" label="选择何日">
                    <a-input-number
                        v-model="formData.day"
                        :min="-999"
                        :max="999"
                        size="samll"
                        style="width: 100px;"
                    />
                </a-form-item>
                <a-form-item field="event" label="事件名称">
                    <a-input
                        v-model="formData.event"
                        :max-length="15"
                        placeholder="请填写事件名"
                        size="samll"
                        style="width: 200px;"
                        allow-clear
                    />
                </a-form-item>
                <a-form-item field="eventdesc" label="事件描述">
                    <a-textarea
                        v-model="formData.eventdesc"
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
    </PopupMenu>
    <div class="timeline">
        <div class="timeline__block">
            <div class="slider-box" ref="sliderBox">
                <div class="slider-lable">
                    <a-progress type="circle" size="mini" status="normal" :percent="percentYear" />
                    {{ timeLine.name }}:&nbsp;{{ currentYear }}年
                </div>
                <div @mousemove.stop class="slider-tools">
                    <a-space size="mini">
                        <a-button @click="isAddEvent = true" type="text" size="mini" title="添加历史事件">
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
            <div class="slider-detail">
                <a-typography v-for="item  in currentDetail.data" :key="item.id">
                    <a-typography-title :heading="5">{{ item.title }}</a-typography-title>
                    <a-typography-title
                        :heading="6"
                    >{{ (item.month === null ? '' : item.month + '月') + ' ' + (item.day === null ? '' : item.day + '日') }}</a-typography-title>
                    <a-typography-paragraph style="text-indent: 2em;">{{ item.desc }}</a-typography-paragraph>
                </a-typography>
            </div>
            <div class="slider-setting">
                <div class="setting-item">
                    <a-result :status="null" title="添加时间线">
                        <template #extra>
                            <a-button @click="addTimeLine" type="primary" size="small">
                                <template #icon>
                                    <icon-plus />
                                </template>添加
                            </a-button>
                        </template>
                    </a-result>
                </div>
                <div class="setting-item">
                    <a-result :status="null" title="切换时间线">
                        <template #extra>
                            <a-dropdown
                                @popup-visible-change="isRotate = !isRotate"
                                @select="changeTimeLine"
                            >
                                <a-button type="primary" size="small">
                                    <template #icon>
                                        <icon-down :class="isRotate ? 'rotate' : '_rotate'" />
                                    </template>切换
                                </a-button>
                                <template #content>
                                    <a-doption>默认线</a-doption>
                                    <a-doption>xxx线</a-doption>
                                </template>
                            </a-dropdown>
                        </template>
                    </a-result>
                </div>
            </div>
        </div>
        <section @scroll="sectionScroll" ref="timelineSection" class="timeline__section">
            <div class="timeline__nav">
                <ul :style="`transform: translateY(${timelineUl_tran})`" ref="timelineUl">
                    <li v-for="(item, i) in yearData.data" :key="item.id" :id="'nav_' + i">
                        <a
                            @click.prevent="toAnchor('con_' + i)"
                            :class="checkedId === ('con_' + i) ? 'active' : ''"
                            :href="'#' + i"
                            :title="item.timeSlot.toString()"
                        >{{ timeSlot_format(item.timeSlot) }}</a>
                    </li>
                </ul>
            </div>
            <div class="wrapper" ref="wrapper">
                <a-empty v-if="yearData.data.length === 0" style="margin-top: 100px;">点击时间轴右上角添加历史事件</a-empty>
                <a-timeline v-else>
                    <a-timeline-item
                        v-for="(item, i) in yearData.data"
                        :key="item.id"
                        :id="'con_' + i"
                        @click="choiceOneYear(item.timeSlot)"
                        :style="currentDetail.curYear === item.timeSlot ? 'background-color: #f2f3f5;' : ''"
                        class="timeline-item"
                        title="点击查看详情"
                    >
                        <h2>
                            {{ item.timeSlot }}
                            <span style="font-size: 16px;">{{ item.title }}</span>
                            <span
                                style="float: right;margin: 9px 8px 0 0;font-size: 12px;color: #bfc1c3;"
                            >总事件数:{{ item.totalNum }}</span>
                        </h2>
                        <p style="text-indent: 2em;">{{ item.desc }}</p>
                    </a-timeline-item>
                </a-timeline>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, Ref, onMounted, computed, nextTick } from 'vue';
import {
    IconPlus, IconDown, IconPlusCircle, IconLocation,
    IconZoomIn, IconZoomOut, IconToLeft, IconToRight
} from '@arco-design/web-vue/es/icon';
import PopupMenu from './widget/PopupMenu.vue';
import { throttle } from '../utils/flowControl';
import '../style/fine-tune-timeLine.scss';// 局部组件库样式微调
import { db } from '../db/db';
import { v4 } from 'uuid';
import { useRoute } from 'vue-router';
import useCurrentInstance from '../utils/useCurrentInstance';

const { proxy } = useCurrentInstance();
const route = useRoute();
const query_id = parseInt(<string>route.query.id);
const theTimeLineData: { data: Array<TimeLineGroup> } = reactive({ data: [] });

const yearData: {
    data:
    Array<{ id: string, timeSlot: number, title: string, desc: string, totalNum: number }>
} = reactive({ data: [] });
const timeLine = reactive({ tid: '', min: -5000, max: 5000, name: '默认线' });
// 当前年份
const currentYear = ref(new Date().getFullYear());
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

const offsetTop_el: { data: Array<{ id: string, offsetTop: number }> } = reactive({ data: [] });
const slider = ref(), sliderBox = ref();
onMounted(() => {
    getTimeLineData();
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
const checkedId = ref('con_0'), wrapper: Ref<HTMLElement | undefined> = ref();
const toAnchor = (id: string) => {
    if (wrapper.value!.clientHeight > timelineSection.value!.clientHeight) {
        checkedId.value = id;
        const targetAnchor = document.getElementById(id);
        if (targetAnchor) targetAnchor.scrollIntoView({ behavior: "smooth" });
        toNavCenter();
    }
}

// 内容滚动标记当前元素
const timelineSection: Ref<HTMLElement | undefined> = ref();
const sectionScroll = throttle(() => {
    const curScrollTop: number | undefined = timelineSection.value?.scrollTop;
    if (curScrollTop === 0) checkedId.value = 'con_0';
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
    } else {
        currentYear.value = value;
        setSliderState();
    }
}

// 添加历史事件
const isAddEvent = ref(false);
// 选择标签页
const curTabType: Ref<'eveYear' | 'eveMonth' | 'eveDay'> = ref('eveYear');
const formData = reactive({
    month: 1,
    day: 1,
    event: '',
    eventdesc: ''
});
const chocieTab = (type: 'eveYear' | 'eveMonth' | 'eveDay') => {
    curTabType.value = type;
}
const addHistoryEvent = () => {
    db.opus.where(':id').equals(query_id).modify(item => {
        for (let i in item.theTimeLine) {
            if (item.theTimeLine[i].tid === timeLine.tid) {
                if (curTabType.value === 'eveYear') {
                    item.theTimeLine[i][curTabType.value].push({
                        yid: v4(),
                        timeSlot: currentYear.value,
                        data: { title: formData.event, desc: formData.eventdesc }
                    })
                } else if (curTabType.value === 'eveMonth') {
                    item.theTimeLine[i][curTabType.value].push({
                        mid: v4(),
                        yearSlot: currentYear.value,
                        timeSlot: formData.month,
                        data: { title: formData.event, desc: formData.eventdesc }
                    })
                } else if (curTabType.value === 'eveDay') {
                    item.theTimeLine[i][curTabType.value].push({
                        did: v4(),
                        yearSlot: currentYear.value,
                        monthSlot: formData.month,
                        timeSlot: formData.day,
                        data: { title: formData.event, desc: formData.eventdesc }
                    })
                }
                break;
            }
        }
    }).then(() => {
        isAddEvent.value = false;
        getTimeLineData();
    })
}
// 添加新时间线
const addTimeLine = () => {
    console.log('添加新时间线');
}
// 切换时间线
const changeTimeLine = (value: string) => {
    console.log('切换时间线:', value);
}
// 旋转图标
const isRotate = ref(false);
// 取消弹框
const modify = () => {
    isPosition.value = false;
    isAddEvent.value = false;
}

// 选择某一年渲染详情页
interface Detail {
    id: string; month: number | null; day: number | null; title: string; desc: string
}
const currentDetail: {
    curYear: number,
    data: Array<Detail>
} = reactive({ curYear: 2022, data: [] });
const choiceOneYear = (year: number) => {
    if (summaryObj.data[year] !== undefined) {
        currentDetail.curYear = year;
        // 排序月份后再排序日份
        summaryObj.data[year].sort((a, b) => {
            if (a.month !== b.month) return (a.month || 0) - (b.month || 0);
            else if (a.day !== b.day) return (a.day || 0) - (b.day || 0);
            return 0;
        })
        currentDetail.data = summaryObj.data[year];
    }
}
// 获取数据
const defaultPos = ref(0);
let summaryObj: {
    data: { [key: number]: Array<Detail> }
} = reactive({ data: {} });
function getTimeLineData() {
    db.opus.get(query_id)
        .then(value => {
            if (value) {
                theTimeLineData.data = value.theTimeLine;
                // 设置基本数据
                timeLine.tid = theTimeLineData.data[defaultPos.value].tid;
                timeLine.max = theTimeLineData.data[defaultPos.value].max;
                timeLine.min = theTimeLineData.data[defaultPos.value].min;
                timeLine.name = theTimeLineData.data[defaultPos.value].name;
                // 将每个年份的事件全部集合起来 key为年份
                summaryObj.data = {}; // 清空
                theTimeLineData.data[defaultPos.value].eveYear.forEach(item => {
                    if (summaryObj.data[item.timeSlot] === undefined) summaryObj.data[item.timeSlot] = [];
                    summaryObj.data[item.timeSlot].push({
                        id: item.yid,
                        month: null,
                        day: null,
                        title: item.data.title,
                        desc: item.data.desc
                    })
                })
                theTimeLineData.data[defaultPos.value].eveMonth.forEach(item => {
                    if (summaryObj.data[item.yearSlot] === undefined) summaryObj.data[item.yearSlot] = [];
                    summaryObj.data[item.yearSlot].push({
                        id: item.mid,
                        month: item.timeSlot,
                        day: null,
                        title: item.data.title,
                        desc: item.data.desc
                    })
                })
                theTimeLineData.data[defaultPos.value].eveDay.forEach(item => {
                    if (summaryObj.data[item.yearSlot] === undefined) summaryObj.data[item.yearSlot] = [];
                    summaryObj.data[item.yearSlot].push({
                        id: item.did,
                        month: item.monthSlot,
                        day: item.timeSlot,
                        title: item.data.title,
                        desc: item.data.desc
                    })
                })
                yearData.data = []; // 先清空后push
                for (let i in summaryObj.data) {
                    yearData.data.push({
                        id: summaryObj.data[i][0].id,
                        timeSlot: parseInt(i),
                        title: summaryObj.data[i][0].title,
                        desc: summaryObj.data[i][0].desc,
                        totalNum: summaryObj.data[i].length
                    })
                }
                // 升序排序
                yearData.data.sort((a, b) => a.timeSlot - b.timeSlot);
                choiceOneYear(yearData.data[0].timeSlot);
                nextTick(() => {
                    calculateOffsetTop();
                })
            }
        })
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
    offsetTop_el.data = yearData.data.map((_, index) => {
        targetElement = document.getElementById('con_' + index)!;
        return {
            id: 'con_' + index,
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
// 滑动时间轴
function slidingTimeline(e: MouseEvent) {
    const x = e.pageX - slider.value.offsetLeft;
    sliderBox.value.onmousemove = fn;
    document.onmouseup = function () {
        if (sliderBox.value.onmousemove) sliderBox.value.onmousemove = null;
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

<style src="../style/timelineeditor.scss" lang="scss" scoped>
</style>
