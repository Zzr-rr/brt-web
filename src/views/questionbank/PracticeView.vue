<template>

  <div>
    <!-- 标题栏 -->
    <el-header>
      <el-button @click="onClickLeft" icon="el-icon-arrow-left" text>返回</el-button>
      <span style="font-size: 18px; font-weight: bold;">题目测试</span>
    </el-header>

    <!-- 题目列表 -->
    <el-main>
      <div v-if="questions.length > 0">
        <el-card v-for="(question, index) in questions" :key="question.id" class="question-card" 
				:style="{margin:'10px'}">
          <div class="question-content">
            <h3>{{ index + 1 }}. {{ question.content }}</h3>
            <!-- 根据题目类型进行渲染 -->
            <template v-if="question.questionType === '选择题'">
              <el-radio-group v-model="selectedAnswers[question.id]">
                <el-radio :value="'A'">A.{{ question.optionA }}</el-radio>
                <el-radio :value="'B'">B.{{ question.optionB }}</el-radio>
                <el-radio :value="'C'">C.{{ question.optionC }}</el-radio>
                <el-radio :value="'D'">D.{{ question.optionD }}</el-radio>
              </el-radio-group>
            </template>

            <template v-else-if="question.questionType === '判断题'">
              <el-radio-group v-model="selectedAnswers[question.id]" :direction="isVertical ? 'vertical' : 'horizontal'">
                <el-radio :value="'true'">正确</el-radio>
                <el-radio :value="'false'">错误</el-radio>
              </el-radio-group>
            </template>

            <template v-else-if="question.questionType === '简答题'">
              <el-input v-model="selectedAnswers[question.id]" type="textarea" :rows="3" placeholder="请输入简答题答案" />
            </template>

            <template v-else-if="question.questionType === '填空题'">
              <el-input v-model="selectedAnswers[question.id]" placeholder="请输入填空题答案" />
            </template>

            <!-- 显示正确答案 -->
            <p v-if="showAnswer[question.id]" class="answer">
              正确答案：<span class="correct">{{ question.answer }}</span>
            </p>
          </div>
        </el-card>
      </div>

      <!-- 无数据占位符 -->
      <el-empty v-else description="没有题目" />

      <!-- 提交答案按钮 -->
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
import { ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';

export default {
	setup(){
		const router=useRouter();
		const onClickLeft = () => {
    	router.push({ name: 'mybank' });
  	};
		return{
			onClickLeft,
		}
	},
  data() {
    return {
      questions: [
        {
          id: 1,
          content: "选择题：你喜欢什么编程语言？",
          questionType: "选择题",
          optionA: "JavaScript",
          optionB: "Python",
          optionC: "Java",
          optionD: "C++",
          answer: "A",
          score: 10,
        },
        {
          id: 2,
          content: "判断题：Vue 是一个前端框架。",
          questionType: "判断题",
          answer: "true",
          score: 5,
        },
        {
          id: 3,
          content: "简答题：请简述 Vue 的响应式原理。",
          questionType: "简答题",
          answer: "Vue 使用了数据劫持和发布-订阅模式。",
          score: 15,
        },
        {
          id: 4,
          content: "填空题：Vue 的指令 v-_____ 用于绑定元素的样式。",
          questionType: "填空题",
          answer: "style",
          score: 5,
        },
      ],
      selectedAnswers: {},
      showAnswer: {},
      isVertical: false,
      currentQuestionIndex: 0,
      totalScore: 0,
      isSubmitting: false,
    };
  },
  computed: {
    submitBtnText() {
      return this.isSubmitting ? '正在提交' : '提交';
    },
  },
  methods: {
    onSubmit() {
      let totalCount = Object.keys(this.selectedAnswers).length;
      let correctCount = 0;
      let score = 0;
      
      this.isSubmitting = true;
      
      // 计算总得分
      for (const question of this.questions) {
        const userAnswer = this.selectedAnswers[question.id];
        if (userAnswer === question.answer) {
          correctCount++;
          score += question.score;
        }
        this.showAnswer[question.id] = true;
      }
      this.totalScore = score;
      
      // 使用 element-plus 组件弹出对话框显示结果
      const message = `你选择了 ${totalCount} 道题，答对了 ${correctCount} 道题。总得分：${this.totalScore} 分。`;

      ElMessageBox.alert(message, "考试结束啦>_<", {
        confirmButtonText: '确定',
      }).then(() => {
        // 关闭时的处理
				this.isSubmitting = false;
      });
    },
    
    getQuestionScore(questionId) {
      const userAnswer = this.selectedAnswers[questionId];
      const question = this.questions.find((q) => q.id === questionId);
      return userAnswer === question.answer ? question.score : 0;
    },
    
    showQuestion() {
      const question = this.questions[this.currentQuestionIndex];
      switch (question.questionType) {
        case "选择题":
          this.isVertical = false;
          break;
        case "判断题":
          this.isVertical = true;
          break;
      }
    },
  },
  mounted() {
    this.questions.sort((a, b) => {
      const typeOrder = { "选择题": 0, "判断题": 1, "填空题": 2, "简答题": 3 };
      return typeOrder[a.questionType] - typeOrder[b.questionType];
    });
    this.showQuestion();
  },
};
</script>


<style>
	.answer {
	color: red;
	margin-bottom: 0;
	}
	.correct {
	color: green;
	}
</style>
