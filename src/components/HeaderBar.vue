<template>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
        @select="handleSelect">
        <el-menu-item index="0">
            <img style="width: 50px" src="../assets/images/logo.svg" alt="ZhuZiRui Logo" />
        </el-menu-item>
        <RouterLink to="/about"><el-menu-item index="1">关于我们</el-menu-item></RouterLink>
        <el-sub-menu index="3">
            <template #title>用户</template>
            <RouterLink to="/users/personalpage"><el-menu-item index="2-1">用户中心</el-menu-item></RouterLink>
            <RouterLink to="/logout"><el-menu-item index="2-2">登出</el-menu-item></RouterLink>
        </el-sub-menu>
    </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>

<style>
.el-menu--horizontal>.el-menu-item:nth-child(1) {
    margin-right: auto;
}
</style>