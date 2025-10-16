<template>
  <div class="course-detail-title">
    <div class="course-detail-title__container">
      <div class="container-back" @click="handleBackClick">
        <img src="@/assets/images/back-icon.png" alt="" />
        <span>返回上一级</span>
      </div>
      <div class="container-info">
        <div class="info-title">
          <div class="info-title-name">{{ props.courseInfo.practicalName }}</div>
          <div class="info-title-bar"></div>
        </div>
        <div class="info-content">
          <div class="info-content-item">
            <div class="info-content-item-title">学习人数</div>
            <div class="info-content-item-value">{{ props.courseInfo.learnStudentNum }}</div>
          </div>
          <div class="info-content-item">
            <div class="info-content-item-title">学习次数</div>
            <div class="info-content-item-value">{{ props.courseInfo.learnTimes }}</div>
          </div>
          <div class="info-content-item">
            <div class="info-content-item-title">浏览次数</div>
            <div class="info-content-item-value">{{ props.courseInfo.browseNum }}</div>
          </div>
        </div>
        <div class="info-score">
          <el-rate v-model="computedRate" text-color="#333333" disabled show-score />
        </div>
      </div>
      <div class="container-desc">课程简介：{{ props.instruction }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  courseInfo: {
    type: Object,
    default: () => ({})
  },
  instruction: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['back-click'])
const computedRate = computed(() => {
  return props.courseInfo.courseScore
})
const handleBackClick = () => {
  emit('back-click')
}
</script>

<style lang="scss" scoped>
.course-detail-title {
  padding: 24px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  .course-detail-title__container {
    position: relative;
    padding: 24px;
    background: rgba(255, 135, 92, 0.1);
    border-radius: 2px;
    .container-back {
      position: absolute;
      top: 24px;
      right: 24px;
      height: 16px;
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        width: 16px;
        height: 16px;
        margin-right: 7px;
      }
      span {
        font-weight: 500;
        font-size: 16px;
        color: #ff7c4d;
        line-height: 16px;
      }
    }
    .container-info {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      .info-title {
        width: fit-content;
        margin-right: 80px;
        .info-title-name {
          font-weight: 500;
          font-size: 20px;
          color: #000000;
          margin-bottom: 8px;
        }
        .info-title-bar {
          width: 120px;
          height: 4px;
          background: linear-gradient(90deg, #e95520 0%, rgba(255, 255, 255, 0) 100%);
        }
      }
      .info-content {
        display: flex;
        margin-right: 80px;
        .info-content-item {
          display: flex;
          align-items: center;
          margin-right: 16px;
          .info-content-item-title {
            font-weight: 500;
            font-size: 14px;
            color: #000000;
            margin-right: 8px;
          }
          .info-content-item-value {
            font-family: DINAlternate, DINAlternate;
            font-weight: bold;
            font-size: 16px;
            color: #ff875c;
          }
        }
      }
      .info-score {
        :deep(.el-rate.is-disabled .el-rate__item) {
          color: #cdd0d6;
        }
        :deep(.el-rate .el-rate__icon) {
          margin-right: 4px;
          font-size: 22px;
        }
        :deep(.el-rate__text) {
          font-weight: bold;
          font-size: 20px;
          line-height: 24px;
        }
      }
    }
    .container-desc {
      font-weight: 400;
      font-size: 14px;
      color: #000000;
      line-height: 22px;
    }
  }
}
</style>
