<template>
  <div class="practical-item">
    <div class="practical-item-top">
      <div class="practical-item-top__left">
        <img src="@/assets/icons/svg/practical-icon.svg" alt="" />
      </div>
      <div class="practical-item-top__right">
        <div class="right-title" :title="props.practicalInfo.practicalName">
          {{ props.practicalInfo.practicalName }}
        </div>
        <div class="right-info">
          <div class="right-info__item">
            {{ props.practicalInfo.teacherName }}
          </div>
          <el-rate
            v-model="computedRate"
            text-color="#333333"
            disabled
            show-score
            score-template="{value} 分"
          />
        </div>
        <div class="right-score">
          <div class="right-score__title">综合得分</div>
          <div class="right-score__score">{{ computedExamScore }}</div>
          <div class="right-score__title">综合排名</div>
          <div class="right-score__ranking">{{ computedRank }}</div>
        </div>
      </div>
    </div>
    <div class="practical-item-bottom">
      <div class="practical-item-bottom__left">
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
      <div class="practical-item-bottom__right">
        <el-button v-if="props.practicalInfo.operation === '1'" type="primary" @click="handleStudy">
          开始学习
        </el-button>
        <el-button v-else type="info" disabled>已结束</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const emit = defineEmits(['view-detail'])

const props = defineProps({
  practicalInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const computedRate = computed(() => {
  return props.practicalInfo.courseScore
})
const computedExamScore = computed(() => {
  if (props.practicalInfo.examScore || props.practicalInfo.examScore === 0) {
    return props.practicalInfo.examScore
  } else {
    return '-'
  }
})
const computedRank = computed(() => {
  if (props.practicalInfo.rank || props.practicalInfo.rank === 0) {
    return props.practicalInfo.rank
  } else {
    return '-'
  }
})
const computedProgress = computed(() => {
  const progress = props.practicalInfo.progress || 0
  return progress
})

function handleStudy() {
  emit('practical-detail')
}
</script>

<style lang="scss" scoped>
.practical-item {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #ffffff;
  border-radius: 4px;
  width: 100%;
  height: 200px;
  &-top {
    display: flex;
    margin-bottom: 16px;
    &__left {
      width: 180px;
      height: 120px;
      margin-right: 8px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    &__right {
      flex: 1;
      display: flex;
      flex-direction: column;
      .right-title {
        font-weight: 500;
        font-size: 14px;
        color: #000000;
        height: 40px;
        line-height: 20px;
        overflow: hidden;
        display: -webkit-box; /* 使用 Webkit 的盒模型 */
        -webkit-line-clamp: 2; /* 限制显示两行 */
        -webkit-box-orient: vertical; /* 垂直排列内容 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
      }
      .right-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 5px;
        &__item {
          font-weight: 500;
          font-size: 14px;
          color: #000000;
          line-height: 21px;
        }
        :deep(.el-rate) {
          --el-rate-icon-margin: 2px;
        }
      }
      .right-score {
        display: flex;
        height: 44px;
        align-items: center;
        background: #f2f2f2;
        border-radius: 4px;
        padding-left: 12px;
        &__title {
          font-weight: 500;
          font-size: 12px;
          color: #7f7f7f;
          margin-right: 4px;
        }
        &__score {
          font-weight: bold;
          font-size: 20px;
          color: #333333;
          margin-right: 25px;
        }
        &__ranking {
          font-weight: bold;
          font-size: 20px;
          color: #333333;
        }
      }
    }
  }
  &-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    &__left {
      display: flex;
      align-items: center;
      margin-right: 8px;
      flex: 1;
      .item-title {
        font-weight: bold;
        font-size: 24px;
        color: #595959;
      }
      .item-unit {
        font-weight: bold;
        font-size: 14px;
        color: #595959;
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
    &__right {
      :deep(.el-button--primary) {
        width: 96px;
        border-radius: 4px;
      }
    }
  }
}
</style>
