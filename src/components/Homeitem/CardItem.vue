<template>
  <el-row :gutter="40" class="discount">
    <el-col :span="6" v-for="(item, index) in CardItemData.value" :key="index">
      <div
        class="item"
        :key="item.interactionId"
        @click="goToDetail(item.interactionId)"
      >
        <div class="imgItem">
          <img :src="item.imgUrl" />
        </div>
        <div class="info">
          <div class="title">我是题目</div>
          <div class="desc">{{ item.content }}</div>
          <div class="bottom">{{ item.createdAtFormatted }}</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { ItemList as CardItemData1 } from "@/assets/data/Homeitem";
import CommunityApi from "@/api/communityInteraction";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
const CardItemData = ref([]);
const router = useRouter();
const goToDetail = (id) => {
  router.push({ name: "ItemDetail", params: { id } });
};

onMounted(async () => {
  try {
    const response = await CommunityApi.getIteminfo();
    if (response && response.data) {
      CardItemData.value = response.data;

      response.data.forEach((post) => {
        const createdAt = post.createdAt;

        if (createdAt) {
          const date = new Date(createdAt);
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const formattedDate = `${month}.${day}`;
          post.createdAtFormatted = formattedDate;
        }
      });
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
}
</style>
