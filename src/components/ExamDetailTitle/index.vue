<template>
  <div class="exam-detail-title">
    <div v-if="!isExam" class="exam-detail-title__back" @click="handleBackClick">
      <img src="@/assets/images/back-icon.png" alt="" />
      <span>返回上一级</span>
    </div>
    <div class="exam-detail-title__top">
      <div class="exam-detail-title__top__title">{{ examDetail.courseName }}</div>
      <div class="exam-detail-title__top__bar"></div>
    </div>
    <div class="exam-detail-title__bottom">
      <span>试卷说明：</span>
      <span>本试卷共{{ paperInstruction.totalNum }}题，</span>
      <span v-if="paperInstruction.singleNum > 0">
        单选题{{ paperInstruction.singleNum }}题，每题{{ paperInstruction.singleScore }}分，
      </span>
      <span v-if="paperInstruction.multipleNum > 0">
        多选 {{ paperInstruction.multipleNum }}题，每题{{ paperInstruction.multipleScore }}分，
      </span>
      <span>满分 {{ paperInstruction.totalScore }} 分</span>
      <span v-if="paperInstruction.timeLimit > 0">
        ，考试时间 {{ paperInstruction.timeLimit }}分钟
      </span>
    </div>
    <div v-if="examDetail.score || examDetail.score === 0" class="exam-detail-title__score">
      <div class="score__title">
        <span class="score__title__text">{{ examDetail.score }}</span>
        <span class="score__title__unit">分</span>
      </div>
      <div class="score__time">
        {{ examDetail.submitTime }}
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['back-click'])

const handleBackClick = () => {
  emit('back-click')
}

const isExam = ref(false)
const examDetail = ref({})
const paperInstruction = ref({})
function initExamTitle(state, info) {
  isExam.value = state
  examDetail.value = info
  paperInstruction.value = info.paperInstruction
}

defineExpose({
  initExamTitle
})
</script>

<style lang="scss" scoped>
.exam-detail-title {
  position: relative;
  padding: 23px 24px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  &__back {
    height: 16px;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
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
  &__top {
    width: fit-content;
    margin-bottom: 16px;
    &__title {
      font-weight: 500;
      font-size: 16px;
      color: #000000;
      line-height: 16px;
      margin-bottom: 8px;
    }
    &__bar {
      width: 120px;
      height: 4px;
      background: linear-gradient(90deg, #e95520 0%, rgba(255, 255, 255, 0) 100%);
    }
  }
  &__bottom {
    font-weight: 400;
    font-size: 16px;
    color: #000000;
    line-height: 24px;
  }
  &__score {
    position: absolute;
    height: 58px;
    top: 28px;
    right: 23px;
    text-align: right;
    .score__title {
      margin-bottom: 5px;
      .score__title__text {
        font-weight: bold;
        font-size: 32px;
        color: #000000;
        line-height: 37px;
        margin-right: 2px;
      }
      .score__title__unit {
        font-weight: 500;
        font-size: 16px;
        color: #000000;
        line-height: 24px;
      }
    }
    .score__time {
      font-weight: 400;
      font-size: 16px;
      color: #000000;
      line-height: 24px;
    }
  }
}
</style>
