<template>
  <el-container class="file-list-container">
    <!-- 控制按钮 -->
    <el-header class="file-controls">
      <el-button type="primary" icon="Upload" @click="uploadFile">上传</el-button>
      <el-button type="success" icon="Link">链接</el-button>
      <el-button type="success" icon="Share" @click="shareFile">分享</el-button>
      <el-button type="success" icon="Generate" @click="generateQuestionBank">生成题库</el-button>
    </el-header>
    <!-- 文件列表 -->
     
    <el-main>
      <el-table
        :data="transformedFiles"
        size="large"
        class="file"
        stripe
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
        ref="multipleTable"
      >

        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="文件名" width="200"></el-table-column>
        <el-table-column prop="modified" label="最近使用时间"></el-table-column>
        <el-table-column label="标签">
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
                <a :href="`/api${row.fileUrl}`" download><el-button type="link" @click="downLoadAction">下载</el-button></a>
                <el-button type="link" @click="deleteAction(row.id)">删除</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import 'element-plus/dist/index.css';
import fileApi from '@/api/file'; // 确保路径正确
import axios from 'axios';

const files = ref([]);
const transformedFiles = ref([]);
const selectedFiles = ref([]);
const router = useRouter();

const uploadFile = () => {
  router.push({ name: 'upload' });
};

const downLoadAction = () => {
  alert('开始下载');
};

const deleteAction = async (id) => {
  if (confirm("确定要删除这个文件吗？")) {
    try {
      const response = await fileApi.delete({ fileId: id }); // 传递文件 ID 作为参数
      if (response.code === 200) {
        alert('文件删除成功');
        await loadFiles(); // 重新加载文件列表
      } else {
        alert(response.data.message || '删除文件失败');
      }
    } catch (error) {
      console.error("删除文件时发生错误:", error);
      alert('发生错误，删除文件失败');
    }
  }
};

const shareFile = () => {
  router.push({ name: 'share' });
};

const generateQuestionBank = () => {
  if (selectedFiles.value.length === 0) {
    alert('请至少选择一个文件');
  } else {
    const fileIds = selectedFiles.value.map(file => file.id);
    router.push({ name: 'generate', params: { fileIds } });
  }
};

const handleSelectionChange = (val) => {
  selectedFiles.value = val;
};

// 加载文件列表
const loadFiles = async () => {
  try {
    const response = await fileApi.getFileList();
    if (response.code === 200) {
      files.value = response.data; // 更新原始 files 变量
      console.log(response.data);
      transformFiles(); // 确保调用 transformFiles 函数
    } else {
      alert(response.data.message || '加载文件列表失败');
    }
  } catch (error) {
    console.error("Failed to load files:", error);
    alert('加载文件列表时发生错误');
  }
};

// 数据转换函数
const transformFiles = () => {
  transformedFiles.value = files.value.map(file => {
    return {
      id: file.fileId,
      name: file.fileName,
      modified: file.createdAt, // 或者选择 updatedAt
      tag: JSON.parse(file.keywords), // 将 JSON 字符串转换为数组
      fileUrl: file.fileUrl // 添加文件下载 URL
    };
  });
};

// 组件挂载时加载文件列表
onMounted(loadFiles);
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
.action-button {
  display: none;
}
.el-table__body tr:hover .action-button {
  display: inline-block;
  left: -260px;
}
</style>