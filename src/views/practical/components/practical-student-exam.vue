<template>
  <el-dialog
    v-model="dialogVisible"
    :show-close="false"
    :append-to-body="false"
    :close-on-click-modal="false"
    width="960"
    top="5vh"
    class="my-practical-exam"
    align-center
    :before-close="handleClose"
  >
    <template #header="{ close }">
      <div class="dialog__header">
        <div class="dialog__header--left">
          <div class="left-title">{{ dialogTitle }}</div>
          <!-- <div class="left-bar"></div> -->
        </div>
        <div v-if="!isExamVal" class="dialog__header--right">
          <el-icon color="#FFFFFF" size="20" @click="close"><CloseBold /></el-icon>
        </div>
      </div>
      <div class="dialog__body">
        <BasicPageTopBottom :marginGap="16">
          <template #top>
            <exam-detail-title ref="examDetailTitleRef" />
          </template>
          <template #content>
            <div class="height-100 basic-result">
              <exam-detail-question ref="examDetailQuestionRef" @back-click="handleClose" />
            </div>
          </template>
        </BasicPageTopBottom>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import ExamDetailTitle from './exam-detail-title.vue'
import ExamDetailQuestion from './exam-detail-question.vue'
import { nextTick } from 'vue'

const isExamVal = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('发起考试')
const examDetailTitleRef = ref(null)
const examDetailQuestionRef = ref(null)
async function openDialog(isExam, examInfo) {
  dialogVisible.value = true
  isExamVal.value = isExam
  nextTick(() => {
    examDetailTitleRef.value.initExamTitle(isExam, examInfo)
    examDetailQuestionRef.value.initExamInfo(isExam, examInfo)
  })
}

function handleClose() {
  dialogVisible.value = false
}

defineExpose({
  openDialog
})
</script>

<style lang="scss">
.my-practical-exam {
  background-color: transparent;
  background-image: url('@/assets/images/practical/practical-dialog-bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  padding: 24px;
  border-radius: 6px;
  .dialog__header {
    width: 100%;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &--left {
      .left-title {
        font-weight: 400;
        font-size: 16px;
        color: #ffffff;
        line-height: 16px;
        margin-bottom: 8px;
      }
      .left-bar {
        width: 120px;
        height: 4px;
        background: linear-gradient(90deg, #e95520 0%, rgba(255, 255, 255, 0) 100%);
      }
    }
    &--right {
      height: 20px;
      cursor: pointer;
    }
  }
  .dialog__body {
    width: 100%;
    height: 588px;
    padding-top: 16px;
    .basic-page__right-content {
      background: transparent;
    }
    .basic-page__left {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .basic-page__right {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  }
}
</style>
