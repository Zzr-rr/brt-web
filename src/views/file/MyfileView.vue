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
        :data="files"
        size="large"
        class="file"
        stripe
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
        ref="multipleTable"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="name" label="文件名" width="200"></el-table-column>
        <el-table-column prop="modified" label="最近使用时间" width="180"></el-table-column>
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
        <!-- <el-table-column prop="generated" label="是否生成题库"></el-table-column> -->
      </el-table>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import 'element-plus/dist/index.css';

const router = useRouter();
const files = ref([
  { id: 1, name: '高等数学', modified: '2024-09-25 19:42', tag: ['极限', '微积分'], generated: '是' },
  { id: 2, name: '低等数学', modified: '2024-09-04 13:41', tag: ['整数的加减乘除'], generated: '是' },
  { id: 3, name: '中等数学', modified: '2024-08-27 20:15', tag: ['求导'], generated: '否' },
  { id: 4, name: 'AIERDENG', modified: '2024-07-01 21:48', tag: [], generated: '否' },
  { id: 5, name: '高等元素反应', modified: '2024-05-30 11:54', tag: ['感电', '过载'], generated: '是' },
  // 可以继续添加其他文件信息
]);
const selectedFiles = ref([]);

const uploadFile = () => {
  router.push({ name: 'upload' });
};

const someAction = (id) => {
  alert(`操作文件ID: ${id}`);
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
  position: absolute;
  left: -260px;
}
</style>