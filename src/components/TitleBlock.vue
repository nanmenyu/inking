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
                <svg
                    t="1642252481008"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="1821"
                    width="18"
                    height="18"
                >
                    <path
                        d="M929.8 528.1H93.5c-15.5 0-28-12.5-28-28s12.5-28 28-28h836.3c15.5 0 28 12.5 28 28s-12.5 28-28 28z"
                        fill="#5f6368"
                        p-id="1822"
                    />
                </svg>
            </span>
            <span v-if="!isMax" @click="maximizeWin">
                <svg
                    t="1642252575794"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2064"
                    width="18"
                    height="18"
                >
                    <path
                        d="M812.3 959.4H213.7c-81.6 0-148-66.4-148-148V212.9c0-81.6 66.4-148 148-148h598.5c81.6 0 148 66.4 148 148v598.5C960.3 893 893.9 959.4 812.3 959.4zM213.7 120.9c-50.7 0-92 41.3-92 92v598.5c0 50.7 41.3 92 92 92h598.5c50.7 0 92-41.3 92-92V212.9c0-50.7-41.3-92-92-92H213.7z"
                        fill="#5f6368"
                        p-id="2065"
                    />
                </svg>
            </span>
            <span v-else @click="maximizeWin">
                <svg
                    t="1642303369314"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="1674"
                    width="18"
                    height="18"
                >
                    <path
                        d="M812.2 65H351.6c-78.3 0-142.5 61.1-147.7 138.1-77 5.1-138.1 69.4-138.1 147.7v460.6c0 81.6 66.4 148 148 148h460.6c78.3 0 142.5-61.1 147.7-138.1 77-5.1 138.1-69.4 138.1-147.7V213c0-81.6-66.4-148-148-148z m-45.8 746.3c0 50.7-41.3 92-92 92H213.8c-50.7 0-92-41.3-92-92V350.7c0-50.7 41.3-92 92-92h460.6c50.7 0 92 41.3 92 92v460.6z m137.8-137.7c0 47.3-35.8 86.3-81.8 91.4V350.7c0-81.6-66.4-148-148-148H260.2c5.1-45.9 44.2-81.8 91.4-81.8h460.6c50.7 0 92 41.3 92 92v460.7z"
                        fill="#5f6368"
                        p-id="1675"
                    />
                </svg>
            </span>
            <span @click="closeWin">
                <svg
                    t="1642252612509"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2307"
                    width="18"
                    height="18"
                >
                    <path
                        d="M96.6 915c-10.9-10.9-10.9-28.7 0-39.6L887 85c10.9-10.9 28.7-10.9 39.6 0 10.9 10.9 10.9 28.7 0 39.6L136.2 915c-10.9 10.9-28.6 10.9-39.6 0z"
                        fill="#5f6368"
                        p-id="2308"
                    />
                    <path
                        d="M887 915L96.6 124.6c-10.9-10.9-10.9-28.7 0-39.6 10.9-10.9 28.7-10.9 39.6 0l790.4 790.4c10.9 10.9 10.9 28.7 0 39.6-10.9 10.9-28.6 10.9-39.6 0z"
                        fill="#5f6368"
                        p-id="2309"
                    />
                </svg>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
    IconLeft,
    IconRight
} from '@arco-design/web-vue/es/icon';
import router from '../router/index';
import { useRoute } from 'vue-router';

/*----控制页面的前进后退----*/
const backDisable = ref(false),
    forwardDisable = ref(false);
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
