import { db } from '../../db/db';
import { useMainStore } from '../../store';

interface Theme {
    defaultTheme: { mode: string, mainColor: string, secondColor: string },
    getSystemFont: string | null
}

/**
 * 初始化用户数据表
 */
export function initUserDB(): void {
    const mainStore = useMainStore();

    db.user.where(':id').between(1, Infinity).toArray().then(value => {
        if (value.length === 0) {
            // 首次打开软件,初始化2年的数据
            addLongData(2, () => {
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

            // id从1开始，0说明已有的数据无法对应
            if (mainStore.currentUserId === 0) {
                // 再来一年(目前共三年数据)
                addLongData(1, () => {
                    // 删除第一年的数据(回到两年的数据状态)
                    const tempId_Arr: Array<any> = value.map(item => item.id).slice(0, 365);
                    db.user.bulkDelete(tempId_Arr);
                })
            }
        })
    }

    // 生成从当天开始往后years年的数据
    function addLongData(years: number, cb: Function): void {
        const currentTime = new Date().getTime();
        const userData: Array<User> = [];
        for (let i = 0; i < 365 * years; i++) {
            userData.push({
                cTime: currentTime + i * 86400000 as unknown as Date,
                cWords: 0
            })
        }
        db.user.bulkAdd(userData).then(cb());
    }
}

/**
 * 初始化字数统计
 */
export async function initCodeword(): Promise<void> {
    const mainStore = useMainStore();
    let cout_temp = 0;

    await db.opus.where(':id').between(1, Infinity).toArray().then(value => {
        value.forEach(opus => {
            cout_temp += opus.opusNumber;
        })
    }).then(() => {
        mainStore.contrastTotalNumber_thisTime = mainStore.TotalNumber_thisTime = mainStore.baseTotalNumber_thisTime = cout_temp;
        mainStore.firstEntry = true;
    })
}

/**
 * 初始化用户默认主题
 */
export function initUserTheme(): Theme {
    let defaultTheme = {
        mode: 'light',
        mainColor: 'RGB(0,191,166)',
        secondColor: 'RGB(0,176,255)'
    }
    const getUserTheme = localStorage.getItem('uTheme');
    if (getUserTheme === null) {
        localStorage.setItem('uTheme', JSON.stringify(defaultTheme));
    } else {
        defaultTheme = JSON.parse(getUserTheme);
    }

    // 获取用户设置数据 ----------- 系统字体
    const getSystemFont = localStorage.getItem('uSystemFont');

    return {
        defaultTheme,
        getSystemFont
    }
}

/**
 * 初始化用户设置项
 */
export function initUserSetting(): void {
    const mainStore = useMainStore();

    // 获取用户设置数据 ----------- 每日计划
    const getDailyPlan = localStorage.getItem('uDailyPlan');
    if (getDailyPlan === null) {
        localStorage.setItem('uDailyPlan', '2000'); // 默认2000字
    } else {
        mainStore.dailyPlan = parseInt(getDailyPlan);
    }

    // 获取用户设置数据 ----------- 趋势分析每页显示数
    const getNumPerpage = localStorage.getItem('uNumPerpage');
    if (getNumPerpage === null) {
        localStorage.setItem('uNumPerpage', '10'); // 默认10条/页
    } else {
        mainStore.numPerpage = parseInt(getNumPerpage);
    }

    // 获取用户设置数据 ----------- 查词引擎
    const getSearchEngine = localStorage.getItem('uSearchEngine');
    if (getSearchEngine === null) {
        localStorage.setItem('uSearchEngine', 'wordSearch_baidu'); // 默认百度汉语
    } else {
        mainStore.searchEngine = getSearchEngine;
    }

    // 获取用户设置数据 ----------- 备份文件路径
    const getBackupPath = localStorage.getItem('uBackupPath');
    if (getBackupPath === null) {
        window.$API.ipcSend('getBackupPath');
        window.$API.ipcOnce('backupPath', (path: string) => {
            localStorage.setItem('uBackupPath', path);
            mainStore.backupPath = path;
        })
    } else {
        mainStore.backupPath = getBackupPath;
    }
}