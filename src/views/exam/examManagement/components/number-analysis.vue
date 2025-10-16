<template>
  <div class="number-analysis">
    <div ref="chartRef" class="number-analysis-chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const colorList = ['#FF7C4D', '#34BF00']
const chartRef = ref(null)
let chartInstance = null

function getChartOption(totalStudent, seriesData) {
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
          formatter: '{name|{b}}\n{value|{c}}\n{before|}{circle|}{after|}',
          rich: {
            name: {
              lineHeight: 0,
              fontSize: 14,
              color: '#00000080',
              fontWeight: 500,
              padding: [0, 10, 15, 10] // 调整文本位置
            },
            value: {
              lineHeight: 0,
              fontSize: 20,
              color: '#000000',
              fontWeight: 'bold',
              padding: [0, 10, -25, 10] // 调整文本位置
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
          length2: 60 // 引导线第二段长度
        },
        data: seriesData
      }
    ],
    graphic: {
      type: 'text',
      left: 'center',
      top: 'center',
      style: {
        text: `{name|总计}\n{value|${totalStudent}}`,
        rich: {
          name: {
            textAlign: 'center',
            fontSize: 14,
            color: '#000000',
            fontWeight: 500
          },
          value: {
            textAlign: 'center',
            fontSize: 20,
            color: '#000000',
            fontWeight: 'bold',
            lineHeight: 24
          }
        }
      }
    }
  }
}

function setChartData(data) {
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }
  const { totalStudent, examCount, unExamCount } = data
  const seriesData = [
    { name: '未参考人数', value: unExamCount },
    { name: '参考人数', value: examCount }
  ]
  const option = getChartOption(totalStudent, seriesData)
  chartInstance.setOption(option)
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
.number-analysis {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 210px;
  &-chart {
    width: 100%;
  }
}
</style>
