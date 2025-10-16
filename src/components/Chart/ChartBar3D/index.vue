<!-- 基础3D柱状图 组件 -->
<template>
  <basic-no-data-div class="chart-bar-3d" :showNoData="showNoData">
    <chart-legends-custom v-if="config.showLegend" :data="legends" />
    <basic-chart :options="chartOptions" />
  </basic-no-data-div>
</template>

<script setup>
import ChartLegendsCustom from '@/components/Chart/ChartLegendsCustom/index'
import BasicNoDataDiv from '@/components/BasicNoDataDiv/index'

const showNoData = ref(false)

/* 基础3D柱状图 组件 传入配置生成3d柱状图
  示例配置
{
  x: { // x轴配置
    name: '时间',
    unit: '',
    data: [1, 2, 3, 4]
  },
  y: [ // x轴配置
    {
      name: '数量',
      unit: '个'
    }
  ],
  seriesData: [ // 图表数据
    {
      name: '一组',
      data: [10, 20, 50, 100]
    }, {
      name: '二组',
      data: [10, 20, 50, 100]
    }
  ],
  showLegend:false, // 是否展示图例 3d柱状图图例为自定义的不可交互 默认不展示 不传不展示
  type: 'bar', // 默认 bar 纯柱子 barAndLine 柱子和折线
  options: { // 其它定制echarts配置 会merge到最终生成的options中去
    grid: {
      left: 100
    },
    dataZoom: [
      { type: 'inside' }, { type: 'slider', height: 20, textStyle: { color: 'transparent' }}
    ]
  }
} */
// todo 柱状图颜色

import { watchDebounced } from '@vueuse/core'
import { deepClone } from '../../../utils'
import { getYAxis } from '../../../utils/echartsFun'
import _ from 'lodash'
const chartOptions = ref()

const legends = ref([
  {
    label: '',
    shape: 'square',
    color: 'linear-gradient( 180deg, #FFD15C 0%, rgba(255,209,92,0) 100%)'
  }, {
    label: '',
    shape: 'line',
    color: 'linear-gradient( 180deg, #FFD15C 0%, rgba(255,209,92,0) 100%)'
  }
])
const props = defineProps({
  theme: {
    type: String,
    default: 'light'
  },
  config: {
    type: Object,
    required: true,
    default: () => {
      return {
      }
    }
  }
})

// 3d柱状图的基础配置
const baseOptions = {
  tooltip: {
    trigger: 'axis',
    confine: true,
    axisPointer: {
      type: 'cross'
    }
  },
  grid: {
    left: 60,
    top: 50,
    right: 80,
    bottom: 40
  },
  legend: {
    data: [],
    right: 0
  },
  xAxis: [
    {
      type: 'category',
      name: '',
      axisTick: {
        show: false
      },
      axisLabel: {
      },
      nameTextStyle: {
        align: 'left'
      },
      axisLine: {
        show: false
      },
      data: []
    }
  ],
  yAxis: [],
  series: []
}

onMounted(() => {
  chartOptions.value = refreshChartBar3D(props.config)
})

// 防抖检测配置变化 并重新渲染
watchDebounced(() => props.config, val => {
  nextTick(() => {
    refreshChartBar3D(val)
  })
}, {
  immediate: true,
  deep: true,
  debounce: 200
})

const refreshChartBar3D = (config) => {
  if ((Array.isArray(config.seriesData) && config.seriesData.length !== 0)) {
    showNoData.value = false
  } else {
    showNoData.value = true
    return
  }
  const options = deepClone(baseOptions)
  options.xAxis[0].data = config.xData.data
  options.xAxis[0].name = config.xData.name + (config.xData.unit)
  options.yAxis = getYAxis(config.yData.map(x => x.name))
  options.series = [
    {
      z: 2,
      name: config.seriesData[0].name,
      type: 'pictorialBar',
      symbolPosition: 'end',
      data: config.seriesData[0].data,
      symbol: 'diamond',
      symbolOffset: ['0', '-50%'],
      symbolSize: [22, 10],
      tooltip: {
        show: true,
        valueFormatter: e => e + (config.yData[0].unit || '')
      },
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, x2: 0, y: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#FFD15C' },
            { offset: 1, color: '#fad496' }
          ]
        }
      }
    },
    {
      z: 1,
      type: 'bar',
      barWidth: 10,
      barGap: '0%',
      data: config.seriesData[0].data,
      stack: '1',
      tooltip: {
        show: false
      },
      itemStyle: {
        borderWidth: 0,
        color: {
          type: 'linear',
          x: 0, x2: 0, y: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#FFD15C' },
            { offset: 1, color: 'rgba(255, 209, 92, 0)' }
          ]
        }
      }
    },
    {
      z: 1,
      type: 'bar',
      barWidth: 2,
      barGap: 0,
      data: config.seriesData[0].data,
      stack: '2',
      tooltip: {
        show: false
      },
      itemStyle: {
        borderWidth: 0,
        // color: 'transparent'
        color: {
          type: 'linear',
          x: 0, x2: 0, y: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255,237,208,1)' },
            { offset: 1, color: 'rgba(255,237,208,0)' }
          ]
        }
      }
    },
    {
      z: 1,
      type: 'bar',
      barWidth: 10,
      barGap: '0%',
      data: config.seriesData[0].data,
      stack: '3',
      tooltip: {
        show: false
      },
      itemStyle: {
        borderWidth: 0,
        color: {
          type: 'linear',
          x: 0, x2: 0, y: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#FFD15C' },
            { offset: 1, color: 'rgba(255, 209, 92, 0)' }
          ]
        }
      }
    }
  ]

  if (config?.type === 'barAndLine') {
    options.series.push({
      type: 'line',
      tooltip: {
        show: true,
        valueFormatter: e => e + (config.yData[1].unit || '')
      },
      yAxisIndex: 1,
      name: config.seriesData[1].name,
      data: config.seriesData[1].data
    })
  }
  if (config?.showLegend) {
    if (config.seriesData.length === 1) {
      legends.value = [legends.value[0]]
      legends.value[0].label = config.seriesData[0].name
    }

    if (config.seriesData.length === 2) {
      legends.value[0].label = config.seriesData[0].name
      legends.value[1].label = config.seriesData[1].name
    }
  }

  return _.merge(options, config.options)
}

</script>

<style scoped lang="scss">
.chart-bar-3d{
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
