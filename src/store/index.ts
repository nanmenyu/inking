import { defineStore } from 'pinia';
// import { setHighlightKeyword } from '../common/editor/syntax';

export const useMainStore = defineStore('mainStore', {
    state: () => ({
        needSaveDocData: false, // 是否需要保存当前内容
        isHighlightCount: false, // 高亮记数触发器
        isInSearch: false, // 是否处在搜索状态
        highlightCount: 0, // 检索到的关键字总数
        targetIndex: 1, // 当前检索指向的关键字
        keywordArr: [], //当前的关键字数组
        KeywordEditorChange: false // 关键字页数据是否发生更新
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
        }
    },
})