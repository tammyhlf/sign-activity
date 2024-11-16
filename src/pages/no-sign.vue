<template>
  <div class="no-sign">
    <h3>未签到人员名单</h3>
    <div class="button-container">
      <button @click="fetchNoSign">刷新</button>
      <button @click="handleExport">导出</button>
      <button @click="() => clickImport(1)">筹款致敬答谢活动导入</button>
      <button @click="() => clickImport(2)">交流会活动导入</button>
      <input type="file" ref="fileInputRef" @change="handleImport" accept=".xlsx, .xls" style="display: none;" />
    </div>
    <div class="table-box">
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>姓名</th>
            <th>座位号</th>
            <th>活动名称</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in noSignList" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.seat || '' }}</td>
            <td>{{ item.activity_name || '' }}</td>
          </tr>
        </tbody>
      </table>
      <div class="loading-box" :class="{ active: isLoading }">
        <svg class="loading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" stroke="#4CAF50" stroke-width="5" fill="none" stroke-dasharray="126.92" stroke-dashoffset="0">
            <animate attributeName="stroke-dashoffset" from="126.92" to="0" dur="1.5s" keyTimes="0;1" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref } from 'vue'
import * as XLSX from 'xlsx'
import axios from 'axios'

// 未签到名单
const noSignList = ref([])
// input ref
const fileInputRef = ref(null)
// 导入活动类型: 1 -> 筹款活动；2 -> 交流会
const importActivityType = ref(1)
// 加载中
const isLoading = ref(true)

// 全量获取名单
const fetchNoSign = async () => {
  try {
    isLoading.value = true
    const res = await axios.get(`${import.meta.env.VITE_API_HOST}/api/no-sign/list`)
    // 获取集合数据
    noSignList.value = res.data.data;
  } catch (error) {
    console.error('Error getting data:', error);
  } finally {
    isLoading.value = false
  }
}

// 导出
const handleExport = async () => {
  await fetchNoSign()
  // 将数据转换为 JSON 格式的表格数据

  const data = noSignList.value.map((item) => ({
    '姓名': item.name,
    '座位号': item.seat || '',
    '活动名称': item.activity_name || '',
  }));

  // 创建工作簿并添加工作表
  const worksheet = XLSX.utils.json_to_sheet(data);  // 将数据转换为工作表
  const workbook = XLSX.utils.book_new();  // 创建工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, '未签到名单');  // 将工作表添加到工作簿

  // 生成 Excel 文件并导出
  XLSX.writeFile(workbook, '未签到人员名单.xlsx');  // 导出文件，文件名可自定义
}

// 点击导入
const clickImport = (type) => {
  importActivityType.value = type
  fileInputRef.value?.click?.()
}

// 导入
const handleImport = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData();
  formData.append('file', file);
  formData.append('activityType', importActivityType.value);

  try {
    isLoading.value = true
    await axios.post(`${import.meta.env.VITE_API_HOST}/api/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    fetchNoSign() // 导入后自动刷新
  } catch (error) {
    console.error(error);
  } finally {
    event.target.value = null; // 重置输入值
    isLoading.value = false
  }
}

const init = async () => {
  fetchNoSign()
}

onMounted(() => {
  init()
})
</script>

<style scoped>
.no-sign {
  position: relative;
  height: 100vh; /* 视窗高度 */
  width: 100vw;
  overflow-y: auto; /* 允许垂直滚动 */
  text-align: center;
}
.name {
  margin-top: 16px;
  font-size: 16px;
}

table {
  width: 96%;
  margin: 0 auto;
  margin-bottom: 50px;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

th, td {
  padding: 12px 8px;
  border: 1px solid #ddd;
  text-align: left;
}

thead {
  background-color: #4CAF50;
  color: white;
  font-weight: bold;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9; /* 偶数行背景色 */
}

tbody tr:nth-child(odd) {
  background-color: #ffffff; /* 奇数行背景色 */
}

tbody tr:hover {
  background-color: #f1f1f1; /* 鼠标悬停效果 */
}

th {
  font-size: 16px;
}

td {
  font-size: 14px;
  color: #333;
}

.button-container {
  margin-bottom: 12px;
  margin-right: 12px;
  display: flex;
  /* justify-content: flex-end; */
  flex-wrap: wrap;
}

.button-container button {
  margin-block: 4px;
  margin-left: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  transition: background-color 0.3s ease;
}

.table-box {
  position: relative;
}


.loading-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: rgba(0, 0, 0, 0.2); /* 更深的透明背景 */
  visibility: hidden; /* 默认隐藏 */
}

.loading-box.active {
  visibility: visible; /* 当 loading 激活时显示 */
}

.loading {
  margin-top: 100px;
  border: 6px solid #f3f3f3; /* 轻灰色 */
  border-top: 6px solid #4CAF50; /* 用绿色表示进度 */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite; /* 旋转动画 */
}

/* 旋转动画 */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>