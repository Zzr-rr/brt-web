<!-- <template>
  <div class="floating-window">
    <el-card class="floating-card">
      <h3>题库</h3>
      <div class="button-container">
        <el-button
          v-for="item in questions"
          :key="item.id"
          :type="
            resultMap[item.id] !== undefined
              ? resultMap[item.id]
                ? 'success'
                : 'danger'
              : 'primary'
          "
          size="small"
          @click="scrollToQuestion(item.id)"
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
    results: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    // Create a map for quick lookup of answers
    resultMap() {
      console.log(this.results);
      return this.results.reduce((acc, result) => {
        acc[result.questionId] = result.isCorrect;
        return acc;
      }, {});
    },
  },
  methods: {
    // Scroll to a specific question
    scrollToQuestion(id) {
      this.$emit('scroll-to-question', id);
    },
  },
  watch: {
    // Watch for changes to results to trigger re-rendering of buttons
    results(newResults) {
      this.resultMap = newResults;
    },
  },
}

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

</style> -->

