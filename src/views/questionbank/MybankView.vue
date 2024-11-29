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

const router = useRouter();

// 文件数据，其中 `solve` 表示已解决的题目数量，`modified` 表示总题量
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
</style>
