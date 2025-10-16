<template>
  <div class="course-item">
    <div class="course-item-top">
      <div class="course-item-top__left">
        <img v-if="props.courseInfo.courseId === 6100002" src="@/assets/images/hlqh.jpg" alt="" />
        <img v-else src="@/assets/icons/svg/practical-icon.svg" alt="" />
      </div>
      <div class="course-item-top__right">
        <div class="right-title" :title="props.courseInfo.practicalName">
          {{ props.courseInfo.practicalName }}
        </div>
        <div class="right-score">
          <div class="right-score-item">
            <div class="right-score-item__scan">{{ props.courseInfo.browseNum }}</div>
            <div class="right-score-item__title">浏览次数</div>
          </div>
          <div class="right-score-item">
            <div class="right-score-item__num">{{ props.courseInfo.learnStudentNum }}</div>
            <div class="right-score-item__title">学习人数</div>
          </div>
          <div class="right-score-item">
            <div class="right-score-item__times">{{ props.courseInfo.learnTimes }}</div>
            <div class="right-score-item__title">学习次数</div>
          </div>
        </div>
      </div>
    </div>
    <div class="course-item-bottom">
      <div class="course-item-bottom__left">
        <div class="item-title">
          {{ props.courseInfo.teacherName }}
        </div>
        <el-rate
          v-model="computedRate"
          text-color="#333333"
          disabled
          show-score
          score-template="{value} 分"
        />
      </div>
      <div class="course-item-bottom__right">
        <el-button
          v-if="props.courseInfo.operation === '1'"
          type="primary"
          @click="loadCourseDetail"
        >
          教学
        </el-button>
        <el-button v-else type="info" disabled>已结束</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  courseInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const emit = defineEmits(['course-detail'])
// 计算老师评分
const computedRate = computed(() => {
  return props.courseInfo.courseScore
})
function loadCourseDetail() {
  emit('course-detail')
}
</script>

<style lang="scss" scoped>
.course-item {
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
        margin-bottom: 8px;
        overflow: hidden;
        display: -webkit-box; /* 使用 Webkit 的盒模型 */
        -webkit-line-clamp: 2; /* 限制显示两行 */
        -webkit-box-orient: vertical; /* 垂直排列内容 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
      }
      .right-score {
        display: flex;
        height: 72px;
        align-items: center;
        justify-content: space-around;
        background: #f2f2f2;
        border-radius: 4px;
        padding-left: 4px;
        &-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          &__title {
            font-weight: 500;
            font-size: 12px;
            color: #7f7f7f;
            margin-right: 4px;
          }
          &__scan {
            font-weight: bold;
            font-size: 16px;
            color: #333333;
          }
          &__num {
            font-weight: bold;
            font-size: 16px;
            color: #333333;
          }
          &__times {
            font-weight: bold;
            font-size: 16px;
            color: #333333;
          }
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
        font-weight: 500;
        font-size: 14px;
        color: #000000;
        line-height: 21px;
        margin-right: 18px;
      }
      :deep(.el-rate) {
        --el-rate-icon-margin: 2px;
      }
      :deep(.el-rate__text) {
        font-weight: bold;
        font-size: 14px;
        margin-left: 2px;
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
