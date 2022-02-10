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
        path: '/reading',
        name: 'Reading',
        component: () => import('../views/readingPage.vue')
    }, {
        path: '/bigworld',
        name: 'Bigworld',
        component: () => import('../views/bigworldPage.vue')
    }, {
        path: '/recycle',
        name: 'Recycle',
        component: () => import('../views/recyclePage.vue')
    }, {
        path: '/specialEditor',
        name: 'SpecialEditor',
        component: () => import('../views/specialeditorPage.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;
