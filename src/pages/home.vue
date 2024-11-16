<template>
  <div class="background">
    <div class="input-area">
      <div class="search-area">
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
      </div>
      <!-- <p v-if="searchValue && isShowSite">未找到对应的座位号</p> -->
      <div v-if="showResults" class="site-box">
        <div class="site-item" v-for="(item) in searchResults" :key="item._id">
          <div class="info">
            <p>姓名: <strong>{{item.name}}</strong></p>
            <!-- <p>签到号码: <strong>{{ item.sign_in_number || '' }}</strong></p> -->
            <p>座位号: <strong>{{ item.seat || '' }}</strong></p>
            <!-- <div class="divide mt10"></div>
            <div class="site-tip">温馨提示:面对主舞台,从右往左排列座位号</div>
            <div class="site-tip-sub">例:“1-2”座位号对应位置为,第一排从右往左数第2列</div>
            <div class="divide"></div> -->
          </div>
          <div class="sign-button">
            <div v-if="item.sign_status === 1" class="tip">已签到</div>
            <div v-else class="button" @click="() => handleSign(item)">点击签到</div>
          </div>
        </div>
      </div>
      <p v-if="searchValue && isShowSite">未找到对应的座位号</p>
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
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_HOST}/api/search`, {
      params: {
        name: searchValue.value
      }
    })

    searchResults.value = res.data.data
    isShowSite.value = true
  } catch (error) {
    console.error(error)
  }
}

// 签到
const handleSign = async (item) => {
  debugger
  try {
    // 签到
    await axios.post(`${import.meta.env.VITE_API_HOST}/api/sign`, {
      id: item.id,
      name: item.name,
    })
  } catch (error) {
    console.error(error)
  } finally {
    handleSearch()
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
  background-image: url('../assets/red-bg.webp');
  background-size: 100% 100%;
  color: #fff;
}
.input-area {
  /* position: absolute; */
  position: relative;
  top: 40%;
  padding: 0px 20px;
  height: calc(100vh - 40%);
  /* left: 50%; */
  /* transform: translateX(-50%); */
}

.search-area {
  display: flex;
}
.search-input {
  flex: 1;
  height: 45px;
  /* width: 330px; */
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
  /* position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
  font-size: 20px;
  color: #831a1f;
  /* width: 330px; */
  max-height: 80%;
  overflow-y: scroll;
  /* background-color: rgba(232, 189, 164, 0.8); */
  /* border-radius: 30px; */
  padding-bottom: 5px;
}

.site-item {
  display: flex;
  padding: 16px;
  margin-bottom: 20px;
  background-color: rgba(232, 189, 164, 0.8);
  border-radius: 12px;

}

.site-item .info {
  flex: 1;
}

.site-item .info > p {
  margin: 0px;
  font-size: 18px;
  text-align: left;
}

.site-item .sign-button {
  margin-left: 8px;
  width: 60px;
  line-height: 45px;
  color: #fff;
  font-size: 12px;
}

.site-item .sign-button .tip {
  line-height: 45px;
  background-color: #3b8221;
  border-radius: 20px;
  font-size: 12px;
}

.site-item .sign-button .button {
  line-height: 45px;
  background-color: #831a1f;
  border-radius: 20px;
  font-size: 12px;
}

.divide {
  height: 1.5px;
  margin: 2px 55px;
  background-color: #831a1f;
}

.mt10 {
  margin-top: 25px !important;
}
.site-tip {
  margin-bottom: 1px;
  margin-top: 1px;
  font-size: 12px;
  transform: scale(0.95);
}

.site-tip-sub {
  margin-bottom: 1px;
  margin-top: -1px;
  font-size: 12px;
  transform: scale(0.78);
}

.search {
  margin-left: 12px;
  width: 100px;
  height: 45px;
  /* width: 330px; */
  line-height: 45px;
  background-color: #831a1f;
  border-radius: 20px;
  color: #fff;
  font-size: 15px;
}
</style>
