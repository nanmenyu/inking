<template>
  <div id="app-bg">
    <!-- <img :src="defaultBg" /> -->
  </div>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useMainStore } from './store/index';
import { db } from './db/db';
import { setSharedColor, setupMainThemes, setupSecondaryThemes } from './hooks/setupThemes';
import defaultBg from '../public/static/img/default-bg.jpg';
import { onMounted } from 'vue';
// import axios from 'axios';

const mainStore = useMainStore();

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

// 初始化主题
let defaultTheme = {
  mode: 'light',
  mainColor: 'RGB(12,171,168)',
  secondColor: 'RGB(83,133,253)'
}
const getUserTheme = localStorage.getItem('uTheme');
if (getUserTheme === null) localStorage.setItem('uTheme', JSON.stringify(defaultTheme));
else defaultTheme = JSON.parse(getUserTheme);

onMounted(() => {
  if (defaultTheme.mode === 'dark') document.body.setAttribute('arco-theme', 'dark');
  setupMainThemes(defaultTheme.mainColor);
  setupSecondaryThemes(defaultTheme.secondColor);
  setSharedColor(defaultTheme.mode);
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
