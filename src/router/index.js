// src/router/index.js or index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/home.vue' // Example: Home page
import noSign from '../pages/no-sign.vue' // 引入新页面组件

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/', // 如果你希望访问根路径重定向到 /home
    redirect: '/home',
  },
  {
    path: '/no-sign',  // 新页面的路径
    name: 'NoSign',
    component: noSign,  // 对应组件
  },
]

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory(),
  routes,
})

export default router
