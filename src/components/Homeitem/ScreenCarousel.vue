<template>
  <div class="screen-container">
    <!-- Element Plus Carousel 轮播图 -->
    <el-carousel :interval="5000" arrow="always">
      <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
        <div class="carousel-content">
          <img :src="item.imgUrl" alt="carousel item" class="carousel-img" />
          <div class="caption">{{ item.caption }}</div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import MonkeyGodImg from '@/assets/images/MonkeyGod.png';
// 定义 Carousel 项目
const carouselItems = ref([
  { imgUrl: MonkeyGodImg, caption: 'Slide 1' },
  { imgUrl: MonkeyGodImg, caption: 'Slide 2' },
  { imgUrl: MonkeyGodImg, caption: 'Slide 3' },
  { imgUrl: MonkeyGodImg, caption: 'Slide 4' },
]);
</script>

<style scoped>
.screen-container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  margin-bottom: 50px;
  background-color: black;
}

.carousel-content {
  position: relative;
  text-align: center;
  color: white;
}

.carousel-img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.caption {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  font-size: 18px;
  color: white;
}
</style>
