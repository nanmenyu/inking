import { defineStore } from 'pinia';

export const useMainStore = defineStore('mainStore', {
    state: () => ({
        needSaveDocData: false,
        isHighlightCount: false,
        highlightCount: 0
    }),
    getters: {

    },
    // optional actions
    actions: {
    },
})