<template>
    <el-container class="file-list-container">
      <!-- 控制按钮 -->
      <el-header class="file-controls">
        <el-button type="primary" icon="Upload" @click="uploadFile">上传</el-button>
        <el-button type="success" icon="Link">链接</el-button>
        <el-button type="success" icon="Share" @click="shareFile">分享</el-button>
      </el-header>
  
      <!-- 文件列表 -->
      <el-main>
        <el-table :data="files" size="large" class="file" stripe style="width: 100%" border>
          <el-table-column prop="name" label="题库名" width="200" ></el-table-column>
          <el-table-column prop="modified" label="最近使用时间" width="180" ></el-table-column>
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
                  <el-button
                  
                   type="text"
                    @click="someAction(row.id)"
                  >
                  进入
                  </el-button>
                  <el-button
                    
                    type="text"
                    @click="someAction(row.id)"
                  >
                  删除
                </el-button>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="solve" label="进度"  ></el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import {useRouter} from 'vue-router'
  import 'element-plus/dist/index.css';
  const router=useRouter();
  const files = ref([
    { id: 1, name: '高等数学', modified: '2024-09-25 19:42', tag: ['极限', '微积分'], solve: '4/20' },
    { id: 2, name: '低等数学', modified: '2024-09-04 13:41', tag: ['整数的加减乘除'], solve: '1/20' },
    { id: 3, name: '中等数学', modified: '2024-08-27 20:15', tag: ['求导'], solve: '0/20' },
    { id: 4, name: 'AIERDENG', modified: '2024-07-01 21:48', tag: [], solve: '14/200' },
    { id: 5, name: '高等元素反应', modified: '2024-05-30 11:54', tag: ['感电', '过载'], solve: '4/20' },
    // 可以继续添加其他文件信息
  ]);
  
  const uploadFile = () => {
    router.push({ name: 'upload' });
  };
  
  const someAction = (id) => {
    alert(`操作文件ID: ${id}`);
    router.push({ name: 'practice', params: { id } });
  };
  
  const shareFile=()=>{
    router.push( {name:'share'});
  
  }
  </script>
  
  <style scoped>
  .file {
    color: #444444;
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
    position:absolute;
    left:-260px;
  }
  </style>
  


<!-- <template>
    <div>
        <h1>This is an mybank page</h1>
    </div>
</template>
<script></script>
<style></style> -->