<template>
  <el-main>
    <!-- 返回按钮 -->
    <el-header>
      <el-button @click="onClickLeft" icon="HomeFilled" text>返回</el-button>
    </el-header>
    <!-- 题目卡片 -->
    <div v-if="question">
      <el-card class="question-card" :style="{ margin: '10px' }">
        <!-- 选择题 -->
        <div class="question-content">
          <h3>{{ question.questionText }}</h3>
          <template v-if="question.questionType === 'SINGLE_CHOICE'">
            <el-radio-group v-model="selectedAnswer" :disabled="!isWritable">
              <el-radio
                v-for="(option, index) in question.options"
                :key="index"
                :value="option"
              >
                {{ String.fromCharCode(65 + index) }}.{{ option }}
              </el-radio>
            </el-radio-group>
          </template>

          <!-- 多选题 -->
          <template v-if="question.questionType === 'MULTIPLE_CHOICE'">
            <el-checkbox-group v-model="selectedAnswer" :disabled="!isWritable">
              <el-checkbox
                v-for="(option, index) in question.options"
                :key="index"
                :value="option"
              >
                {{ String.fromCharCode(65 + index) }}.{{ option }}
              </el-checkbox>
            </el-checkbox-group>
          </template>

          <!-- 简答题 -->
          <template v-if="question.questionType === 'SHORT_ANSWER'">
            <el-input
              v-model="selectedAnswer"
              type="textarea"
              :rows="3"
              placeholder="请输入简答题答案"
              :disabled="!isWritable"
            />
          </template>

          <!-- 显示正确答案 -->
          <p v-if="IsDone" class="answer">
              正确答案：
              <span class="correct">
                <template
                  v-if="
                    question.questionType === 'SINGLE_CHOICE' ||
                    question.questionType === 'MULTIPLE_CHOICE'
                  "
                >
                  {{
                    question.correctAnswer
                      .filter((answer) => answer.isCorrect)
                      .map((answer) => answer.content)
                      .join(", ")
                  }}
                </template>

                <template v-else>
                  {{
                    Array.isArray(question.correctAnswer)
                      ? question.correctAnswer.join(", ")
                      : question.correctAnswer
                  }}
                </template>
              </span>
            </p>
        </div>
      </el-card>
    </div>
    <!-- 无题目显示空状态 -->
    <!-- <el-empty v-else description="没有题目" /> -->
    <div v-if="SingleQuestionLoading" class="loading-father">
        <img src="/src/assets/images/svg-spinners--12-dots-scale-rotate.svg" class="loading">
      </div>
    <!-- 提交按钮 -->
    <el-button
      block
      type="primary"
      :loading="isSubmitting"
      :disabled="isSubmitting"
      @click="onSubmit"
    >
      {{ submitBtnText }}
    </el-button>
  </el-main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import userQuestionProgressApi from "@/api/userQuestionProgress";
import questionApi from "@/api/question";
import {useItemStore} from '@/store/modules/CommentStore'
import { storeToRefs } from "pinia";
const QuestionLoading=useItemStore();
const {SingleQuestionLoading}=storeToRefs(QuestionLoading);
const route = useRoute();
const QuestionId = route.params.id;
// State
const question = ref(null); 
const selectedAnswer = ref(null); 
const IsDone = ref(false); 
const isSubmitting = ref(false); 
const isWritable = ref(true); 

// Router
const router = useRouter();
const onClickLeft = () => {
  router.push({ name: "study-progress" });
};

const submitBtnText = computed(() => {
  return isSubmitting.value ? "正在提交" : "提交";
});


const fetchData = async () => {
  try {
    QuestionLoading.setSingleQuestionLoading(true);
    const response = await questionApi.getSingleQuestion(QuestionId);
    const data = response.data || {};

   
    if (data.options && typeof data.options === "string") {
      data.options = JSON.parse(data.options);
    }
    if (data.correctAnswer && typeof data.correctAnswer === "string") {
      data.correctAnswer = JSON.parse(data.correctAnswer);
    }
    
    
    question.value = data; 
    QuestionLoading.setSingleQuestionLoading(false);
  } catch (error) {
    console.error("获取题目失败:", error);
  }
};

const onSubmit = async () => {
  if (!question.value) return;

  
  const formData = {
    questionId: question.value.questionId,
    userAnswer: null,
  };

  
  if (question.value.questionType === "SHORT_ANSWER") {
    formData.userAnswer = selectedAnswer.value || "null";
  } else if (
    question.value.questionType === "MULTIPLE_CHOICE" ||
    question.value.questionType === "SINGLE_CHOICE"
  ) {
    formData.userAnswer = JSON.stringify(
      question.value.options.map((option) => ({
        content: option,
        isCorrect: selectedAnswer.value.includes(option),
      }))
    );
  }

  // 提交答案
  isSubmitting.value = true;
  isWritable.value = false;

  try {
    console.log("传输结果", formData);
    const result = await userQuestionProgressApi.uploadQuestionProgress([
      formData,
    ]);
    IsDone.value = true;
    const message = result.data[0].isCorrect ? `你做对了！` : `纯纯的飞舞`;
    ElMessageBox.alert(message, "答题完成", { confirmButtonText: "确定" }).then(
      () => {
        isSubmitting.value = false;
        // router.push({ name: "study-progress" });
      }
    );
  } catch (error) {
    console.error("提交失败:", error);
    isSubmitting.value = false;
  }
};

// 加载题目数据
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.loading-father{
  width: 100%;
  height: 100px;
  justify-content: center; 
  display: flex;
}
.loading{
  align-items: center; /* 垂直居中 */
}
.answer {
  color: red;
  margin-bottom: 0;
}
.correct {
  color: green;
}
.question-card {
  margin: 10px;
}
</style>
