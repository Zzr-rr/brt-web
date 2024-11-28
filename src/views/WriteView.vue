<template>
  <div>
  
      
    <el-card class="edit-box-card">
      <!-- 标题输入 -->
       <ElButton @click="returnMyfile" class="return" icon="Close" text></ElButton>
      <el-form-item label="题目 :">
        <el-input v-model="article.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <!-- 简述输入 -->
      <el-form-item label="简述 :">
        <el-input v-model="article.desc" placeholder="请输入简述"></el-input>
      </el-form-item>

      <!-- 内容输入 -->
      <el-form-item label="内容 :">
        <el-input
          v-model="article.content"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
        ></el-input>
        <el-dialog v-model="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>

      <!-- 附件上传 -->
      <el-form-item label="附件:">
        <el-upload
          action="#"
          multiple
          :file-list="fileList"
          :on-preview="handleFilePreview"
          :on-remove="handleFileRemove"
        >
          <el-button size="small" type="primary">点击上传</el-button>
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
function handleFilePreview(file) {
  console.log(file);
}

function handleFileRemove(file, fileList) {
  console.log(file, fileList);
}

function submitArticle() {
  if(!article.value.title){
    ElMessage.error('题目必须填写');
    return;
  }
  else if(article.value.content.length<15){
    console.log(article.value.content.length);
    ElMessage.error('至少15字数限制');
    return;
  }
  else if(!article.value.tag){
    ElMessage.error('至少添加一个标签');
    return;
  }
  ElMessage.success('成功添加');
  console.log('文章内容:', article.value);
}
</script>

<style scoped>
.return{
  position: absolute;
  top:90px;
  right: 30px;

}
.edit-box-card {
  padding: 20px;
}

.submit-button {
  text-align: center;
  margin-top: 20px;
}
</style>
