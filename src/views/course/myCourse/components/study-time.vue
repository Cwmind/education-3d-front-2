<template>
  <div class="study-time">
    <div class="study-time-item">
      <div class="item">
        <div class="item-title">今日学习时长</div>
        <div class="item-today">{{ totayLearnTime }}</div>
      </div>
    </div>
    <div class="study-time-item">
      <div class="item">
        <div class="item-title">累计学习时长</div>
        <div class="item-total">{{ totalLearnTime }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { requestStudyDuration } from '@/api/basic/common'

const totayLearnTime = ref('')
const totalLearnTime = ref('')

// 学习时长查询
async function getStudyDuration() {
  const result = await requestStudyDuration({ courseType: 'kc' })
  const { code, response } = result
  if (code === 1 && response) {
    totayLearnTime.value = response.totayLearnTime || '-'
    totalLearnTime.value = response.totalLearnTime || '-'
  } else {
    totayLearnTime.value = '-'
    totalLearnTime.value = '-'
  }
}

onMounted(() => {
  getStudyDuration()
})
</script>

<style lang="scss" scoped>
.study-time {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  height: 84px;
  &-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    .item-title {
      font-weight: 500;
      font-size: 14px;
      color: #7f7f7f;
    }
    .item-today {
      font-weight: bold;
      font-size: 24px;
      color: #ff7c4d;
      line-height: 28px;
    }
    .item-total {
      font-weight: bold;
      font-size: 24px;
      color: #34bf00;
      line-height: 28px;
    }
  }
}
</style>
