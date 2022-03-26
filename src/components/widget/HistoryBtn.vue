<!-- 路由前进后退工具 -->
<template>
    <a-space style="height: 100%;">
        <a-button @click="back" :disabled="backDisable" type="text" shape="circle">
            <icon-arrow-left />
        </a-button>
        <h3 style="color: #4e5969;" title="返回主页">
            <router-link to="/">INKING</router-link>
        </h3>
        <a-button @click="forward" :disabled="forwardDisable" type="text" shape="circle">
            <icon-arrow-right />
        </a-button>
    </a-space>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
    IconArrowLeft,
    IconArrowRight
} from '@arco-design/web-vue/es/icon';
import router from '../../router/index';

/*----控制页面的前进后退----*/
const backDisable = ref(false),
    forwardDisable = ref(false);
const back = () => {
    router.go(-1);
}
const forward = () => {
    router.go(1)
}

onMounted(() => {
    if (window.history.state.back === null) backDisable.value = true;
    if (window.history.state.forward === null) forwardDisable.value = true;
})

</script>

<style scoped>
</style>