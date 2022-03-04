<!-- 最最顶部标题栏（最大最小化与关闭） -->
<template>
    <div class="header">
        <div class="left">
            <router-link to="/">
                <img src="../../public/static/img/logo.png" />
            </router-link>
            <button
                @click="back"
                :disabled="backDisable"
                :class="backDisable ? 'disabled' : 'not-disabled'"
                title="后退"
            >
                <icon-left
                    :style="{ fontSize: '16px', marginLeft: '-2px', color: backDisable ? '#babcbe' : '#5f6368' }"
                />
            </button>
            <button
                @click="forward"
                :disabled="forwardDisable"
                :class="forwardDisable ? 'disabled' : 'not-disabled'"
                title="前进"
            >
                <icon-right
                    :style="{ fontSize: '16px', marginRight: '-2px', color: forwardDisable ? '#babcbe' : '#5f6368' }"
                />
            </button>
        </div>
        <div class="middle">
            <span>📢:Arco Design ProArco Pro v2.0 全新上线 🎉</span>
        </div>
        <div class="right">
            <span @click="minimizeWin">
                <img :src="minimizeIcon" />
            </span>
            <span v-if="!isMax" @click="maximizeWin">
                <img :src="maximizeIcon" />
            </span>
            <span v-else @click="maximizeWin">
                <img :src="maximizeIcon2" />
            </span>
            <span @click="closeWin">
                <img :src="closeWinIcon" />
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
    IconLeft, IconRight
} from '@arco-design/web-vue/es/icon';
import { db } from '../db/db';
import { useMainStore } from '../store/index';
import router from '../router/index';
import { useRoute } from 'vue-router';
import minimizeIcon from '../assets/svg/minimizeIcon.svg';
import maximizeIcon from '../assets/svg/maximizeIcon.svg';
import maximizeIcon2 from '../assets/svg/maximizeIcon2.svg';
import closeWinIcon from '../assets/svg/closeWinIcon.svg';

const mainStore = useMainStore();

/*----控制页面的前进后退----*/
const backDisable = ref(false), forwardDisable = ref(false);
const back = () => {
    router.go(-1);
}
const forward = () => {
    router.go(1);
}
onMounted(() => {
    if (window.history.state.back === null) backDisable.value = true;
    if (window.history.state.forward === null) forwardDisable.value = true;
})

/*----控制页面的最大化、最小化和关闭----*/
const isMax = ref(false);
function minimizeWin() {
    window.$API.ipcSend("window-min");
}
function maximizeWin() {
    window.$API.ipcSend("window-max");
    isMax.value = !isMax.value;
}
function closeWin() {
    // 关闭之前做点善后工作
    db.user.where(':id').equals(mainStore.currentUserId).modify(item => {
        // 保存今日码字数
        item.codewords = item.codewords + mainStore.TotalNumber_thisTime - mainStore.contrastTotalNumber_thisTime;
    })
    window.$API.ipcSend("window-close");
}

// 通过route修改样式
const route = useRoute(),
    leftColor = ref('#f2f3f5');
if (route.path === '/writer' || route.path === '/specialEditor') {
    leftColor.value = '#fff';
} else {
    leftColor.value = '#f2f3f5';
}

</script>

<style scoped>
.header {
    width: 100vw;
    height: 40px;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    /*  允许拖动应用 */
    -webkit-app-region: drag;
    user-select: none;
}
.header .left {
    width: 250px;
    line-height: 40px;
    background-color: v-bind(leftColor);
}
.left img {
    height: 25px;
    margin-top: 10px;
    /* 避免拖动属性导致不能点击 */
    -webkit-app-region: no-drag;
}
.left button {
    width: 25px;
    height: 25px;
    margin-left: 20px;
    transform: translateY(-7.5px);
    border: none;
    border-radius: 50%;
    background-color: #ebebeb;
    /* 避免拖动属性导致不能点击 */
    -webkit-app-region: no-drag;
}
.not-disabled:hover {
    background-color: #ddd;
    cursor: pointer;
}
.disabled {
    cursor: not-allowed;
}

.header .middle {
    box-sizing: border-box;
    width: 400px;
    height: 100%;
    padding-top: 10px;
}
.header .right {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 130px;
    height: 40px;
}
.header .right span {
    padding: 4px;
    padding-bottom: 2px;
    border-radius: 2px;
    cursor: default;
    /* 避免拖动属性导致不能点击 */
    -webkit-app-region: no-drag;
    cursor: pointer;
}
.header .right span:hover {
    background-color: #f2f3f5;
}
</style>
