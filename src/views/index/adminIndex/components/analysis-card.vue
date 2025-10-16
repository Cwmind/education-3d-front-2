<template>
  <div class="analysis-card">
    <el-statistic :title="props.title" :value="outputValue" :group-separator="''" />
    <img v-if="props.icon" :src="props.icon" alt="" class="analysis-card-icon" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTransition } from '@vueuse/core'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  value: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: ''
  }
})

const source = ref(0)
const outputValue = useTransition(source, {
  duration: 500
})

watch(
  () => props.value,
  (e) => {
    source.value = e
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.analysis-card {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  padding: 19px 0 19px 45px;
  position: relative;
  :deep(.el-statistic__head) {
    font-weight: 500;
    font-size: 14px;
    color: #d6d6d6;
    line-height: 16px;
  }
  :deep(.el-statistic__content) {
    font-weight: bold;
    font-size: 24px;
    color: #ffffff;
    line-height: 26px;
    cursor: pointer;
    &:hover {
      color: #ff7c4d;
    }
  }
  &-icon {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 84px;
    height: 84px;
  }
}
</style>
