<template>
  <el-card class="custom-card" shadow="hover">
    <el-container class="error-list-container">
      <!-- 错题列表 -->
      <el-main>
        <el-table
          :data="sortedErrorQuestions"
          size="large"
          class="error-table"
          stripe
        >
          <!-- 题目名称列 -->
          <el-table-column width="30">
            <template #default="{ row }">
              <div
                :class="{
                  'diff-orange': row.completed === 1,
                  'diff-green': row.completed === 2,
                  'diff-red': !row.completed,
                }"
              >
                <el-icon>
                  <template v-if="row.completed">
                    <Check />
                  </template>
                  <template v-else>
                    <Close />
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
          <!-- <el-table-column label="复习状态" width="250">
            <template #default="{ row }">
              <div :class="row.">
                {{ row.tag }}
              </div>
            </template>
          </el-table-column> -->

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
import { computed, reactive,onMounted } from "vue";
import "element-plus/dist/index.css";
import { ElIcon } from "element-plus";
import questionApi from "@/api/question";
import userWrongQuestionApi from "@/api/userWrongQuestion";
const errorQuestions = reactive([]);
const fetchData = async () => {
  try {
    const response = await userWrongQuestionApi.getWrongQuestionList();
    // console.log("获得错题信息", response);
    const WrongQuestions = response.data;
    for (let question of WrongQuestions) {
      try{
         const QuestionDetail = await questionApi.getSingleQuestion(
        question.questionId
      );
      // console.log("QuestionDetail",question);
      
      const QuestionName = QuestionDetail.data.questionText;
      const QuestionDifficulty = QuestionDetail.data.difficulty;
      errorQuestions.push({
        name: QuestionName,
        difficulty: QuestionDifficulty,
        reviewStatus: question.reviewStatus,
      })
    }catch(error){
        console.log("error",error);
        
      };
    }
  } catch (error) {
    console.log("error", error);
  }
};
onMounted(()=>{
  fetchData();
})
// 设置难度的颜色类
const formattedDifficulty = computed(() => {
  return errorQuestions.map((question) => {
    if (question.difficulty === "EASY") {
      question.difficultyClass = "diff-green";
    } else if (question.difficulty === "MEDIUM") {
      question.difficultyClass = "diff-orange";
    } else {
      question.difficultyClass = "diff-red";
    }
    return question;
  });
});

const formattedErrorQuestions = computed(() => {
  return formattedDifficulty.value.map((question) => {
    // 判断是否完成
    if (question.reviewStatus == "NOT_REVIEWED") question.completed = 0;
    else if (question.reviewStatus == "REVIEWED") question.completed = 1;
    else question.completed = 2;
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
  overflow-y: auto; /* 启用纵向滚动条 */
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
