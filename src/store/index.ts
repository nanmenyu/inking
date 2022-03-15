import { defineStore } from 'pinia';

export const useMainStore = defineStore('mainStore', {
    state: () => ({
        currentUserId: 0, //当前对应用户表的ID 
        isHighlightCount: false, // 高亮记数触发器
        isInSearch: false, // 是否处在搜索状态
        highlightCount: 0, // 检索到的关键字总数
        targetIndex: 1, // 当前检索指向的关键字
        keywordArr: [], //当前的关键字数组
        baseTotalNumber_thisTime: 0, // 打开软件时的基准总字数（从打开程序——>关闭软件）
        contrastTotalNumber_thisTime: 0, // 计算净增长值的中间值
        TotalNumber_thisTime: 0, // 改变后的总字数
        baseTotalNumber_today: 0, //从数据库中拿取的今日码字数
        curSelectedText: '', //当前选中的文字
        keywordMarks: [], //当前的高亮标记目标
    }),
    getters: {
    },
    // optional actions
    actions: {
        updateTargetIndex(offset: number) {
            // 更新搜索状态下当前搜索词的索引
            let temp = this.targetIndex;
            temp += offset;
            if (temp < 1) {
                this.targetIndex = 1;
            } else if (temp > this.highlightCount) {
                this.targetIndex = this.highlightCount;
            } else {
                this.targetIndex = temp;
            }
        }
    },
})

export const useThemeStore = defineStore('themeStore', {
    state: () => ({
        theme: '', // 黑暗或亮色主题
        primary_6: '',
        color_text_1: '',
        my_secondary_6: ''
    })
})