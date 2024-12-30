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
        <el-table-column prop="modified" label="最近修改时间"></el-table-column>
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
                <a :href="`/api${row.fileUrl}`" download>
                  <el-button type="link" @click="downLoadAction">下载</el-button>
                </a>
                <el-button type="link" @click="deleteAction(row.id)">删除</el-button>
                <el-button type="link" @click="openUpdateForm(row)">更新</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>

  <!-- 生成题库弹出表单 -->
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

  <!-- 更新表单 -->
  <el-dialog v-model="isUpdateFormVisible" title="文件信息">
    <el-form :model="updateForm" :label-width="formLabelWidth">
      <el-form-item label="自定义名称">
        <el-input v-model="updateForm.customName" placeholder="请输入文件名称"></el-input>
      </el-form-item>
      <div class="tag-input-container">
        <el-input
          v-model="updateNewTag"
          placeholder="输入标签后按 Enter 添加"
          @keyup.enter="addTagToUpdateForm"
        ></el-input>
      </div>
      <div class="selected-tags">
        <span>已选标签：</span>
        <div class="tag-list">
          <el-tag
            v-for="(tag, index) in updateForm.selectedTags"
            :key="index"
            closable
            @close="removeTag(tag, 'update')"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="closeUpdateForm">取消</el-button>
      <el-button type="primary" @click="submitUpdateForm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import 'element-plus/dist/index.css';
import fileApi from '@/api/file'; // 确保路径正确

const router = useRouter();
const files = ref([]);
const transformedFiles = ref([]);
const selectedFiles = ref([]);
const selectedFile = ref(null);
const isFormVisible = ref(false);
const isUpdateFormVisible = ref(false);
const form = ref({
  customName: '',
  description: '',
  coverImage: null,
  coverImagePreview: null,
  selectedTags: [],
  selectedFileIds: [] // 新增属性，用于存储选中的文件ID
});
const updateForm = ref({
  fileId: null, // 新增文件 ID
  customName: '',
  selectedTags: [],
});
const newTag = ref('');
const updateNewTag = ref('');
const formLabelWidth = '120px';

const uploadFile = () => {
  router.push({ name: 'upload' });
};

const downLoadAction = () => {
  alert('开始下载');
};

const deleteAction = async (id) => {
  if (confirm("确定要删除这个文件吗？")) {
    try {
      const response = await fileApi.delete({ fileId: id });
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
  if (form.value.selectedFileIds.length === 0) {  
    alert('请先选择文件！');  
  } else {  
    form.value.selectedTags = selectedFile.value.tag.slice();  
    isFormVisible.value = true;  
  }  
};  

const handleSelectionChange = (val) => {  
  selectedFiles.value = val;  
  form.value.selectedFileIds = val.map(file => file.id); // 收集选中的文件ID
  if (val.length > 0) {  
    selectedFile.value = val[0];  
  } else {  
    selectedFile.value = null;  
  }  
};

const handleCoverImageChange = (event) => {
  // 获取选中的第一个文件
  const selectedImage = event.target.files[0];
  if (selectedImage) {
    // 验证文件类型
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp"
    ];
    if (!validImageTypes.includes(selectedImage.type)) {
      this.$message.error(
        "不支持的文件类型。请上传JPEG、PNG、GIF或WEBP格式的图片。"
      );
      resetImage();
      return;
    }
    // 验证文件大小
    if (selectedImage.size > 2 * 1024 * 1024) { // 限制为2MB
      this.$message.error("文件大小不能超过2MB");
      resetImage();
      return;
    }
    // 设置文件名及预览
    form.value.coverImage = selectedImage; // 保存选中的图片文件
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.coverImagePreview = e.target.result; // 读取文件并生成预览
    };
    reader.readAsDataURL(selectedImage);
  }
};

// 提交表单
const submitForm = async () => {
  // 验证标签是否输入
  if (form.value.selectedTags.length === 0) {
    alert("请至少选择一个标签！");
    return;
  }
  
  // 验证图片文件是否选择
  if (!form.value.coverImage) {
    alert("请上传封面图片！");
    return;
  }

  // 创建 FormData 对象并添加图片文件
  const imageFormData = new FormData();
  imageFormData.append("file", form.value.coverImage);

  try {
    // 调用图片上传接口
    const uploadResponse = await sourceApi.uploadImage(imageFormData);
    console.log('图片上传响应:', uploadResponse);
    
    // 检查上传结果
    if (uploadResponse.code !== 200) {
      alert("图片上传失败");
      return;
    }
    
    alert("图片上传成功");

    // 从上传响应中获取图片URL
    const coverUrl = uploadResponse.data; // 假设响应中包含图片的 URL
    // 创建题库的参数
    const createParams = {
      fileIdList: form.value.selectedFileIds, // 使用选中的文件ID列表
      title: form.value.customName,
      description: form.value.description,
      keywords: JSON.stringify(form.value.selectedTags), // 将标签 JSON 化
      coverUrl: coverUrl // 使用上传后的图片 URL
    };
    console.log(createParams);
    // 调用创建参数接口
    const createResponse = await questionBankApi.create(createParams);
    console.log(createResponse)
    if (createResponse.code === 200) {
      alert("题库创建成功");
      closeForm();
    } else {
      alert("题库创建失败");
    }
  } catch (error) {
    console.error("提交时发生错误:", error);
    alert("提交失败");
  }
};

// 重置图片相关状态
const resetImage = () => {
  form.value.coverImage = null;
  form.value.coverImagePreview = null;
};

const openUpdateForm = (row) => {
  updateForm.value.fileId = row.id; // 读取文件 ID
  updateForm.value.customName = row.name; // 读取文件名
  updateForm.value.selectedTags = row.tag.slice(); // 读取当前文件的标签
  isUpdateFormVisible.value = true; // 显示更新表单
};

const closeUpdateForm = () => {
  isUpdateFormVisible.value = false;
  updateForm.value = { fileId: null, customName: '', selectedTags: [] }; // 重置表单
};

const submitUpdateForm = async () => {
  if (!updateForm.value.fileId) {
    alert("文件 ID 是必填项");
    return;
  }

  const keywordsStr = JSON.stringify(updateForm.value.selectedTags);
  const updateData = {
    fileId: updateForm.value.fileId,
    fileName: updateForm.value.customName,
    keywords: keywordsStr,
    // isPublic: false // 默认不传，确保后端处理为可选
  };

  try {
    const response = await fileApi.updatefile(updateData); // 更新接口调用
    if (response.code === 200) {
      alert("文件更新成功");
      closeUpdateForm();
      await loadFiles(); // 更新文件列表
    } else {
      alert("文件更新失败");
    }
  } catch (error) {
    console.error("更新文件时发生错误:", error);
    alert("更新文件失败");
  }
};

const addTag = () => {
  if (newTag.value.trim()) {
    if (!form.value.selectedTags.includes(newTag.value)) {
      form.value.selectedTags.push(newTag.value.trim());
    } else {
      alert('该标签已存在！');
    }
    newTag.value = '';
  } else {
    alert('请输入有效的标签！');
  }
}; 

const addTagToUpdateForm = () => {
  if (updateNewTag.value.trim()) {
    if (!updateForm.value.selectedTags.includes(updateNewTag.value)) {
      updateForm.value.selectedTags.push(updateNewTag.value.trim());
    } else {
      alert('该标签已存在！');
    }
    updateNewTag.value = '';
  } else {
    alert('请输入有效的标签！');
  }
};

const removeTag = (tag, formType = 'create') => {
  const targetForm = formType === 'update' ? updateForm.value.selectedTags : form.value.selectedTags;
  const index = targetForm.indexOf(tag);
  if (index !== -1) {
    targetForm.splice(index, 1);
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
    selectedFileIds: [] // 重置选中的文件ID列表
  };  
  newTag.value = '';  
};  

const loadFiles = async () => {
  try {
    const response = await fileApi.getFileList();
    if (response.code === 200) {
      files.value = response.data;
      console.log(files.value);
      transformFiles(); // 确保调用 transformFiles 函数
    } else {
      alert(response.data.message || '加载文件列表失败');
    }
  } catch (error) {
    console.error("Failed to load files:", error);
    alert('加载文件列表时发生错误');
  }
};

const transformFiles = () => {
  transformedFiles.value = files.value.map(file => {
    return {
      id: file.fileId,
      name: file.fileName,
      modified: file.updatedAt, // 或者选择 updatedAt
      tag: JSON.parse(file.keywords), // 将 JSON 字符串转换为数组
      fileUrl: file.fileUrl // 添加文件下载 URL
    };
  });
};

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
</style>
<template>
  <el-row :gutter="40" class="discount">
    <el-col :span="6" v-for="(item, index) in transformedBanks" :key="index">
      <div class="item" @click="goToDetail(item.id)">
        <div class="imgItem">
          <img :src="item.fileUrl" v-if="item.fileUrl" />
          <div v-else class="placeholder">无图片</div> <!-- 处理没有图片的情况 -->
        </div>
        <div class="info">
          <div class="title-container">
            <div class="title">{{ item.name }}</div>
            <div class="action-button">
              <el-button type="text" @click.stop="goItem(item.id)">进入</el-button>
              <el-button type="text" @click.stop="deleteItem(item.id)">删除</el-button>
            </div>
          </div>
          <div class="desc">{{ item.des }}</div>
          <div class="bottom">{{ item.modified }}</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import 'element-plus/dist/index.css';
import questionBankApi from '@/api/questionBank';
import sourceApi from '@/api/source'; // 引入新的 API

const Banks = ref([]);
const transformedBanks = ref([]);

const router = useRouter();

const goToDetail = (id) => {
  router.push({ name: 'ItemDetail', params: { id } });
};

const goItem = (id) => {
  router.push({ name: 'questionbank' }).then(() => {
    router.push({ name: 'practice', params: { id } });
  });
};

// 加载题库列表
const loadBanks = async () => {
  try {
    const response = await questionBankApi.getBankList();
    if (response.code === 200) {
      Banks.value = response.data;
      console.log(response.data);
      transformBanks();
    } else {
      alert(response.data.message || '加载题库列表失败');
    }
  } catch (error) {
    console.error("Failed to load banks:", error);
    alert('加载题库列表时发生错误');
  }
};

// 数据转换函数
const transformBanks = () => {
  transformedBanks.value = Banks.value.map(bank => {
    return {
      id: bank.bankId,
      name: bank.title,
      des: bank.description,
      modified: bank.createdAt,
      fileUrl: bank.coverUrl || '/path/to/default/image.jpg', // 设置默认图片
      tag: JSON.parse(bank.keywords)
    };
  });
};

// 删除题库
const deleteItem = async (id) => {
  if (confirm("确定要删除这个题库吗？")) {
    try {
      const response = await questionBankApi.delete({ bankId: id });
      if (response && response.code === 200) {
        alert('文件删除成功');
        await loadBanks(); 
      } else {
        alert((response && response.data && response.data.message) || '删除题库失败');
      }
    } catch (error) {
      console.error("删除题库时发生错误:", error);
      alert('发生错误，删除题库失败，错误信息为: ' + (error.message || '未知错误'));
    }
  }
};

// 上传图片
const uploadImage = async (file, bankId) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await sourceApi.uploadImage(formData);
    if (response.code === 200) {
      alert('图片上传成功');
      await loadBanks(); // 重新加载题库列表以显示新的图片
    } else {
      alert('图片上传失败，原因: ' + (response.data.message || '未知错误'));
    }
  } catch (error) {
    console.error("图片上传时发生错误:", error);
    alert('发生错误，图片上传失败，错误信息为: ' + (error.message || '未知错误'));
  }
};

onMounted(loadBanks);
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
  height: 250px;
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
  height: 65%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: gray;
    font-size: 16px;
  }
}

.info {
  padding: 5px;
  flex: 1;
  background-color: #eeeeee;

  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding: 5px;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 1px;
    font-family: system-ui;
  }

  .action-button {
    display: none;
  }

  .title-container:hover .action-button {
    display: flex;
    gap: 10px;
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