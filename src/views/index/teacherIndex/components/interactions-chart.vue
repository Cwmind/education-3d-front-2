<template>
  <div class="interactions-chart">
    <div class="chart-title">{{ props.title }}</div>
    <BasicNoData v-if="showNoData" />
    <div v-else ref="chartRef" class="chart-content"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})
const showNoData = ref(true)
const chartRef = ref(null)
let chartInstance = null

const commonTooltip = {
  trigger: 'axis',
  axisPointer: {
    type: 'none' // 取消竖线
  },
  backgroundColor: 'rgba(0, 0, 0, 0.7)', // 修改 tooltip 背景色
  borderWidth: 0,
  formatter: function (params) {
    const item = params[0]
    const customMarker = `<span style="display:inline-block;margin-right:4px;margin-bottom:2px;border-radius:50%;width:6px;height:6px;background-color:${item.color};"></span>`
    return `${customMarker}此课程互动 ${item.data}次`
  },
  textStyle: {
    color: '#D2D2D2',
    fontSize: 12
  }
}
function getChartOption(yAxisData, seriesData) {
  return {
    grid: {
      left: 5,
      right: 50,
      bottom: 16,
      top: 16,
      containLabel: true
    },
    tooltip: commonTooltip,
    color: '#FF875C',
    xAxis: {
      type: 'value',
      name: '次',
      nameLocation: 'start',
      nameTextStyle: {
        padding: [0, -5, -20, 0], // 调整单位与轴标签的间距
        verticalAlign: 'bottom'
      },
      splitLine: {
        show: true, // 显示分割线
        lineStyle: {
          type: 'dashed', // 设置为虚线
          color: ['#0000001a'],
          width: 1
        }
      }
    },
    yAxis: {
      type: 'category',
      data: yAxisData,
      axisTick: {
        show: false
      },
      axisLabel: {
        textStyle: {
          color: '#7F7F7F'
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#E0E0E0',
          width: 1,
          type: 'solid'
        }
      }
    },
    series: [
      {
        type: 'bar',
        data: seriesData,
        barWidth: 20
      }
    ]
  }
}

function setChartData(data) {
  if (data?.length > 0) {
    showNoData.value = false
    const yAxisData = []
    const seriesData = []
    data.forEach((item) => {
      yAxisData.push(item.courseName)
      seriesData.push(item.commentCount)
    })
    nextTick(() => {
      if (!chartInstance) {
        chartInstance = echarts.init(chartRef.value)
      }
      const option = getChartOption(yAxisData, seriesData)
      chartInstance.setOption(option)
    })
  } else {
    showNoData.value = true
  }
}

onMounted(() => {
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})
onUnmounted(() => {
  chartInstance?.dispose()
})

defineExpose({
  setChartData
})
</script>

<style lang="scss" scoped>
.interactions-chart {
  width: 100%;
  height: 300px;
  .chart-title {
    font-weight: 500;
    font-size: 16px;
    color: #000000;
  }
  .chart-content {
    height: 280px;
  }
}
</style>
