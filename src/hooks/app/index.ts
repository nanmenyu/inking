import { db } from '../../db/db';
import { useMainStore } from '../../store';

// 初始化用户数据表
export function initUserDB(): void {
    const mainStore = useMainStore();

    db.user.where(':id').between(1, Infinity).toArray().then(value => {
        if (value.length === 0) {
            // 首次打开软件
            addLongData(() => {
                initCurUserData();
            });
        } else {
            initCurUserData();
        }
    })

    // 获取当天的数据库id和初始化数据
    function initCurUserData(): void {
        // 获取当前日期对应的数据ID
        db.user.where(':id').between(1, Infinity).toArray().then(value => {
            const currentTime = new Date().getTime();
            const len = value.length;
            for (let i = 0; i < len; i++) {
                // 时间戳对应同一天
                if (new Date(currentTime).toDateString() === new Date(value[i].cTime).toDateString()) {
                    mainStore.currentUserId = value[i].id ?? 0;
                    mainStore.baseTotalNumber_today = value[i].cWords ?? 0;
                    break;
                }
            }

            // id从1开始，0说明十年的数据无法对应
            if (mainStore.currentUserId === 0) {
                // 再来10年
                addLongData(() => {
                    // 删除旧10年的数据
                    const tempId_Arr: Array<any> = value.map(item => item.id).slice(0, value.length - len);
                    db.user.bulkDelete(tempId_Arr);
                })
            }
        })
    }

    // 初始化10年的数据占位(约1.5MB)
    function addLongData(cb: Function): void {
        const currentTime = new Date().getTime();
        const userData: Array<User> = [];
        for (let i = 0; i < 3650; i++) {
            userData.push({
                cTime: currentTime + i * 86400000 as unknown as Date,
                cWords: 0
            })
        }
        db.user.bulkAdd(userData).then(cb());
    }
}