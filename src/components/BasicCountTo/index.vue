<!-- 大屏数字滚动展示组件 -->
<template>
  <span> {{ prefix }}{{ numValue.toFixed(precision) }}{{ suffix }} </span>
</template>

<script setup>
import { useTransition } from '@vueuse/core'
const props = defineProps({
  num: {
    type: [Number, null, undefined, String],
    default: 0
  },
  // 前缀
  prefix: {
    type: String,
    default: ''
  },
  // 后缀
  suffix: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  precision: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 1500
  }
})
const oldNumberValue = ref(0)
const numValue = useTransition(oldNumberValue, {
  duration: props.duration
})

watch(() => props.num, (e) => {
  oldNumberValue.value = e
}, {
  immediate: true
})

</script>

<style scoped lang="scss">
</style>
