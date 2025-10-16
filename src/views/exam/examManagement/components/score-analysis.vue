<template>
  <div class="score-analysis">
    <BasicNoData v-if="showNoData" />
    <div v-else ref="chartRef" class="score-analysis-chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const showNoData = ref(true)
const chartRef = ref(null)
let chartInstance = null
const chartColor = '#34BF00'

const commonTooltip = {
  trigger: 'axis',
  axisPointer: {
    type: 'none' // 取消竖线
  },
  backgroundColor: 'rgba(0, 0, 0, 0.7)', // 修改 tooltip 背景色
  borderWidth: 0,
  textStyle: {
    color: '#fff',
    fontSize: 14
  },
  formatter: function (params) {
    const item = params[0]
    const customMarker = `<span style="display:inline-block;margin-right:4px;margin-bottom:2px;border-radius:50%;width:6px;height:6px;background-color:${item.color};"></span>`
    return `${customMarker}人数为 ${item.data}`
  }
}

function getChartOption(xAxisData, seriesData) {
  return {
    color: chartColor,
    grid: {
      top: 30,
      left: 40,
      right: 0,
      bottom: 20
    },
    tooltip: commonTooltip,
    xAxis: {
      data: xAxisData,
      axisTick: {
        show: false
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
    yAxis: {
      type: 'value',
      name: '人数',
      splitLine: {
        show: true, // 显示分割线
        lineStyle: {
          type: 'dashed', // 设置为虚线
          color: ['#0000001a'],
          width: 1
        }
      }
    },
    series: [
      {
        name: '分数',
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
    const xAxisData = []
    const seriesData = []
    data.forEach((element) => {
      xAxisData.push(element.scoreRange)
      seriesData.push(element.studentCount)
    })
    nextTick(() => {
      if (!chartInstance) {
        chartInstance = echarts.init(chartRef.value)
      }
      const option = getChartOption(xAxisData, seriesData)
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
.score-analysis {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 210px;
  &-chart {
    width: 100%;
    height: 100%;
  }
}
</style>
