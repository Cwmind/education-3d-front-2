<template>
  <div class="course-progress">
    <div class="course-progress__title">
      总计{{ props.totalNum }}门课程，已完成{{ props.completeNum }}门课程
    </div>
    <div class="course-progress__content">
      <div class="item-title">{{ computedProgress }}</div>
      <div class="item-unit">%</div>
      <div class="item-progress">
        <el-progress
          color="#34BF00"
          :percentage="computedProgress"
          :stroke-width="10"
          :show-text="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  totalNum: {
    type: Number,
    default: 0
  },
  completeNum: {
    type: Number,
    default: 0
  }
})

const computedProgress = computed(() => {
  const complete = props.completeNum
  const total = props.totalNum
  const percentage = ((complete / total) * 100).toFixed(0)
  if (total === 0) {
    return 0
  } else {
    return percentage
  }
})
</script>

<style lang="scss" scoped>
.course-progress {
  width: 100%;
  height: 84px;
  padding: 19px;
  background: #ffffff;
  border-radius: 4px;
  &__title {
    width: 100%;
    font-weight: 500;
    font-size: 14px;
    color: #7f7f7f;
    margin-bottom: 4px;
  }
  &__content {
    width: 100%;
    display: flex;
    align-items: center;
    .item-title {
      font-weight: bold;
      font-size: 24px;
      color: #34bf00;
    }
    .item-unit {
      font-weight: bold;
      font-size: 14px;
      color: #34bf00;
      margin-right: 8px;
    }
    .item-progress {
      flex: 1;
      :deep(.el-progress-bar__outer) {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 0;
      }
      :deep(.el-progress-bar__inner) {
        border-radius: 0;
      }
    }
  }
}
</style>
