<template>
  <el-card :body-style="{ padding: '20px' }" class="custom-card" >
    <div ref="chartContainer" style="width: 600px; height: 300px"></div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import * as echarts from "echarts";

// 定义 props，接收来自父组件的 totalCorrect 和 totalValue 数据
const props = defineProps({
  totalCorrect: {
    type: Number,
    required: true,
  },
  totalValue: {
    type: Number,
    required: true,
  },
});

// 图表容器引用
const chartContainer = ref(null);
let myChart = null;

// 更新图表的配置和数据
const updateChart = () => {
  if (myChart) {
    const option = {
      backgroundColor: "rgb(40,46,72)",
      title: {
        text: "刷题进度",
        top: "50%",
        left: "40%",
        padding: [-20, 0, 0, -45],
        textStyle: {
          fontSize: 19,
          color: "white",
        },
        subtext: `{totalSty|${(
          (props.totalCorrect / props.totalValue) *
          100
        ).toFixed(2)}%}`,
        subtextStyle: {
          color: "white",
          rich: {
            totalSty: {
              fontSize: 19,
              color: "white",
              align: "center",
            },
          },
        },
      },
      legend: {
        orient: "vertical",
        right: "10%",
        top: "18%",
        itemGap: 10,
        itemWidth: 16,
        itemHeight: 16,
        icon: "rect",
        formatter: function (name) {
          if (name === "正确") {
            return `{nameSty|正确: ${props.totalCorrect}道}`;
          } else if (name === "错误/未完成") {
            return `{nameSty|错误/未完成: ${props.totalValue - props.totalCorrect}道}`;
          } else {
            return "";
          }
        },
        textStyle: {
          rich: {
            nameSty: {
              fontSize: 12,
              color: "white",
              padding: [10, 14],
            },
          },
        },
      },
      tooltip: {},
      series: [
        {
          name: "学习进度",
          type: "pie", // 饼图类型
          radius: ["50%", "70%"],
          center: ["40%", "50%"],
          data: [
            {
              value: props.totalCorrect,
              name: "正确",
              itemStyle: { color: "#34D160" },
            },
            {
              value: props.totalValue - props.totalCorrect,
              name: "错误/未完成",
              itemStyle: { color: "#FF6A6A" },
            },
          ],
        },
      ],
    };

    myChart.setOption(option);
  }
};

// 在组件挂载后初始化图表
onMounted(() => {
  nextTick(() => {
    myChart = echarts.init(chartContainer.value);
    updateChart();
  });
});

// 如果 totalCorrect 或 totalValue 更新，重新设置图表
watch(
  () => [props.totalCorrect, props.totalValue],
  () => {
    updateChart();
  },
  { immediate: true }
);
</script>

<style scoped>
.custom-card {
  position: sticky;
  padding: 10px;
  width: 650px; height: 350px;
  border-radius: 2%;
  color: white;
  font-size: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
