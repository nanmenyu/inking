<!-- 时间线编辑模块 -->
<template>
    <PopupMenu
        v-if="isAddEvent"
        title="添加历史事件"
        determine="添加"
        @toModify="modify"
        @toDetermine="addHistoryEvent"
        :determineDisabled="addEventDisabled"
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
                        :min="1"
                        :max="999"
                        size="samll"
                        style="width: 100px;"
                    />
                </a-form-item>
                <a-form-item v-if="curTabType === 'eveDay'" field="day" label="选择何日">
                    <a-input-number
                        v-model="formData.day"
                        :min="1"
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
                        show-word-limit
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
    <PopupMenu
        v-if="isTimeLineSetting"
        :title="isToAdd ? '添加时间线' : '时间线设置'"
        :determine="isToAdd ? '添加' : '设置'"
        @toModify="modify"
        @toDetermine="TimeLineSetting"
        :determineDisabled="formLine.name.length === 0 ||
        formLine.min === 0 || !formLine.min || formLine.max === 0 || !formLine.max"
    >
        <a-form :model="formLine" layout="inline">
            <a-form-item field="name" label="名称">
                <a-input
                    v-model="formLine.name"
                    :max-length="10"
                    style=" width: 100px"
                    placeholder="时间线名称"
                    allow-clear
                />
            </a-form-item>
            <a-form-item field="name" label="Min">
                <a-input-number
                    v-model="formLine.min"
                    style=" width: 100px"
                    placeholder="年份范围"
                    :min="-99999"
                    :max="isToAdd ? formLine.max - 100 : Math.min.apply(Math, yearData.data.map(it => it.timeSlot))"
                />
            </a-form-item>
            <a-form-item field="name" label="Max">
                <a-input-number
                    v-model="formLine.max"
                    style=" width: 100px"
                    placeholder="年份范围"
                    :min="isToAdd ? formLine.min + 100 : Math.max.apply(Math, yearData.data.map(it => it.timeSlot))"
                    :max="99999"
                />
            </a-form-item>
        </a-form>
    </PopupMenu>
    <PopupMenu
        v-if="isEditDetail"
        title="修改详情"
        determine="修改"
        @toModify="modify"
        @toDetermine="deteEditDetail"
    >
        <a-form :model="formDetail" layout="vertical" style="overflow: hidden;">
            <a-form-item field="event" label="事件名称">
                <a-input
                    v-model="formDetail.title"
                    :max-length="15"
                    allow-clear
                    placeholder="请修改事件名"
                />
            </a-form-item>
            <a-form-item field="eventdesc" label="事件描述">
                <a-textarea
                    v-model="formDetail.content"
                    placeholder="修改事件的相关描述"
                    :auto-size="{
                        minRows: 5,
                        maxRows: 5
                    }"
                    :max-length="500"
                    show-word-limit
                    allow-clear
                />
            </a-form-item>
        </a-form>
    </PopupMenu>
    <div class="timeline">
        <section @scroll="sectionScroll" ref="timelineSection" class="timeline__section">
            <div class="wrapper" ref="wrapper">
                <a-empty v-if="yearData.data.length === 0" style="margin-top: 100px;">点击时间轴右上角添加历史事件</a-empty>
                <a-timeline v-else>
                    <!-- 这里必须用i做key，不然左边时间轴无法再切换时完全刷新 -->
                    <a-timeline-item
                        v-for="(item, i) in yearData.data"
                        :key="i"
                        @click="choiceOneYear(item.timeSlot)"
                        title="点击查看详情"
                    >
                        <template #dot>
                            <IconClockCircle
                                :style="{ fontSize: '12px', color: ' rgb(var(--my-secondary-6))' }"
                            />
                        </template>
                        <div
                            :class="currentDetail.curYear === item.timeSlot ? 'timeline-item checked' : 'timeline-item'"
                        >
                            <h2>
                                {{ item.timeSlot + '年' }}&nbsp;&nbsp;
                                <span
                                    style="font-size: 16px;"
                                >{{ '🔖' + item.title }}</span>
                                <span
                                    style="float: right;margin: 9px 8px 0 0;font-size: 12px;color: #bfc1c3;user-select: none;"
                                >
                                    <span
                                        @click.stop="deleteOneYear(item.timeSlot)"
                                        class="tag-close"
                                        title="删除"
                                    >
                                        <icon-close />
                                    </span>
                                    总事件数:{{ item.totalNum }}
                                </span>
                            </h2>
                            <p style="text-indent: 2em;">{{ item.desc }}</p>
                        </div>
                    </a-timeline-item>
                </a-timeline>
            </div>
        </section>
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
                        <a-button @click="eventJump(-1)" type="text" size="mini" title="前一个事件">
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
                        <a-button @click="eventJump(1)" type="text" size="mini" title="后一个事件">
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
                            let eventNum = 0;
                            yearData.data.forEach(item => {
                                if (item.timeSlot === value) eventNum = item.totalNum;
                            })
                            if (value === 0) {
                                return '数学零点(无意义)';
                            } else if (eventNum > 0) {
                                return value + '年(' + eventNum + '个事件)';
                            } else {
                                return value + '年';
                            }
                        }"
                    />
                </div>
            </div>
            <div class="slider-detail">
                <a-empty v-if="currentDetail.data.length === 0"></a-empty>
                <a-card
                    v-else
                    v-for="item  in currentDetail.data"
                    :key="item.id"
                    hoverable
                    class="a-card"
                    :title="'✨' + item.title + '\u3000' + (item.month === null ? '' : item.month + '月') + '' + (item.day === null ? '' : item.day + '日')"
                >
                    <template #extra>
                        <a-popconfirm
                            @cancel="deleteDetail(item.id, item.month, item.day)"
                            @ok="editDetail(item.id, item.month, item.day)"
                            content="选择对应操作"
                            okText="修改"
                            cancelText="删除"
                            position="lt"
                        >
                            <a-link>Edit</a-link>
                        </a-popconfirm>
                    </template>
                    <a-typography-paragraph style="text-indent: 2em;">{{ item.desc }}</a-typography-paragraph>
                </a-card>
            </div>
            <div class="slider-setting">
                <a-space direction="vertical" size="large">
                    <a-tooltip content="时间线设置" mini position="left">
                        <a-button @click="showLineSetting('set')" type="primary" size="small">
                            <template #icon>
                                <icon-settings />
                            </template>设置
                        </a-button>
                    </a-tooltip>
                    <a-tooltip content="添加时间线" mini position="left">
                        <a-button @click="showLineSetting('add')" type="primary" size="small">
                            <template #icon>
                                <icon-plus />
                            </template>添加
                        </a-button>
                    </a-tooltip>

                    <a-tooltip content="删除时间线" mini position="left">
                        <a-button @click="deleteTimeLine" type="primary" size="small">
                            <template #icon>
                                <icon-delete />
                            </template>删除
                        </a-button>
                    </a-tooltip>
                    <a-dropdown @popup-visible-change="isRotate = !isRotate">
                        <a-button type="primary" size="small">
                            <template #icon>
                                <icon-down :class="isRotate ? 'rotate' : '_rotate'" />
                            </template>切换
                        </a-button>
                        <template #content>
                            <a-doption
                                v-for="(item, i) in theTimeLineData.data"
                                :key="item.tid"
                                :class="item.tid === timeLine.tid ? 'checked' : ''"
                                @click="changeTimeLine(i)"
                            >{{ item.name }}</a-doption>
                        </template>
                    </a-dropdown>
                </a-space>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, Ref, onMounted, computed, nextTick, watch, onBeforeUnmount } from 'vue';
import {
    IconPlus, IconDown, IconPlusCircle, IconLocation, IconSettings, IconClose,
    IconZoomIn, IconZoomOut, IconToLeft, IconToRight, IconDelete, IconClockCircle
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
// const timeline = ref();
const yearData: {
    data:
    Array<{ id: string, timeSlot: number, title: string, desc: string, totalNum: number }>
} = reactive({ data: [] });
const timeLine = reactive({ tid: '', min: -5000, max: 5000, name: '默认线' }),
    currentYear = ref(0); // 当前年份
let flag = true; // 控制当前年份第一次初始化

// 当前年份占总时间轴的长度比例
const percentYear = computed(() => {
    return (currentYear.value - timeLine.min) / (timeLine.max - timeLine.min);
})

// 时间轴和步长的缩放比例 // 时间轴的长度'px'
const scaleFactor = ref(1), sliderWidth = ref(0);
// 等分时间轴添加标度
const timeLineMarks = computed(() => {
    const stepObj: {
        [key: string]: string | number
    } = { [timeLine.min]: timeLine.min, [timeLine.max]: timeLine.max };
    if (timeLine.min < 0) stepObj[0] = 0;
    yearData.data.forEach(item => {
        stepObj[item.timeSlot] = '🔺';
    })
    return stepObj;
})

const offsetTop_el: { data: Array<{ id: string, offsetTop: number }> } = reactive({ data: [] });
const slider = ref(), sliderBox = ref();
// 裁切太长的数字以省略号表示
// const timeSlot_format = (timeSlot: number): number | string => {
//     return timeSlot > 99999 ? timeSlot.toString().slice(0, 5) + '...' : timeSlot;
// }
// 锚点跳转
const checkedId = ref('con_0'), wrapper: Ref<HTMLElement | undefined> = ref();
// const toAnchor = (id: string) => {
//     if (wrapper.value!.clientHeight > timelineSection.value!.clientHeight) {
//         checkedId.value = id;
//         const targetAnchor = document.getElementById(id);
//         if (targetAnchor) targetAnchor.scrollIntoView({ behavior: "smooth" });
//         // toNavCenter();
//     }
// }
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
    // toNavCenter();
}, 30);
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
    sliderWidth.value = Math.round(sliderBox.value.clientWidth * scaleFactor.value * 0.9);
    // 窗口大小改变时自动适应时间轴右侧
    window.addEventListener('resize', setSliderState)
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', setSliderState);
})
watch(currentYear, (value) => {
    for (let i in yearData.data) {
        if (yearData.data[i].timeSlot === value) {
            choiceOneYear(value);
            break;
        }
    }
})

/* ----------------------- 时间线工具栏-----------------------*/

// 控制时间轴长度缩放
const controlScaling = (type: string) => {
    // 最大25倍
    if (scaleFactor.value <= 25 && type === 'enlarge') {
        scaleFactor.value += 1;
    } else if (scaleFactor.value > 0.5 && type === 'reduce') {
        scaleFactor.value -= 0.5;
    }
    sliderWidth.value = Math.round(sliderBox.value.clientWidth * scaleFactor.value * 0.9);
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
    } else if (value > timeLine.max || value < timeLine.min) {
        proxy.$message.error('时间点越界!');
    } else {
        currentYear.value = value;
        setSliderState();
    }
}
// 前后事件跳转
const eventJump = (direction: -1 | 1) => {
    //  1:后一个事件  -1:前一个事件 
    if (direction === 1) {
        for (let i in yearData.data) {
            if (yearData.data[i].timeSlot > currentYear.value) {
                currentYear.value = yearData.data[i].timeSlot;
                break;
            }
        }
    } else if (direction === -1) {
        let len = yearData.data.length;
        for (let i = 0; i < len; i++) {
            if (yearData.data[len - i - 1].timeSlot < currentYear.value) {
                currentYear.value = yearData.data[len - i - 1].timeSlot;
                break;
            }
        }
    }
}
// 添加历史事件
const isAddEvent = ref(false);
const addEventDisabled = computed(() => {
    if (curTabType.value === 'eveYear'
        && (currentYear.value === 0 || !currentYear.value))
        return true;
    if (curTabType.value === 'eveMonth'
        && (currentYear.value === 0 || !currentYear.value || !formData.month))
        return true;
    if (curTabType.value === 'eveDay'
        && (currentYear.value === 0 || !currentYear.value || !formData.month || !formData.day))
        return true;
    return false;
})
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
    if (type === 'eveYear') formData.month = formData.day = 1;
    if (type === 'eveMonth') formData.day = 1;
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


/* ----------------------- 增删改时间线-----------------------*/
// 添加新时间线
const isTimeLineSetting = ref(false), isToAdd = ref(true);
const formLine: {
    name: string, min: number, max: number
} = reactive({ name: '', min: 1, max: 2022 });
// 呼出窗口
const showLineSetting = (type: 'set' | 'add') => {
    isTimeLineSetting.value = true;
    isToAdd.value = type === 'add' ? true : false;
    if (type === 'set') {
        [formLine.name, formLine.min, formLine.max] = [timeLine.name, timeLine.min, timeLine.max];
    } else {
        [formLine.name, formLine.min, formLine.max] = ['', 1, 2022];
    }
}
const TimeLineSetting = () => {
    if (isToAdd.value) {
        db.opus.where(':id').equals(query_id).modify(item => {
            item.theTimeLine.push({
                tid: v4(),
                name: formLine.name,
                max: formLine.max,
                min: formLine.min,
                eveYear: [],
                eveMonth: [],
                eveDay: []
            })
        }).then(() => {
            isTimeLineSetting.value = false;
            getTimeLineData();
            proxy.$message.success('添加新时间线成功！');
        })
    } else {
        db.opus.where(':id').equals(query_id).modify(item => {
            for (let i in item.theTimeLine) {
                if (item.theTimeLine[i].tid === timeLine.tid) {
                    [item.theTimeLine[i].name, item.theTimeLine[i].min, item.theTimeLine[i].max]
                        = [formLine.name, formLine.min, formLine.max];
                    break;
                }
            }
        }).then(() => {
            isTimeLineSetting.value = false;
            getTimeLineData();
            proxy.$message.success('时间线设置成功！');
        })
    }
}
// 删除时间线
const deleteTimeLine = () => {
    if (theTimeLineData.data.length > 1) {
        proxy.$modal.warning({
            title: "删除本条时间线",
            content: '是否删除本条时间线? 该操作不可逆!',
            simple: true,
            onOk: () => {
                db.opus.where(':id').equals(query_id).modify(item => {
                    for (let i in item.theTimeLine) {
                        if (item.theTimeLine[i].tid === timeLine.tid) {
                            item.theTimeLine.splice(parseInt(i), 1);
                            break;
                        }
                    }
                }).then(() => {
                    proxy.$message.success('删除成功！');
                    getTimeLineData();
                    changeTimeLine(0);
                })
            }
        })
    } else {
        proxy.$message.error('最后一条线无法删除！');
    }
}
// 切换时间线
const changeTimeLine = (index: number) => {
    defaultPos.value = index;
    currentDetail.data = [];
    getTimeLineData();
    setLineStorage();
}
// 删除某一历史点(全年)
const deleteOneYear = (year: number) => {
    proxy.$modal.warning({
        title: "删除历史事件",
        content: `是否删除“${year}年”的所有历史事件? 该操作不可逆!`,
        simple: true,
        onOk: () => {
            db.opus.where(':id').equals(query_id).modify(item => {
                for (let i in item.theTimeLine) {
                    if (item.theTimeLine[i].tid === timeLine.tid) {
                        item.theTimeLine[i].eveYear = item.theTimeLine[i].eveYear.filter(it => {
                            return it.timeSlot !== year;
                        })
                        item.theTimeLine[i].eveMonth = item.theTimeLine[i].eveMonth.filter(it => {
                            return it.yearSlot !== year;
                        })
                        item.theTimeLine[i].eveDay = item.theTimeLine[i].eveDay.filter(it => {
                            return it.yearSlot !== year;
                        })
                        break;
                    }
                }
            }).then(() => {
                proxy.$message.success('删除成功！');
                getTimeLineData();
            })
        }
    })
}


/* ----------------------- 删改右侧详情页 -----------------------*/
// 删除右侧详情项
const deleteDetail = (id: string, month: number | null, day: number | null) => {
    console.log(id, month, day);
    proxy.$modal.warning({
        title: "删除历史事件",
        content: '是否删除所选历史事件? 该操作不可逆!',
        simple: true,
        onOk: () => {
            db.opus.where(':id').equals(query_id).modify(item => {
                for (let i in item.theTimeLine) {
                    if (item.theTimeLine[i].tid === timeLine.tid) {
                        if (month && day) {
                            item.theTimeLine[i].eveDay = item.theTimeLine[i].eveDay.filter(it => {
                                return it.did !== id;
                            })
                        } else if (month) {
                            item.theTimeLine[i].eveMonth = item.theTimeLine[i].eveMonth.filter(it => {
                                return it.mid !== id;
                            })
                        } else {
                            item.theTimeLine[i].eveYear = item.theTimeLine[i].eveYear.filter(it => {
                                return it.yid !== id;
                            })
                        }
                        break;
                    }
                }
            }).then(() => {
                proxy.$message.success('删除成功！');
                getTimeLineData();
            })
        }
    })

}
// 修改右侧详情项
const isEditDetail = ref(false);
const formDetail = reactive({
    id: '',
    title: '',
    content: ''
})
let currentType = '';
const editDetail = (id: string, month: number | null, day: number | null) => {
    isEditDetail.value = true;
    currentDetail.data.forEach(item => {
        if (item.id === id)
            [formDetail.id, formDetail.title, formDetail.content] = [id, item.title, item.desc];
    })
    if (month && day) currentType = 'eveDay';
    else if (month) currentType = 'eveMonth';
    else currentType = 'eveYear';
}
//确认修改详情项
const deteEditDetail = () => {
    db.opus.where(':id').equals(query_id).modify(item => {
        for (let i in item.theTimeLine) {
            if (item.theTimeLine[i].tid === timeLine.tid) {
                item.theTimeLine[i][currentType].forEach((it: {
                    yid: string; mid: string; did: string; data: any;
                }) => {
                    if ((it.yid || it.mid || it.did) === formDetail.id) {
                        [it.data.title, it.data.desc] = [formDetail.title, formDetail.content];
                    }
                })
                break;
            }
        }
    }).then(() => {
        isEditDetail.value = false;
        proxy.$message.success('修改成功！');
        getTimeLineData();
    })
}

/* ----------------------- 其它 -----------------------*/
// 旋转图标
const isRotate = ref(false);
// 取消弹框
const modify = () => {
    isPosition.value = false;
    isAddEvent.value = false;
    isTimeLineSetting.value = false;
    isEditDetail.value = false;
}


/* ----------------------- 选择某一年并渲染详情页 -----------------------*/
interface Detail {
    id: string; month: number | null; day: number | null; title: string; desc: string
}
const currentDetail: {
    curYear: number,
    data: Array<Detail>
} = reactive({ curYear: timeLine.min, data: [] });
const currentChoice = ref(0);
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
        currentChoice.value = year;
        setLineStorage();
    }
}


/* ----------------------- 非触发事件 -----------------------*/
// 读取本地缓存
const defaultPos = ref(0);
const timeLineCache = localStorage.getItem('timeLineCache');
if (timeLineCache) {
    let temp = JSON.parse(timeLineCache);
    currentChoice.value = temp.selectYear;
    defaultPos.value = temp.selectLine;
}
// 获取数据
let summaryObj: {
    data: { [key: number]: Array<Detail> }
} = reactive({ data: {} });
function getTimeLineData() {
    db.opus.get(query_id).then(value => {
        if (value) {
            theTimeLineData.data = value.theTimeLine;
            if (!theTimeLineData.data[defaultPos.value]) defaultPos.value = 0;
            // 设置基本数据
            timeLine.tid = theTimeLineData.data[defaultPos.value].tid;
            timeLine.max = theTimeLineData.data[defaultPos.value].max;
            timeLine.min = theTimeLineData.data[defaultPos.value].min;
            timeLine.name = theTimeLineData.data[defaultPos.value].name;
            if (flag) { // 只执行一次的初始化操作
                currentYear.value = Math.round((timeLine.max + timeLine.min) / 2);
                flag = false;
            };
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
            choiceOneYear(currentChoice.value);
            setSliderState();
            // nextTick(() => {
            //     calculateOffsetTop();
            // })
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
// function calculateOffsetTop() {
//     let targetElement: HTMLElement;
//     offsetTop_el.data = yearData.data.map((_, index) => {
//         targetElement = document.getElementById('con_' + index)!;
//         return {
//             id: 'con_' + index,
//             offsetTop: targetElement.offsetTop
//         }
//     })
// }
// 计算nav中已checked元素高度
// const timelineUl: Ref<HTMLElement | undefined> = ref(),
//     timelineNav: Ref<HTMLElement | undefined> = ref();
// const timelineUl_tran: Ref<string> = ref('0px');
// function toNavCenter() {
//     const currentElement = document.getElementById(checkedId.value.replace('con_', 'nav_'));
//     if (currentElement && (timelineUl.value?.clientHeight! > timelineNav.value?.clientHeight!)) {
//         timelineUl_tran.value = -1 * currentElement.offsetTop + 'px';
//     }
// }
// 滑动时间轴
function slidingTimeline(e: MouseEvent) {
    const x = e.pageX - slider.value.offsetLeft;
    sliderBox.value.onmousemove = fn;
    document.onmouseup = function () {
        if (sliderBox.value && sliderBox.value.onmousemove) sliderBox.value.onmousemove = null;
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
// 缓存数据
function setLineStorage() {
    localStorage.setItem('timeLineCache', JSON.stringify({ selectYear: currentChoice.value, selectLine: defaultPos.value }));
}
defineExpose({ setSliderState });
</script>

<style src="../style/timelineeditor.scss" lang="scss" scoped>
</style>





