<!-- <template>
  <div class="picsort">
  <Chart :totalCorrect="totalCorrect" :totalValue="totalValue" />
  <study-list :databank="databank"/>
  <WrongList :errorQuestions="errorQuestions" />
  <Bar :databank="databank"/>
  
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "@/components/studyprogress/ChartPic.vue";
import Bar from "@/components/studyprogress/BarPic.vue"
import StudyList from "@/components/studyprogress/StudyList.vue";
import WrongList from "@/components/studyprogress/WrongList.vue";
import questionApi from "@/api/question";
import questionBankApi from "@/api/questionBank";
import wrongQuestionApi from "@/api/userWrongQuestion";
const totalCorrect = ref(0);
const totalValue = ref(0);
// 获取题库列表
async function fetchQuestionBankList() {
  try {
    const response = await questionBankApi.getpersonalQuestionbank();
    return response.data || [];  // 如果返回数据为空，返回空数组
  } catch (error) {
    console.error('Failed to fetch question banks', error);
    return [];  // 请求失败时返回空数组，避免继续处理
  }
}

// 获取某个题库的作答数据
async function fetchQuestionList(bankId) {
  try {
    const response = await questionApi.getQuestionList(bankId);
    return response.data || [];  // 如果返回数据为空，返回空数组
  } catch (error) {
    console.error(`Failed to fetch questions for bankId ${bankId}`, error);
    return [];  // 请求失败时返回空数组，避免继续处理
  }
}

// 获取所有题库的数据并进行处理
async function fetchAllData() {
  const questionBankList = await fetchQuestionBankList();//题库信息
  
  if (!questionBankList.length) {
    console.log('No question banks available');
    return;
  }

  // 使用 Promise.all 来并发请求所有题库的作答数据
  const questionPromises = questionBankList.map(bank => fetchQuestionList(bank.bankId));

  try {
    const allQuestionData = await Promise.all(questionPromises);

    // 合并所有作答数据并进行处理
    allQuestionData
      .filter(data => data.length > 0) // 过滤掉空数据
      .forEach((questionData, index) => {
        questionData.forEach(answer => {
          // 在这里进行用户做题的统计逻辑
          console.log(`Bank ${questionBankList[index].name} - User ${answer.userId} answered question ${answer.questionId}`);
        });
      });
  } catch (error) {
    console.error('Error fetching or processing question data', error);
  }
}

// 调用 fetchAllData 函数来执行操作
fetchAllData();

// 数据
const databank = [
  { value: 50, correct: 20, error: 30, name: "高等数学" ,tag: ['极限', '微积分']},
  { value: 70, correct: 60, error: 10, name: "线性代数" ,tag: ['整数的加减乘除'],},
  { value: 1000, correct: 200, error: 800, name: "元素反应",tag:['感电', '过载']},
];
const errorQuestions = [
  {
    name: "题目1",
    tag: "线性代数",
    difficulty: "简单",
    solvePercentage: 80,
  },
  {
    name: "题目2",
    tag: "高等数学",
    difficulty: "中等",
    solvePercentage: 100,
  },
  {
    name: "题目3",
    tag: "元素反应",
    difficulty: "困难",
    solvePercentage: 40,
  },
];

// 计算总值
onMounted(() => {
  const totals = databank.reduce(
    (acc, b) => {
      acc.totalCorrect += b.correct; // 累加正确的数量
      acc.totalValue += b.value; // 累加总数
      return acc;
    },
    { totalCorrect: 0, totalValue: 0 }
  );

  // 更新响应式的 totalCorrect 和 totalValue
  totalCorrect.value = totals.totalCorrect;
  totalValue.value = totals.totalValue;
});
</script>

<style scoped>

.picsort {
  display: flex;            /* 使用 Flex 布局 */
  justify-content: space-between;  /* 子元素之间的间距 */
  align-items: center;      /* 子元素垂直居中 */
  gap: 20px;                /* 子元素之间的间距 */
  flex-wrap: wrap;          /* 让子元素换行 */
}              
.picsort > * {
  flex: 1 1 calc(50% - 10px); /* 每个子元素占据 50% 的宽度，并预留出间隙 */
  box-sizing: border-box;    /* 包含 padding 和 border 在内的宽度 */
}
</style> -->
