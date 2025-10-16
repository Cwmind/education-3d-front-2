<template>
  <div class="practical-progress">
    <div class="practical-progress__title">
      总计{{ props.progressData.totalClass }}个实训班级，已介绍{{
        props.progressData.studyClass
      }}个实训班级的学习
    </div>
    <div class="practical-progress__content">
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
  progressData: {
    type: Object,
    default: () => ({})
  }
})

const computedProgress = computed(() => {
  return props.progressData.totalProgress || 0
})
</script>

<style lang="scss" scoped>
.practical-progress {
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
