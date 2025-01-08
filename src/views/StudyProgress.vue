<template>
    <!-- 静态部分，默认显示 -->
    <div v-if="$route.name !== 'review'" class="picsort">
      <Chart :totalCorrect="totalCorrect" :totalValue="totalValue" />
      <study-list/>
      <Bar />
    </div>

    <div>
      <router-view />
    </div>
  
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "@/components/studyprogress/ChartPic.vue";
import Bar from "@/components/studyprogress/BarPic.vue";
import StudyList from "@/components/studyprogress/StudyList.vue";
// import WrongList from "@/components/studyprogress/WrongList.vue";
import userQuestionProgressApi from "@/api/userQuestionProgress";
const totalCorrect = ref(0);
const totalValue = ref(0);
var response = {};

async function fetchQuestionList() {
  try {
    const response = await userQuestionProgressApi.getQuestionProgressList(); 
    
    return response.data || []; 
  } catch (error) {
    console.error("Failed to fetch question", error);
    return []; 
  }
}
async function calculateNum() {
  try {
    response = await fetchQuestionList();
    totalValue.value = response.length;
    totalCorrect.value=response.filter((question)=>question.isCorrect).length;
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
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  gap: 20px; 
  flex-wrap: wrap; 
}
.picsort > * {
  box-sizing: border-box;
}
</style>
