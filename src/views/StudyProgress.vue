<template>
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


// 定义响应式数据
const totalCorrect = ref(0);
const totalValue = ref(0);

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
</style>
