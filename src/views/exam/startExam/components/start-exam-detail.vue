<template>
  <div class="start-exam-detail">
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
  </div>
</template>

<script setup>
import { requestPaperInfo } from '@/api/exam/startExam'
import ExamDetailTitle from '@/components/ExamDetailTitle'
import ExamDetailQuestion from '@/components/ExamDetailQuestion'

const emit = defineEmits(['back-click'])
const props = defineProps({
  examInfo: {
    type: Object,
    default: () => ({})
  }
})

const examDetailTitleRef = ref(null)
const examDetailQuestionRef = ref(null)
async function getPaperInfo() {
  try {
    const { examInfo } = props
    const result = await requestPaperInfo(examInfo.id)
    const { code, response } = result
    if (code === 1) {
      examDetailTitleRef.value.initExamTitle(false, response)
      examDetailQuestionRef.value.initExamInfo(false, response)
    } else {
      examDetailTitleRef.value.initExamTitle(false, {})
      examDetailQuestionRef.value.initExamInfo(false, {})
    }
  } catch (error) {
    console.log('getPaperInfo error', error)
  }
}

onMounted(() => {
  getPaperInfo()
})
</script>

<style lang="scss" scoped>
.start-exam-detail {
  width: 100%;
  height: 100%;
  .basic-result {
    background: #e9e9e9;
  }
}
</style>
