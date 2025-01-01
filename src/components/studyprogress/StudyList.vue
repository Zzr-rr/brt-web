<template>
  <el-card class="custom-card" shadow="hover">
    <el-container class="file-list-container">
      <!-- 文件列表 -->
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
                @click="someAction(row.name)"
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
  </el-card>
</template>
<script setup>
import { computed, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import userQuestionProgressApi from "@/api/userQuestionProgress";
import questionBankApi from "@/api/questionBank";

const router = useRouter();
const databank = reactive([]);


const fetchData = async () => {
  try {
  
    const response = await questionBankApi.getBankList();
    const bankList = response.data;  
    console.log("请求getBankList",bankList);
    
    
    for (let bank of bankList) {
      const bankId = bank.bankId;
      const title = bank.title;
      
      bank.keywords=JSON.parse(bank.keywords);
      const progressData = await userQuestionProgressApi.getQuestionProgressbankList(
        {bankId:bankId}
      ); 
      console.log("传入数据",progressData);
      if(progressData.data==[])
        continue;
      const totalValue = progressData.data.length;
      const totalCorrect = progressData.data
    .filter(question => question !== null && question.isCorrect)
    .length;
      databank.push({
        name: title,
        value: totalValue,
        correct: totalCorrect,
        tag: bank.keywords || [], // 假设每个题库有tags
      });
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
};

// 在组件挂载时执行数据获取
onMounted(() => {
  fetchData();
});

// 计算每个题库的进度百分比
const formattedFiles = computed(() => {
  return databank.map((file) => {
    file.solvePercentage = file.value === 0 ? 0 : (file.correct / file.value) * 100;
    if (file.solvePercentage >= 80) {
      file.progressClass = "progress-green";
    } else if (file.solvePercentage >= 40) {
      file.progressClass = "progress-yellow";
    } else {
      file.progressClass = "progress-red";
    }
    return file;
  });
});

// 排序文件列表，按照进度百分比从小到大排序
const sortedFiles = computed(() => {
  return [...formattedFiles.value].sort((a, b) => a.solvePercentage - b.solvePercentage);
});

const someAction = (id) => {
  alert(`操作文件ID: ${id}`);
  router.push({ name: "practice", params: { id } });
};
</script>


<style scoped>
.file {
  color: black;
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 13px;
  width: 100%;
}

.file-list-container {
  width: 100%;
  margin: auto;
  margin-top: 20px;
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
  overflow-y: auto; /* 启用纵向滚动条 */
  position: relative;
  width: 600px;
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
