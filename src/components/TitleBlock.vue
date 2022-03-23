<!-- 最最顶部标题栏（最大最小化与关闭） -->
<template>
    <div class="header">
        <div class="left">
            <div class="left-btn" title="跳转到首页">
                <router-link to="/">
                    <svg
                        class="icon"
                        viewBox="0 0 1024 1024"
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                    >
                        <path p-id="16750" />
                        <path p-id="16751" />
                    </svg>
                    <span>HOME</span>
                </router-link>
            </div>
            <button
                @click="back"
                :disabled="backDisable"
                :class="backDisable ? 'disabled' : 'not-disabled'"
                title="后退"
            >
                <icon-left :style="{ fontSize: '16px', marginLeft: '-2px' }" />
            </button>
            <button
                @click="forward"
                :disabled="forwardDisable"
                :class="forwardDisable ? 'disabled' : 'not-disabled'"
                title="前进"
            >
                <icon-right :style="{ fontSize: '16px', marginRight: '-2px' }" />
            </button>
        </div>
        <div class="middle">
            <span>📢:Arco Design ProArco Pro v2.0 全新上线 🎉</span>
        </div>
        <div class="right">
            <span @click="minimizeWin">
                <svg
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                >
                    <path p-id="h1" />
                </svg>
            </span>
            <span v-if="!isMax" @click="maximizeWin">
                <svg
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                >
                    <path p-id="h2" />
                </svg>
            </span>
            <span v-else @click="maximizeWin">
                <svg
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                >
                    <path p-id="h3" />
                </svg>
            </span>
            <span @click="closeWin">
                <svg
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                >
                    <path p-id="h4" />
                    <path p-id="h5" />
                </svg>
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
// import minimizeIcon from '../assets/svg/minimizeIcon.svg';
// import maximizeIcon from '../assets/svg/maximizeIcon.svg';
// import maximizeIcon2 from '../assets/svg/maximizeIcon2.svg';
// import closeWinIcon from '../assets/svg/closeWinIcon.svg';

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
    }).then(() => {
        window.$API.ipcSend("window-close");
    })
}

// 通过route修改样式
const route = useRoute(), leftColor = ref(''), leftShadow = ref('');
if (route.path === '/writer' || route.path === '/specialEditor' || route.path === '/reading' || route.path === '/pdfreading') {
    leftColor.value = 'rgb(var(--my-bg-color))';
    leftShadow.value = 'none';
} else {
    leftColor.value = 'var(--color-menu-light-bg)';
    leftShadow.value = '0 4px 10px #0000001a'
}

</script>

<style scoped>
.header {
    width: 100vw;
    height: 40px;
    display: flex;
    justify-content: space-between;
    background-color: rgb(var(--my-bg-color));
    /*  允许拖动应用 */
    -webkit-app-region: drag;
    user-select: none;
}
body[arco-theme="dark"] .header .left {
    background-color: v-bind(leftColor);
}

.header .left {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 250px;
    line-height: 40px;
    /* background-color: v-bind(leftColor); */
    background-color: rgb(var(--my-bg-color));
    border-radius: 0 40px 0 0;
    box-shadow: v-bind(leftShadow);
}
.left .left-btn a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    text-decoration: none;
    /* margin-top: 10px; */
    cursor: pointer;
    /* 避免拖动属性导致不能点击 */
    -webkit-app-region: no-drag;
}
.left-btn span {
    display: block;
    font-size: 20px;
    font-weight: bold;
    margin-left: 8px;
    color: rgb(var(--primary-6));
}
.left .left-btn:hover span {
    color: rgb(var(--primary-5));
}
.left button {
    width: 25px;
    height: 25px;
    margin-left: 20px;
    /* transform: translateY(-7.5px); */
    border: none;
    border-radius: 50%;
    /* background-color: #ebebeb; */
    background-color: var(--color-secondary);
    /* 避免拖动属性导致不能点击 */
    -webkit-app-region: no-drag;
}

.not-disabled {
    color: var(--color-text-1);
}
.not-disabled:hover {
    background-color: var(--color-secondary-hover);
    cursor: pointer;
}
.disabled {
    cursor: not-allowed;
    color: var(--color-text-4);
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
    background-color: var(--color-fill-3);
}
.left .left-btn:hover path[p-id="16750"] {
    fill: rgb(var(--primary-5));
}
path[p-id="h1"],
path[p-id="h2"],
path[p-id="h3"],
path[p-id="h4"],
path[p-id="h5"] {
    fill: var(--color-text-1);
}
path[p-id="h1"] {
    d: path(
        "M929.8 528.1H93.5c-15.5 0-28-12.5-28-28s12.5-28 28-28h836.3c15.5 0 28 12.5 28 28s-12.5 28-28 28z"
    );
}
path[p-id="h2"] {
    d: path(
        "M812.3 959.4H213.7c-81.6 0-148-66.4-148-148V212.9c0-81.6 66.4-148 148-148h598.5c81.6 0 148 66.4 148 148v598.5c.1 81.6-66.3 148-147.9 148zM213.7 120.9c-50.7 0-92 41.3-92 92v598.5c0 50.7 41.3 92 92 92h598.5c50.7 0 92-41.3 92-92V212.9c0-50.7-41.3-92-92-92H213.7z"
    );
}
path[p-id="h3"] {
    d: path(
        "M812.2 65H351.6c-78.3 0-142.5 61.1-147.7 138.1-77 5.1-138.1 69.4-138.1 147.7v460.6c0 81.6 66.4 148 148 148h460.6c78.3 0 142.5-61.1 147.7-138.1 77-5.1 138.1-69.4 138.1-147.7V213c0-81.6-66.4-148-148-148zm-45.8 746.3c0 50.7-41.3 92-92 92H213.8c-50.7 0-92-41.3-92-92V350.7c0-50.7 41.3-92 92-92h460.6c50.7 0 92 41.3 92 92v460.6zm137.8-137.7c0 47.3-35.8 86.3-81.8 91.4V350.7c0-81.6-66.4-148-148-148H260.2c5.1-45.9 44.2-81.8 91.4-81.8h460.6c50.7 0 92 41.3 92 92v460.7z"
    );
}
path[p-id="h4"] {
    d: path(
        "M96.6 915c-10.9-10.9-10.9-28.7 0-39.6L887 85c10.9-10.9 28.7-10.9 39.6 0 10.9 10.9 10.9 28.7 0 39.6L136.2 915c-10.9 10.9-28.6 10.9-39.6 0z"
    );
}
path[p-id="h5"] {
    d: path(
        "M887 915L96.6 124.6c-10.9-10.9-10.9-28.7 0-39.6 10.9-10.9 28.7-10.9 39.6 0l790.4 790.4c10.9 10.9 10.9 28.7 0 39.6-10.9 10.9-28.6 10.9-39.6 0z"
    );
}
path[p-id="16750"] {
    d: path(
        "M1024 512c0 282.7776-229.2224 512-512 512S0 794.7776 0 512 229.2224 0 512 0s512 229.2224 512 512z"
    );
    fill: rgb(var(--primary-6));
}
path[p-id="16751"] {
    d: path(
        "M493.5936 234.9056a39.3984 39.3984 0 0 1 36.608 0l1.9584 1.024 1.6384 1.536 243.7376 224.512a45.4144 45.4144 0 0 1 13.7344 49.024 36.8896 36.8896 0 0 1-35.6096 23.168H704V716.8a51.2 51.2 0 0 1-51.2 51.2h-76.8v-115.2a64 64 0 0 0-128 0v115.2h-76.8a51.2 51.2 0 0 1-51.2-51.2V534.1696h-54.2336a36.6336 36.6336 0 0 1-33.024-23.552 44.9536 44.9536 0 0 1 13.9136-48.896l244.992-225.792z"
    );
    fill: #fff;
}
</style>
