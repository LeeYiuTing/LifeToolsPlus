import { createRouter, createWebHistory } from 'vue-router';
import home from '../views/home.vue';
import newPage from '../views/new.vue';
import good from '../views/good.vue';

const routes = [
    { path: '/', component: home },
    { path: '/good', component: good },
    { path: '/new', component: newPage },
    { path: '/album', component: ()=> import('../views/album/search.vue') },
    { path: '/album/upload', component: ()=>import('../views/album/upload.vue')},
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
