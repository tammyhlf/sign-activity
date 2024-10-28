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
import axios from 'axios'

const excelData = ref([]) // 存储从Excel文件中解析的数据
const isShowSite = ref(false) // 是否展示座位模块
const showPlaceholder = ref(true) // 是否展示placeholder

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

// 搜索
const handleSearch = async () => {
  isShowSite.value = true

  try {
    // 签到
    await axios.post(`${import.meta.env.VITE_API_HOST}/api/sign`, {
      name: searchValue.value
    })
  } catch (error) {
    console.error(error)
  } finally {
    // 请求搜索名单
    const res = await axios.get(`${import.meta.env.VITE_API_HOST}/api/sign`, {
      params: {
        name: searchValue.value
      }
    })
    searchResults.value = res.data.data
  }
}

// 全量获取名单
const getData = async() => {
  try {
    // 获取集合数据
    const res = await axios.get(`${import.meta.env.VITE_API_HOST}/api/no-sign/list`)
    excelData.value = res.data.data
  } catch (error) {
    console.error('Error getting data:', error);
  }
}

// 页面初始化
const init = async () => {
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
