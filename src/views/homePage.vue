<!-- 主页 -->
<template>
    <TitleBlock></TitleBlock>
    <SidebarLeft></SidebarLeft>
    <LabelTop></LabelTop>
    <HomeContent></HomeContent>
</template>

<script setup lang="ts">
import TitleBlock from '../components/TitleBlock.vue';
import SidebarLeft from '../components/SidebarLeft.vue';
import HomeContent from '../components/HomeContent.vue';
import LabelTop from '../components/LabelTop.vue';
import { useRoute } from 'vue-router';
import useCurrentInstance from '../utils/useCurrentInstance';

/*----根据路由参数弹出提示信息----*/
const route = useRoute(), { proxy } = useCurrentInstance();
if (route.query.Message) {
    proxy.$message.success(route.query.Message);
}

</script>

<style scoped>
</style>