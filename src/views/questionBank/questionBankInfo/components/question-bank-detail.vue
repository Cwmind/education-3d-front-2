<template>
  <el-drawer
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="drawerTitle"
    width="520px"
    append-to-body
    :before-close="handleCancel"
  >
    <div class="question-bank-detail">
      <div class="question-bank-detail__title">
        <span class="question-bank-detail__title--type">
          【{{ questionBankDetail.questionTypeName }}】
        </span>
        <span class="question-bank-detail__title--topic">
          {{ questionBankDetail.topic }}
        </span>
      </div>
      <div class="question-bank-detail__options">
        <el-radio-group v-if="questionBankDetail.questionType === 1" disabled>
          <el-radio
            v-for="radio in questionBankDetail.optionList"
            :key="radio.value"
            :label="radio.label"
            :value="radio.value"
          />
        </el-radio-group>
        <el-checkbox-group v-else disabled>
          <el-checkbox
            v-for="checkbox in questionBankDetail.optionList"
            :key="checkbox.value"
            :label="checkbox.label"
            :value="checkbox.value"
          />
        </el-checkbox-group>
      </div>
      <div class="question-bank-detail__answer">
        <span class="question-bank-detail__answer--title">【答案】</span>
        <span class="question-bank-detail__answer--content">
          {{ questionBankDetail.correctStr }}
        </span>
      </div>
      <div class="question-bank-detail__analysis">
        <span class="question-bank-detail__analysis--title">【解析】</span>
        <span class="question-bank-detail__analysis--content">
          {{ questionBankDetail.answerAnalyze }}
        </span>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
const drawerVisible = ref(false)
const drawerTitle = ref('试题信息')
const questionBankDetail = ref({})

function openDrawer(item) {
  drawerVisible.value = true
  questionBankDetail.value = item
  const { options, correct } = item
  const correctList = correct.split(';')
  questionBankDetail.value.correctStr = correctList.join('、')
  questionBankDetail.value.optionList = options.map((item) => {
    const parts = item.split(/\.(.+)/, 2)
    return {
      value: parts[0],
      label: parts[0] + '、' + parts[1]
    }
  })
}
const handleCancel = () => {
  drawerVisible.value = false
  questionBankDetail.value = {}
}

defineExpose({
  openDrawer
})
</script>

<style lang="scss" scoped>
.question-bank-detail {
  &__title {
    font-weight: 400;
    font-size: 16px;
    color: #000000;
    line-height: 24px;
  }
  &__options {
    margin-bottom: 8px;
    :deep(.el-radio-group) {
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
    }
    :deep(.el-checkbox-group) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
    }
    :deep(.el-radio) {
      height: 34px;
      line-height: 34px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.9);
    }
    :deep(.el-radio__input.is-disabled + span.el-radio__label) {
      color: rgba(0, 0, 0, 0.9);
    }
    :deep(.el-checkbox) {
      height: 34px;
      line-height: 34px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.9);
    }
    :deep(.el-checkbox__input.is-disabled + span.el-checkbox__label) {
      color: rgba(0, 0, 0, 0.9);
    }
  }
  &__answer {
    margin-bottom: 12px;
    font-weight: 400;
    font-size: 16px;
    color: #000000;
  }
  &__analysis {
    font-weight: 400;
    font-size: 16px;
    color: #000000;
  }
}
</style>
