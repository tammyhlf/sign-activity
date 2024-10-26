<template>
  <div class="background">
    <div class="input-area" v-if="!showResults">
      <div
        type="text"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        class="search-input"
        contenteditable="true"
      >
        <span v-show="showPlaceholder" class="placeholder">请输入名字以查找座位号</span>
      </div>
      <div class="search" @click="handleSearch">立即查询</div>
      <p v-if="searchValue && isShowSite">未找到对应的座位号</p>
    </div>
    <div v-else class="site-box">
      <div class="site-item" v-for="(item) in searchResults" :key="item._id">
        <p>姓名: <strong>{{item.name}}</strong></p>
        <p>签到号码: <strong>{{ item.sign_in_number || '' }}</strong></p>
        <p>第一场座位: <strong>{{ item.first_seat }}</strong></p>
        <p>第二场座位: <strong>{{ item.second_seat }}</strong></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCurrentInstance } from 'vue'

const excelData = ref([]) // 存储从Excel文件中解析的数据
const isShowSite = ref(false) // 是否展示座位模块
const showPlaceholder = ref(true) // 是否展示placeholder

const instance = getCurrentInstance()  // 获取当前组件实例
const { globalProperties } = instance.appContext.config
const db = globalProperties.$cloudbase.database();

// 鉴权
const auth = globalProperties.$cloudbase?.auth?.();

// 搜索名字/搜索座位号
const searchValue = ref('')
// 搜索结果名单
const searchResults = ref([])

// 展示名单列表
const showResults = computed(() => searchResults.value.length > 0)

// 输入
const handleInput = (e) => {
  searchValue.value = e.target.innerText.trim()
  // 输入清空名单
  searchResults.value = []
  isShowSite.value = false
}

// 聚焦
const handleFocus = () => {
  showPlaceholder.value = false
}

// 失焦
const handleBlur = () => {
  if (!searchValue.value) {
    showPlaceholder.value = true
  }
}

// 获取最大签到数
const findMaxSignInNum = async () => {
  try {
    const list = await db.collection('sign_table').limit(10000).get()
    const maxNum = Math.max(...list?.data?.map?.(item => Number(item.sign_in_number)))
    console.log("🚀 ~ findMaxSignInNum ~ maxNum:", maxNum)
    return maxNum || 0
  } catch (e) {
    console.log("🚀 ~ findMaxSignInNum ~ e:", e)
    return 0
  }
}

// 签到
const handleSign = async (item) => {
  // 查询最大签到数
  const sign_in_number = await findMaxSignInNum()
  const updateData = { sign_in_number: sign_in_number + 1, sign_in_status: true }
    
  console.log("🚀 ~ handleSign ~ updateData:", updateData)
  db.collection('sign_table')
    .where({
      _id: item._id
    })
    .update(updateData)
    .then((res) => {
      console.log("🚀 ~ db.collection ~ res:", item._id, res)
    })
    .catch((err) => {
      console.log("🚀 ~ db.collection ~ err:", err)
    })
    .finally(() => {
      // 刷新状态
      db.collection('sign_table')
        .limit(10000)
        .where({ name: searchValue.value })
        .get()
        .then((res) => {
          searchResults.value = res.data
        })
    })
}

// 搜索
const handleSearch = () => {
  isShowSite.value = true
  // 查询姓名相符合，并且未签到的名单
  searchResults.value = excelData.value.filter(row => row['name'].trim() === searchValue.value )

  // 签到第一个
  const firstNoSign = searchResults.value.filter((row) => !row.sign_in_status)

  if (firstNoSign[0]) {
    handleSign(firstNoSign[0])
  }
}

// 全量获取名单
const getData = async() => {
  try {
    // 获取集合数据
    const res = await db.collection('sign_table').limit(10000).get();
    excelData.value = res.data;
    console.log("🚀 ~ getData ~ res.data:", res)
  } catch (error) {
    console.error('Error getting data:', error);
  }
}

// 登陆
const login = async () =>{
  // 调用匿名登录接口
  await auth.anonymousAuthProvider().signIn();
  // 匿名登录成功后，登录状态isAnonymous字段值为true
  const loginState = await auth.getLoginState();
  console.log(loginState.isAnonymousAuth); // true
}

// 页面初始化
const init = async () => {
  await login()
  getData()
}

onMounted(() => {
  init()
})
</script>

<style scoped>
.background {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-image: url('../assets/red-bg.jpeg');
  background-size: 100% 100%;
  color: #fff;
}
.input-area {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
}
.search-input {
  height: 45px;
  width: 330px;
  line-height: 45px;
  margin-bottom: 20px;
  background-color: #fff;
  color: #831a1f;
  border-radius: 20px;
}
.placeholder {
  color: #999;
  font-size: 14px;
  pointer-events: none;
}
.site-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  color: #831a1f;
  width: 330px;
  max-height: 50%;
  overflow-y: scroll;
}

.site-item {
  background-color: rgba(236, 167, 128, .6);
  border-radius: 30px;
}

.search {
  height: 45px;
  width: 330px;
  line-height: 45px;
  background-color: #831a1f;
  border-radius: 20px;
  color: #fff;
  font-size: 15px;
}
</style>
