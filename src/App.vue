<script setup>
import { RouterView, useRoute } from 'vue-router'
import HeaderBar from './components/HeaderBar.vue';
import AsideBar from './components/AsideBar.vue';
import FooterBar from './components/FooterBar.vue';
import { computed } from 'vue';
const route = useRoute();
const isAuthPage = computed(() => ['/login'].includes(route.path));
</script>

<template>
  <div v-if="isAuthPage">
    <RouterView />
  </div>
  <div v-else>
    <el-container>
      <el-header>
        <HeaderBar></HeaderBar>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <AsideBar></AsideBar>
        </el-aside>
        <el-container>
          <el-main>
            <RouterView />
          </el-main>
          <el-footer>
            <FooterBar></FooterBar>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>


<style scoped>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.common-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-container {
  height: 100%;
}

.el-main {
  flex: 1;
  /* 确保内容区域可以自适应剩余空间 */
}
#app {
  background-color: var(--global-background-color);
  font-size: 20px;
  color: #000; /* 默认字体颜色为黑色 */
  transition: background-color 0.3s;
  padding: 20px;
  min-height: 100vh; /* 确保背景覆盖整个视口 */
}
</style>
