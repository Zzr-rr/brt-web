<template>  
  <el-row :gutter="40" class="discount">  
    <el-col :span="6" v-for="(item, index) in transformedBanks" :key="index">  
      <div class="item" @click="goToDetail(item.id)">  
        <div class="imgItem">  
          <img :src="item.fileUrl" />  
        </div>  
        <div class="info">  
          <div class="title-container"> <!-- 新增的容器 -->  
            <div class="title">{{ item.name }}</div>  
            <div class="action-button"> <!-- 操作按钮 -->  
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
</template> 

<script setup>  
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import 'element-plus/dist/index.css';
import questionBankApi from '@/api/questionBank'; // 确保路径正确


const Banks = ref([]);
const transformedBanks = ref([]);



const router = useRouter();  

const goToDetail = (id) => {  
  router.push({ name: 'ItemDetail', params: { id } });  
};  

const goItem = (id) => {  
  // 首先导航到 questionbank
  router.push({ name: 'questionbank' }).then(() => {
    // 然后导航到 practice
    router.push({ name: 'practice', params: { id } });
  });
};

// 加载题库列表  
const loadBanks = async () => {  
  try {  
    const response = await questionBankApi.getBankList();  
    if (response.code === 200) {  
      Banks.value = response.data; // 更新原始 Banks 变量  
      console.log(response.data);  
      transformBanks(); // 确保调用 transformBanks 函数  
    } else {  
      alert(response.data.message || '加载题库列表失败');  
    }  
  } catch (error) {  
    console.error("Failed to load banks:", error);  
    alert('加载题库列表时发生错误');  
  }  
};  

// 数据转换函数  
const transformBanks = () => {  
  transformedBanks.value = Banks.value.map(bank => {  
    return {  
      id: bank.bankId,  
      name: bank.title,  
      des: bank.description,  
      modified: bank.createdAt, // 或者选择 updatedAt  
      fileUrl: bank.coverUrl, // 封面url  
      tag: JSON.parse(bank.keywords) // 将 JSON 字符串转换为数组  未在封面进行显示！！
    };  
  });  
};   

// 将 deleteItem 函数标记为 async  
const deleteItem = async (id) => {  
  if (confirm("确定要删除这个题库吗？")) {  
    try {  
      const response = await questionBankApi.delete({ bankId: id });  
      
      // 检查 response 是否存在且有效  
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

  .title-container { /* 新增的标题容器 */  
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

  .action-button { /* 操作按钮容器 */  
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