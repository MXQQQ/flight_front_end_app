import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Details',
        component: () => import('../views/Details.vue')
    },
    {
        path: '/details',
        name: 'Details',
        component: () => import('../views/Details.vue')
    },
    {
        path: '/airlines',
        name: 'Airlines',
        component: () => import('../views/Airlines.vue')
    },
    {
        path: '/globe',
        name: 'Globe',
        component: () => import('../views/Globe.vue')
    },
    {
        path: '/query',
        name: 'Query',
        component: () => import('../views/Query.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
