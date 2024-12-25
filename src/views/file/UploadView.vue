<template>
  <div class="upload-page">
    <el-card class="upload-container">
      <h1>上传文件</h1>
      <div class="upload-area">
        <p>目前仅支持5MB以内的PDF/DOC/DOCX/TXT文件上传，请确保文件格式正确</p>
        <el-button
          type="primary"
          link
          icon="el-icon-upload"
          @click="triggerFileInput"
        >
          点击上传文件
        </el-button>
        <input
          type="file"
          @change="handleFileUpload"
          class="file-input"
          ref="fileInput"
        />
        <div v-if="fileName" class="file-name">
          <el-tag>{{ fileName }}</el-tag>
        </div>
      </div>
      <el-button
        type="success"
        link
        :disabled="!selectedFile"
        @click="showForm"
      >
        下一步
      </el-button>

      <!-- 弹出表单 -->
      <el-dialog v-model="isFormVisible" title="文件信息">
        <el-form :model="form">
          <el-form-item label="自定义名称" :label-width="formLabelWidth">
            <el-input
              v-model="form.customName"
              placeholder="请输入文件名称"
            ></el-input>
          </el-form-item>
          <div class="tag-input-container">
            <el-input
              v-model="newTag"
              placeholder="输入标签后按 Enter 添加"
              @keyup.enter="addTag"
            ></el-input>
          </div>

          <div class="selected-tags">
            <span>已选标签：</span>
            <div class="tag-list">
              <el-tag
                v-for="(tag, index) in form.selectedTags"
                :key="index"
                closable
                @close="removeTag(tag)"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>

          <!-- 可选标签 -->
          <div class="available-tags">
            <span>可选标签：</span>
            <div class="tag-buttons">
              <el-button
                v-for="tag in availableTags"
                :key="tag"
                size="mini"
                :type="form.selectedTags.includes(tag) ? 'primary' : 'default'"
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </el-button>
            </div>
          </div>
        </el-form>
        <template #footer>
          <el-button @click="closeForm">取消</el-button>
          <el-button type="primary" @click="submitForm">确认</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const selectedFile = ref(null);
const fileName = ref("");
const isFormVisible = ref(false);
const form = ref({
  customName: "",
  selectedTags: [],
});
const availableTags = ref(["数学", "物理", "化学", "生物", "英语", "历史"]);
const newTag = ref("");
const maxTags = 7; // 最大标签数量

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
  if (selectedFile.value) {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!validTypes.includes(selectedFile.value.type)) {
      this.$message.error(
        "不支持的文件类型。请上传PDF、DOC、DOCX或TXT文件。"
      );
      resetFile();
      return;
    }
    if (selectedFile.value.size > 5 * 1024 * 1024) {
      this.$message.error("文件大小不能超过5MB");
      resetFile();
      return;
    }
    fileName.value = selectedFile.value.name;
    form.value.customName = fileName.value;
  }
};

const resetFile = () => {
  selectedFile.value = null;
  fileName.value = "";
  form.value.customName = "";
};

const triggerFileInput = () => {
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) {
    fileInput.click();
  }
};

const showForm = () => {
  if (selectedFile.value) {
    isFormVisible.value = true; // 打开弹窗
  } else {
    this.$message.error("请先选择文件！");
  }
};

const closeForm = () => {
  isFormVisible.value = false; // 关闭弹窗
  form.value.selectedTags = [];
};

const submitForm = () => {
  if (form.value.selectedTags.length === 0) {
    this.$message.error("请至少选择一个标签！");
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile.value);
  formData.append("name", form.value.customName);
  formData.append("tags", form.value.selectedTags.join(","));

  fetch("YOUR_BACKEND_API_URL", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      this.$message.success("文件上传成功");
      closeForm();
      resetFile();
    })
    .catch((error) => {
      console.error("Error:", error);
      this.$message.error("文件上传失败");
    });
};

const addTag = () => {
  if (newTag.value && !form.value.selectedTags.includes(newTag.value) && form.value.selectedTags.length < maxTags) {
    form.value.selectedTags.push(newTag.value);
  }
  newTag.value = "";
};

const removeTag = (tag) => {
  form.value.selectedTags = form.value.selectedTags.filter(t => t !== tag);
};

const toggleTag = (tag) => {
  if (form.value.selectedTags.includes(tag)) {
    removeTag(tag);
  } else if (form.value.selectedTags.length < maxTags) {
    form.value.selectedTags.push(tag);
  }
};
</script>

<style scoped>
.vertical-layout .el-form-item__content {
  display: block; /* 使内容块级显示，从而垂直排列 */
  margin-left: 0; /* 重置左边距，因为标签和内容将垂直排列 */
}

.upload-page {
  text-align: center;
  padding: 20px;
  background-color: #f7f7f7;
}

.upload-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.upload-area {
  margin-bottom: 20px;
}

.file-input {
  display: none;
}

.file-name {
  margin-top: 10px;
}

.error {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
.tag-input-container {
  align-items: center;
  margin-bottom: 10px;
}

.selected-tags,
.available-tags {
  margin-top: 15px;
  text-align: left;
}

.selected-tags span,
.available-tags span {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}


.selected-tags {
  margin: 10px 0; /* 可以根据需要调整外边距 */
}

.tag-list {
  display: flex; /* 启用 Flexbox */
  flex-wrap: wrap; /* 允许换行 */
  gap: 10px; /* 标签之间的间隔，可以根据需要调整 */
}

.tag-list .el-tag {
  margin-bottom: 10px; /* 标签底部的间隔 */
}
.tag-buttons {
  flex-wrap: wrap; /* 支持换行 */
  gap: 8px; /* 元素之间的间距 */
}

.el-tag,
.el-button {
  flex-shrink: 0;
}

.el-tag {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.el-button {
  padding: 4px 8px;
}

.upload-area p {
  margin-bottom: 15px;
  font-size: 14px;
  color: #666;
}
</style>
