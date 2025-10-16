<template>
  <BasicPageLeftRight :marginGap="16">
    <template #left>
      <div class="practical-question-left">
        <div
          v-for="(item, index) in questionList"
          :id="`content-${index}`"
          :key="index"
          class="question-item"
        >
          <div class="question-item__title">
            <span>{{ index + 1 }}/{{ questionList.length }}</span>
            <span>【{{ item.questionTypeName }}】</span>
            <span>{{ item.topic }}</span>
          </div>
          <div class="question-item__option">
            <template v-if="item.questionType === 1">
              <el-radio-group v-model="item.selectOption" :disabled="!isExam">
                <el-radio
                  v-for="(radio, rIndex) in item.options"
                  :key="rIndex"
                  :value="computedOptionsValue(radio)"
                >
                  {{ radio }}
                </el-radio>
              </el-radio-group>
            </template>
            <template v-if="item.questionType === 2">
              <el-checkbox-group v-model="item.selectOption" :disabled="!isExam">
                <el-checkbox
                  v-for="(checkbox, cIndex) in item.options"
                  :key="cIndex"
                  :value="computedOptionsValue(checkbox)"
                >
                  {{ checkbox }}
                </el-checkbox>
              </el-checkbox-group>
            </template>
          </div>
          <div v-if="item.isSubmit" class="question-item__answer">
            <span class="question-item__answer--title">【答案】</span>
            <span class="question-item__answer--content">
              {{ item.correctStr }}
            </span>
          </div>
          <div v-if="item.isSubmit" class="question-item__analysis">
            <span class="question-item__analysis--title">【解析】</span>
            <span class="question-item__analysis--content">
              {{ item.analysis }}
            </span>
          </div>
        </div>
      </div>
    </template>
    <template #right>
      <div class="practical-question-right">
        <div class="question-right__title">
          <div class="question-right__title__name">答题卡</div>
          <div v-if="countdownContent" class="question-right__title__countdown">
            {{ countdownContent }}
          </div>
        </div>
        <div class="question-right__content">
          <div
            v-for="(item, index) in questionList"
            :key="item"
            :class="computedItemClass(item)"
            class="question-right__content__item"
            @click="scrollToElement(index)"
          >
            <span>{{ index + 1 }}</span>
          </div>
        </div>
        <div v-if="isExam" class="question-right__submit">
          <el-button type="primary" class="question-right__submit__button" @click="submitExam">
            交卷
          </el-button>
        </div>
        <template v-else>
          <div v-if="examDetail.score || examDetail.score === 0" class="question-right__score">
            <div class="score__title">
              <span class="score__title__text">{{ examDetail.score }}</span>
              <span class="score__title__unit">分</span>
            </div>
            <div class="score__time">
              {{ examDetail.submitTime }}
            </div>
          </div>
          <div v-else class="question-right__submit">
            <el-button class="question-right__submit__back" @click="backClick">
              返回上一层
            </el-button>
          </div>
        </template>
      </div>
    </template>
  </BasicPageLeftRight>
</template>

<script setup>
import { computed, onUnmounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { requestSubmitPaper } from '@/api/exam/myExam'

const emit = defineEmits(['back-click'])

const computedOptionsValue = computed(() => {
  return (item) => {
    return item.split('.')[0]
  }
})
const computedItemClass = computed(() => {
  return (item) => {
    if (item.isSubmit) {
      if (item.isCorrect === '1') {
        return 'question-right__content__item--right'
      } else {
        return 'question-right__content__item--wrong'
      }
    }
    if (item.questionType === 1 && item.selectOption) {
      return 'question-right__content__item--active'
    } else if (item.questionType === 2 && item.selectOption.length > 0) {
      return 'question-right__content__item--active'
    } else {
      return 'question-right__content__item--default'
    }
  }
})

function scrollToElement(index) {
  const targetElement = document.getElementById(`content-${index}`)
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
async function handleSubmitExam() {
  try {
    const submitAnswers = questionList.value.map((item) => {
      let answer = ''
      if (item.questionType === 1) {
        answer = item.selectOption
      } else if (item.questionType === 2) {
        answer = item.selectOption.join(';')
      }
      return {
        questionId: item.questionId,
        answer
      }
    })
    const { examId, answerId } = examDetail.value
    const params = {
      examId,
      answerId,
      submitAnswers
    }
    const result = await requestSubmitPaper(params)
    const { code } = result
    if (code === 1) {
      emit('back-click')
      ElMessage.success('提交成功')
    } else {
      ElMessage.error('提交失败')
    }
  } catch (error) {
    console.log('handleSubmitExam error: ', error)
  }
}
function submitExam() {
  const emptySelectOptions = questionList.value.filter((item) => {
    if (item.questionType === 1) {
      return !item.selectOption
    } else if (item.questionType === 2) {
      return item.selectOption.length === 0
    }
  })
  if (emptySelectOptions.length > 0) {
    ElMessageBox.confirm(`${emptySelectOptions.length}题未作答，请确认是否交卷！`, '', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      handleSubmitExam()
    })
  } else {
    handleSubmitExam()
  }
}
function handleAutoFinish() {
  if (isExam.value) {
    handleSubmitExam()
  }
}
const countdownContent = ref('')
const timeRemaining = ref(0)
const timerInterval = ref(null)
const warningThreshold = ref(30)

function startExam() {
  countdownContent.value = ''
  timeRemaining.value = paperInstruction.value.timeLimit * 60
  timerInterval.value = setInterval(updateTimer, 1000)
}
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const secondsLeft = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`
}
function handleCountdownMessage(seconds) {
  const secondsLeft = seconds % 60
  if (secondsLeft > 0) {
    ElMessage({
      type: 'warning',
      offset: 60,
      duration: 900,
      customClass: 'exam-countdown-message',
      dangerouslyUseHTMLString: true,
      message: `<div class='countdown-num'>${String(secondsLeft).padStart(
        2,
        '0'
      )}</div><div class='countdown-text'>倒计时</div>`
    })
  }
}
function updateTimer() {
  timeRemaining.value -= 1
  countdownContent.value = formatTime(timeRemaining.value)
  if (timeRemaining.value <= warningThreshold.value) {
    handleCountdownMessage(timeRemaining.value)
  }
  if (timeRemaining.value <= 0) {
    clearInterval(timerInterval.value)
    countdownContent.value = '00:00'
    ElMessage.warning('考试时间已结束，正在自动提交...')
    setTimeout(handleAutoFinish, 1000)
  }
}
const getSelectOption = (item) => {
  if (item.isSubmit) return item.selectOption
  return item.questionType === 1 ? '' : item.questionType === 2 ? [] : null
}

const isExam = ref(false)
const examDetail = ref({})
const paperInstruction = ref({})
const questionList = ref([])
function initExamInfo(state, info) {
  const { questions } = info
  isExam.value = state
  examDetail.value = info
  paperInstruction.value = info.paperInstruction
  questionList.value = questions.map((item) => {
    return {
      ...item,
      selectOption: getSelectOption(item)
    }
  })
  clearInterval(timerInterval.value)
  if (isExam.value && paperInstruction.value.timeLimit) {
    startExam()
  }
}
function backClick() {
  emit('back-click')
}
defineExpose({
  initExamInfo
})
onUnmounted(() => {
  clearInterval(timerInterval.value)
})
</script>

<style lang="scss" scoped>
.practical-question-left {
  width: 576px;
  height: calc(100% - 48px);
  margin: 24px 8px 24px 24px;
  overflow-y: auto;
  user-select: none;
  .question-item {
    margin-bottom: 24px;
    &__title {
      font-weight: 400;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.7);
      line-height: 24px;
    }
    &__option {
      :deep(.el-radio-group) {
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
      }
      :deep(.el-radio) {
        height: 34px;
        line-height: 34px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.7);
      }
      :deep(.el-checkbox-group) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
      }
      :deep(.el-checkbox) {
        height: 34px;
        line-height: 34px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.7);
      }
    }
    &__answer {
      margin-top: 10px;
      font-weight: 400;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.7);
    }
    &__analysis {
      margin-top: 10px;
      font-weight: 400;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}
.practical-question-right {
  height: 100%;
  user-select: none;
  display: flex;
  flex-direction: column;
  padding: 24px 0 24px 24px;
  .question-right__title {
    height: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-right: 24px;
    &__name {
      font-weight: 500;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.7);
    }
    &__countdown {
      color: rgba(255, 255, 255, 0.7);
      font-size: 16px;
      font-weight: bold;
    }
  }
  .question-right__content {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(24px, 1fr));
    gap: 24px;
    overflow-x: hidden;
    overflow-y: auto;
    padding-right: 24px;
    align-content: baseline;
    &__item {
      width: 32px;
      height: 32px;
      font-weight: 400;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      border: 1px solid #dcdcdc;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    &__item--default {
      &:hover {
        background: rgba(0, 0, 0, 0.6);
        border: none;
      }
    }
    &__item--active {
      border: none;
      background: #ff875c;
      color: rgba(255, 255, 255, 0.9);
    }
    &__item--right {
      background: #38a70e;
      border: 1px solid rgba(220, 220, 220, 0.2);
      color: rgba(255, 255, 255, 0.9);
    }
    &__item--wrong {
      background: #da4444;
      border: 1px solid rgba(220, 220, 220, 0.2);
      color: rgba(255, 255, 255, 0.9);
    }
  }
  .question-right__submit {
    width: 100%;
    height: 32px;
    margin-top: 24px;
    display: flex;
    justify-content: center;
    &__button {
      width: 96px;
      border-radius: 2px;
    }
    &__back {
      background: rgba(216, 216, 216, 0.1);
      border-radius: 2px;
      border: 1px solid rgba(220, 220, 220, 0.2);
      color: rgba(255, 255, 255, 0.7);
    }
  }
  &__score {
    width: 100%;
    height: 102px;
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .score__title {
      .score__title__text {
        font-weight: bold;
        font-size: 32px;
        color: #ffffff;
      }
      .score__title__unit {
        font-weight: 500;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.7);
        line-height: 24px;
      }
    }
    .score__time {
      font-weight: 400;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.7);
      line-height: 24px;
    }
  }
}
</style>
<style lang="scss">
.practical-question-left {
  .question-item__option {
    .el-radio__input.is-disabled + span.el-radio__label {
      color: rgba(255, 255, 255, 0.7);
    }
    .el-checkbox__input.is-disabled + span.el-checkbox__label {
      color: rgba(255, 255, 255, 0.7);
    }
    .el-radio__input.is-disabled .el-radio__inner {
      background: transparent;
    }
    .el-checkbox__input.is-disabled .el-checkbox__inner {
      background: transparent;
    }
    .el-radio__inner {
      background: transparent;
    }
    .el-radio__inner:after {
      background-color: #ff875c;
    }
    .el-radio__input.is-checked .el-radio__inner {
      background: transparent;
    }
    .el-checkbox__inner {
      background: transparent;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #ff875c;
    }
  }
}

.exam-countdown-message {
  background: rgba(255, 135, 92, 0.5);
  border-radius: 8px;
  border: none;
  display: flex;
  flex-direction: column;
  padding: 32px 43px;
  .el-icon {
    display: none;
  }
  .el-message__content {
    .countdown-num {
      width: 42px;
      height: 42px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background: #ed7b2f;
      margin-bottom: 8px;
      font-weight: bold;
      font-size: 20px;
      color: #ffffff;
      line-height: 30px;
    }
    .countdown-text {
      font-weight: 400;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      line-height: 20px;
    }
  }
}
</style>
