<template>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
        @select="handleSelect">
        <el-menu-item index="0">
            <img style="width: 50px" src="@/assets/images/logo.svg" alt="Home Logo" />
            <span style="margin-left: 10px" class="gradient-text-one">做题速通网站</span>
        </el-menu-item>
        <el-menu-item index="/about">
            <el-icon><Search /></el-icon>
            关于我们
        </el-menu-item>
        <el-sub-menu index="3">
            <template #title>
                <el-icon><Avatar /></el-icon>
                用户
            </template>
            <el-menu-item index="/users/personalpage">用户中心</el-menu-item>
            <el-menu-item index="/logout">登出</el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import authApi from '@/api/auth';
import { ElMessage } from 'element-plus';
const router = useRouter()
const route = useRoute()
const activeMenu = ref(route.path);
watch(route, (newRoute) => {
    activeMenu.value = newRoute.path;
})
const handleSelect = (key) => {
    activeMenu.value
    if (key == '/logout') {
        logout();
    } else {
        router.push(key)
    }
}
const logout = async () => {
    try {
        const res = await authApi.logout();
        if (res?.code === 200) {
            ElMessage.success('退出成功');
            setTimeout(() => {
                router.push('/login');
            }, 1000);
        } else {
            ElMessage.error('退出失败');
        }
    } catch (error) {
        ElMessage.error(error);
    }
}
</script>

<style>
.el-menu--horizontal>.el-menu-item:nth-child(1) {
    margin-right: auto;
}

.gradient-text-one{  
    background-image:-webkit-linear-gradient(bottom,rgb(17, 9, 9),#8403fd,rgb(0, 21, 255)); 
    -webkit-background-clip:text; 
    -webkit-text-fill-color:transparent; 
}
</style>