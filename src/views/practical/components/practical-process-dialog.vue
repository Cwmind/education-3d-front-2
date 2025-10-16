<template>
  <el-dialog
    v-model="dialogVisible"
    :show-close="false"
    :append-to-body="false"
    :close-on-click-modal="false"
    top="5vh"
    width="800"
    class="practical-process-dialog"
    align-center
    destroy-on-close
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
    <div v-loading="contentLoading" class="process-dialog__body">
      <template v-if="teachingInfo">
        <div v-if="dialogType === 'listBasic'" class="dialog__body--listbasic">
          <div class="listbasic-left" v-html="teachingInfo.content"></div>
          <div class="listbasic-right">
            <template v-if="teachingInfo.videoPath">
              <video :src="teachingInfo.videoPath" autoplay controls class="teaching-video"></video>
            </template>
          </div>
        </div>
        <div v-else-if="dialogType === 'listCore'" class="dialog__body--listcore">
          <div
            v-for="(item, index) in teachingInfo"
            :key="index"
            class="listcore-item"
            v-html="item.content"
          ></div>
        </div>
        <div v-else-if="dialogType === 'deviceBasic'" class="dialog__body--devicebasic">
          <div
            v-for="(item, index) in teachingInfo"
            :key="index"
            class="devicebasic-item"
            v-html="item.content"
          ></div>
        </div>
        <div v-else-if="dialogType === 'deviceVideo'" class="dialog__body--devicevideo">
          <video :src="teachingInfo.videoPath" autoplay controls class="teaching-video"></video>
        </div>
      </template>
      <BasicNoData v-else />
    </div>
  </el-dialog>
</template>

<script setup>
import { checkRole } from '@/utils/permission'
import { STUDENT } from '@/config/rolesConfig'
import { requestProcessPractical } from '@/api/practical/practicalTeaching'
import { requestStudyProgressMonitor } from '@/api/practical/myPractical'

const contentLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogType = ref('')
const teachingInfo = ref()
const practicalInfo = ref()

function openDialog(info, practical) {
  loadProcessPractical(info)
  practicalInfo.value = practical
  dialogVisible.value = true
}
async function loadProcessPractical(info) {
  const { processCode, type } = info
  contentLoading.value = true
  const result = await requestProcessPractical({ processCode })
  contentLoading.value = false
  const { code, response } = result
  if (code === 1) {
    if (type === 'listBasic') {
      const { introduction } = response
      handleIntroduction(introduction)
      studyProgressMonitor({
        label: processCode,
        chapter: introduction.chapter
      })
    } else if (type === 'listCore') {
      const { knowledge } = response
      handleKnowledge(knowledge)
      studyProgressMonitor({
        label: processCode,
        chapter: knowledge.chapter
      })
    } else if (type === 'deviceBasic') {
      const { equip } = response
      handleDeviceBasic(info, equip)
    } else if (type === 'deviceVideo') {
      const { equip } = response
      handleDeviceVideo(info, equip)
    }
    dialogType.value = type
  } else {
    teachingInfo.value = ''
  }
}
// 基础介绍
function handleIntroduction(value) {
  dialogTitle.value = '工序基础介绍'
  teachingInfo.value = value
}
// 核心知识点
function handleKnowledge(value) {
  dialogTitle.value = '核心知识点'
  teachingInfo.value = value.contents
}
// 设备基础知识
function handleDeviceBasic(info, value) {
  const { orderNum, processCode } = info
  const equipItem = value.find((item) => item.orderNum === orderNum)
  const { equipName, basic, chapter } = equipItem
  dialogTitle.value = equipName + '基础知识'
  teachingInfo.value = basic
  studyProgressMonitor({
    label: processCode,
    chapter: chapter
  })
}
// 设备讲解视频
function handleDeviceVideo(info, value) {
  const { orderNum, processCode } = info
  const equipItem = value.find((item) => item.orderNum === orderNum)
  const { equipName, video, chapter } = equipItem
  dialogTitle.value = equipName + '讲解视频'
  teachingInfo.value = video
  studyProgressMonitor({
    label: processCode,
    chapter: chapter
  })
}

// 学习进度监控
function studyProgressMonitor(info) {
  if (checkRole(STUDENT)) {
    const params = {
      ...info,
      classId: practicalInfo.value.classId,
      courseType: practicalInfo.value.courseType,
      courseId: practicalInfo.value.courseId
    }
    requestStudyProgressMonitor(params)
  }
}

defineExpose({
  openDialog
})
</script>

<style lang="scss" scoped>
.process-dialog__body {
  :deep(.el-loading-mask) {
    background-color: 'rgba(0, 0, 0, 0.7)';
  }
  :deep(.el-empty) {
    height: 100%;
    opacity: 0.9;
  }
}
</style>
<style lang="scss">
.practical-process-dialog {
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
  .process-dialog__body {
    width: 100%;
    height: 432px;
    .dialog__body--listbasic {
      width: 100%;
      height: 100%;
      padding-right: 4px;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
      .listbasic-left {
        width: 100%;
        height: fit-content;
        padding: 8px 0;
        margin-right: 16px;
        font-weight: 400;
        font-size: 16px;
        color: #ffffff;
      }
      .listbasic-right {
        flex: 1;
        height: 100%;
        text-align: center;
        .teaching-video {
          width: 100%;
        }
      }
    }
    .dialog__body--listcore {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow: auto;
      padding-right: 6px;
      .listcore-item {
        p {
          font-weight: 400;
          font-size: 16px;
          color: #ffffff;
          line-height: 24px;
        }
      }
    }
    .dialog__body--devicebasic {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow: auto;
      padding-right: 6px;
      .devicebasic-item {
        p {
          font-weight: 400;
          font-size: 16px;
          color: #ffffff;
          line-height: 24px;
        }
      }
    }
    .dialog__body--devicevideo {
      width: 100%;
      height: 100%;
      .teaching-video {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
