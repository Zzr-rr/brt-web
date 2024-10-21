<script setup>
import { RouterView } from 'vue-router'
import HeaderBar from './components/HeaderBar.vue';
import AsideBar from './components/AsideBar.vue';
import FooterBar from './components/FooterBar.vue';
</script>

<template>
  <div class="common-layout">
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
</style>
