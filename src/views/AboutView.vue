<template>
  <div class="boxcontain">
    <div class="box box1"></div>
  <div class="box box2"></div>
  </div>
  
</template>

<script setup>
import { gsap } from 'gsap';
import { onMounted } from 'vue';

onMounted(() => {
  gsap.to(".box1", { 
    x: window.innerWidth - 300,
    duration: 3,
    rotation: 360
  });
  gsap.to(".box2", { 
    x: window.innerWidth - 300,
    duration: 3.5,
    rotation: 360
  });
});
</script>

<style scoped>
body {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  margin: 0;
  overflow: hidden; /* 禁止滚动 */
}

html {
  overflow: hidden; /* 确保 HTML 也禁止滚动 */
}
.boxcontain{
  
}
.box {
  display: block;
  background-color: black;
  border-radius: 2px;
  height: 20px;
  width: 20px;
  margin: 10px;
}

.box1 {
  background-color: red; /* 如果需要，可以对 box1 定制样式 */
}

.box2 {
  background-color: blue; /* 如果需要，可以对 box2 定制样式 */
}
</style>
