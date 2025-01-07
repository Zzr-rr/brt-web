<template>
  
  <el-card class="custom-card" shadow="hover">
    <el-container class="file-list-container">
      <el-main>
        <el-table :data="sortedFiles" size="large" class="file" stripe>
          <el-table-column
            prop="name"
            label="题库名"
            width="150"
            class="name-column"
          >
            <template #default="{ row }">
              <div 
                class="name-cell" 
                @click="someAction(row.id)"
              >
                {{ row.name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="value"
            label="题量"
            width="100"
          ></el-table-column>
          <el-table-column label="标签" width="250">
            <template #default="{ row }">
              <div class="tag-container">
                <el-tag
                  v-for="(tag, index) in row.tag"
                  :key="index"
                  type="info"
                  class="file-tag"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="进度" width="100">
            <template #default="{ row }">
              <div :class="row.progressClass">
                {{ row.solvePercentage.toFixed(2) }}%
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <div v-if="learningbanklistLoading" class="loading-father">
        <img src="/src/assets/images/svg-spinners--12-dots-scale-rotate.svg" class="loading">
      </div>
  </el-card>
</template>

<script setup>
import { computed, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import userQuestionProgressApi from "@/api/userQuestionProgress";
import questionBankApi from "@/api/questionBank";
import { useItemStore } from "@/store/modules/CommentStore";
import { storeToRefs } from "pinia";
const router = useRouter();
const databank1=reactive([]);
const databank = reactive([]);
const StudyLoading=useItemStore();
const {learningbanklistLoading}=storeToRefs(StudyLoading);


const fetchData = async () => {
  try {
    StudyLoading.setlearningbanklistLoading(true);
    const response = await userQuestionProgressApi.getBankinfoList();
    const bankList = response.data;
    console.log("请求getBankinfoList",bankList);

    for (let bank of bankList) {

      databank1.push({
          id: bank.bankId,
          name: bank.bankName,
          value: bank.totalNum,
          tag: JSON.parse(bank.keywords),
          solvePercentage: bank.correctNum/bank.totalNum*100,
          progressClass: (bank.correctNum/bank.totalNum >= 0.6 ? "progress-green" : "progress-red"),
        });

    }


    StudyLoading.setlearningbanklistLoading(false);
  } catch (error) {
    console.error("Error fetching data", error);
  }
}


onMounted(() => {
  fetchData();
});

// 将 databank1 作为 sortedFiles 暴露给模板
const sortedFiles = computed(() => databank1);


const someAction = (id) => {
  router.push({ name: "practice", params: { id } });
};
</script>




<style scoped>
.file {
  
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 13px;
  width: 100%;
}
.loading-father{
  width: 100%;
  height: 100px;
  justify-content: center; 
  display: flex;
}
.loading{
  align-items: center; /* 垂直居中 */
}
.file-list-container {
  width: 100%;
  margin: auto;
}

.tag-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.file-tag {
  font-size: 12px;
}

.progress-green {
  color: green;
}

.progress-yellow {
  color: orange;
}

.progress-red {
  color: red;
}

.custom-card {
  overflow-y: auto; 
  position: relative;
  width: 650px;
  max-width: 100%;
  height: 400px;
  border-radius: 2%;
  color: white;
  font-size: 24px;
  margin: auto;
}

.name-cell:hover {
  color: blue;
  cursor: pointer;
}
</style>
