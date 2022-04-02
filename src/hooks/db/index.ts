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

/**
 * 更新作品总字数
 */
export function refreshOpusNumber(id: number, cb?: Function) {
    let totalNumber = 0;
    db.opus.get(id).then(value => {
        value?.data.forEach(item => {
            item.volume.forEach(it => {
                if (!item.discard && !it.discard) totalNumber += it.chapterNum ?? 0;
            })
        })
    }).then(() => {
        db.opus.update(id, { opusNumber: totalNumber }).then(() => {
            if (typeof cb === 'function') cb();
        })
    })
}