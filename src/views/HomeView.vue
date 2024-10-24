<template>
  <div>
    <ScreenCarousel></ScreenCarousel>
    <CardItem></CardItem>
    <router-view></router-view>
  </div>
</template>

<script setup>
import CardItem from "@/components/Homeitem/card-item.vue"
import ScreenCarousel from "@/components/Homeitem/ScreenCarousel.vue";
</script>
<style></style>