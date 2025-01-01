<template>
  <div>
    <!-- 进度条 -->
    <el-progress :percentage="progress" v-if="loading" />

    <el-row :gutter="40" class="discount">
      <el-col :span="6" v-for="(item, index) in transformedBanks" :key="index">
        <div class="item" @mouseenter="item.hover = true" @mouseleave="item.hover = false">
          <div class="imgItem">
            <img v-if="item.fileUrl" :src="item.fileUrl" />
            <div v-else class="placeholder">无图片</div> <!-- 处理没有图片的情况 -->
          </div>
          <div class="info">
            <div class="title-container">
              <div class="title">{{ item.name }}</div>
              <div class="action-button" v-if="item.hover">
                <el-button type="text" @click.stop="goItem(item.id)">进入</el-button>
                <el-button type="text" @click.stop="deleteItem(item.id)">删除</el-button>
                <el-button type="text" @click.stop="openUpdateForm(item)">更新</el-button>
              </div>
            </div>
            <div class="desc">{{ item.des }}</div>
            <div class="bottom">{{ item.modified }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 更新表单 -->
    <el-dialog v-model="isUpdateFormVisible" title="更新题库信息">
      <el-form :model="updateForm" :label-width="formLabelWidth">
        <el-form-item label="题库名称">
          <el-input v-model="updateForm.customName" placeholder="请输入题目名称"></el-input>
        </el-form-item>
        <el-form-item label="上传封面图片" :label-width="formLabelWidth">
          <input type="file" @change="handleCoverImageChange" accept="image/*" />
        </el-form-item>
        <el-form-item label="题库描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="updateForm.des" placeholder="请输入题库描述"></el-input>
        </el-form-item>
        <el-form-item label="添加标签" :label-width="formLabelWidth">
          <el-input v-model="newTag" placeholder="输入标签后按 Enter 添加" @keyup.enter="addTagToUpdateForm"></el-input>
          <div class="selected-tags">
            <span>已选标签：</span>
            <el-tag v-for="(tag, index) in updateForm.selectedTags" :key="index" closable @close="removeTag(tag, 'update')">
              {{ tag }}
            </el-tag>
          </div>
        </el-form-item>
      </el-form>

      <div class="image-preview-container">
        <img v-if="updateForm.coverImagePreview || !updateForm.isImageChanged" :src="updateForm.coverImagePreview || updateForm.fileUrl" alt="封面预览" class="preview-image" />
      </div>

      <template #footer>
        <el-button @click="closeUpdateForm">取消</el-button>
        <el-button type="primary" @click="submitUpdateForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import questionBankApi from '@/api/questionBank';
import sourceApi from '@/api/source'; // 引入新的 API

const Banks = ref([]);
const transformedBanks = ref([]);
const progress = ref(0);
const loading = ref(false);
const isUpdateFormVisible = ref(false);
const updateForm = ref({
  id: null,
  customName: '',
  des: '',
  selectedTags: [],
  fileUrl: '',
  coverImage: null,
  coverImagePreview: null,
  isImageChanged: false // 新增字段标识是否选择了新图片
});
const newTag = ref('');
const router = useRouter();
const formLabelWidth = '120px';

// 跳转到细节页面
const goToDetail = (id) => {
  router.push({ name: 'ItemDetail', params: { id } });
};

// 跳转到题库练习页面
const goItem = (id) => {
  router.push({ name: 'questionbank' }).then(() => {
    router.push({ name: 'practice', params: { id } });
  });
};

// 打开更新表单
const openUpdateForm = (item) => {
  updateForm.value.id = item.id;
  updateForm.value.customName = item.name;
  updateForm.value.des = item.des;
  updateForm.value.selectedTags = item.tag.slice();
  updateForm.value.fileUrl = item.fileUrl;
  updateForm.value.coverImagePreview = item.fileUrl; // 预览图片
  updateForm.value.isImageChanged = false; // 初始化未选择新图片
  isUpdateFormVisible.value = true;
};

// 关闭更新表单
const closeUpdateForm = () => {
  isUpdateFormVisible.value = false;
  updateForm.value = {
    id: null,
    customName: '',
    des: '',
    selectedTags: [],
    fileUrl: null,
    coverImage: null,
    coverImagePreview: null,
    isImageChanged: false,
  };
  newTag.value = '';
};

// 处理封面图片变更
const handleCoverImageChange = (event) => {
  const selectedImage = event.target.files[0];
  if (selectedImage) {
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validImageTypes.includes(selectedImage.type)) {
      ElMessage.error("不支持的文件类型。请上传JPEG、PNG、GIF或WEBP格式的图片。");
      return;
    }
    if (selectedImage.size > 2 * 1024 * 1024) { // 限制为2MB
      ElMessage.error("文件大小不能超过2MB");
      return;
    }
    
    // 预览图片
    const reader = new FileReader();
    reader.onload = (e) => {
      updateForm.value.coverImagePreview = e.target.result; // 设置预览的 URL
    };
    reader.readAsDataURL(selectedImage);
    updateForm.value.coverImage = selectedImage; // 保存选中的图片文件
    updateForm.value.isImageChanged = true; // 标记为已选择新图片
  }
};

// 添加标签到更新表单
const addTagToUpdateForm = () => {
  if (newTag.value.trim()) {
    if (!updateForm.value.selectedTags.includes(newTag.value)) {
      updateForm.value.selectedTags.push(newTag.value.trim());
    } else {
      ElMessage.error('该标签已存在！');
    }
    newTag.value = '';
  } else {
    ElMessage.error('请输入有效的标签！');
  }
};

// 移除标签
const removeTag = (tag, formType = 'update') => {
  const targetForm = formType === 'update' ? updateForm.value.selectedTags : updateForm.value.tag;
  const index = targetForm.indexOf(tag);
  if (index !== -1) {
    targetForm.splice(index, 1);
  }
};

// 提交更新表单
const submitUpdateForm = async () => {
  const coverUrl = updateForm.value.isImageChanged ? await uploadCoverImage() : updateForm.value.fileUrl; // 根据是否更改图片选择不同的 URL
  
  const keywordsStr = JSON.stringify(updateForm.value.selectedTags);
  const updateData = {
    bankId: updateForm.value.id,
    title: updateForm.value.customName,
    description: updateForm.value.des,
    coverUrl: coverUrl,
    keywords: keywordsStr
  };

  try {
    const response = await questionBankApi.updateQuestionbank(updateData);
    if (response.code === 200) {
      ElMessage.success('题库更新成功');
      closeUpdateForm();
      await loadBanks();
    } else {
      ElMessage.error(response.data.message || '题库更新失败');
    }
  } catch (error) {
    console.error("更新题库时发生错误:", error);
    ElMessage.error('发生错误，题库更新失败');
  }
};

// 上传封面图片
const uploadCoverImage = async () => {
  const imageFormData = new FormData();
  imageFormData.append("file", updateForm.value.coverImage);

  try {
    // 调用图片上传接口
    const uploadResponse = await sourceApi.uploadImage(imageFormData);
    if (uploadResponse.code !== 200) {
      ElMessage.error("图片上传失败");
      return null;
    }
    return uploadResponse.data; // 获取上传后的图片 URL
  } catch (error) {
    console.error("上传图片时发生错误:", error);
    ElMessage.error('发生错误，上传图片失败');
    return null;
  }
}

// 加载题库
const loadBanks = async () => {
  loading.value = true;
  try {
    const response = await questionBankApi.getBankList();
    if (response.code === 200) {
      Banks.value = response.data;
      await transformBanks();
    } else {
      ElMessage.error(response.data.message || '加载题库列表失败');
    }
  } catch (error) {
    console.error("Failed to load banks:", error);
    ElMessage.error('加载题库列表时发生错误');
  } finally {
    loading.value = false;
  }
};

// 转换题库数据
const transformBanks = async () => {
  const totalBanks = Banks.value.length;
  let processedBanks = 0;

  await Promise.all(Banks.value.map(async (bank) => {
    let fileUrl = bank.coverUrl;
    if (bank.coverUrl) {
      try {
        const response = await axios.get('/api' + fileUrl, {
          responseType: 'blob',
        });
        fileUrl = window.URL.createObjectURL(response.data);
      } catch (error) {
        console.error("Failed to download image:", error);
        fileUrl = '';
      }
    }

    const transformedItem = {
      id: bank.bankId,
      name: bank.title,
      des: bank.description,
      modified: bank.createdAt,
      fileUrl,
      tag: JSON.parse(bank.keywords),
      hover: false // 新增字段用于悬停状态
    };

    transformedBanks.value.push(transformedItem);
    processedBanks++;
    progress.value = Math.round((processedBanks / totalBanks) * 100);
  }));
};

// 删除题库
const deleteItem = async (id) => {
  if (confirm("确定要删除这个题库吗？")) {
    try {
      const response = await questionBankApi.delete({ bankId: id });
      if (response && response.code === 200) {
        ElMessage.success('文件删除成功');
        await loadBanks();
      } else {
        ElMessage.error((response && response.data && response.data.message) || '删除题库失败');
      }
    } catch (error) {
      console.error("删除题库时发生错误:", error);
      ElMessage.error('发生错误，删除题库失败，错误信息为: ' + (error.message || '未知错误'));
    }
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
  height: 250px; /* 固定高度 */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  transition: transform 0.3s ease;
  padding: 10px; /* 添加内边距 */

  &:hover {
    transform: translateY(-10px);
  }
}

.imgItem {
  height: 65%; /* 调整图片区域的高度 */
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 确保图片完整展示并保持比例 */
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
  flex: 1;
  background-color: #eeeeee;

  .title-container {
    display: flex;
    justify-content: space-between; /* 使标题和按钮分开 */
    align-items: center; /* 垂直居中 */
    position: relative; /* 使按钮可以绝对定位 */
    padding: 5px; /* 添加一些内边距 */
  }

  .title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 1px;
    font-family: system-ui;
    overflow: hidden; /* 溢出隐藏 */
    text-overflow: ellipsis; /* 使用省略号表示溢出 */
    white-space: nowrap; /* 不换行 */
  }

  .action-button {
    display: flex; /* 使用 flex 布局方便按钮排列 */
    gap: 10px; /* 按钮之间的间隔 */
  }

  .desc {
    padding: 8px;
    font-size: 14px;
    color: #0c0c0c;
    line-height: 1.4; /* 行高 */
    font-family: Georgia, serif;
    font-weight: normal;
    overflow: hidden; /* 溢出隐藏 */
    text-overflow: ellipsis; /* 使用省略号表示溢出 */
    white-space: nowrap; /* 不换行 */
  }

  .bottom {
    padding: 5px;
    font-size: 13px;
    color: #2d2d2d;
  }
}

/* 预览图片样式 */
.image-preview-container {
  display: flex;
  justify-content: center; /* 水平居中对齐 */
  align-items: center; /* 垂直居中对齐 */
  flex-direction: column; /* 竖向排列容器内的元素 */
  width: 100%; /* 设置宽度为100% */
  margin-top: 10px;
}

.preview-image {
  max-width: 100%; /* 最大宽度为容器的100% */
  max-height: 200px; /* 最大高度为200px，确保尺寸合适 */
  object-fit: cover; /* 确保图片完整展示并保持比例 */
}
</style>