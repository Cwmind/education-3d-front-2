<!-- 基础chart组件 -->
<template>
  <div ref="chartRef" class="width-100 height-100"></div>
</template>

<script setup>
/* 基础chart组件 自动根据ref元素初始化echarts 只需传入options即可渲染图表 自动监测options变化并重新渲染 */

import { useECharts } from '@/hooks/useECharts'
import { isInvalidValue } from '@/utils/fun'
import { watchDebounced } from '@vueuse/core'

const props = defineProps({
  options: {
    type: Object,
    default: () => {}
  }
})

const chartRef = ref()
const { setOptions } = useECharts(chartRef)
watchDebounced(() => props.options, (val) => {
  console.log(val)
  if (!isInvalidValue(val) && Object.keys(val).length) {
    nextTick(() => {
      setOptions(val)
    })
  }
}, {
  immediate: true,
  deep: true,
  debounce: 200
})

</script>

<style scoped lang="scss">
</style>
