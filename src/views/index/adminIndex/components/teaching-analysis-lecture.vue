<template>
  <div class="teaching-analysis-lecture">
    <div class="lecture-title">
      <div class="lecture-title-name">实时授课分析</div>
      <div class="lecture-title-bar"></div>
    </div>
    <el-carousel
      v-if="lectureInfoList.length > 0"
      ref="carouselRef"
      :interval="1500"
      arrow="never"
      indicator-position="none"
      height="168px"
    >
      <el-carousel-item v-for="item in lectureInfoList" :key="item">
        <div class="lecture-content">
          <div class="lecture-content-title">
            <div class="title-name">{{ item.courseName }}</div>
            <div class="title-tag">{{ item.teacherName }}</div>
            <div class="title-tag" :title="item.className">{{ item.className }}</div>
          </div>
          <div class="lecture-content-chart">
            <div class="chart-item">
              <div class="item-left">
                <img src="@/assets/index/teachers-num.png" alt="" />
              </div>
              <div class="item-right">
                <el-statistic :value="item.onlineCount" />
                <div class="item-title">到课人数</div>
              </div>
            </div>
            <div class="chart-item">
              <div class="item-left">
                <img src="@/assets/index/teachers-num.png" alt="" />
              </div>
              <div class="item-right">
                <el-statistic :value="item.offlineCount" />
                <div class="item-title">缺勤人数</div>
              </div>
            </div>
            <div class="chart-item">
              <div class="item-left">
                <img src="@/assets/index/teachers-num.png" alt="" />
              </div>
              <div class="item-right">
                <el-statistic :value="item.interactionCount" />
                <div class="item-title">互动次数</div>
              </div>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <div v-else class="lecture-noData">
      <BasicNoData style="opacity: 0.5; height: 190px" />
    </div>
  </div>
</template>

<script setup>
import { nextTick } from 'vue'

const carouselRef = ref()
const lectureInfoList = ref([])
function setData(data) {
  lectureInfoList.value = []
  nextTick(() => {
    lectureInfoList.value = data || []
    carouselRef.value?.setActiveItem(0)
  })
}
defineExpose({
  setData
})
</script>

<style lang="scss" scoped>
.teaching-analysis-lecture {
  .lecture-title {
    width: fit-content;
    margin-bottom: 16px;
    &-name {
      font-weight: 500;
      font-size: 18px;
      color: #ffffff;
      line-height: 16px;
      margin-bottom: 8px;
    }
    &-bar {
      width: 120px;
      height: 4px;
      background: linear-gradient(90deg, #e95520 0%, rgba(255, 255, 255, 0) 100%);
    }
  }
  // :deep(.el-carousel__container) {
  //   height: 168px;
  // }
  .lecture-content {
    height: 168px;
    background-image: url('@/assets/index/analysis-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    border-radius: 4px;
    padding: 32px 37px;
    .lecture-content-title {
      width: 100%;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 34px;
      .title-name {
        font-weight: 500;
        font-size: 16px;
        color: #ffffff;
        margin-right: 8px;
        margin-bottom: 4px;
      }
      .title-tag {
        max-width: 100px;
        white-space: nowrap; /* 禁止文本换行 */
        overflow: hidden; /* 隐藏溢出的文本 */
        text-overflow: ellipsis; /* 当文本溢出时显示省略号 */
        height: 24px;
        background: #ff875c;
        border-radius: 4px;
        padding: 0 8px;
        font-weight: 400;
        font-size: 12px;
        color: #ffffff;
        line-height: 24px;
        margin-right: 4px;
      }
    }
    &-chart {
      display: flex;
      justify-content: space-between;
      .chart-item {
        display: flex;
        .item-left {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          margin-right: 8px;
          img {
            width: 20px;
            height: 20px;
          }
        }
        .item-right {
          :deep(.el-statistic__number) {
            font-weight: bold;
            font-size: 24px;
            color: #ffffff;
          }
          .item-title {
            font-weight: 500;
            font-size: 14px;
            color: #d6d6d6;
          }
        }
      }
    }
  }
}
</style>
