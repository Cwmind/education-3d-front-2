<template>
  <div class="exam-detail-title">
    <div class="title">试卷说明：</div>
    <div>
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
  </div>
</template>

<script setup>
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
  height: 84px;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 400;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  .title{
    margin-bottom: 3px;
  }
}
</style>
