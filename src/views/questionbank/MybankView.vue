<template>
  <div>
    <!-- 进度条 -->
    <el-progress :percentage="progress" v-if="loading" />
    
    <el-row :gutter="40" class="discount">
      <el-col :span="6" v-for="(item, index) in transformedBanks" :key="index">
        <div class="item" @click="goToDetail(item.id)">
          <div class="imgItem">
            <img v-if="item.fileUrl" :src="item.fileUrl" />
          </div>
          <div class="info">
            <div class="title-container">
              <div class="title">{{ item.name }}</div>
              <div class="action-button">
                <el-button type="text" @click.stop="goItem(item.id)">进入</el-button>
                <el-button type="text" @click.stop="deleteItem(item.id)">删除</el-button>
              </div>
            </div>
            <div class="desc">{{ item.des }}</div>
            <div class="bottom">{{ item.modified }}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'; // 导入 ElMessage
import 'element-plus/dist/index.css';
import axios from 'axios';
import questionBankApi from '@/api/questionBank';

const Banks = ref([]);
const transformedBanks = ref([]);
const progress = ref(0); // 进度条的当前值
const loading = ref(false); // 加载状态

const router = useRouter();

const goToDetail = (id) => {
  router.push({ name: 'ItemDetail', params: { id } });
};

const goItem = (id) => {
  router.push({ name: 'questionbank' }).then(() => {
    router.push({ name: 'practice', params: { id } });
  });
};

// 加载题库列表
const loadBanks = async () => {
  loading.value = true; // 设置加载状态
  progress.value = 0; // 重置进度条值
  try {
    const response = await questionBankApi.getBankList();
    if (response.code === 200) {
      Banks.value = response.data; // 更新原始 Banks 变量
      console.log(response.data);
      await transformBanks(); // 确保调用 transformBanks 函数
    } else {
      alert(response.data.message || '加载题库列表失败');
    }
  } catch (error) {
    console.error("Failed to load banks:", error);
    alert('加载题库列表时发生错误');
  } finally {
    loading.value = false; // 结束加载状态
    ElMessage({ // 显示加载完成的消息
      message: '加载完成',
      type: 'success', // 成功类型
      duration: 3000 // 显示3秒
    });
  }
};

// 数据转换函数
const transformBanks = async () => {
  const totalBanks = Banks.value.length; // 题库的总数量
  let processedBanks = 0; // 处理的题库数量

  await Promise.all(Banks.value.map(async (bank) => {
    let fileUrl = bank.coverUrl;
    if (bank.coverUrl) {
      try {
        const response = await axios.get('/api' + fileUrl, {
          responseType: 'blob' // 确保响应类型为blob
        });
        fileUrl = window.URL.createObjectURL(response.data); // 创建URL对象
      } catch (error) {
        console.error("Failed to download image:", error);
        fileUrl = ''; // 如果下载失败，设置为空
      }
    }
    
    const transformedItem = {
      id: bank.bankId,
      name: bank.title,
      des: bank.description,
      modified: bank.createdAt,
      fileUrl,
      tag: JSON.parse(bank.keywords) // 将 JSON 字符串转换为数组
    };
    
    transformedBanks.value.push(transformedItem);
    processedBanks++;
    progress.value = Math.round((processedBanks / totalBanks) * 100); // 更新进度条值
  }));
};

// 将 deleteItem 函数标记为 async
const deleteItem = async (id) => {
  if (confirm("确定要删除这个题库吗？")) {
    try {
      const response = await questionBankApi.delete({ bankId: id });
      
      if (response && response.code === 200) {
        alert('文件删除成功');
        await loadBanks(); // 重新加载题库列表
      } else {
        alert((response && response.data && response.data.message) || '删除题库失败');
      }
    } catch (error) {
      console.error("删除题库时发生错误:", error);
      alert('发生错误，删除题库失败，错误信息为: ' + (error.message || '未知错误'));
    }
  }
};

onMounted(loadBanks);
</script>

<style lang="less" scoped>
.discount {
  border-radius: 10px;
}

.item {
  margin-bottom: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  width: 100%;
  height: 250px; /* 固定高度 */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }
}

.imgItem {
  height: 65%; /* 调整图片区域的高度 */
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 确保图片完整展示并保持比例 */
  }
}

.info {
  padding: 5px;
  flex: 1;
  background-color: #eeeeee;

  .title-container {
    display: flex;
    justify-content: space-between; /* 使标题和按钮分开 */
    align-items: center; /* 垂直居中 */
    position: relative; /* 使按钮可以绝对定位 */
    padding: 5px; /* 添加一些内边距 */
  }

  .title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 1px;
    font-family: system-ui;
  }

  .action-button {
    display: none; /* 默认隐藏按钮 */
  }

  .title-container:hover .action-button { /* 鼠标悬停时显示按钮 */
    display: flex;
    gap: 10px; /* 按钮之间的间隔 */
  }

  .desc {
    padding: 8px;
    font-size: 14px;
    color: #0c0c0c;
    line-height: 1;
    font-family: Georgia, serif;
    font-weight: normal;
  }

  .bottom {
    padding: 5px;
    font-size: 13px;
    color: #2d2d2d;
    position: absolute;
    right: 5px;
    bottom: 0;
  }
}
</style>