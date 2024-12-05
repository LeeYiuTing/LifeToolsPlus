import { createRouter, createWebHistory } from 'vue-router';
import '../views/Japanese/JpLearnSetOption.vue'

const routes = [
    {path: '/', component: () => import('../views/home.vue')},
    {path: '/goOut', component: () => import('../views/goOut/goOut.vue')},
    {path: '/jpLearnSet', component: () => import('../views/Japanese/JpLearnSetOption.vue')},
    {path: '/jpLearn', component: () => import('../views/Japanese/jpLearn.vue')},
    {path: '/new', component: () => import('../views/new.vue')},
    {path: '/album', component: () => import('../views/album/search.vue')},
    {path: '/album/upload', component: () => import('../views/album/upload.vue')},
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;


