import { createApp } from 'vue'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue';
import router from './router/index';
import '@arco-design/web-vue/dist/arco.css';

//引入全局用css/js
import './style/global.css';

// App.config.globalProperties.$USER_PATH = ''

createApp(App).use(ArcoVue, {
    // 用于改变使用组件时的前缀名称
    componentPrefix: 'a'
}).use(router).mount('#app');
