import { createApp } from 'vue'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue';
import router from './router/index';
import '@arco-design/web-vue/dist/arco.css';
import { createPinia } from 'pinia';

//引入全局用scss/js
import './style/global.scss';

// App.config.globalProperties.$USER_PATH = ''
window.ondragstart = function () {
    return false; // 全局禁用拖拽
}
createApp(App).use(ArcoVue, {
    // 用于改变使用组件时的前缀名称
    componentPrefix: 'a'
}).use(router).use(createPinia()).mount('#app');
