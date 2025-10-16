<template>
  <div class="attendance-analysis-pie">
    <div ref="chartRef" class="attendance-pie-chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import 'echarts-gl'

const colorList = ['#0677c9', '#FF7C4D', '#ddd34a']
const chartRef = ref(null)
let chartInstance = null

// 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
function getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, height) {
  // 计算
  const midRatio = (startRatio + endRatio) / 2

  const startRadian = startRatio * Math.PI * 2
  const endRadian = endRatio * Math.PI * 2
  const midRadian = midRatio * Math.PI * 2

  // 如果只有一个扇形，则不实现选中效果。
  if (startRatio === 0 && endRatio === 1) {
    isSelected = false
  }

  // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
  k = typeof k !== 'undefined' ? k : 1 / 3

  // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
  const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0
  const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0

  // 计算高亮效果的放大比例（未高亮，则比例为 1）
  const hoverRate = isHovered ? 1.05 : 1

  // 返回曲面参数方程
  return {
    u: {
      min: -Math.PI,
      max: Math.PI * 3,
      step: Math.PI / 32
    },

    v: {
      min: 0,
      max: Math.PI * 2,
      step: Math.PI / 20
    },

    x: function (u, v) {
      if (u < startRadian) {
        return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
      }
      if (u > endRadian) {
        return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
      }
      return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate
    },

    y: function (u, v) {
      if (u < startRadian) {
        return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
      }
      if (u > endRadian) {
        return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
      }
      return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate
    },

    z: function (u, v) {
      if (u < -Math.PI * 0.5) {
        return Math.sin(u)
      }
      if (u > Math.PI * 2.5) {
        return Math.sin(u)
      }
      return Math.sin(v) > 0 ? 1 * height : -1
    }
  }
}

// 生成模拟 3D 饼图的配置项
function getPie3D(title, pieData) {
  const series = []
  let sumValue = 0
  let startValue = 0
  let endValue = 0
  const legendData = []
  const k = 1
  for (let i = 0; i < pieData.length; i++) {
    sumValue += pieData[i].value
    const seriesItem = {
      name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
      type: 'surface',
      parametric: true,
      wireframe: {
        show: false
      },
      pieData: pieData[i],
      pieStatus: {
        selected: false,
        hovered: false,
        k: 1
      }
    }

    if (typeof pieData[i].itemStyle !== 'undefined') {
      const itemStyle = {}

      typeof pieData[i].itemStyle.color !== 'undefined'
        ? (itemStyle.color = pieData[i].itemStyle.color)
        : null
      typeof pieData[i].itemStyle.opacity !== 'undefined'
        ? (itemStyle.opacity = pieData[i].itemStyle.opacity)
        : null

      seriesItem.itemStyle = itemStyle
    }
    series.push(seriesItem)
  }

  // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
  // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
  for (let i = 0; i < series.length; i++) {
    endValue = startValue + series[i].pieData.value
    series[i].pieData.startRatio = startValue / sumValue
    series[i].pieData.endRatio = endValue / sumValue
    series[i].parametricEquation = getParametricEquation(
      series[i].pieData.startRatio,
      series[i].pieData.endRatio,
      false,
      false,
      k,
      4
    )

    startValue = endValue

    legendData.push(series[i].name)
  }

  // 准备待返回的配置项，把准备好的 legendData、series 传入。
  const option = {
    title: {
      text: title,
      left: 'center',
      top: '4%'
    },
    legend: {
      show: true,
      top: '15%'
    },
    tooltip: {
      formatter: (params) => {
        if (params.seriesName !== 'mouseoutSeries') {
          return `${
            params.seriesName
          }<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
            params.color
          };"></span>${option.series[params.seriesIndex].pieData.value2}%`
        }
      }
    },

    xAxis3D: {
      min: -1,
      max: 1
    },
    yAxis3D: {
      min: -1,
      max: 1
    },
    zAxis3D: {
      min: -1,
      max: 1
    },
    grid3D: {
      show: false,
      boxHeight: 4,
      top: '1%',
      viewControl: {
        autoRotate: false, // 自动旋转
        autoRotateAfterStill: 2, // 是否自动恢复旋转 秒
        distance: 262, // 视角的距离
        alpha: 40, // 倾斜角度
        beta: 110, // 视角绕 y 轴，即左右旋转的角度。
        zoomSensitivity: 0, // 禁用缩放
        rotateSensitivity: 0 // 禁用旋转
      }
    },
    series: series
  }
  return option
}

function setChartData(data) {
  if (chartInstance) {
    chartInstance?.dispose()
    chartInstance = null
  }
  chartInstance = echarts.init(chartRef.value)
  const { title, chartData } = data
  const seriesData = []
  chartData.forEach((item, index) => {
    seriesData.push({
      name: item.intervalRange,
      value: item.percentage,
      value2: item.percentage,
      itemStyle: {
        color: colorList[index]
      }
    })
  })

  const option = getPie3D(title, seriesData, 1.5)
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
.attendance-analysis-pie {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 350px;

  .attendance-pie-chart {
    width: 450px;
  }
}
</style>
