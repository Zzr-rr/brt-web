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
                <el-radio :value="'A'">A.{{ question.options[0] }}</el-radio>
                <el-radio :value="'B'">B.{{ question.options[1] }}</el-radio>
                <el-radio :value="'C'">C.{{ question.options[2] }}</el-radio>
                <el-radio :value="'D'">D.{{ question.options[3] }}</el-radio>
              </el-radio-group>
            </template>
            <!--多选题-->
            <template v-if="question.questionType === 'MULTIPLE_CHOICE'">
              <el-checkbox-group
                v-model="selectedAnswers[question.questionId]"
                :disabled="!Iswrittable"
              >
                <el-checkbox :label="'A'"
                  >A.{{ question.options[0] }}</el-checkbox
                >
                <el-checkbox :label="'B'"
                  >B.{{ question.options[1] }}</el-checkbox
                >
                <el-checkbox :label="'C'"
                  >C.{{ question.options[2] }}</el-checkbox
                >
                <el-checkbox :label="'D'"
                  >D.{{ question.options[3] }}</el-checkbox
                >
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
            <p v-if="isdone" class="answer">
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

<script>
import { ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import PractiveHeadbar from "./PractiveHeadbar.vue";
import { number } from "echarts";
import questionApi from "@/api/question";
import userQuestionProgressApi from "@/api/userQuestionProgress";
export default {
  components: { PractiveHeadbar },
  props: {
    bankid: {
      require: true,
      type: number,
    },
  },
  setup() {
    const router = useRouter();
    const onClickLeft = () => {
      router.push({ name: "mybank" });
    };
    return {
      onClickLeft,
    };
  },
  data() {
    return {
      questions: [],
      selectedAnswers: {},
      results: {},
      // showAnswer: {},
      // isVertical: false,
      // currentQuestionIndex: 0,
      totalCount: 0,
      correctCount: 0,
      isSubmitting: false,
      Iswrittable: true,
    };
  },
  computed: {
    submitBtnText() {
      return this.isSubmitting ? "正在提交" : "提交";
    },
  },
  methods: {
    //获取相应的题库题目
    async fetchdata(bankid) {
      try {
        const response = await questionApi.getQuestionList(bankid);
        return response.data || []; // 如果返回数据为空，返回空数组
      } catch (error) {
        console.log("error", error);
      }
    },
    //提交表单
    async Uploaddata(formData) {
      try {
        const response = await userQuestionProgressApi.uploadQuestionProgress(
          formData
        );
        return response.data || []; // 如果返回数据为空，返回空数组
      } catch (error) {
        console.log("error", error);
      }
    },
    // 处理题目已答完状态
    QuestionDone(item) {
      const question = this.questions.find((q) => q.id === item.id);
      if (question) {
        question.Isdone = true;
      }
    },
    // 提交答卷
    async onSubmit() {
      const formData = this.questions.map((question) => {
        return {
          questionId: question.questionId,
          userAnswer: this.selectedAnswers[question.questionId] || "", // 如果没有答案，默认为空字符串
        };
      });
      this.isSubmitting = true;
      this.Iswrittable = false;
      try {
        this.results = await this.Uploaddata(formData); // 等待上传数据完成
        this.totalCount = this.results.length;

        this.correctCount = this.results.filter(
          (question) => question.isCorrect
        ).length;

        const message = `你选择了 ${this.totalCount} 道题，答对了 ${this.correctCount} 道题。`;
        ElMessageBox.alert(message, "考试结束啦>_<", {
          confirmButtonText: "确定",
        }).then(() => {
          this.isSubmitting = false;
        });
      } catch (error) {
        console.error("提交失败:", error);
        this.isSubmitting = false;
      }
    },
    // 滚动到指定问题
    scrollToQuestion(id) {
      const element = document.getElementById("question-" + id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    },

    // 显示题目类型的设置
    // showQuestion() {
    //   const question = this.questions[this.currentQuestionIndex];
    //   switch (question.questionType) {
    //     case "选择题":
    //       this.isVertical = false;
    //       break;
    //     case "判断题":
    //       this.isVertical = true;
    //       break;
    //   }
    // },

    mounted() {
      this.fetchdata(this.bankid).then((data) => {
        this.question = data;
      });
      // this.showQuestion();
    },
  },
};
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
