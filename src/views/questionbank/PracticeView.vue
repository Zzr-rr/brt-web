<template>
  <div>
    <PractiveHeadbar
      :questions="questions"
      @scroll-to-question="scrollToQuestion"
      :results="results"
      :selectedAnswers="selectedAnswers"
    />
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
                  :value="option"
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
                  :value="option"
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

                <!-- 填空题 -->
                <template v-else>
                  <!-- 如果是填空题，确保correctAnswer是数组，再执行join -->
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
      <div v-if="questionLoading" class="loading-father">
        <img src="/src/assets/images/svg-spinners--12-dots-scale-rotate.svg" class="loading">
      </div>
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
import {useItemStore} from '@/store/modules/CommentStore'
import { storeToRefs } from "pinia";
const route = useRoute();
const bankid = route.params.id;
const QuestionLoading=useItemStore();
const {questionLoading}=storeToRefs(QuestionLoading);
// State
const questions = reactive([]);
const selectedAnswers = reactive({});
const results = ref([]);
const Isdone = ref(false);
const totalCount = ref(0);
const correctCount = ref(0);
const isSubmitting = ref(false);
const Iswrittable = ref(true);

// Router
const router = useRouter();
const onClickLeft = () => {
  router.push({ name: "mybank" });
};

const submitBtnText = computed(() => {
  return isSubmitting.value ? "正在提交" : "提交";
});

const fetchData = async (bankid) => {
  try {
    QuestionLoading.setquestionLodaing(true);
    const response = await questionApi.getQuestionList({
      bankId: bankid,
    });
    const data = response.data || [];
    data.forEach((question) => {
      if (question.options && typeof question.options === "string") {
        question.options = JSON.parse(question.options); 
        question.correctAnswer = JSON.parse(question.correctAnswer);
      }
    });
    QuestionLoading.setquestionLodaing(false);
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
    return response.data || []; 
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
  console.log("填入结果", selectedAnswers);

  const constructformData = (questions, selectedAnswers) => {
    return questions.map((question) => {
      const questionId = question.questionId;
      var userAnswer = selectedAnswers[questionId];
      const options = question.options;
      if (question.questionType === "SHORT_ANSWER") {
        // 单选题或简答题的处理
        if(userAnswer==undefined)
          userAnswer='null';
        return {
          questionId: questionId,
          userAnswer: userAnswer, // 用户直接选择的答案
        };
      } else if (
        question.questionType === "MULTIPLE_CHOICE" ||
        question.questionType === "SINGLE_CHOICE"
      ) {
        if(userAnswer==undefined)
          userAnswer=[];
        // 多选题的处理
        const reconstructedAnswers = options.map((option) => {
          return {
            content: option,
            isCorrect: userAnswer.includes(option), // 判断用户是否选择了该选项
          };
        });

        return {
          questionId: questionId,
          userAnswer: JSON.stringify(reconstructedAnswers), // 转为字符串存储
        };
      }
    });
  };

  const formData = constructformData(questions, selectedAnswers);
  console.log("输入结果", formData);
  isSubmitting.value = true;
  Iswrittable.value = false;

  try {
    results.value = await uploadData(formData); // 等待上传数据完成
    console.log("返回计算结果",results.value);
    totalCount.value = results.value.length;
    correctCount.value = results.value.filter(
      (question) => question.isCorrect
    ).length;
    Isdone.value = !Isdone.value;
    // 选择了 ${totalCount.value} 道题，
    const message = `你一共做了 ${totalCount.value}题，一共答对了 ${correctCount.value} 道题！`;
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
