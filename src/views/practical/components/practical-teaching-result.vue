<template>
  <el-dialog
    v-model="dialogVisible"
    :show-close="false"
    :append-to-body="false"
    :close-on-click-modal="false"
    top="5vh"
    width="800"
    class="practical-teaching-result"
    align-center
    :before-close="handleClose"
  >
    <template #header="{ close }">
      <div class="dialog__header">
        <div class="dialog__header--left">
          <div class="left-title">{{ dialogTitle }}</div>
          <!-- <div class="left-bar"></div> -->
        </div>
        <div class="dialog__header--right">
          <el-icon color="#FFFFFF" size="20" @click="close"><CloseBold /></el-icon>
        </div>
      </div>
    </template>
    <div v-loading="contentLoading" class="dialog__body">
      <div v-if="dialogType === 'resultList'" class="dialog__body--list">
        <BasicNoData v-if="queryDataList.length === 0" />
        <div v-for="item in queryDataList" v-else :key="item.examId" class="list-item">
          <div class="item-left">{{ item.examName }}</div>
          <div class="item-right">
            <el-button type="primary" @click="handleResultInfo(item)">查看详情</el-button>
          </div>
        </div>
      </div>
      <div v-if="dialogType === 'resultDetail'" class="dialog__body--detail">
        <div class="detail-list">
          <div v-for="(item, index) in examDetailList" :key="index" class="detail-item">
            <div v-if="item.scoreStatus === '考试中'" class="item-exam">考试中</div>
            <div v-else-if="item.scoreStatus === '未考试'" class="item-unexam">未考试</div>
            <div v-else class="item-score">{{ item.scoreStatus }}分</div>
            <img
              v-if="item.sex === 1"
              src="@/assets/images/exam/exam-man.png"
              alt=""
              class="item-avatar"
            />
            <img v-else src="@/assets/images/exam/exam-woman.png" alt="" class="item-avatar" />
            <div class="item-name">{{ item.studentName }}</div>
          </div>
        </div>
        <div class="detail-back">
          <div class="detail-back-btn" @click="handleDetailBack">返回上一层</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import processCodeInfo from '@/config/processCodeConfig'
import { requestQryExamInfo, requestQryExamDetail } from '@/api/practical/practicalTeaching'

const dialogVisible = ref(false)
const dialogTitle = ref('查看考核')
const dialogType = ref('')
const contentLoading = ref(false)
const queryDataList = ref([])
const label = ref('')
const practicalInfo = ref({})
function openDialog(data, info) {
  const { processCode } = data
  label.value = processCodeInfo.find((item) => item.code === processCode).name
  practicalInfo.value = info
  dialogType.value = 'resultList'
  dialogVisible.value = true
  getQryExamInfo()
  clearInterval(setIntervalId.value)
}
async function getQryExamInfo() {
  try {
    contentLoading.value = true
    const { courseType, courseId, classId } = practicalInfo.value
    const params = {
      courseType,
      courseId,
      classId,
      label: label.value
    }
    const result = await requestQryExamInfo(params)
    contentLoading.value = false
    const { code, response } = result
    if (code === 1 && response) {
      queryDataList.value = response
    } else {
      queryDataList.value = []
      ElMessage.warning(result.message)
    }
  } catch (error) {
    contentLoading.value = false
    queryDataList.value = []
  }
}
const examDetailList = ref([])
const setIntervalId = ref(null)
async function handleResultInfo(item) {
  dialogTitle.value = '考核详情'
  dialogType.value = 'resultDetail'
  setIntervalId.value = setInterval(() => {
    loadResultInfo(item)
  }, 20 * 1000)
  loadResultInfo(item)
}
async function loadResultInfo(item) {
  try {
    contentLoading.value = true
    const result = await requestQryExamDetail({ examId: item.examId })
    contentLoading.value = false
    const { code, response } = result
    if (code === 1 && response) {
      examDetailList.value = response
    } else {
      examDetailList.value = []
    }
  } catch (error) {
    contentLoading.value = false
    examDetailList.value = []
  }
}

function handleDetailBack() {
  dialogTitle.value = '查看考核'
  dialogType.value = 'resultList'
  clearInterval(setIntervalId.value)
}

function handleClose() {
  dialogVisible.value = false
  clearInterval(setIntervalId.value)
}

defineExpose({
  openDialog
})
</script>

<style lang="scss" scoped>
.practical-teaching-result {
  :deep(.el-loading-mask) {
    background-color: 'rgba(0, 0, 0, 0.7)';
  }
}
</style>
<style lang="scss">
.practical-teaching-result {
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
    display: flex;
    height: 432px;

    &--list {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: 6px;
      .list-item {
        width: 100%;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        margin-bottom: 16px;
        font-weight: 400;
        font-size: 16px;
        color: #ffffff;
        cursor: pointer;
        &:hover {
          background: rgba(0, 0, 0, 0.6);
        }
      }
    }
    &--detail {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .detail-list {
        width: 100%;
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        place-items: center;
        gap: 16px;
        margin-bottom: 16px;
        align-content: baseline;
        .detail-item {
          width: 42px;
          height: 78px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          .item-exam {
            font-weight: 400;
            font-size: 14px;
            color: #34bf00;
            margin-bottom: 8px;
          }
          .item-score {
            font-weight: 400;
            font-size: 14px;
            color: #ffffff;
            margin-bottom: 8px;
          }
          .item-unexam {
            font-weight: 400;
            font-size: 14px;
            color: #ff875c;
            margin-bottom: 8px;
          }
          .item-avatar {
            width: 32px;
            height: 32px;
            margin-bottom: 8px;
          }
          .item-name {
            font-weight: 400;
            font-size: 14px;
            color: #ffffff;
          }
        }
      }
      .detail-back {
        width: 100%;
        height: 32px;

        .detail-back-btn {
          width: 112px;
          height: 32px;
          background: rgba(216, 216, 216, 0.1);
          border-radius: 2px;
          border: 1px solid rgba(220, 220, 220, 0.2);
          font-weight: 400;
          font-size: 16px;
          color: #ffffff;
          line-height: 32px;
          text-align: center;
          float: right;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
