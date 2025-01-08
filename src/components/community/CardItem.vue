<template>
  <el-row :gutter="40" class="discount">
    <el-col :span="6" v-for="(item, index) in CardItemData.value" :key="index">
      <div
        class="item"
        :key="item.interactionId"
        @click="goToDetail(item.interactionId, item.content)"
      >
        <div class="imgItem">
          <img :src="cardImage" />
        </div>
        <div class="info">
          <div class="title">我是题目</div>
          <div class="desc">{{ item.content }}</div>
          <div class="like-area">
            <el-icon
              color="#409efc"
              :class="{'active': item.isLiked}"
              @click.stop="Starone(item)"
            >
              <Star />
            </el-icon>
            <span>{{ item.likesCount }}</span>
          </div>
          <div class="bottom">{{ item.createdAtFormatted }}</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script setup>
import { useRouter } from "vue-router";
import {  reactive, onMounted } from "vue";
import CommunityApi from "@/api/communityInteraction";
import { ElIcon } from 'element-plus';
// import vue from "eslint-plugin-vue";
import cardImage from '@/assets/images/card1.png';  // 指定完整的文件名和扩展名
const CardItemData = reactive([]);  // 用于存储卡片数据
const router = useRouter();

const goToDetail = (id, content) => {
  router.push({ name: "TestView", params: { id, content } });
};

// 点赞功能处理
const Starone = async (item) => {
  
  item.isLiked = true; 
    item.likesCount += 1;

  // 发送点赞请求
  try {
    await CommunityApi.LikeAdder({ targetId: item.interactionId });
    console.log("点赞操作完成");
  } catch (error) {
    console.error("点赞失败", error);
  }
};

onMounted(async () => {
  
  try {
    const response = await CommunityApi.getIteminfo();
    if (response && response.data) {
      response.data.data.forEach((post) => {
        const createdAt = post.createdAt;
        if (createdAt) {
          const date = new Date(createdAt);
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const formattedDate = `${month}.${day}`;
          post.createdAtFormatted = formattedDate;
        }
        post.isLiked = false; // 默认状态为未点赞
      });
      CardItemData.value = response.data.data;
    }
  } catch (error) {
    console.error("获取帖子内容失败：", error);
  }
});
</script>

<style lang="less" scoped>
.discount {
  border-radius: 10px;
}
.item:hover {
  cursor: pointer;
}
.item {
  margin-bottom: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  width: 100%;
  height: 200px;
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
  height: 45%;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.info {
  padding: 5px;
  flex: 1;
  background-color: #eeeeee;
  .title {
    padding: 5px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 1px;
    font-family: system-ui;
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
  .like-area {
    padding: 5px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .like-area .el-icon {
    font-size: 20px;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  /* 当点赞星星被点击时，增加 active 样式 */
  .like-area .el-icon.active {
    color: #ffd700;  /* 星星填充颜色 */
  }
}
</style>
