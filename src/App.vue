<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue';
import useCurrentInstance from './utils/useCurrentInstance';
import { setSharedColor, setupMainThemes, setupSecondaryThemes } from './hooks/setupThemes';
import { initUserDB, initCodeword, initUserTheme, initUserSetting } from './hooks/app';
import toupdate from './hooks/toupdate';

const { proxy } = useCurrentInstance();

// 初始化用户数据表
initUserDB();

// 初始化字数统计
initCodeword();

// 初始化用户主题（风格、配色、字体）
const theme = initUserTheme();

// 初始化用户设置（每日计划、趋势分析、查词引擎）
initUserSetting();

onMounted(() => {
  // 设置主题
  if (theme.defaultTheme.mode === 'dark') document.body.setAttribute('arco-theme', 'dark');
  setupMainThemes(theme.defaultTheme.mainColor);
  setupSecondaryThemes(theme.defaultTheme.secondColor);
  setSharedColor(theme.defaultTheme.mode);

  // 设置字体
  const element_app = document.getElementById('app');
  element_app!.setAttribute('style', `font-family:${theme.getSystemFont ?? '默认字体'};`);
  nextTick(() => {
    // 进软件执行一次检测更新
    toupdate(proxy, false);
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
