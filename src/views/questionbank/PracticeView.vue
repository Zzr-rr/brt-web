<template>
  <div>
    <PractiveHeadbar
      :questions="questions"
      @scroll-to-question="scrollToQuestion"
      :results="results"
    /><!--未传入-->
  </div>
  <div>
    <el-header>
      <el-button @click="onClickLeft" icon="HomeFilled" text>返回</el-button>
    </el-header>

    <el-main>
      <div v-if="questions.length > 0">
        <el-card
          v-for="(question, index) in questions"
          :key="question.questionId"
          :id="'question-' + question.questionId"
          class="question-card"
          @change="QuestionDone(question)"
          :style="{ margin: '10px' }"
        >
          <div class="question-content">
            <h3>{{ index + 1 }}. {{ question.questionText }}</h3>

            <!-- 选择题 -->
            <template v-if="question.questionType === 'SINGLE_CHOICE'">
              <el-radio-group
                v-model="selectedAnswers[question.questionId]"
                :disabled="!Iswrittable"
              >
                <el-radio
                  v-for="(option, index) in question.options"
                  :key="index"
                  :value="String.fromCharCode(65 + index)"
                >
                  {{ String.fromCharCode(65 + index) }}.{{ option }}
                </el-radio>
              </el-radio-group>
            </template>
            <!--多选题-->
            <template v-if="question.questionType === 'MULTIPLE_CHOICE'">
              <el-checkbox-group
                v-model="selectedAnswers[question.questionId]"
                :disabled="!Iswrittable"
              >
              <el-checkbox
                  v-for="(option, index) in question.options"
                  :key="index"
                  :value="String.fromCharCode(65 + index)"
                >
                  {{ String.fromCharCode(65 + index) }}.{{ option }}
                </el-checkbox>
              </el-checkbox-group>
            </template>
            <!-- 判断题 -->
            <!-- <template v-else-if="question.questionType === '判断题'">
              <el-radio-group
                v-model="selectedAnswers[question.questionId]"
                :direction="isVertical ? 'vertical' : 'horizontal'"
                :disabled="!Iswrittable"
              >
                <el-radio :value="'true'">正确</el-radio>
                <el-radio :value="'false'">错误</el-radio>
              </el-radio-group>
            </template> -->

            <!-- 简答题 -->
            <template v-else-if="question.questionType === 'SHORT_ANSWER'">
              <el-input
                v-model="selectedAnswers[question.questionId]"
                type="textarea"
                :rows="3"
                placeholder="请输入简答题答案"
                :disabled="!Iswrittable"
              />
            </template>

            <!-- 填空题 -->
            <!-- <template v-else-if="question.questionType === '填空题'">
              <el-input
                v-model="selectedAnswers[question.questionId]"
                placeholder="请输入填空题答案"
                :disabled="!Iswrittable"
              />
            </template> -->

            <!-- 显示答案 -->
            <p v-if="Isdone" class="answer">
              正确答案：<span class="correct">{{
                question.correctAnswer
              }}</span>
            </p>
          </div>
        </el-card>
      </div>

      <el-empty v-else description="没有题目" />

      <el-button
        ref="submitButton"
        block
        type="primary"
        :loading="isSubmitting"
        :disabled="isSubmitting"
        @click="onSubmit"
      >
        {{ submitBtnText }}
      </el-button>
    </el-main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import PractiveHeadbar from "./PractiveHeadbar.vue";
import questionApi from "@/api/question";
import userQuestionProgressApi from "@/api/userQuestionProgress";

const route = useRoute();
const bankid = route.params.id;

// State
const questions = reactive([]);
const selectedAnswers = reactive({});
const results = ref([]);
const totalCount = ref(0);
const correctCount = ref(0);
const isSubmitting = ref(false);
const Iswrittable = ref(true);

// Router
const router = useRouter();
const onClickLeft = () => {
  router.push({ name: "mybank" });
};

// Computed properties
const submitBtnText = computed(() => {
  return isSubmitting.value ? "正在提交" : "提交";
});

// Methods
const fetchData = async (bankid) => {
  try {
    const response = await questionApi.getQuestionList({
      bankId: bankid,
    });
    const data = response.data || [];
    data.forEach((question) => {
      if (question.options && typeof question.options === "string") {
        question.options = JSON.parse(question.options); // 转换为数组
      }
    });
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

const uploadData = async (formData) => {
  try {
    const response = await userQuestionProgressApi.uploadQuestionProgress(
      formData
    );
    return response.data || []; // 返回空数组
  } catch (error) {
    console.log("error", error);
  }
};

const QuestionDone = (item) => {
  const question = questions.find((q) => q.id === item.id);
  if (question) {
    question.Isdone = true;
  }
};

const onSubmit = async () => {
  const formData = questions.map((question) => ({
    questionId: question.questionId,
    userAnswer: selectedAnswers[question.questionId] || "", // 默认空字符串
  }));

  isSubmitting.value = true;
  Iswrittable.value = false;

  try {
    results.value = await uploadData(formData); // 等待上传数据完成
    totalCount.value = results.value.length;
    correctCount.value = results.value.filter(
      (question) => question.isCorrect
    ).length;

    const message = `你选择了 ${totalCount.value} 道题，答对了 ${correctCount.value} 道题。`;
    ElMessageBox.alert(message, "考试结束啦>_<", {
      confirmButtonText: "确定",
    }).then(() => {
      isSubmitting.value = false;
    });
  } catch (error) {
    console.error("提交失败:", error);
    isSubmitting.value = false;
  }
};

const scrollToQuestion = (id) => {
  const element = document.getElementById("question-" + id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

// Mounted lifecycle
onMounted(() => {
  fetchData(bankid).then((Data) => {
    questions.push(...Data);
  });
});
</script>

<style scoped>
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
