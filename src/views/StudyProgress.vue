<template>
  <div class="picsort">
  <Chart :totalCorrect="totalCorrect" :totalValue="totalValue" />
  <Bar :databank="databank"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "@/components/studyprogress/ChartPic.vue"; // 引入Chart组件
import Bar from "@/components/studyprogress/BarPic.vue"
// 数据
const databank = [
  { value: 50, correct: 20, error: 30, name: "高等数学" },
  { value: 70, correct: 60, error: 10, name: "线性代数" },
  { value: 1000, correct: 200, error: 800, name: "元素反应" },
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
  display: flex;           
  justify-content: space-between; 
  align-items: center;   
  gap: 20px; 
}              
</style>
