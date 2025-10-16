import { nextTick, onMounted, onUnmounted, unref } from 'vue'
import echarts from '@/utils/lib/echarts'
import { useElementVisibility } from '@vueuse/core/index'

export function useECharts(elRef) {
  let chartInstance = null
  const targetIsVisible = useElementVisibility(elRef)
  // chart被隐藏又显示时 中途可能尺寸发生了变化 显示时resize
  watch(() => targetIsVisible.value, (e) => {
    if (e) {
      nextTick(() => {
        if (elRef.value?.clientWidth === 0) {
          return
        }
        chartInstance?.resize()
      })
    }
  })
  function initCharts() {
    const el = unref(elRef)
    if (!el || !unref(el)) {
      return
    }
    chartInstance = echarts.init(el)
  }

  function setOptions(options, clear = true) {
    nextTick(() => {
      setTimeout(() => {
        if (!chartInstance) {
          initCharts()
        }
        clear && chartInstance?.clear()
        chartInstance?.setOption(options)
      }, 30)
    })
  }

  onMounted(() => {
    window.addEventListener('resize', () => {
      if (elRef.value?.clientWidth === 0) {
        return
      }
      chartInstance?.resize()
    })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', () => {
      chartInstance?.resize()
    })
    if (chartInstance) {
      chartInstance.dispose()
      chartInstance = null
    }
  })

  function getInstance() {
    if (!chartInstance) {
      initCharts()
    }
    return chartInstance
  }

  return { setOptions, getInstance }
}
