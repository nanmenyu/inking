<template>
    <TitleBlock></TitleBlock>
    <a-layout class="layout-content">
        <a-layout-sider collapsible breakpoint="xl">
            <div class="logo" />
            <a-menu style="text-align: left;">
                <!-- 渲染列表 -->
                <div v-for="item in catalogItme" :key="item.id">
                    <a-sub-menu
                        v-if="item.subitems.length > 0"
                        :key="item.id"
                        :title="item.label.trim()"
                    >
                        <a-tooltip
                            v-for="it in item.subitems"
                            :key="it.id"
                            :content="it.label.trim()"
                            position="right"
                            mini
                        >
                            <a-menu-item
                                @click="directoryJump(it.href)"
                                style="font-size: 12px;"
                            >{{ it.label.trim() }}</a-menu-item>
                        </a-tooltip>
                    </a-sub-menu>
                    <a-menu-item
                        v-else
                        @click="directoryJump(item.href)"
                        :key="'-' + item.id"
                    >{{ item.label.trim() }}</a-menu-item>
                </div>
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
import { nextTick, Ref, ref } from 'vue';
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

const catalogItme: Ref<Array<any>> = ref([]);
let rendition: any;

const directoryJump = (url: string) => {
    rendition.display(url);
}

function loadFileData() {
    db.ebooks.get(query_id).then(value => {
        const book = ePub(value?.data! as any);
        rendition = book.renderTo(container.value, {
            width: '100%',
            height: '100%',
            manager: 'continuous',
            flow: 'scrolled'
        });
        rendition.display();
        rendition.themes.fontSize(24 + 'px');
        // rendition.on('selected', function (cfiRange: any) {
        //     book.getRange(cfiRange).then(range => {
        //         console.log(range.toString());
        //     })
        // })

        book.loaded.navigation.then(function (toc: any) {
            // 获得电子书的目录
            toc.forEach((chapter: any) => {
                // console.log(chapter);
                catalogItme.value.push(chapter);
            });
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