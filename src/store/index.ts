import { defineStore } from 'pinia';
// import { setHighlightKeyword } from '../common/editor/syntax';

export const useMainStore = defineStore('mainStore', {
    state: () => ({
        currentUserId: 0, //当前对应用户表的ID 
        // needSaveDocData: false, // 是否需要保存当前内容
        isHighlightCount: false, // 高亮记数触发器
        isInSearch: false, // 是否处在搜索状态
        highlightCount: 0, // 检索到的关键字总数
        targetIndex: 1, // 当前检索指向的关键字
        keywordArr: [], //当前的关键字数组
        KeywordEditorChange: false, // 关键字页数据是否发生更新
        baseTotalNumber_thisTime: 0, // 打开软件时的基准总字数（从打开程序——>关闭软件）
        contrastTotalNumber_thisTime: 0, // 计算净增长值的中间值
        TotalNumber_thisTime: 0, // 改变后的总字数
        // isCodewords: false // 是否需要显示本次码字数量
    }),
    getters: {
    },
    // optional actions
    actions: {
        updateTargetIndex(offset: number) {
            let temp = this.targetIndex;
            temp += offset;
            if (temp < 1) {
                this.targetIndex = 1;
            } else if (temp > this.highlightCount) {
                this.targetIndex = this.highlightCount;
            } else {
                this.targetIndex = temp;
            }
        },
        // 保存本次码字数
        // updateCodewords_thisTime() {
        //     let temp = this.codewords_thisTime + this.codewords;
        //     if (temp < 0) {
        //         this.codewords_thisTime = 0;
        //     } else {
        //         this.codewords_thisTime = temp;
        //     }
        // }
    },
})