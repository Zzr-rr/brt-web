<template>
	<div>
		<!-- 标题栏 -->
		<van-nav-bar title="题目测试" left-text="返回" left-arrow @click-left="onClickLeft" />

		<!-- 题目列表 -->
		<van-list v-if="questions.length > 0">
			<div class="question-card" v-for="(question, index) in questions" :key="question.id">
				<van-card
						  :title="index + 1 + '. ' + question.content"
						  :class="{ 'bg-red': showAnswer[question.id] && selectedAnswers[question.id] !== question.answer }">
					<!-- 根据题目类型进行渲染 -->
					<template v-if="question.questionType === '选择题'" #desc>
						<van-radio-group v-model="selectedAnswers[question.id]">
							<van-radio :name="'A'">A.{{ question.optionA }}</van-radio>
							<van-radio :name="'B'">B.{{ question.optionB }}</van-radio>
							<van-radio :name="'C'">C.{{ question.optionC }}</van-radio>
							<van-radio :name="'D'">D.{{ question.optionD }}</van-radio>
						</van-radio-group>
            <!-- 显示正确答案 -->
        <p class="answer" v-if="question && showAnswer[question.id]">正确答案：<span class="correct">{{ question.answer }}</span></p>
					</template>

					<template v-else-if="question.questionType === '判断题'" #desc>
						<van-radio-group v-model="selectedAnswers[question.id]" :direction="isVertical ? 'vertical' : 'horizontal'">
							<van-radio :name="'true'">正确</van-radio>
							<van-radio :name="'false'">错误</van-radio>
						</van-radio-group>
            <!-- 显示正确答案 -->
        <p class="answer" v-if="question && showAnswer[question.id]">正确答案：<span class="correct">{{ question.answer }}</span></p>
					</template>

					<template v-else-if="question.questionType === '简答题'" #desc>
						<van-field v-model="selectedAnswers[question.id]" :rows="3" placeholder="请输入简答题答案" />
            <!-- 显示正确答案 -->
        <p class="answer" v-if="question && showAnswer[question.id]">正确答案：<span class="correct">{{ question.answer }}</span></p>
					</template>

					<template v-else-if="question.questionType === '填空题'" #desc>
						<van-field
								   v-model="selectedAnswers[question.id]"
								   label-width="80px"
								   placeholder="请输入填空题答案">
							<template #label>请填写答案：</template>
						</van-field>
            <!-- 显示正确答案 -->
        <p class="answer" v-if="question && showAnswer[question.id]">正确答案：<span class="correct">{{ question.answer }}</span></p>
					</template>        					
				</van-card>
			</div>
		</van-list>

		<!-- 无数据占位符 -->
		<van-empty v-else />

		<!-- 提交答案按钮 -->
		<van-button ref="submitButton" block type="primary" :disabled="isSubmitting" @click="onSubmit">{{ submitBtnText }}</van-button>
	</div>
</template>

<script>
	import axios from "axios";
	import { showDialog } from 'vant';
	export default {
	  data() {
	    return {
	      questions: [], // 题目列表
	      selectedAnswers: {}, // 用户选择的答案
	      showAnswer: {}, // 是否显示答案
	      isVertical: false, // 是否垂直布局选项（主要用于选择题）
	      currentQuestionIndex: 0, // 当前问题的索引
	      totalScore: 0, // 总分数
	      isSubmitting: false, // 是否正在提交答案
	    };
	  },
	  computed: {
	    submitBtnText() {
	      return this.isSubmitting ? '正在提交' : '提交'
	    }
	  },
	  methods: {
	    // 返回按钮点击事件处理函数
	    onClickLeft() {
	      this.$router.push("/my");
	    },
	
	    // 提交答案的代码
	    onSubmit() {
	      let totalCount = Object.keys(this.selectedAnswers).length;
	      let correctCount = 0;
	      let score = 0;
	
	      // 禁用提交按钮
	      this.isSubmitting = true
	
	      // 计算总得分
	      for (const question of this.questions) {
	        const userAnswer = this.selectedAnswers[question.id];
	        if (userAnswer === question.answer) {
	          correctCount++;
	          score += question.score;
	        }
	        // 显示正确答案
	        this.showAnswer[question.id] = true;
	      }
	      this.totalScore = score;
	
	      // 使用vant-ui组件弹出对话框显示结果
	  const message = `你选择了 ${totalCount} 道题，答对了 ${correctCount} 道题。总得分：${this.totalScore} 分。`;
	
	  showDialog({
	    title: "考试结束啦>_<",
	    message: message,
	  }).then(() => {
	    // on close
	  });
	
	  // 禁用提交按钮
	  this.isSubmitting = true
	  
	  // 显示正确答案
	  for (const question of this.questions) {
	    this.showAnswer[question.id] = true;
	  }
    // console.log("正确答案集合")
    // for (let i = 0; i < this.questions.length; ++ i){
    //   console.log(this.questions[i].answer)
    // }

    console.log("用户选择的正确答案集合")
    console.log(this.selectedAnswers)
	},
	
	
	// 获取问题分数
	getQuestionScore(questionId) {
	  const userAnswer = this.selectedAnswers[questionId];
	  const question = this.questions.find((q) => q.id === questionId);
	  return userAnswer === question.answer ? question.score : 0;
	},
	
	// 显示当前问题
	showQuestion() {
	  // 获取当前问题
	  const question = this.questions[this.currentQuestionIndex];
	
	  // 根据题目类型渲染问题
	  switch (question.questionType) {
	    case "选择题":
	      this.isVertical = false;
	      break;
	    case "判断题":
	      this.isVertical = true;
	      break;
	  }
	
	  // 显示问题并将提交按钮重新启用
	  this.$refs.submitButton.disable = false;
	},
	},
	mounted() {
	// 获取题目列表
	axios
	.get("http://localhost:8083/questions")
	.then((res) => {
	this.questions = res.data.data;
	
	    // 对问题数据进行按题目类型排序
	    this.questions.sort((a, b) => {
	      const typeOrder = { "选择题": 0, "判断题": 1, "填空题": 2, "简答题": 3 };
	      return typeOrder[a.questionType] - typeOrder[b.questionType];
	    });
	
	    // 显示第一个问题
	    this.showQuestion();
	  })
	  .catch((error) => {
	    console.log(error);
	  });
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
