<template>  
  <el-container class="file-list-container">  
    <!-- 控制按钮 -->  
    <el-header class="file-controls">  
      <el-button type="primary" icon="Upload" @click="uploadFile">上传</el-button>  
      <el-button type="success" icon="Link">链接</el-button>  
      <el-button type="success" icon="Share" @click="shareFile">分享</el-button>  
      <el-button type="success" icon="Generate" :disabled="!selectedFile" @click="generateQuestionBank">  
        生成题库  
      </el-button>  
    </el-header>  

    <!-- 文件列表 -->  
    <el-main>  
      <el-table  
        :data="files"  
        size="large"  
        class="file"  
        stripe  
        style="width: 100%"  
        @selection-change="handleSelectionChange"  
        ref="multipleTable"  
      >  
        <el-table-column type="selection" width="55"></el-table-column>  
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
                <el-button type="link" @click="someAction(row.id)">进入</el-button>  
                <el-button type="link" @click="someAction(row.id)">删除</el-button>  
              </div>  
            </div>  
          </template>  
        </el-table-column>  
      </el-table>  
    </el-main>  
  </el-container>  

  <!-- 弹出表单 -->  
  <el-dialog v-model="isFormVisible" title="生成题库" custom-class="custom-dialog">  
    <el-form :model="form" class="dialog-form">  
      <el-form-item label="题库名称" :label-width="formLabelWidth">  
        <el-input v-model="form.customName" placeholder="请输入题库名称"></el-input>  
      </el-form-item>  

      <el-form-item label="上传封面图片" :label-width="formLabelWidth">  
        <input type="file" @change="handleCoverImageChange" accept="image/*" />  
      </el-form-item>  

      <el-form-item label="题库描述" :label-width="formLabelWidth">  
        <el-input  
          type="textarea"  
          v-model="form.description"  
          placeholder="请输入题库描述"  
        ></el-input>  
      </el-form-item>  

      <el-form-item label="添加标签" :label-width="formLabelWidth">  
        <el-input  
          v-model="newTag"  
          placeholder="输入标签后按 Enter 添加"  
          @keyup.enter="addTag"  
        ></el-input>  
        <div class="selected-tags">  
          <span>已选标签：</span>  
          <el-tag  
            v-for="(tag, index) in form.selectedTags"  
            :key="index"  
            closable  
            @close="removeTag(tag)"  
          >  
            {{ tag }}  
          </el-tag>  
        </div>  
      </el-form-item>  

      <el-form-item>  
        <div class="image-preview-container">  
          <img v-if="form.coverImagePreview" :src="form.coverImagePreview" class="preview-image" />  
        </div>  
        <div class="description">{{ form.description }}</div>  
      </el-form-item>  
    </el-form>  
    <template #footer>  
      <el-button @click="closeForm">取消</el-button>  
      <el-button type="success" @click="submitForm">确认</el-button>  
    </template>  
  </el-dialog>  
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
]);  
const selectedFiles = ref([]);  
const selectedFile = ref(null); // 当前选择的文件  
const isFormVisible = ref(false);  
const form = ref({  
  customName: '',  
  description: '',  
  coverImage: null,  
  coverImagePreview: null,  
  selectedTags: [],  
});  
const newTag = ref('');  
const formLabelWidth = '120px';  
const activeIndex = ref(0); // 添加 activeIndex 的定义  

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
  if (!selectedFile.value) {  
    alert('请先选择文件！');  
  } else {  
    form.value.selectedTags = selectedFile.value.tag.slice(); // 复制当前文件的标签  
    isFormVisible.value = true;  
  }  
};  

const handleSelectionChange = (val) => {  
  selectedFiles.value = val;  
  if (val.length > 0) {  
    selectedFile.value = val[0];  
  } else {  
    selectedFile.value = null;  
  }  
};  

const handleCoverImageChange = (event) => {  
  const file = event.target.files[0];  
  if (file && file.type.startsWith('image/')) {  
    if (file.size <= 1024 * 1024) { // 限制图片大小为1MB  
      form.value.coverImage = file;  
      const reader = new FileReader();  
      reader.onload = (e) => {  
        form.value.coverImagePreview = e.target.result;  
      };  
      reader.readAsDataURL(file);  
    } else {  
      alert('图片文件大小不能超过1MB！');  
      event.target.value = ''; // 清空选择  
    }  
  } else {  
    alert('请选择图片文件！');  
    event.target.value = ''; // 清空选择  
  }  
};  

const addTag = () => {  
  if (newTag.value.trim()) {  
    if (!form.value.selectedTags.includes(newTag.value)) {  
      form.value.selectedTags.push(newTag.value.trim());  
    } else {  
      alert('该标签已存在！');  
    }  
    newTag.value = ''; // 清空输入框  
  } else {  
    alert('请输入有效的标签！');  
  }  
};  

const removeTag = (tag) => {  
  const index = form.value.selectedTags.indexOf(tag);  
  if (index !== -1) {  
    form.value.selectedTags.splice(index, 1);  
  }  
};  

const closeForm = () => {  
  isFormVisible.value = false;  
  form.value = {  
    customName: '',  
    description: '',  
    coverImage: null,  
    coverImagePreview: null,  
    selectedTags: [],  
  };  
  newTag.value = '';  
};  

const submitForm = () => {  
  if (!form.value.coverImage) {  
    alert('请上传封面图片');  
    return;  
  }  
  // 这里可以添加提交表单的逻辑  
  console.log('提交的表单数据:', form.value);  
  isFormVisible.value = false; // 只有在确认时才关闭窗口  
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
.image-preview-container {  
  display: flex;  
  justify-content: center; /* 水平居中对齐 */  
  align-items: center; /* 垂直居中对齐 */  
  flex-direction: column; /* 竖向排列容器内的元素 */  
  width: 200px; /* 设置固定宽度 */  
  height: 200px; /* 设置固定高度 */  
  border: 1px solid #ccc; /* 添加边框 */  
  margin: 0 auto 10px; /* 水平居中，底部间距为10px */  
  overflow: hidden; /* 隐藏溢出部分 */  
  position: relative; /* 为绝对定位提供参考 */  
}  

.preview-image {  
  max-width: 100%; /* 最大宽度为容器的100% */  
  max-height: 100%; /* 最大高度为容器的100% */  
  object-fit: cover;
}  

.description {  
  position: absolute; /* 绝对定位 */  
  bottom: -30px; /* 存在于容器下方，可以根据需要调整这个值 */  
  left: 50%;  
  transform: translateX(-50%); /* 水平居中 */  
  width: 300px; /* 描述的宽度 */  
  text-align: center; /* 描述文本居中 */  
  margin-top: 10px; /* 描述离方框的额外间距 */  
}
.name {
    position: absolute;
    top: -30px; /* 根据需要调整，使其位于图片方框上方 */
    left: 50%;
    transform: translateX(-50%);
    width: 300px; /* 与图片方框相同的宽度 */
}
</style>