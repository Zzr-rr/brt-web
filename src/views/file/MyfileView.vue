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