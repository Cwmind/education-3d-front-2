<template>
  <div class="practical-detail">
    <div ref="practicalDetailRef" class="practical-detail-content">
      <div class="content__header">
        <div class="content__header-title">{{ title }}</div>
      </div>
      <div class="content__unity">
        <iframe
          id="iframe3d"
          :src="iframeSrc"
          frameborder="0"
          width="100%"
          height="100%"
          scrolling="no"
        ></iframe>
      </div>
      <div class="content__btn content__btn--back" @click="handleBackClick">
        <img src="@/assets/icons/practical/back.svg" alt="" />
      </div>
      <div class="content__btn content__btn--fullscreen" @click="toggleFullScreen">
        <img src="@/assets/icons/practical/fullscreen.svg" alt="" />
      </div>
      <el-tooltip
        effect="dark"
        content="切换视角"
        placement="bottom"
        :teleported="false"
        class="box-item"
      >
        <div
          v-if="unityView === 'Game'"
          class="content__btn content__btn--roam"
          @click="handleRoamClick"
        >
          <img src="@/assets/icons/practical/roam.svg" alt="" />
        </div>
      </el-tooltip>
      <el-popover
        placement="left-end"
        :show-arrow="false"
        :teleported="false"
        popper-class="practical-operate-popover"
      >
        <template #reference>
          <div v-if="unityView === 'Game'" class="content__btn content__btn--operate">
            <img src="@/assets/icons/practical/operate.svg" alt="" />
          </div>
        </template>
        <div class="practical-detail-operate">
          <div class="operate-item">
            <img
              class="operate-item-icon icon-left"
              src="@/assets/icons/practical/operate-w.svg"
              alt=""
            />
            <img
              class="operate-item-icon icon-right"
              src="@/assets/icons/practical/operate-up.svg"
              alt=""
            />
            <span>前进</span>
          </div>
          <div class="operate-item">
            <img
              class="operate-item-icon icon-left"
              src="@/assets/icons/practical/operate-a.svg"
              alt=""
            />
            <img
              class="operate-item-icon icon-right"
              src="@/assets/icons/practical/operate-down.svg"
              alt=""
            />
            <span>后退</span>
          </div>
          <div class="operate-item">
            <img
              class="operate-item-icon icon-left"
              src="@/assets/icons/practical/operate-a.svg"
              alt=""
            />
            <img
              class="operate-item-icon icon-right"
              src="@/assets/icons/practical/operate-left.svg"
              alt=""
            />
            <span>向左</span>
          </div>
          <div class="operate-item">
            <img
              class="operate-item-icon icon-left"
              src="@/assets/icons/practical/operate-d.svg"
              alt=""
            />
            <img
              class="operate-item-icon icon-right"
              src="@/assets/icons/practical/operate-right.svg"
              alt=""
            />
            <span>向右</span>
          </div>
          <div class="operate-item">
            <img
              class="operate-item-icon icon-right"
              src="@/assets/icons/practical/operate-esc.svg"
              alt=""
            />
            <span>退出全屏</span>
          </div>
          <div class="operate-mouse">
            <div class="operate-item-icon icon-mouse">
              <img src="@/assets/icons/practical/operate-mouse.svg" alt="" />
            </div>
            <div class="operate-mouse-text">
              <span>按住鼠标右</span>
              <span>键转动视角</span>
            </div>
          </div>
        </div>
      </el-popover>
      <el-popover
        placement="left-end"
        :show-arrow="false"
        :teleported="false"
        :width="225"
        popper-class="practical-operate-popover"
      >
        <template #reference>
          <div v-if="unityView === 'Game'" class="content__btn content__btn--rate">
            <img src="@/assets/icons/practical/rate.svg" alt="" />
          </div>
        </template>
        <div class="practical-detail-rate">
          <div class="rate-title">匿名评分</div>
          <div v-if="courseScoreList.length > 0" class="rate-content">
            <div v-for="item in courseScoreList" :key="item" class="rate-item">
              <div class="rate-item-icon">
                <img src="@/assets/icons/practical/rate-user.svg" alt="" />
              </div>
              <div class="rate-item-content">
                <div class="rate-item-content-time">{{ item.createTime }}</div>
                <el-rate v-model="item.courseScore" disabled show-score text-color="#FFFFFF" />
              </div>
            </div>
          </div>
          <div v-else class="rate-content-empty">暂无评分</div>
          <div class="rate-submit">
            <div class="rate-submit-rate">
              <el-rate v-model="courseScore" allow-half show-score text-color="#FFFFFF" />
            </div>
            <el-button type="primary" size="small" @click="handleRateSubmit">提交</el-button>
          </div>
        </div>
      </el-popover>
      <practical-process-dialog ref="practicalProcessDialogRef" />
      <practical-teaching-exam ref="practicalTeachingExamRef" />
      <practical-teaching-result ref="practicalTeachingResultRef" />
      <practical-student-exam ref="practicalStudentExamRef" />
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import { checkRole } from '@/utils/permission'
import { TEACHER, STUDENT } from '@/config/rolesConfig'
import useUserStore from '@/store/modules/user'
import processCodeInfo from '@/config/processCodeConfig'
import PracticalProcessDialog from './practical-process-dialog.vue'
import PracticalTeachingExam from './practical-teaching-exam.vue'
import PracticalTeachingResult from './practical-teaching-result.vue'
import PracticalStudentExam from './practical-student-exam.vue'
import {
  requestStartSimulationExam,
  requestQryStuExamInfo,
  requestGradeTheCourse
} from '@/api/practical/myPractical'
import { requestCourseScoreList } from '@/api/course/courseCenter'
import { monitorStudy } from '@/api/basic/common'

const userStore = useUserStore()
const emit = defineEmits(['back-click'])
const props = defineProps({
  practicalInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
// 上报学习时间定时器
const studyTimer = ref(null)
// 当前选中的工序
const selectProcessCode = ref('')
// 工序评分
const courseScore = ref(0)
const unityView = ref(null)
const iframeSrc = ref('./unity3D/index.html?v=' + new Date().getTime())
const title = ref('新能源锂离子电池制造工艺3D仿真实训软件')
// 发送数据到unity
function sendMsgToUnity(data) {
  const iframe = document.getElementById('iframe3d')
  iframe.contentWindow.postMessage(data)
}
// 接收unity参数
async function handleUnityLoad(event) {
  const { data } = event
  if (data) {
    console.log('handleUnityLoad data', data)
    const { type } = data
    if (type === 'getConfig') {
      sendMsgToUnity({
        type: 'getConfig',
        token: 'Bearer ' + getToken(),
        roles: JSON.stringify(userStore.roles),
        processCodes: JSON.stringify(props.practicalInfo.processCodes),
        practicalInfo: JSON.stringify(props.practicalInfo)
      })
    }
    if (type === 'changeScene') {
      const { tag, processCode } = data
      unityView.value = tag
      if (tag === 'Game') {
        selectProcessCode.value = processCode
        title.value = processCodeInfo.find((item) => item.code === processCode).name + '工序'
        getCourseScoreList()
      } else {
        selectProcessCode.value = ''
        title.value = '新能源锂离子电池制造工艺3D仿真实训软件'
      }
    }
    const validClickTypes = ['listBasic', 'listCore', 'deviceBasic', 'deviceVideo']
    if (validClickTypes.includes(type)) {
      // 点击工序介绍、核心知识、基础知识、讲解视频出发事件
      loadPracticalProcessInfo(data)
    } else if (type === 'exam') {
      if (checkRole(TEACHER)) {
        // 老师角色点击考试测试
        loadTeacherExam(data)
      } else if (checkRole(STUDENT)) {
        // 学生角色点击考试测试
        loadStudentExam(data)
      } else {
        ElMessage.error('无操作权限!')
      }
    } else if (type === 'examResult') {
      if (checkRole(TEACHER)) {
        // 老师角色点击查看考试
        loadExamResult(data)
      } else if (checkRole(STUDENT)) {
        // 学生角色点击查看考试
        loadStudentExamResult(data)
      } else {
        ElMessage.error('无操作权限!')
      }
    }
  }
}
const practicalProcessDialogRef = ref(null)
function loadPracticalProcessInfo(data) {
  practicalProcessDialogRef.value.openDialog(data, props.practicalInfo)
}
const practicalTeachingExamRef = ref()
function loadTeacherExam(data) {
  practicalTeachingExamRef.value.openDialog(data, props.practicalInfo)
}
const practicalTeachingResultRef = ref()
function loadExamResult(data) {
  practicalTeachingResultRef.value.openDialog(data, props.practicalInfo)
}
const practicalStudentExamRef = ref(null)
async function loadStudentExam(data) {
  const { courseId, classId } = props.practicalInfo
  const { processCode } = data
  const label = processCodeInfo.find((item) => item.code === processCode).name
  const params = {
    courseId,
    classId,
    label
  }
  const result = await requestStartSimulationExam(params)
  const { code, response } = result
  if (code === 1 && response) {
    practicalStudentExamRef.value.openDialog(true, response)
  } else {
    ElMessage.warning(result.message)
  }
}
async function loadStudentExamResult(data) {
  const { courseId, classId } = props.practicalInfo
  const { processCode } = data
  const label = processCodeInfo.find((item) => item.code === processCode).name
  const params = {
    courseId,
    classId,
    label
  }
  const result = await requestQryStuExamInfo(params)
  const { code, response } = result
  if (code === 1 && response) {
    const { paperAnswerDetails } = response
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
    practicalStudentExamRef.value.openDialog(false, response)
    // ElMessage({
    //   type: 'warning',
    //   offset: 200,
    //   duration: 2000,
    //   customClass: 'student-exam-result-message',
    //   dangerouslyUseHTMLString: true,
    //   message: '<div>今天还未</div><div>参与考试</div>'
    // })
  } else {
    ElMessage.warning(result.message)
  }
}
// 点击返回按钮
function handleBackClick() {
  title.value = '新能源锂离子电池制造工艺3D仿真实训软件'
  if (unityView.value === 'UI') {
    emit('back-click', 0)
  } else {
    sendMsgToUnity({
      type: 'webClick',
      btnType: 'back'
    })
  }
}
const practicalDetailRef = ref()
// 点击全屏按钮
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    practicalDetailRef.value.requestFullscreen().catch((err) => {
      console.error(`无法进入全屏模式: ${err.message}`)
    })
  } else {
    document.exitFullscreen().catch((err) => {
      console.error(`无法退出全屏模式: ${err.message}`)
    })
  }
}
// 点击切换视角
function handleRoamClick() {
  sendMsgToUnity({
    type: 'webClick',
    btnType: 'changeView'
  })
}
// 获取评分列表
const courseScoreList = ref([])
async function getCourseScoreList() {
  const result = await requestCourseScoreList({
    courseId: props.practicalInfo.courseId,
    label: selectProcessCode.value
  })
  const { code, response } = result
  if (code === 1) {
    courseScoreList.value = response
  } else {
    courseScoreList.value = []
  }
}
// 提交评分
async function handleRateSubmit() {
  const { courseType, courseId, classId, teacherUuid } = props.practicalInfo
  const params = {
    courseType,
    courseId,
    classId,
    teacherUuid,
    label: selectProcessCode.value,
    courseScore: courseScore.value
  }
  const result = await requestGradeTheCourse(params)
  const { code } = result
  if (code === 1) {
    getCourseScoreList()
    courseScore.value = 0
    ElMessage.success('添加评分成功')
  } else {
    ElMessage.warning(result.message)
  }
}
// 监控学习时长（学生角色）
function startMonitorStudy() {
  if (checkRole(STUDENT)) {
    clearInterval(studyTimer.value)
    const params = {
      courseType: props.practicalInfo.courseType,
      classId: props.practicalInfo.classId,
      courseId: props.practicalInfo.courseId
    }
    studyTimer.value = setInterval(() => {
      monitorStudy(params)
    }, 1000 * 20)
    monitorStudy(params)
  }
}
onMounted(() => {
  unityView.value = 'UI'
  startMonitorStudy()
  window.addEventListener('message', handleUnityLoad)
})
onUnmounted(() => {
  clearInterval(studyTimer.value)
  window.removeEventListener('message', handleUnityLoad)
})
</script>

<style lang="scss" scoped>
.practical-detail {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  &-content {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #e9e9e9 url('@/assets/images/board/bg.png') no-repeat;
    background-size: 100% 100%;
    .content__header {
      position: relative;
      width: 100%;
      height: 68px;
      background: url('@/assets/images/board/board-title.png') no-repeat center;
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      margin: 0 auto;
      z-index: 1;

      &-title {
        font-weight: 500;
        font-size: 24px;
        color: #ffffff;
        line-height: 58px;
        text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
      }
    }
    .content__unity {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
    .content__btn {
      width: 32px;
      height: 32px;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
      img {
        width: 16px;
        height: 16px;
      }
    }
    .content__btn--back {
      position: absolute;
      top: 16px;
      left: 16px;
    }
    .content__btn--fullscreen {
      position: absolute;
      top: 16px;
      right: 16px;
    }
    .content__btn--roam {
      position: absolute;
      top: 16px;
      right: 56px;
    }
    .content__btn--operate {
      position: absolute;
      bottom: 16px;
      right: 16px;
    }
    .content__btn--rate {
      position: absolute;
      bottom: 56px;
      right: 16px;
    }
  }
}
</style>
<style lang="scss">
.student-exam-result-message {
  background: rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  border: none;
  display: flex;
  flex-direction: column;
  padding: 22px 36px 16px;
  .el-message-icon--warning {
    color: #ed7b2f;
    height: 42px;
    width: 42px;
    svg {
      height: 42px;
      width: 42px;
    }
  }
  .el-message__content {
    font-weight: 400;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 20px;
  }
}
.practical-operate-popover {
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
.practical-detail-operate {
  background-image: url('@/assets/images/practical/practical-operate-bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  padding: 16px 20px 16px 16px;
  .operate-item {
    height: 32px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 18px;
    .operate-item-icon {
      width: 32px;
      height: 32px;
    }
    .icon-left {
      margin-right: 4px;
    }
    .icon-right {
      margin-right: 8px;
    }
  }
  .operate-mouse {
    height: 32px;
    display: flex;
    font-weight: 400;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 18px;
    .operate-item-icon {
      width: 32px;
      height: 32px;
    }
    .operate-mouse-text {
      display: flex;
      flex-direction: column;
    }
    .icon-mouse {
      background: rgba(0, 0, 0, 0.6);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
    }
  }
}
.practical-detail-rate {
  background-image: url('@/assets/images/practical/practical-operate-bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .rate-title {
    font-weight: 400;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 18px;
    margin-bottom: 24px;
  }
  .rate-content {
    height: 142px;
    width: 100%;
    overflow-y: auto;
    .rate-item {
      display: flex;
      margin-bottom: 16px;
      .rate-item-icon {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        margin-right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .rate-item-content {
        .rate-item-content-time {
          font-weight: 400;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 18px;
          margin-bottom: 4px;
        }
      }
    }
  }
  .rate-content-empty {
    height: 142px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 18px;
  }

  .rate-submit {
    width: 100%;
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .rate-submit-rate {
      width: 120px;
    }
  }
  .el-rate {
    height: 16px !important;
  }
  .el-rate__icon {
    margin-right: 1px !important;
  }
  .el-rate__text {
    margin-left: 2px !important;
  }
  .el-rate.is-disabled .el-rate__item {
    color: rgba(255, 255, 255, 0.3);
  }
}
</style>
