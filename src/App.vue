<template>
  <div id="app">
    <router-view></router-view>  <!-- 渲染匹配路由的组件 -->
    <button @click="handleSearch">查询</button>
    <button @click="handleInsert">插入</button>
    <button @click="handleDelete">删除</button>
    <button @click="handleSign">签到</button>
  </div>
</template>

<script setup>
</script>

<style>
</style>

<script setup name="DB">
// import { onMounted } from 'vue';
// import cloudbase from '@cloudbase/js-sdk';
// import { getCurrentInstance } from 'vue'

// // const app = cloudbase.init({
// //   env: 'default-6g2quukx81b39ea9',
// //   region: "ap-guangzhou"
// // });

// const instance = getCurrentInstance()  // 获取当前组件实例
// const { globalProperties } = instance.appContext.config
// const app = globalProperties.$cloudbase;

// const auth = app.auth();

// const db = app.database();

// const login = async () =>{
//   // 调用匿名登录接口
//   await auth.anonymousAuthProvider().signIn();
//   // 匿名登录成功后，登录状态isAnonymous字段值为true
//   const loginState = await auth.getLoginState();
//   console.log(loginState.isAnonymousAuth); // true
// }

// const handleSearch = () => {
//   db.collection('sign_table')
//   .get().then((res) => {
//     console.log('🚀🚀 DB', res);
//   })
// }

// // 增加多条数据只支持服务端 SDK 使用，客户端遍历添加吧
// const handleInsert = () => {
//   db.collection('sign_table').add(
//     {
//       name: '代用名',
//       first_seat: '第一排8号',
//       second_seat: '第二排32号',
//       sign_in_number: 1,
//       sign_in_status: false,
//     }
//   )
// }

// const handleDelete = () => {
//   db.collection('sign_table').where({
//     name: '代用名'
//   }).remove()
// }

// const handleSign = () => {
//   db.collection('sign_table').where({
//     _id: 'ed8dc551671906b7003c7b6947617a5a'
//   }).update({
//     sign_in_number: 2,
//     sign_in_status: true
//   }).then((res) => {
//     console.log("🚀 ~ db.collection ~ res:", res)
    
//   }).catch((err) => {
//     console.log("🚀 ~ db.collection ~ err:", err)
    
//   })
// }

// onMounted(async () => {
//   // login()
//   // handleSearch();
// })
</script>
