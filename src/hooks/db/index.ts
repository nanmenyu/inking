import { db } from '../../db/db';
import { useMainStore } from '../../store/index';

/**
 * 保存今日码字数
 */
export function saveTodaysCodewords(cb?: Function) {
    const mainStore = useMainStore();
    db.user.where(':id').equals(mainStore.currentUserId).modify(item => {
        item.cWords = item.cWords + mainStore.TotalNumber_thisTime - mainStore.contrastTotalNumber_thisTime;
    }).then(() => {
        if (typeof cb === 'function') cb();
    })
}