<template>
    <el-container class="file-list-container">
      <!-- 控制按钮 -->
      <el-header class="file-controls">
        <el-button type="primary" icon="Upload" @click="uploadFile">上传</el-button>
        <el-button type="success" icon="Link">链接</el-button>
        <el-button type="success" icon="Share">分享</el-button>
      </el-header>
  
      <!-- 文件列表 -->
      <el-main>
        <el-table :data="files" class="file">
          <el-table-column prop="name" label="题库名" width="250%" show-overflow-tooltip></el-table-column>
          <el-table-column prop="modified" label="最近使用时间" width="200%" show-overflow-tooltip></el-table-column>
          <el-table-column prop="tag" label="标签" width="400%" show-overflow-tooltip></el-table-column>
          <el-table-column prop="solve" label="进度" width="100%" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import 'element-plus/dist/index.css';
  
  const files = ref([
    
    { id: 2, name: '高等数学', modified: '2024-09-25 19:42', tag:["极限","微积分"],solve:'4/20'},
    { id: 3, name: '低等数学', modified: '2024-09-04 13:41', tag:["整数的加减乘除"] ,solve:'1/20'},
    { id: 4, name: '中等数学', modified: '2024-08-27 20:15', tag: ["求导"] ,solve:'0/20'},
    { id: 5, name: 'AIERDENG', modified: '2024-07-01 21:48', tag: [] ,solve:'14/200'},
    { id: 6, name: '高等元素反应', modified: '2024-05-30 11:54', tag: ["感电","过载"],solve:'4/20' },
    { id: 2, name: '高等数学', modified: '2024-09-25 19:42', tag:["极限","微积分"] ,solve:'4/20'},
    { id: 3, name: '低等数学', modified: '2024-09-04 13:41', tag:["整数的加减乘除"] ,solve:'4/20'},
    { id: 4, name: '中等数学', modified: '2024-08-27 20:15', tag: ["求导"],solve:'4/20' },
    { id: 5, name: 'AIERDENG', modified: '2024-07-01 21:48', tag: [] ,solve:'4/20'},
    { id: 6, name: '高等元素反应', modified: '2024-05-30 11:54', tag: ["感电","过载"] ,solve:'19/20'},
    { id: 2, name: '高等数学', modified: '2024-09-25 19:42', tag:["极限","微积分"],solve:'4/20' },
    { id: 3, name: '低等数学', modified: '2024-09-04 13:41', tag:["整数的加减乘除"],solve:'4/20' },
    { id: 4, name: '中等数学', modified: '2024-08-27 20:15', tag: ["求导"] ,solve:'4/20'},
    { id: 5, name: 'AIERDENG', modified: '2024-07-01 21:48', tag: [] ,solve:'4/20'},
    { id: 6, name: '高等元素反应', modified: '2024-05-30 11:54', tag: ["感电","过载"] ,solve:'8/60'},

  ]);
  
  const uploadFile = () => {
    alert('Upload functionality will be implemented');
  };
  </script>
  
  <style scoped>
  .file{
    color: #444444;
    font-family: 'Microsoft YaHei', sans-serif;
    font-size:13px;
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
  </style>
  