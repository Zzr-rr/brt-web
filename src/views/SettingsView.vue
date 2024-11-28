<template>
    <div id="app">
      <h1>选择背景颜色</h1>
      <button @click="setWhiteColor">白色背景</button>
      <button @click="setBlackColor">黑色背景</button>
    </div>
  </template>
  
  <script>
  import { computed, watch } from 'vue';
  import { mapState } from 'vuex';
  
  export default {
    computed: {
      ...mapState(['backgroundColor']),
    },
    methods: {
      setWhiteColor() {
        this.$store.dispatch('updateBackgroundColor', '#ffffff');
      },
      setBlackColor() {
        this.$store.dispatch('updateBackgroundColor', '#000000');
      }
    },
    watch: {
      backgroundColor(newColor) {
        document.documentElement.style.setProperty('--global-background-color', newColor);
      }
    },
    mounted() {
      // 设置初始的 CSS 变量
      document.documentElement.style.setProperty('--global-background-color', this.backgroundColor);
    }
  }
  </script>
  
  <style>
  #app {
    background-color: var(--global-background-color);
    font-size: 20px;
    color: #000; /* 默认字体颜色 */
    transition: background-color 0.3s;
    padding: 20px;
    min-height: 100vh; /* 确保背景覆盖整个视口 */
  }
  </style>