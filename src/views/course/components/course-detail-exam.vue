<template>
  <BasicPageTopBottom :marginGap="16">
    <template #top>
      <exam-detail-title ref="examDetailTitleRef" @back-click="emit('back-click', 0)" />
    </template>
    <template #content>
      <div class="height-100 basic-result">
        <exam-detail-question ref="examDetailQuestionRef" @back-click="emit('back-click', 0)" />
      </div>
    </template>
  </BasicPageTopBottom>
</template>

<script setup>
import ExamDetailTitle from '@/components/ExamDetailTitle'
import ExamDetailQuestion from '@/components/ExamDetailQuestion'

const emit = defineEmits(['back-click'])
const examDetailTitleRef = ref(null)
const examDetailQuestionRef = ref(null)
async function setExamData(data) {
  examDetailTitleRef.value.initExamTitle(false, data)
  examDetailQuestionRef.value.initExamInfo(false, data)
}

defineExpose({
  setExamData
})
</script>

<style lang="scss" scoped>
.basic-result {
  background: #e9e9e9;
}
</style>
