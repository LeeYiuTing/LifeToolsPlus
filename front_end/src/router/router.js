import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router';
import '../views/Japanese/JpLearnSetOption.vue'

const routes = [
    {path: '/', component: () => import('../views/home.vue')},
    {path: '/goOut', component: () => import('../views/goOut/goOut.vue')},
    {path: '/jpLearnSet', component: () => import('../views/Japanese/JpLearnSetOption.vue')},
    {path: '/jpLearnTY', component: () => import('../views/Japanese/jpLearnTY.vue')},
    {path: '/jpLearnTX', component: () => import('../views/Japanese/jpLearnTX.vue')},
    {path: '/new', component: () => import('../views/new.vue')},
    {path: '/album', component: () => import('../views/album/search.vue')},
    {path: '/album/search', component: () => import('../views/album/search.vue')},
    {path: '/album/upload', component: () => import('../views/album/upload.vue')},
    {path: '/album/tagPage', component: () => import('../views/album/tagPage.vue')},
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;


