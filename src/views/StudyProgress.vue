<template>
  <div class="picsort">
    <Chart :totalCorrect="totalCorrect" :totalValue="totalValue" />
    <study-list/>
    <!-- <WrongList :errorQuestions="errorQuestions.value" /> -->
    <!-- <Bar :databank="databank" /> -->
  </div>
</template>

<script setup>
import { ref, onMounted ,reactive} from "vue";
import Chart from "@/components/studyprogress/ChartPic.vue";
import Bar from "@/components/studyprogress/BarPic.vue";
import StudyList from "@/components/studyprogress/StudyList.vue";
import WrongList from "@/components/studyprogress/WrongList.vue";
import userQuestionProgressApi from "@/api/userQuestionProgress";
import wrongQuestionApi from "@/api/userWrongQuestion";
const totalCorrect = ref(0);
const totalValue = ref(0);
// const errorQuestions = reactive({});
var response = {};
// 获取题库列表
async function fetchQuestionList() {
  try {
    const response = await userQuestionProgressApi.getQuestionProgressList(); //返回题目列表
    // errorQuestions.value=await wrongQuestionApi.getWrongQuestionList();
    return response.data || []; // 如果返回数据为空，返回空数组
  } catch (error) {
    console.error("Failed to fetch question", error);
    return []; // 请求失败时返回空数组，避免继续处理
  }
}
async function calculateNum() {
  try {
    response = await fetchQuestionList();
    totalValue.value = response.length;
    totalCorrect.value=response.filter((question)=>question.isCorrect).length;
    // response.forEach((question) => {
    //   if (question.isCorrect) totalCorrect.value++;
    // });
  } catch (error) {
    console.error("Failed to calucate question", error);
  }
};
onMounted(async()=>{
  await calculateNum();
})
</script>

<style scoped>
.picsort {
  display: flex; /* 使用 Flex 布局 */
  justify-content: space-between; /* 子元素之间的间距 */
  align-items: center; /* 子元素垂直居中 */
  gap: 20px; /* 子元素之间的间距 */
  flex-wrap: wrap; /* 让子元素换行 */
}
.picsort > * {
  flex: 1 1 calc(50% - 10px); /* 每个子元素占据 50% 的宽度，并预留出间隙 */
  box-sizing: border-box; /* 包含 padding 和 border 在内的宽度 */
}
</style>
