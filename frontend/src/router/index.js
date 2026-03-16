import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Painel from '../views/Painel.vue';
import Cadastro from '../views/Cadastro.vue';

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/cadastro',
        name: 'Cadastro',
        component: Cadastro
    },
    {
        path: '/painel',
        name: 'Painel',
        component: Painel,
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from) => {
    const token = localStorage.getItem('token');

    if (to.meta.requiresAuth && !token) {
        return '/'
    }
});

export default router;
