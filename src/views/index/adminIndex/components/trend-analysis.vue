<template>
  <div class="trend-analysis">
    <div class="trend-analysis-top">
      <div class="trend-analysis-top-item">
        <div class="item-title">实训软件访问量</div>
        <el-statistic :value="sxrjBrowseTotalValue" class="item-software" />
      </div>
      <div class="trend-analysis-top-item">
        <div class="item-title">实训课程访问量</div>
        <el-statistic :value="kcBrowseCountTotalValue" class="item-courses" />
      </div>
    </div>
    <div ref="chartContainer" class="trend-analysis-bottom"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTransition } from '@vueuse/core'
import * as echarts from 'echarts'

const chartContainer = ref(null)
let chartInstance = null

const generateSeries = (name, lineColor, data) => {
  return {
    name,
    data,
    type: 'line',
    smooth: true,
    symbol: 'none',
    symbolSize: 10,
    itemStyle: {
      color: lineColor
    },
    lineStyle: {
      width: 1,
      color: lineColor
    },
    showSymbol: false,
    areaStyle: {
      opacity: 0.1,
      color: lineColor
    }
  }
}
const commonTooltip = {
  trigger: 'axis',
  axisPointer: {
    type: 'line'
  },
  backgroundColor: 'rgba(0, 0, 0, 0.7)', // 修改 tooltip 背景色
  borderWidth: 0,
  padding: 12,
  formatter: (param) => {
    let result = ''
    param.forEach((item) => {
      const customMarker = `<span style="display:inline-block;margin-right:4px;margin-bottom:2px;border-radius:50%;width:6px;height:6px;background-color:${item.color};"></span>`
      result += customMarker + item.seriesName + ' ' + item.value + '<br/>'
    })
    return result
  },
  textStyle: {
    color: '#D2D2D2',
    fontSize: 12
  }
}
function getChartOption(xAxisData, seriesData) {
  return {
    legend: {
      show: true,
      top: 0,
      right: 0,
      icon: 'circle',
      itemHeight: 7,
      itemWidth: 7,
      textStyle: {
        color: '#FFFFFF'
      }
    },
    grid: {
      left: '40',
      right: '15',
      top: '30',
      bottom: '50'
    },
    xAxis: {
      type: 'category',
      offset: 2,
      data: xAxisData,
      boundaryGap: false,
      axisLabel: {
        interval: 0
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisPointer: {
        show: true,
        lineStyle: {
          color: '#E95621',
          width: 1
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '次',
      nameTextStyle: {
        padding: [0, 30, 0, 0] // 调整单位与轴标签的间距
      },
      axisLine: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#ffffff1a'
        }
      }
    },
    tooltip: commonTooltip,
    series: seriesData
  }
}

function setChartData(data) {
  if (!chartInstance) {
    chartInstance = echarts.init(chartContainer.value)
  }
  const xAxisData = []
  const sxrjCountList = []
  const kcCountList = []
  const seriesData = []
  data.forEach((item) => {
    xAxisData.push(item.month)
    sxrjCountList.push(item.sxrjCount)
    kcCountList.push(item.kcCount)
  })
  seriesData.push(generateSeries('实训软件访问量', '#FF7C4D', sxrjCountList))
  seriesData.push(generateSeries('实训课程访问量', '#34BF00', kcCountList))
  const option = getChartOption(xAxisData, seriesData)
  chartInstance.setOption(option)
}
// 实训软件数据
const sxrjBrowseTotal = ref(0)
const sxrjBrowseTotalValue = useTransition(sxrjBrowseTotal, {
  duration: 1000
})
// 实训课程数据
const kcBrowseCountTotal = ref(0)
const kcBrowseCountTotalValue = useTransition(kcBrowseCountTotal, {
  duration: 1000
})
function setData(data) {
  if (data) {
    sxrjBrowseTotal.value = data.sxrjBrowseTotal
    kcBrowseCountTotal.value = data.kcBrowseCountTotal
    setChartData(data.browseCountByMonth)
  } else {
    sxrjBrowseTotal.value = 0
    kcBrowseCountTotal.value = 0
  }
}

defineExpose({
  setData
})
onMounted(() => {
  window.addEventListener('resize', () => {
    chartInstance && chartInstance.resize()
  })
})
</script>

<style lang="scss" scoped>
.trend-analysis {
  &-top {
    display: grid;
    height: 84px;
    grid-template-columns: repeat(2, 1fr);
    gap: 9px;
    margin-bottom: 18px;
    &-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      .item-title {
        font-weight: 500;
        font-size: 14px;
        color: #d6d6d6;
        line-height: 21px;
        margin-bottom: 4px;
      }
      .item-software {
        :deep(.el-statistic__content) {
          font-weight: bold;
          font-size: 24px;
          color: #ff7c4d;
          line-height: 28px;
        }
      }
      .item-courses {
        :deep(.el-statistic__content) {
          font-weight: bold;
          font-size: 24px;
          color: #34bf00;
          line-height: 28px;
        }
      }
    }
  }
  &-bottom {
    width: 100%;
    height: 190px;
  }
}
</style>
