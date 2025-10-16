<template>
  <div class="my-exam-detail">
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
import ExamDetailTitle from '@/components/ExamDetailTitle'
import ExamDetailQuestion from '@/components/ExamDetailQuestion'
import { requestStartExamDetail, requestSubmitExamDetail } from '@/api/exam/myExam'

const emit = defineEmits(['back-click'])
const props = defineProps({
  examInfo: {
    type: Object,
    default: () => ({})
  }
})
const isExam = ref(false)
const examDetailTitleRef = ref(null)
const examDetailQuestionRef = ref(null)
async function getStartExamDetail() {
  try {
    const { detail } = props.examInfo
    const result = await requestStartExamDetail({
      examId: detail.examId,
      courseType: detail.courseType,
      courseId: detail.courseId
    })
    const { code, response } = result
    if (code === 1) {
      response.examId = detail.examId
      examDetailTitleRef.value.initExamTitle(isExam.value, response)
      examDetailQuestionRef.value.initExamInfo(isExam.value, response)
    } else {
      examDetailTitleRef.value.initExamTitle(isExam.value, {})
      examDetailQuestionRef.value.initExamInfo(isExam.value, {})
    }
  } catch (error) {
    console.log('getStartExamDetail error', error)
  }
}
async function getSubmitExamDetail() {
  try {
    const { detail } = props.examInfo
    const result = await requestSubmitExamDetail({ examId: detail.examId })
    const { code, response } = result
    if (code === 1) {
      const { paperAnswerDetails } = response
      response.examId = detail.examId
      paperAnswerDetails.forEach((item) => {
        const { correct, submitAnswer } = item
        const correctList = correct.split(';')
        item.correctStr = correctList.join('、')
        item.isSubmit = true
        if (item.questionType === 1) {
          item.selectOption = submitAnswer
        } else if (item.questionType === 2) {
          item.selectOption = submitAnswer ? submitAnswer.split(';') : []
        }
      })
      response.questions = paperAnswerDetails
      examDetailTitleRef.value.initExamTitle(isExam.value, response)
      examDetailQuestionRef.value.initExamInfo(isExam.value, response)
    } else {
      examDetailTitleRef.value.initExamTitle(isExam.value, {})
      examDetailQuestionRef.value.initExamInfo(isExam.value, {})
    }
  } catch (error) {
    console.log('getSubmitExamDetail error', error)
  }
}

onMounted(() => {
  const { type } = props.examInfo
  if (type === 'start') {
    isExam.value = true
    getStartExamDetail()
  } else if (type === 'detail') {
    isExam.value = false
    getSubmitExamDetail()
  }
})
</script>

<style lang="scss" scoped>
.my-exam-detail {
  width: 100%;
  height: 100%;
  .basic-result {
    background: #e9e9e9;
  }
}
</style>
