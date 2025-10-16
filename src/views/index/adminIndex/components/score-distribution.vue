<template>
  <div class="score-distribution">
    <div class="score-distribution-top">
      <div ref="passRateChart" class="score-distribution-top-left"></div>
      <div ref="unPassRateChart" class="score-distribution-top-right"></div>
    </div>
    <div class="score-distribution-bottom">
      <div v-for="(item, index) in scoreItem" :key="index" class="score-distribution-bottom-item">
        <div class="item-title">{{ item.itemTitle }}</div>
        <div class="item-progress">
          <el-progress
            :percentage="item.itemProgress"
            :stroke-width="10"
            :show-text="false"
            :color="index === 0 ? '#FF7C4D' : '#34BF00'"
          />
        </div>
        <div class="item-number">{{ item.itemNumber }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const passRateChart = ref(null)
let passRateChartInstance = null

const unPassRateChart = ref(null)
let unPassRateChartInstance = null

const scoreItem = ref([])

function getRateChartOption(rate, color) {
  return {
    grid: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        radius: '130%',
        center: ['50%', '70%'],
        detail: {
          formatter: '{value}{percent|%}',
          rich: {
            percent: {
              color: '#FFFFFF',
              fontSize: 10,
              fontWeight: 350
            }
          },
          color: '#FFFFFF',
          fontSize: 20,
          fontWeight: 450,
          lineHeight: 28,
          offsetCenter: [2, -8]
        },
        title: {
          show: true,
          offsetCenter: [0, 12],
          textStyle: {
            color: '#D6D6D6',
            fontSize: 15,
            fontWeight: 500,
            lineHeight: 24
          }
        },
        data: [],
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [rate, color],
              [1, 'rgba(255,255,255,0.05)']
            ]
          }
        },
        axisTick: { show: false },
        axisLabel: { show: false },
        pointer: {
          show: false
        },
        splitLine: {
          show: false // 不显示分隔线
        }
      }
    ]
  }
}
function initPassRateChart(rate) {
  if (!passRateChartInstance) {
    passRateChartInstance = echarts.init(passRateChart.value)
  }
  const rateNum = rate / 100
  const option = getRateChartOption(rateNum, '#34BF00')
  option.series[0].data = [
    {
      value: rate,
      name: '通过率'
    }
  ]
  passRateChartInstance.setOption(option)
}
function initUnPassRateChart(rate) {
  if (!unPassRateChartInstance) {
    unPassRateChartInstance = echarts.init(unPassRateChart.value)
  }
  const rateNum = rate / 100
  const option = getRateChartOption(rateNum, '#FF7C4D')
  option.series[0].data = [
    {
      value: rate,
      name: '未通过率'
    }
  ]
  unPassRateChartInstance.setOption(option)
}

function setData(data) {
  if (data) {
    const { passedRate, unPassedRate, scoreRangeList } = data
    initPassRateChart(passedRate.toFixed(2))
    initUnPassRateChart(unPassedRate.toFixed(2))
    let totalStudents = 0
    scoreRangeList.forEach((item) => {
      totalStudents += item.studentCount
    })
    const list = []
    scoreRangeList.forEach((item) => {
      const percentage = ((item.studentCount / totalStudents) * 100).toFixed(2) // 保留两位小数
      list.push({
        itemTitle: item.scoreRange,
        itemNumber: `${item.studentCount}人次`,
        itemProgress: percentage
      })
    })
    scoreItem.value = list
  }
}

onMounted(() => {
  window.addEventListener('resize', () => {
    passRateChartInstance && passRateChartInstance.resize()
    unPassRateChartInstance && unPassRateChartInstance.resize()
  })
})
defineExpose({
  setData
})
</script>

<style lang="scss" scoped>
.score-distribution {
  margin-bottom: 24px;
  &-top {
    display: grid;
    height: 96px;
    grid-template-columns: repeat(2, 1fr);
    gap: 9px;
    place-items: center;
    padding: 0 30px;
    &-left {
      width: 200px;
      height: 96px;
    }
    &-right {
      width: 200px;
      height: 96px;
    }
  }
  &-bottom {
    &-item {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      .item-title {
        width: 50px;
        font-weight: 400;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        line-height: 18px;
        margin-right: 4px;
      }
      .item-progress {
        flex: 1;
        :deep(.el-progress-bar__outer) {
          border-radius: 0;
          background-color: rgba(255, 255, 255, 0.05);
        }
        :deep(.el-progress-bar__inner) {
          border-radius: 0;
        }
      }
      .item-number {
        width: 60px;
        font-weight: 400;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        line-height: 18px;
        margin-left: 11px;
      }
    }
  }
}
</style>
