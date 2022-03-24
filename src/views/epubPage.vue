<template>
    <TitleBlock></TitleBlock>
    <a-layout class="layout-content">
        <a-layout-sider collapsible breakpoint="xl">
            <div class="logo" />
            <a-menu
                :default-open-keys="['1']"
                :default-selected-keys="['0_3']"
                :style="{ width: '100%' }"
            >
                <a-sub-menu key="1">
                    <template #title>
                        <IconCalendar></IconCalendar>Navigation 1
                    </template>
                    <a-menu-item key="1_1">Menu 1</a-menu-item>
                    <a-menu-item key="1_2">Menu 2</a-menu-item>
                    <a-sub-menu key="2" title="Navigation 2">
                        <a-menu-item key="2_1">Menu 1</a-menu-item>
                        <a-menu-item key="2_2">Menu 2</a-menu-item>
                    </a-sub-menu>
                    <a-sub-menu key="3" title="Navigation 3">
                        <a-menu-item key="3_1">Menu 1</a-menu-item>
                        <a-menu-item key="3_2">Menu 2</a-menu-item>
                        <a-menu-item key="3_3">Menu 3</a-menu-item>
                    </a-sub-menu>
                </a-sub-menu>
                <a-sub-menu key="4">
                    <template #title>
                        <IconCalendar></IconCalendar>Navigation 4
                    </template>
                    <a-menu-item key="4_1">Menu 1</a-menu-item>
                    <a-menu-item key="4_2">Menu 2</a-menu-item>
                    <a-menu-item key="4_3">Menu 3</a-menu-item>
                </a-sub-menu>
            </a-menu>
            <!-- trigger -->
            <template #trigger="{ collapsed }">
                <IconCaretRight v-if="collapsed"></IconCaretRight>
                <IconCaretLeft v-else></IconCaretLeft>
            </template>
        </a-layout-sider>
        <a-layout>
            <div id="epub-container" ref="container"></div>
        </a-layout>
    </a-layout>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import {
    IconCaretRight, IconCaretLeft
} from '@arco-design/web-vue/es/icon';
import TitleBlock from '../components/TitleBlock.vue';
import { useRoute } from 'vue-router';
import { db } from '../db/db';
import ePub from 'epubjs';
import { onMounted } from 'vue';

// const themeStore = useThemeStore();
const route = useRoute(), query_id = parseInt(route.query.id as string);
const container = ref();

function loadFileData() {
    db.ebooks.get(query_id).then(value => {
        const book = ePub(value?.data! as any);
        const rendition = book.renderTo(container.value, {
            width: '100%',
            height: '100%',
            manager: 'continuous',
            flow: 'scrolled'
        });
        rendition.display();
        // console.log(container.value);
        // console.log(document.querySelector('iframe'));
        // sandbox="allow-scripts"
        book.loaded.navigation.then(function (toc: any) {
            // 方式一 toc是一个多维数组，下面这种只能显示第一级的目录

            var catalogItme = '';
            toc.forEach((chapter: any) => {
                catalogItme += '<p class="catalog-itme" data-catalog="' + chapter.href + '">' + chapter.label + '</p>'
            });
            // console.log(catalogItme);
            // 将拼接好的目录渲染到页面里       
            // document.querySelector('catalog').innerHTML = catalogItme

            // 方式二 将所有的目录全部显示出来
            // 第一级的catalog-itme-0
            // 第二级的catalog-itme-1 以此类推...
            // document.querySelector('catalog').innerHTML = recursionHandle(toc.toc, [], 0).join('')
        })
    })
}

onMounted(() => {
    loadFileData();
})

</script>

<style lang="scss" scoped>
.layout-content {
    width: 100%;
    height: calc(100vh - 45px);
}
#epub-container {
    width: 100%;
    // height: calc(100vh - 45px);
    height: 100%;
}
#menu-left {
    // position: fixed;
    // top: 50px;
    // left: 4px;
    box-sizing: border-box;
    width: 200px;
    // height: 600px;
    height: 100%;
    // padding: 40px;
    background-color: var(--color-menu-light-bg);
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 8%);
}
</style>