<template>
  <div class="animationcontainer">
    <AboutAnimation
      v-for="(arrow, index) in arrows"
      :key="index"
      :id="index"
      :size="arrow.size"
      :movex="arrow.movex"
      :movey="arrow.movey"
      :speed="arrow.speed"
      :delay="arrow.delay"
      :rotate="arrow.rotate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AboutAnimation from "@/components/Aboutitem/AboutAnimation.vue";

// 创建随机数生成函数
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
function getRandomRotate(){
  return Math.random()>0.5?360:-360;
}
const arrows = ref([]);

onMounted(() => {
  const totalArrows = 100; // 要生成的箭头数量
  for (let i = 0; i < totalArrows; i++) {
    arrows.value.push({
      size: getRandomNumber(20, 80), 
      speed: getRandomNumber(2, 7), 
      movex: getRandomNumber(100, window.innerWidth-200), 
      movey: getRandomNumber(0, window.innerHeight+200), 
      delay: getRandomNumber(0, 10), 
      rotate:getRandomRotate(),
    });
  }
});
</script>

<style scoped>
.animationcontainer {
  position: relative;
  width: 100%;
  height: 1000px;
  overflow: hidden;
}
</style>
