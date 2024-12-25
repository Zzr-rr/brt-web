<!-- <template>
  <el-container class="file-list-container"> -->
    <!-- 控制按钮 -->
    <!-- <el-header class="file-controls">
      <el-button type="primary" icon="Upload" @click="uploadFile">上传</el-button>
      <el-button type="success" icon="Link">链接</el-button>
      <el-button type="success" icon="Share" @click="shareFile">分享</el-button>
    </el-header> -->

    <!-- 文件列表 -->
    <!-- <el-main>
      <el-table :data="formattedFiles" size="large" class="file" stripe style="width: 100%">
        <el-table-column prop="name" label="题库名" width="200"></el-table-column>
        <el-table-column prop="modified" label="题量" width="180"></el-table-column>
        <el-table-column label="标签" width="300">
          <template #default="{ row }">
            <div class="tag-container">
              <el-tag
                v-for="(tag, index) in row.tag"
                :key="index"
                type="info"
                class="file-tag"
              >
                {{ tag }}
              </el-tag>
              <div class="action-button">
                <el-button type="text" @click="someAction(row.id)">进入</el-button>
                <el-button type="text" @click="someAction(row.id)">删除</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="进度" width="100">
          <template #default="{ row }">
            <div :class="row.progressClass">
            {{ row.solvePercentage.toFixed(2) }}%
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import 'element-plus/dist/index.css';

const router = useRouter(); -->

<!-- // 文件数据，其中 `solve` 表示已解决的题目数量，`modified` 表示总题量
const files = ref([
  { id: 1, name: '高等数学', modified: 30, tag: ['极限', '微积分'], solve: 4 },
  { id: 2, name: '低等数学', modified: 24, tag: ['整数的加减乘除'], solve: 20 },
  { id: 3, name: '中等数学', modified: 37, tag: ['求导'], solve: 8 },
  { id: 4, name: 'AIERDENG', modified: 88, tag: [], solve: 14 },
  { id: 5, name: '高等元素反应', modified: 22, tag: ['感电', '过载'], solve: 14 },
]);

// 计算每个文件的进度百分比
const formattedFiles = computed(() => {
  return files.value.map(file => {
    // 根据 solve 和 modified 计算进度百分比
    file.solvePercentage = file.modified === 0 ? 0 : (file.solve / file.modified) * 100;
    if (file.solvePercentage >= 80) {
      file.progressClass = 'progress-green';
    } else if (file.solvePercentage >= 40) {
      file.progressClass = 'progress-yellow';
    } else {
      file.progressClass = 'progress-red';
    }
    return file;
  });
});

const uploadFile = () => {
  router.push({ name: 'upload' });
};

const someAction = (id) => {
  alert(`操作文件ID: ${id}`);
  router.push({ name: 'practice', params: { id } });
};

const shareFile = () => {
  router.push({ name: 'share' });
};
</script>

<style scoped>
.file {
  color: black;
  font-family: 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  width: 100%;
}

.file-list-container {
  width: 100%;
  margin: auto;
  margin-top: 20px;
}

.file-controls {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  padding-bottom: 20px;
}

.tag-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.file-tag {
  font-size: 12px;
}

/* 默认隐藏操作按钮 */
.action-button {
  display: none;
}

/* 当鼠标悬停在表格行时，显示操作按钮 */
.el-table__body tr:hover .action-button {
  display: inline-block;
  position: absolute;
  left: -260px;
}
.progress-green {
  color: green;
}

.progress-yellow {
  color: orange;
}

.progress-red {
  color: red;
}
</style> -->
<template>  
  <el-row :gutter="40" class="discount">  
    <el-col :span="6" v-for="(item, index) in CardItemData" :key="index">  
      <div class="item" @click="goToDetail(item.id)">  
        <div class="imgItem">  
          <img :src="item.imgUrl" />  
        </div>  
        <div class="info">  
          <div class="title-container"> <!-- 新增的容器 -->  
            <div class="title">{{ item.title }}</div>  
            <div class="action-button"> <!-- 操作按钮 -->  
              <el-button type="text" @click.stop="goToDetail(item.id)">进入</el-button>  
              <el-button type="text" @click.stop="deleteItem(item.id)">删除</el-button>  
            </div>  
          </div>  
          <div class="desc">{{ item.desc }}</div>  
          <div class="bottom">{{ item.time }}</div>  
        </div>  
      </div>  
    </el-col>  
  </el-row>  
</template>  

<script setup>  
import { ItemList as CardItemData } from "@/assets/data/MyBank";  
import { useRouter } from 'vue-router';  

const router = useRouter();  
const goToDetail = (id) => {  
  router.push({ name: 'ItemDetail', params: { id } });  
}  

const deleteItem = (id) => {  
  // 这里你可以添加删除逻辑，比如弹出确认框或调用 API  
  alert(`删除项 ID: ${id}`);  
}  
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