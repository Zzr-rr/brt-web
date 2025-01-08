<template>

</template>

<script setup>



</script>

<style scoped>
.screen-container {
  width: 100%; /* 宽度设置为100% */
  max-width: 100%;
  margin: 0 auto;
  margin-bottom: 10px;
  background-color: black;
}

.carousel-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
  text-align: center;
  color: white;
}

.carousel-img {
  width: 100%; /* 宽度设置为100% */
  height: auto; /* 高度自动调整 */
  object-fit: cover; /* 图片保持比例填满 */
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