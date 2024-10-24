<template>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
        @select="handleSelect">
        <el-menu-item index="0">
            <img style="width: 50px" src="@/assets/images/logo.svg" alt="Home Logo" />
        </el-menu-item>
        <el-menu-item index="/about">关于我们</el-menu-item>
        <el-sub-menu index="3">
            <template #title>用户</template>
            <el-menu-item index="/users/personalpage">用户中心</el-menu-item>
            <el-menu-item index="/logout">登出</el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
const router = useRouter()
const route = useRoute()
const activeMenu = ref(route.path);
watch(route, (newRoute) => {
    activeMenu.value = newRoute.path;
})
const handleSelect = (key) => {
    activeMenu.value
    router.push(key)
}
</script>

<style>
.el-menu--horizontal>.el-menu-item:nth-child(1) {
    margin-right: auto;
}
</style>