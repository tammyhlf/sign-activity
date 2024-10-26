import { createApp } from 'vue'
import './style.css'
// import App from './App.vue'
import Home from './pages/home.vue'
// import NoSign from './pages/no-sign.vue'
import router from './router' // 引入路由
import cloudbase from '@cloudbase/js-sdk'

const app = createApp(Home)
// const app = createApp(NoSign)

// 初始化 CloudBase
const cloudbaseApp = cloudbase.init({
  env: 'default-6g2quukx81b39ea9',  // 替换为你的环境 ID
  region: "ap-guangzhou"
});

// 挂载 cloudbase 实例到 Vue 全局属性
app.config.globalProperties.$cloudbase = cloudbaseApp;

app.use(router)  // 挂载路由器到 Vue 实例
app.mount('#app')  // 挂载 Vue 实例到 #app