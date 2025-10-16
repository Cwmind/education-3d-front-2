<template>
  <div class="comprehensive-analysis">
    <BasicNoData v-if="analysisData.length === 0" />
    <div v-for="item in analysisData" v-else :key="item.id" class="analysis-item">
      <div class="item-left">
        {{ item.courseName }}
      </div>
      <div class="item-right">
        <div class="item-score">
          <div class="score-value">{{ item.maxScore }}</div>
          <div class="score-label">最高分</div>
        </div>
        <div class="item-score">
          <div class="score-value">{{ item.avgScore }}</div>
          <div class="score-label">平均分</div>
        </div>
        <div class="item-score">
          <div class="score-value">{{ item.minScore }}</div>
          <div class="score-label">最低分</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const analysisData = ref([])
function setAnalysisData(data) {
  analysisData.value = data
}
defineExpose({
  setAnalysisData
})
</script>

<style lang="scss" scoped>
.comprehensive-analysis {
  width: 100%;
  height: 230px;
  overflow-y: auto;
  .analysis-item {
    height: 54px;
    background: rgba(255, 135, 92, 0.1);
    border-radius: 2px;
    margin-bottom: 8px;
    padding: 0px 32px 0px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .item-left {
      flex: 1;
      font-weight: 400;
      font-size: 14px;
      color: #ff875c;
      line-height: 21px;
    }
    .item-right {
      width: 156px;
      display: flex;
      justify-content: space-between;
      .item-score {
        display: flex;
        flex-direction: column;
        align-items: center;
        .score-value {
          font-weight: bold;
          font-size: 18px;
          color: #000000;
        }
        .score-label {
          font-weight: 500;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.5);
        }
      }
    }
  }
}
</style>
