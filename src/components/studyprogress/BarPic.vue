<template>
  <el-card class="custom-card">
    <div ref="chartContainer" style="width: 800px; height: 300px;"></div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, nextTick, reactive } from "vue";
import * as echarts from "echarts";
import questionBankApi from "@/api/questionBank";
// 用于存储标签及其计数的对象
const databank1 = reactive({});
let datebank = [];

// 获取题库数据并统计标签
const fetchData = async () => {
  try {
    // 获取题库列表
    const response = await questionBankApi.getBankList();
    const QuestionList = response.data;

    // 遍历所有题库项
    for (let QuestionItem of QuestionList) {
      // 解析每个题目的 keywords 字段，假设它是 JSON 字符串
      const QuestionKeyWords = JSON.parse(QuestionItem.keywords);

  
      for (let item of QuestionKeyWords) {
       
        if (databank1[item]) {
          databank1[item]++;
        } else {
          databank1[item] = 1;
        }
      }
    }

   
    datebank = Object.entries(databank1)
      .sort((a, b) => b[1] - a[1])  
      .slice(0, 7)  
      .map(item => ({
        name: item[0],  
        count: item[1]  
      }));
    updateChart(); 

  } catch (error) {
    console.log("error", error);
  }
};

// 图表容器引用
const chartContainer = ref(null);
let myChart = null;

// 更新图表的配置和数据
const updateChart = () => {
  if (myChart && datebank.length > 0) {
    const tags = datebank.map(item => item.name);  // 标签名
    const counts = datebank.map((item, index) => {
      // 根据索引动态设置柱子的颜色
      let color = "#34D160"; // 默认绿色
      if (item.count>10&&(index===0||index===1)) color = "#FF6A6A"; // 第一名：红色
      else if (item.count>4&&(index===2||index===3)) color = "#FFD700"; // 第二名：黄色

      return {
        value: item.count,
        itemStyle: {
          color, // 动态颜色
        },
      };
    });

    const option = {
      title: {
        text: '题库标签统计',
        left: 'center',
        textStyle: {
          fontSize: 16,
          color: 'black'
        }
      },
      // backgroundColor: 'rgb(40, 46, 72)', // 背景色
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: tags, // 使用标签名作为 X 轴
        axisLabel: {
          color: 'black'
        },
        axisLine: {
          lineStyle: {
            color: 'black'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: 'black'
        },
        axisLine: {
          lineStyle: {
            color: 'black'
          }
        }
      },
      series: [
        {
          name: '标签数',
          type: 'bar',
          data: counts, // 使用动态颜色数据
          barWidth: 50,
        }
      ],
      // 控制柱子间的间隙
      barGap: '0%', 
      barCategoryGap: '10%' 
    };

    myChart.setOption(option);
  }
};

// 在组件加载时调用 fetchData 方法
onMounted(() => {
  nextTick(() => {
    myChart = echarts.init(chartContainer.value);
    fetchData();  
  });
});
</script>

<style scoped>
.custom-card {
  position: sticky;
  width: 900px !important; height: 350px;
  border-radius: 2%;
  color: white;
  font-size: 24px;
  
  
}

#chartContainer{
  width: 100%;
}

</style>