<template>
  <a-modal v-model:visible="visible" @ok="handleOk" @cancel="visible = false">
    <template #title>发现新版本</template>
    <div>发现新版本，是否开启下载更新？</div>
  </a-modal>
  <!-- <TitleBlock></TitleBlock> -->
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useMainStore } from './store';
import { db } from './db/db';
import { setSharedColor, setupMainThemes, setupSecondaryThemes } from './hooks/setupThemes';
// import bg from '../public/static/img/bg.png';
// import TitleBlock from './components/TitleBlock.vue';

import { ref, onMounted } from 'vue';
import axios from 'axios';
import useCurrentInstance from './utils/useCurrentInstance';
import config from '../package.json';

const mainStore = useMainStore();
const { proxy } = useCurrentInstance();
const $message = proxy.$message;
const visible = ref(false);
const upDateUrl = ref('');// 版本更新路径
const newVersion = ref(''); // 新版本版本号

// console.log(config.version);
// axios.get('https://inking-app-3g71u4uxff7c8113-1305098148.ap-shanghai.app.tcloudbase.com/test').then(res => {
//   console.log(res.data);
// })

// 初始化用户数据表
db.user.where(':id').between(1, Infinity).toArray().then(value => {
  if (value.length === 0) {
    addOneData();
  } else {
    const targetData = value[value.length - 1];
    const targetDay = targetData.creationDay,
      targetMonth = targetData.creationMonth,
      targetYear = targetData.creationYear;
    const currentDay = new Date().getDate(),
      currentMonth = new Date().getMonth() + 1,
      currentYear = new Date().getFullYear();
    if (currentDay !== targetDay || currentMonth !== targetMonth || currentYear !== targetYear) {
      // 需要增添一条新数据 
      addOneData();
    }
  }
  function addOneData() {
    db.user.add({
      creationTime: new Date().getTime(),
      creationYear: new Date().getFullYear(),
      creationMonth: new Date().getMonth() + 1,
      creationDay: new Date().getDate(),
      codewords: 0
    })
  }
}).then(() => {
  // 获取最新（最末尾）的数据表ID
  db.user.where(':id').between(1, Infinity).toArray().then(value => {
    mainStore.currentUserId = value[value.length - 1].id ?? 0;
    // 最多存储365天(条)的数据
    if (value.length > 365) {
      // 获取多出来那部分的主键id
      const tempId_Arr: Array<any> = value.map(item => item.id).slice(0, value.length - 365);
      db.user.bulkDelete(tempId_Arr);
    }
  }).then(() => {
    db.user.get(mainStore.currentUserId).then(value => {
      mainStore.baseTotalNumber_today = value?.codewords ?? 0;
    })
  })
})

// 初始化字数统计
let cout_temp = 0;
db.opus.where(':id').between(1, Infinity).toArray().then(value => {
  value.forEach(opus => {
    cout_temp += opus.opusNumber;
  })
}).then(() => {
  mainStore.contrastTotalNumber_thisTime = mainStore.TotalNumber_thisTime = mainStore.baseTotalNumber_thisTime = cout_temp;
})

// 获取用户设置数据 ----------- 主题
let defaultTheme = {
  mode: 'light',
  mainColor: 'RGB(0,191,166)',
  secondColor: 'RGB(0,176,255)'
}
const getUserTheme = localStorage.getItem('uTheme');
if (getUserTheme === null) localStorage.setItem('uTheme', JSON.stringify(defaultTheme));
else defaultTheme = JSON.parse(getUserTheme);

// 获取用户设置数据 ----------- 系统字体
const getSystemFont = localStorage.getItem('uSystemFont');

// 获取用户设置数据 ----------- 每日计划
const getDailyPlan = localStorage.getItem('uDailyPlan');
if (getDailyPlan === null) {
  localStorage.setItem('uDailyPlan', '2000'); // 默认2000字
} else {
  mainStore.dailyPlan = getDailyPlan;
}

// 获取用户设置数据 ----------- 查词引擎
const getSearchEngine = localStorage.getItem('uSearchEngine');
if (getSearchEngine === null) {
  localStorage.setItem('uSearchEngine', 'wordSearch_baidu'); // 默认百度汉语
} else {
  mainStore.searchEngine = getSearchEngine;
}

// 确认更新
const handleOk = () => {
  window.$API.ipcSend('checkForUpdate', upDateUrl.value + '/' + newVersion.value);
  window.$API.ipcOn('get-updateMsg', (data: { msg: number, data: any }) => {
    switch (data.msg) {
      case -1:
        $message.error('网络连接问题');
        break;
      case 0:
        $message.error('更新出现错误');
        break;
      case 1:
        $message.error('开始检查更新');
        break;
      case 2:
        console.log('发现更新');
        break;
      case 3:
        $message.error('没有发现更新');
        break;
      case 4:
        console.log(data.data.percent.toFixed(1));
        break;
      case 5:
        console.log('下载完成');
        break;
    }
  })
}

onMounted(() => {
  // 设置主题
  if (defaultTheme.mode === 'dark') document.body.setAttribute('arco-theme', 'dark');
  setupMainThemes(defaultTheme.mainColor);
  setupSecondaryThemes(defaultTheme.secondColor);
  setSharedColor(defaultTheme.mode);

  // 设置字体
  const element_app = document.getElementById('app');
  element_app!.setAttribute('style', `font-family:${getSystemFont ?? '默认字体'};`);

  // 自动检测更新
  axios.get('http://localhost:8888/update').then(res => {
    if (res.data.version !== config.version) {
      // 发现新版本
      visible.value = true;
      upDateUrl.value = res.data.upDateUrl;
      newVersion.value = res.data.version;
    }
  })
})
</script>

<style>
#app {
  position: relative;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-text-1);
}
</style>
