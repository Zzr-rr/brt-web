<template>
  <div class="floating-window">
    <el-card class="floating-card">
      <h3>题库</h3>
      <div class="button-container">
        <el-button
          v-for="item in questions"
          :key="item.id"
          type="primary"
          size="small"
          @click="scrollToQuestion(id)"
        :class="item.Isdone?'done':'pending'"
        >
          {{ item.id }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    questions: {
      type: Array,
      required: true,
    },
  },
  methods: {
    scrollToQuestion(id) {
      const element = document.getElementById(id);
      
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    },
  },
};
</script>

<style scoped>
.floating-window {
  position: fixed;
  top: 10%;
  right: 20px;
  z-index: 1000;
}

.floating-card {
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 5px;
}


.button-container {
  display: grid; 
  grid-template-columns: repeat(3,1fr);
  gap: 10px; 
  justify-items: right;
  align-items: center; 
}
::v-deep(.el-button) {
  width: 40px;
  height: 40px;
  transition: background-color 0.3s ease, color 0.3s ease; 
}
::v-deep(.el-button.done) {
  color: white;
}

::v-deep(.el-button.pending) {
  
 background-color: white;
 color: black;
}

</style>

