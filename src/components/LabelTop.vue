<!-- 顶部标签栏 -->
<template>
    <div class="label-top">
        <span class="root-title" @click="getLabel('all')" :id="selected === 'all' ? 'seleId' : ''">
            <span>
                <icon-lock class="lock" />全 部
            </span>
        </span>
        <span
            class="root-title"
            @click="getLabel('opus')"
            :id="selected === 'opus' ? 'seleId' : ''"
        >
            <span>
                <icon-lock class="lock" />作 品 集
            </span>
        </span>
        <span
            class="root-title"
            @click="getLabel('note')"
            :id="selected === 'note' ? 'seleId' : ''"
        >
            <span>
                <icon-lock class="lock" />笔 记 本
            </span>
        </span>
        <span class="root-title" @click="getLabel('MD')" :id="selected === 'MD' ? 'seleId' : ''">
            <span>
                <icon-lock class="lock" />Markdown
            </span>
        </span>
        <!-- 添加 -->
        <span class="root-title">
            <icon-plus-circle class="add-label" />
        </span>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
    IconLock,
    IconPlusCircle
} from '@arco-design/web-vue/es/icon';

let selected = ref('all');

function getLabel(na: string) {
    selected.value = na;
}
</script>

<style lang="scss" src="../style/labeltop.scss" scoped>
</style>