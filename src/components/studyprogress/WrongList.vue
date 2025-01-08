<template>
  <el-card class="custom-card" shadow="hover">
    <el-container class="error-list-container">
     
      <el-main>
        <el-table
          :data="sortedErrorQuestions"
          size="large"
          class="error-table"
          stripe
        >
        
          <el-table-column 
          label="状态"

          class="status-column">
            <template #default="{ row }">
              <div
                :class="{
                  'diff-orange': row.completed === 1,
                  'diff-green': row.completed === 2,
                  'diff-red': !row.completed,
                }"
              >
                {{ row.reviewStatus }}
              </div>
            </template>
          </el-table-column>

          <!-- 题目名列 -->
          <el-table-column
            prop="name"
            label="题目名"
            
            class="name-column"
          >
            <template #default="{ row }" >
              <div class="name-cell" @click="Pushreview(row.questionId,row.wrongId)">
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
    <div v-if="learingWronglistLoading" class="loading-father">
        <img src="/src/assets/images/svg-spinners--12-dots-scale-rotate.svg" class="loading">
      </div>
  </el-card>
</template>

<script setup>
import { computed, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import "element-plus/dist/index.css";
// import { ElIcon } from "element-plus";
import { useItemStore } from "@/store/modules/CommentStore";
import { storeToRefs } from "pinia";
import userWrongQuestionApi from "@/api/userWrongQuestion";
const WronglistLoading = useItemStore();
const { learingWronglistLoading } = storeToRefs(WronglistLoading);
const router = useRouter();
const errorQuestions = reactive([]);

const Pushreview = (questionId, wrongId) => {
  router.push({ name: "review", params: { questionId, wrongId } }).catch((error) => {
    console.log("error", error);
  });
};

const fetchData = async () => {
  try {
    // 更新 loading 状态
    WronglistLoading.setlearingWronglistLoading(true);
    const response = await userWrongQuestionApi.getWrongInfo();
    const WrongInfos = response.data;
    for(let info of WrongInfos){
      errorQuestions.push({
        completed: (info.reviewStatus == "REVIEWED"?1:(info.reviewStatus == "NOT_REVIEWED"?0:2)),
        reviewStatus: info.reviewStatus,
        name: info.questionText,
        difficulty: info.difficulty,
        questionId: info.questionId,
        wrongId:info.wrongId,
        difficultyClass: (info.difficulty === "EASY" ? "diff-green" : (info.difficulty === "MEDIUM" ? "diff-orange" : "diff-red")),
      })
    }

    // 请求完成后关闭 loading
    WronglistLoading.setlearingWronglistLoading(false);
  }catch (error) {
    console.error("Error fetching data:", error);
    WronglistLoading.setlearingWronglistLoading(false);
  }
};

onMounted(() => {
  fetchData();
});

const sortedErrorQuestions = computed(() => {
  return errorQuestions;
});
</script>

<!-- <script setup>
import { computed, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import "element-plus/dist/index.css";
import { ElIcon } from "element-plus";
import questionApi from "@/api/question";
import userWrongQuestionApi from "@/api/userWrongQuestion";
import { useItemStore } from "@/store/modules/CommentStore";
import { storeToRefs } from "pinia";
const WronglistLoading = useItemStore();
const { learingWronglistLoading } = storeToRefs(WronglistLoading);
const router = useRouter();
const errorQuestions = reactive([]);

const Pushreview = (id) => {
  router.push({ name: "review", params: { id } }).catch((error) => {
    console.log("error", error);
  });
};

const fetchData = async () => {
  try {
    // 更新 loading 状态
   WronglistLoading.setlearingWronglistLoading(true);

    const response = await userWrongQuestionApi.getWrongQuestionList();
    const WrongQuestions = response.data;

    const questionDetails = await Promise.all(
      WrongQuestions.map((question) =>
        questionApi.getSingleQuestion(question.questionId).then((res) => ({
          questionText: res.data.questionText,
          difficulty: res.data.difficulty,
          questionId: question.questionId,
          reviewStatus: question.reviewStatus,
        }))
      )
    );
    // 请求完成后关闭 loading
    WronglistLoading.setlearingWronglistLoading(false);

    errorQuestions.push(
      ...questionDetails.map((detail) => ({
        name: detail.questionText,
        difficulty: detail.difficulty,
        reviewStatus: detail.reviewStatus,
        QuestionID: detail.questionId,
      }))
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  fetchData();
});

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

const sortedErrorQuestions = computed(() => {
  return [...formattedErrorQuestions.value]
});
</script> -->


<style scoped>
.status-column {
  width: 100px;
}

.loading-father{
  width: 100%;
  height: 100px;
  justify-content: center; 
  display: flex;
}
.loading{
  align-items: center; /* 垂直居中 */
}
.error-table {
  color: black;
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 13px;
  width: 100%;
}

.error-list-container {
  width: 100%;
  margin: auto;
}

.tag-container {
  display: flex;
  gap: 8px;
  align-items: center;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  width: 100%;
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
