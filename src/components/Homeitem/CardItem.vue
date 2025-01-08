<template>
  <div class="screen-container">
    <!-- 背景轮播图 -->
    <div class="background">
      <el-carousel :interval="5000" arrow="always" height="100vh">
        <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
          <div class="carousel-content" :style="{ backgroundImage: 'url(' + item.imgUrl + ')', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: '0.5' }"></div> <!-- 设置更低的透明度 -->
        </el-carousel-item>
      </el-carousel>

      <!-- 页面内容 -->
      <h1 class="title">速通软件 - 让学习变得更高效</h1>
      <div class="overlay">
        <el-button class="custom-button" type="primary" @click="goToMyQuestionBank">  开始学习</el-button>
      </div>
      <div class="content">
        <p class="description">
          速通软件旨在为学习者提供一体化的学习解决方案，通过智能化的题库管理、个性化的学习轨迹规划以及高效的复习工具，帮助用户高效吸收知识，实现真正的知识内化。
          学习的重要性不言而喻，它是通往成功的基石。通过科学的学习方法和工具，我们相信每个人都能在学习的道路上取得显著的成效。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import image34 from '@/assets/images/image34.png';
import image33 from '@/assets/images/image33.jpg';
import image35 from '@/assets/images/image35.jpg';
import image36 from '@/assets/images/image36.jpg';

const router = useRouter();

const goToMyQuestionBank = () => {
  router.push({ name: 'mybank' }); // 跳转到我的题库页面
};

const carouselItems = ref([
  { imgUrl: image34, caption: 'Slide 1' },
  { imgUrl: image33, caption: 'Slide 2' },
  { imgUrl: image35, caption: 'Slide 3' },
  { imgUrl: image36, caption: 'Slide 4' },
]);
</script>

<style scoped>
.screen-container {
  width: 100%;
  height: 100vh; /* 设置为全屏高度 */
  position: relative;
  overflow: hidden; /* 确保不会超出可视区域 */
}

/* 背景轮播图样式 */
.background {
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-content {
  width: 100%;
  height: 100%;
  position: relative;
}

/* Title styling */
.title {
  font-size: 48px; /* 增加字体大小 */
  color: #333; /*加深字体颜色*/
 /* 添加较多层次的白色阴影效果 */
  position: absolute;
  top: 20px; /* 放在顶部，留出一些边距 */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1; /* 确保标题在其他内容上方 */
  font-family: 'Comic Sans MS', cursive, sans-serif; /* 使用艺术字的可能字体 */
  white-space: nowrap; /* 使标题在一行内显示 */
  overflow: hidden; /* 防止溢出 */
  text-overflow: ellipsis; /* 超出显示省略号 */
}

/* 内容区域样式 */
.content {
  text-align: left; /* 文本左对齐 */
  max-width: 300px; /* 限制最大宽度 */
  color: #0a0707; /* 加深文本颜色 */
  padding: 20px; /* 内边距 */
  position: absolute;
  bottom: 200px; /* 放在离底部一定距离的位置 */
  left: 20px; /* 左侧边距 */
  z-index: 1; /* 确保内容在其他元素上方 */
}

/* Description styling */

/* Description styling */
.description {
   font-size: 20px; /* 增加字体大小 */

   line-height: 1.5; /* 增加行间距 */
   font-family: 'Comic Sans MS', cursive, sans-serif; /* 使用艺术字的可能字体 */
}

/* Overlay for Button */
.overlay {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1; /* 确保按钮在其他内容上方 */  
}

.custom-button {
  padding: 10px 30px;
  font-size: 18px;
  color: white;
  background-color: #4CAF50; /* 改为一个绿色的学习相关的颜色 */
  border-radius: 5px; /* 设置圆角 */
  position: relative;
  overflow: hidden;
}

.custom-button::before {
  content: '📚'; /* 添加书本 Emoji */
  position: absolute;
  left: 5px; 
  top: 50%; 
  transform: translateY(-50%); 
  font-size: 20px; /* 更大一点的字体 */
}

.custom-button:hover {
  background-color: #45a049; /* 添加悬停样式 */
}
</style>