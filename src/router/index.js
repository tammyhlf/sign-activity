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
  // 阿里云打包路径用 sign-activity, 腾讯云传空字符串就好
  // history: createWebHistory('/sign-activity'),
  history: createWebHistory(''),
  routes,
})

export default router
