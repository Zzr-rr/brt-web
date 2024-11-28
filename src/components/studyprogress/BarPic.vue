<template>
  <el-card :body-style="{ padding: '20px' }" class="custom-card">
    <div ref="chartContainer" style="width: 400px; height: 300px;"></div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";

// 定义 props，接收来自父组件的数据
const props = defineProps({
  databank: {
    required: true,
    type: Array,
  },
});

// 图表容器引用
const chartContainer = ref(null);
let myChart = null;

// 更新图表的配置和数据
const updateChart = () => {
  if (myChart) {
    const subjects = props.databank.map(item => item.name);  
    const correctData = props.databank.map(item => item.correct); 
    const errorData = props.databank.map(item => item.error); 

    const option = {
      title: {
        text: '学习进度',
        left: 'center',
        textStyle: {
          fontSize: 16,
          color: 'white'
        }
      },
      backgroundColor: 'rgb(40, 46, 72)', // 背景色
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
        data: subjects,  // 使用科目名称
        axisLabel: {
          color: 'white'
        },
        axisLine: {
          lineStyle: {
            color: 'white'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: 'white'
        },
        axisLine: {
          lineStyle: {
            color: 'white'
          }
        }
      },
      series: [
        {
          name: '正确',
          type: 'bar',
          stack: 'total',  // 堆叠的标识
          data: correctData,  // 正确题数
          itemStyle: {
            color: '#34D160' // 绿色
          },
          barWidth: 50,
        },
        {
          name: '错误/未完成',
          type: 'bar',
          stack: 'total',  // 堆叠的标识
          data: errorData,  // 错误题数
          itemStyle: {
            color: '#FF6A6A' // 红色
          },
          barWidth: 50,  // 柱子宽度
        },
        // {
        //   name: '总量',
        //   type: 'bar',
        //   stack: 'total',  // 堆叠的标识
        //   data: totalData,  // 总的做题量
        //   itemStyle: {
        //     color: '#D3D3D3' // 灰色背景
        //   },
        //   barWidth: 30,
        // }
      ],
      // 控制柱子间的间隙
      barGap: '0%', // 同一组柱形之间的间隙为 0
      barCategoryGap: '10%'  // 不同组柱形之间的间隙
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
</script>

<style scoped>
.custom-card {
  position: sticky;
  padding: 10px;
  width: 450px; height: 350px;
  border-radius: 2%;
  color: white;
  font-size: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
