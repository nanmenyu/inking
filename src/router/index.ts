import {
    createRouter,
    createWebHashHistory,
    RouteRecordRaw
} from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/homePage.vue')
    }, {
        path: '/detail',
        name: 'Detail',
        component: () => import('../views/detailPage.vue')
    }, {
        path: '/writer',
        name: 'Writer',
        component: () => import('../views/writerPage.vue')
    }, {
        path: '/readingMode',
        name: 'ReadingMode',
        component: () => import('../views/readingModePage.vue')
    }, {
        path: '/bigworld',
        name: 'Bigworld',
        component: () => import('../views/bigworldPage.vue')
    }, {
        path: '/recycle',
        name: 'Recycle',
        component: () => import('../views/recyclePage.vue')
    }, {
        path: '/setting',
        name: 'Setting',
        component: () => import('../views/settingPage.vue')
    },
    {
        path: '/specialEditor',
        name: 'SpecialEditor',
        component: () => import('../views/specialeditorPage.vue')
    }, {
        path: '/reading',
        name: 'Reading',
        component: () => import('../views/readingPage.vue')
    }, {
        path: '/pdfreading',
        name: 'PdfReading',
        component: () => import('../views/PDFPage.vue')
    }, {
        path: '/user',
        name: 'User',
        component: () => import('../views/userPage.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;
