<template>
  <div>
    <button @click="toggleColorMode">
      切换到{{themeStore === 'dark' ? '明亮' : '暗黑' }}模式
    </button>
  </div>
</template>
 
<script setup>
import { useColorMode } from '@vueuse/core'
 
const { system: themeSystem, store: themeStore } = useColorMode();
 
const toggleColorMode = () => {
  themeStore.value = themeStore.value === 'dark' ? 'light' : 'dark'
}
</script>