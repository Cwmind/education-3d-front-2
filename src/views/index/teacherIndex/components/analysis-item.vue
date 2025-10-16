<template>
  <div class="analysis-item">
    <div class="analysis-item-content">
      <el-statistic
        :title="props.title"
        :value="outputValue"
        :value-style="computedStyle"
        :group-separator="''"
        :precision="props.precision"
      >
        <template #suffix>
          <span v-if="props.suffix" class="content-suffix" :style="computedStyle">
            {{ props.suffix }}
          </span>
        </template>
      </el-statistic>
    </div>
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
  color: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  },
  precision: {
    type: Number,
    default: 0
  }
})

const computedStyle = computed(() => {
  return {
    color: props.color ? props.color : '#000000'
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
.analysis-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-radius: 4px;
  &-content {
    :deep(.el-statistic__head) {
      font-weight: 500;
      font-size: 14px;
      color: #7f7f7f;
    }
    :deep(.el-statistic__content) {
      font-weight: bold;
      font-size: 24px;
    }
    :deep(.el-statistic__suffix) {
      margin-left: 1px;
    }
    .content-suffix {
      font-weight: bold;
      font-size: 14px;
    }
  }
}
</style>
