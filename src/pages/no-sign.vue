<template>
  <div class="no-sign">
    <h3>未签到人员名单</h3>
    <div class="button-container">
      <button @click="fetchNoSign">刷新</button>
      <button @click="handleExport">导出</button>
      <button @click="clickImport">导入</button>
      <input type="file" ref="fileInputRef" @change="handleImport" accept=".xlsx, .xls" style="display: none;" />
    </div>
    <table>
      <thead>
        <tr>
          <th>序号</th>
          <th>姓名</th>
          <th>第一排座位号</th>
          <th>第二排座位号</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in noSignList" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.first_seat || '' }}</td>
          <td>{{ item.second_seat || '' }}</td>
        </tr>
      </tbody>
    </table>
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

// 全量获取名单
const fetchNoSign = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_HOST}/api/no-sign/list`)
    // 获取集合数据
    noSignList.value = res.data.data;
  } catch (error) {
    console.error('Error getting data:', error);
  }
}

// 导出
const handleExport = async () => {
  await fetchNoSign()
  // 将数据转换为 JSON 格式的表格数据
  const data = noSignList.value.map((item) => ({
    '姓名': item.name,
    '第一排座位号': item.first_seat || '',
    '第二排座位号': item.second_seat || ''
  }));

  // 创建工作簿并添加工作表
  const worksheet = XLSX.utils.json_to_sheet(data);  // 将数据转换为工作表
  const workbook = XLSX.utils.book_new();  // 创建工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, '未签到名单');  // 将工作表添加到工作簿

  // 生成 Excel 文件并导出
  XLSX.writeFile(workbook, '未签到人员名单.xlsx');  // 导出文件，文件名可自定义
}

// 点击导入
const clickImport = () => {
  fileInputRef.value?.click?.()
}

// 导入
const handleImport = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData();
  formData.append('file', file);

  try {
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
  justify-content: flex-end;
}

.button-container button {
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
</style>