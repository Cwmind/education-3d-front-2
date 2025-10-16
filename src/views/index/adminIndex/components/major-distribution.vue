<template>
  <div class="major-distribution">
    <div ref="majorDistributionChart" class="major-distribution-chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const colorList = ['#2A9B00', '#34BF00', '#E95520', '#FF7C4D', '#FFA180']
const majorDistributionChart = ref(null)
let majorDistributionChartInstance = null

function getChartOption(seriesData) {
  return {
    color: colorList,
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '50%'],
        label: {
          show: true,
          position: 'outside',
          formatter: '{name|{b}}\n{value|{c}}{percent|%}\n{before|}{circle|}{after|}',
          rich: {
            name: {
              lineHeight: 0,
              fontSize: 14,
              color: '#ffffffb3',
              fontWeight: 500,
              padding: [0, 10, 15, 10] // 调整文本位置
            },
            value: {
              lineHeight: 0,
              fontSize: 14,
              color: '#ffffffb3',
              fontWeight: '500',
              padding: [0, 0, -25, 10] // 调整文本位置
            },
            percent: {
              lineHeight: 0,
              fontSize: 10,
              color: '#ffffffb3',
              fontWeight: '500',
              padding: [0, 10, -25, 0] // 调整文本位置
            },
            before: {
              padding: [0, -5, 0, 0] // 调整左侧偏移
            },
            after: {
              padding: [0, 0, 0, -5] // 调整右侧偏移
            },
            circle: {
              backgroundColor: 'transparent', // 背景透明
              borderColor: 'auto', // 空心圆的颜色与扇区颜色一致
              borderRadius: 7, // 圆的半径
              borderWidth: 1, // 边框宽度
              width: 7, // 强制撑开宽度
              height: 7 // 强制撑开高度
            }
          }
        },
        labelLine: {
          length: 5, // 引导线第一段长度
          length2: 40 // 引导线第二段长度
        },
        data: seriesData
      }
    ]
  }
}

function setChartData(data) {
  if (!majorDistributionChartInstance) {
    majorDistributionChartInstance = echarts.init(majorDistributionChart.value)
  }
  const seriesData = []
  data.forEach((element) => {
    seriesData.push({
      name: element.majorName,
      value: element.proportion
    })
  })
  const option = getChartOption(seriesData)
  majorDistributionChartInstance.setOption(option)
}

defineExpose({
  setData: setChartData
})

onMounted(() => {
  window.addEventListener('resize', () => {
    majorDistributionChartInstance && majorDistributionChartInstance.resize()
  })
})
</script>

<style lang="scss" scoped>
.major-distribution {
  display: flex;
  justify-content: center;
  &-chart {
    width: 100%;
    height: 215px;
  }
}
</style>
