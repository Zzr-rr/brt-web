<template>
  <el-card class="custom-card">
    <div ref="chartContainer" style="width: 600px; height: 300px;"></div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";
const datebank=[
  {
    name:11.24,
    correct:8,
    error:2,
  },
  {
    name:11.25,
    correct:30,
    error:13,
  },
  {
    name:11.26,
    correct:5,
    error:4,
  },
  {
    name:11.27,
    correct:10,
    error:2,
  },
  {
    name:11.28,
    correct:20,
    error:5,
  }
];
// 定义 props，接收来自父组件的数据
// const props = defineProps({
//   databank: {
//     required: true,
//     type: Array,
//   },
// });

// 图表容器引用
const chartContainer = ref(null);
let myChart = null;

// 更新图表的配置和数据
const updateChart = () => {
  if (myChart) {
    // const subjects = props.databank.map(item => item.name);  
    // const correctData = props.databank.map(item => item.correct); 
    // const errorData = props.databank.map(item => item.error); 
    const subjects = datebank.map(item => item.name);  
    const correctData = datebank.map(item => item.correct); 
    const errorData = datebank.map(item => item.error); 
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
        data: subjects, 
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
          stack: 'total',  
          data: correctData, 
          itemStyle: {
            color: '#34D160' 
          },
          barWidth: 50,
        },
        {
          name: '错误',
          type: 'bar',
          stack: 'total', 
          data: errorData,  
          itemStyle: {
            color: '#FF6A6A'
          },
          barWidth: 50,  
        },
        // {
        //   name: '总量',
        //   type: 'bar',
        //   stack: 'total',  // 堆叠的标识
        //   data: 2,  // 总的做题量
        //   itemStyle: {
        //     color: '#D3D3D3' // 灰色背景
        //   },
        //   barWidth: 30,
        // }
      ],
      // 控制柱子间的间隙
      barGap: '0%', 
      barCategoryGap: '10%' 
    };

    myChart.setOption(option);
  }
};

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
  width: 625px; height: 350px;
  border-radius: 2%;
  color: white;
  font-size: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color:  rgb(40,46,72);
}
</style>
