<template>
    <el-menu default-active="activeMenu" class="el-menu-vertical-demo" @select="handleSelect" @open="handleOpen"
        @close="handleClose">
        <el-menu-item index="/home">
            <el-icon>
                <location />
            </el-icon>
            <span>首页</span>
        </el-menu-item>
        <el-sub-menu index="/questionbank">
            <template #title>
                <el-icon><icon-menu /></el-icon>
                <span>题库</span>
            </template>
            <el-menu-item-group>
                <el-menu-item index="/questionbank/square">
                    题库广场
                </el-menu-item>
                <el-menu-item index="/questionbank/mybank">
                    我的题库
                </el-menu-item>
            </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="/file">
            <template #title>
                <el-icon><Folder /></el-icon>
                <span>文件</span>
            </template>
            <el-menu-item-group>
                <el-menu-item index="/file/myfile">
                    我的文件
                </el-menu-item>
                <el-menu-item index="/file/upload">
                    上传文件
                </el-menu-item>
            </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item index="/study-progress">
            <el-icon><Histogram /></el-icon>
            <span>学习进度管理</span>
        </el-menu-item>
        <el-menu-item index="/wrong-list">
            <el-icon><Close /></el-icon>
            <span>错题记录</span>
        </el-menu-item>
        <el-menu-item index="/settings">
            <el-icon>
                <setting />
            </el-icon>
            <span>设置</span>
        </el-menu-item>
    </el-menu>
</template>

<script setup>
import {
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()
const activeMenu = ref(route.path)
watch(route, (newRoute) => {
    activeMenu.value = newRoute.path
})

const handleSelect = (key) => {
    activeMenu.value = key
    router.push(key)
}

const handleOpen = (key, keyPath) => {
    console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
    console.log(key, keyPath)
}
</script>