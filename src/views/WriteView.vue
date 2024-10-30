<template>
  <div>
  
      <ElButton @click="returnMyfile">返回</ElButton>
    <el-card class="edit-box-card">
      <!-- 标题输入 -->
      <el-form-item label="题目 (title):">
        <el-input v-model="article.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <!-- 简述输入 -->
      <el-form-item label="简述 (desc):">
        <el-input v-model="article.desc" placeholder="请输入简述"></el-input>
      </el-form-item>

      <!-- 内容输入 -->
      <el-form-item label="内容 (content):">
        <el-input
          v-model="article.content"
          type="textarea"
          :rows="5"
          placeholder="请输入内容，支持文本和图片"
        ></el-input>
        <el-upload
          class="upload-demo"
          action="#"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>

      <!-- 附件上传 -->
      <el-form-item label="附件 (可选):">
        <el-upload
          action="#"
          multiple
          :file-list="fileList"
          :on-preview="handleFilePreview"
          :on-remove="handleFileRemove"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">支持多文件上传</div>
        </el-upload>
      </el-form-item>

      <!-- 标签选择 -->
      <el-form-item label="标签 (tag):">
        <el-select v-model="article.tag" placeholder="请选择一个标签" style="width: 100%">
          <el-option
            v-for="tag in tags"
            :key="tag.value"
            :label="tag.label"
            :value="tag.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 提交按钮 -->
      <div class="submit-button">
        <el-button type="primary" @click="submitArticle">提交文章</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElButton, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
const router=useRouter();
const article = ref({
  title: '',
  desc: '',
  content: '',
  tag: '',
});

const returnMyfile=()=>{
  router.push({name:'myfile'});
}
const fileList = ref([]);
const tags = ref([
  { value: 'genshin', label: '元神' },
  { value: 'default', label: '默认' },
  { value: 'homo', label: 'homo' },
]);

const dialogImageUrl = ref('');
const dialogVisible = ref(false);

function handlePictureCardPreview(file) {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
}

function handleRemove(file, fileList) {
  console.log(file, fileList);
}

function handleFilePreview(file) {
  console.log(file);
}

function handleFileRemove(file, fileList) {
  console.log(file, fileList);
}

function submitArticle() {
  if (!article.value.title || !article.value.desc || !article.value.content || !article.value.tag) {
    ElMessage.error('请填写完整信息');
    return;
  }
  ElMessage.success('文章提交成功');
  console.log('文章内容:', article.value);
}
</script>

<style scoped>
.edit-box-card {
  padding: 20px;
}

.submit-button {
  text-align: center;
  margin-top: 20px;
}
</style>
