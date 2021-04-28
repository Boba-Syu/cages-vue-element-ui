import {createRouter, createWebHashHistory} from 'vue-router'
// eslint-disable-next-line no-unused-vars
import Home from '../views/Home.vue'

const routes = [
    /*{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/!* webpackChunkName: "about" *!/ '../views/About.vue')
    },*/  {
        path: '/data_detail',
        name: 'data_detail',
        component: () => import('../views/data/dataDetail')
    }, {
        path: '/data_dialogue',
        name: 'data_dialogue',
        component: () => import('../views/data/dataDialogue')
    }, {
        path: '/instruction_detail',
        name: 'instruction_detail',
        component: () => import('../views/instruction/instructionDetail')
    }, {
        path: '/send_instruction',
        name: 'send_instruction',
        component: () => import('../views/instruction/sendInstruction')
    }, {
        path: '/create_timing_task',
        name: 'create_timing_task',
        component: () => import('../views/timingTask/createTimingTask')
    }, {
        path: '/timing_task_detail',
        name: 'timing_task_detail',
        component: () => import('../views/timingTask/timingTaskDetail')
    }, {
        path: '/camera',
        name: 'camera',
        component: () => import('../views/camera/camera')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
