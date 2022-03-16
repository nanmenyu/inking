<template>
    <TitleBlock></TitleBlock>
    <SidebarLeft></SidebarLeft>
    <!-- <LabelTop></LabelTop> -->
    <RecycleContent></RecycleContent>
    <!-- 主题按钮 -->
    <div class="theme" title="更换主题">
        <a-trigger trigger="click" :popup-translate="[-130, -10]">
            <a-button class="btn" type="primary">
                <template #icon>
                    <icon-skin />
                </template>
            </a-button>
            <template #content>
                <ThemeContainer></ThemeContainer>
            </template>
        </a-trigger>
    </div>
</template>

<script setup lang="ts">
import TitleBlock from '../components/TitleBlock.vue';
import SidebarLeft from '../components/SidebarLeft.vue';
// import LabelTop from '../components/LabelTop.vue';
import RecycleContent from '../components/RecycleContent.vue';
import ThemeContainer from '../components/widget/ThemeContainer.vue';
import { IconSkin } from "@arco-design/web-vue/es/icon";
</script>

<style lang="scss" scoped>
.theme {
    @include theme;
}
</style>