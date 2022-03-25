import { db } from '../../db/db';
import { useMainStore } from '../../store/index';
const mainStore = useMainStore();

// 保存今日码字数
export function saveTodaysCodewords(cb?: Function) {
    db.user.where(':id').equals(mainStore.currentUserId).modify(item => {
        item.cWords = item.cWords + mainStore.TotalNumber_thisTime - mainStore.contrastTotalNumber_thisTime;
    }).then(() => {
        if (typeof cb === 'function') cb();
    })
}