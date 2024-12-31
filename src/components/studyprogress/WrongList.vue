<template>
  <el-card class="custom-card" shadow="hover">
    <el-container class="error-list-container">
      <!-- 错题列表 -->
      <el-main>
        <el-table :data="sortedErrorQuestions" size="large" class="error-table" stripe>
          <!-- 题目名称列 -->
          <el-table-column width="30">
            <template #default="{ row }">
              <div :class="row.completed ? 'completed' : 'not-completed'">
                <el-icon :class="row.completed ? 'completed-icon' : 'not-completed-icon'">
                  <template v-if="row.completed">
                    <el-icon><Check /></el-icon>
                  </template>
                  <template v-else>
                    <el-icon><Close /></el-icon>
                  </template>
                </el-icon>
              </div>
            </template>
          </el-table-column>
          <!-- 题目名列 -->
          <el-table-column
            prop="name"
            label="题目名"
            width="200"
            class="name-column"
          >
            <template #default="{ row }">
              <div class="name-cell">
                {{ row.name }}
              </div>
            </template>
          </el-table-column>

          <!-- 所属题库列 -->
          <el-table-column label="所属" width="250">
            <template #default="{ row }">
              <div class="tag-container">
                {{ row.tag }}
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="difficulty" label="难度" width="120">
            <template #default="{ row }">
              <div :class="row.difficultyClass">
                {{ row.difficulty }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-card>
</template>

<script setup>
import { computed } from "vue";
import "element-plus/dist/index.css";
import { ElIcon } from "element-plus";
// const requestParam={};
// const res = await userQuestionProgressApi.getQuestionProgressList(requestParam);
//                             if (res?.code == 200) {
//                                 console.log("1");
//                                 console.log(res.data);
//                             }
// 定义props，接收错题数据
const props = defineProps({
  errorQuestions: {
    required: true,
    type: Array,
  },
});

// 设置难度的颜色类
const formattedDifficulty = computed(() => {
  return props.errorQuestions.map((question) => {
    if (question.difficulty === "简单") {
      question.difficultyClass = "diff-green";
    } else if (question.difficulty === "中等") {
      question.difficultyClass = "diff-orange";
    } else {
      question.difficultyClass = "diff-red";
    }
    return question;
  });
});

// 根据题目标签关联所属题库，直接使用对应的题库名称
const formattedErrorQuestions = computed(() => {
  return formattedDifficulty.value.map((question) => {
    // 判断是否完成
    question.completed = question.solvePercentage >= 100;
    return question;
  });
});

// 排序错题列表，按照完成状态排序
const sortedErrorQuestions = computed(() => {
  return [...formattedErrorQuestions.value].sort(
    (a, b) => b.completed - a.completed
  );
});
</script>

<style scoped>
.error-table {
  color: black;
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 13px;
  width: 100%;
}

.error-list-container {
  width: 100%;
  margin: auto;
  margin-top: 20px;
}

.tag-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.file-tag {
  font-size: 12px;
}

.completed {
  color: green;
}

.not-completed {
  color: red;
}

.completed-icon {
  color: green;
}

.not-completed-icon {
  color: red;
}

/* 难度颜色样式 */
.diff-green {
  color: green;
}

.diff-orange {
  color: orange;
}

.diff-red {
  color: red;
}

.custom-card {
  position: relative;
  width: 600px;
  max-width: 100%;
  height: 400px;
  border-radius: 2%;
  color: white;
  font-size: 24px;
  margin: auto;
}

.name-cell:hover {
  color: blue;
  cursor: pointer;
}
</style>
