<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useMainStore } from './store/index';
import { db } from './db/db';
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
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333333;
}
</style>
