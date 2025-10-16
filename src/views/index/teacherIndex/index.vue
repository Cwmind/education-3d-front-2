<template>
  <div class="teacher-index">
    <div class="teacher-index-contiainer">
      <el-row :gutter="16">
        <el-col :span="12">
          <div class="teacher-index__left">
            <div class="teacher-index__left__top">
              <analysis-card title="实训软件数" :value="sxrjCount" :icon="softwareIcon" />
              <analysis-card title="课程数" :value="kcCount" :icon="coursesIcon" />
              <analysis-card title="学生数" :value="studentCount" :icon="studentsIcon" />
            </div>
            <div class="teacher-index__left__bottom">
              <div class="left-bottom__header">
                <div class="left-bottom__header--left">
                  <div class="left-title">授课分析</div>
                  <div class="left-bar"></div>
                </div>
                <div class="left-bottom__header--right">
                  <el-radio-group
                    v-model="teachingAnalysisTimer"
                    @change="changeTeachingAnalysisTimer"
                  >
                    <el-radio-button label="近14天" :value="14" />
                    <el-radio-button label="近一个月" :value="30" />
                  </el-radio-group>
                </div>
              </div>
              <div class="left-bottom__content">
                <analysis-item title="课堂互动数" :value="interactionCount" color="#FF7C4D" />
                <analysis-item
                  title="到课率"
                  :value="overallAttendanceRate"
                  color="#34BF00"
                  suffix="%"
                  :precision="1"
                />
              </div>
              <analysis-line-chart ref="attendanceAnalysisRef" title="到课率" />
              <interactions-chart ref="interactionsChartRef" title="互动次数分析" />
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="teacher-index__right">
            <div class="teacher-index__right__top">
              <analysis-card title="班级数" :value="classCount" :icon="classesIcon" />
              <analysis-card title="学习次数" :value="learnCount" :icon="studyIcon" />
              <analysis-card title="专业数" :value="majorCount" :icon="majorsIcon" />
            </div>
            <div class="teacher-index__right__bottom">
              <div class="right-bottom__header">
                <div class="right-bottom__header--left">
                  <div class="left-title">学习分析</div>
                  <div class="left-bar"></div>
                </div>
                <div class="right-bottom__header--right">
                  <el-radio-group
                    v-model="learningAnalysisTimer"
                    @change="changeLearningAnalysisTimer"
                  >
                    <el-radio-button label="近14天" :value="14" />
                    <el-radio-button label="近一个月" :value="30" />
                  </el-radio-group>
                </div>
              </div>
              <div class="right-bottom__content">
                <analysis-item title="发起考试数" :value="initiateExamCount" color="#FF7C4D" />
                <analysis-item title="参考人次" :value="examStudentCount" color="#34BF00" />
                <analysis-item
                  title="通过率"
                  :value="examPassRate"
                  color="#34BF00"
                  suffix="%"
                  :precision="1"
                />
                <analysis-item
                  title="参考率"
                  :value="examReferRate"
                  color="#34BF00"
                  suffix="%"
                  :precision="1"
                />
              </div>
              <analysis-line-chart ref="passingAnalysisRef" title="通过率" />
              <score-chart ref="scoreAnalysisRef" title="成绩分布" />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import AnalysisCard from './components/analysis-card.vue'
import AnalysisItem from './components/analysis-item.vue'
import AnalysisLineChart from './components/analysis-line-chart.vue'
import InteractionsChart from './components/interactions-chart.vue'
import ScoreChart from './components/score-chart.vue'
import softwareIcon from '@/assets/index/software-icon.png'
import coursesIcon from '@/assets/index/courses-icon.png'
import studentsIcon from '@/assets/index/students-icon.png'
import classesIcon from '@/assets/index/classes-icon.png'
import studyIcon from '@/assets/index/study-icon.png'
import majorsIcon from '@/assets/index/majors-icon.png'
import {
  requestQryCounts,
  requestLectureAnalysis,
  requestExamAnalysis
} from '@/api/index/teacherIndex'

const teachingAnalysisTimer = ref(14)
const learningAnalysisTimer = ref(14)

function changeTeachingAnalysisTimer() {
  getDataAnalysis()
}
function changeLearningAnalysisTimer() {
  getExamAnalysis()
}

const sxrjCount = ref(0)
const kcCount = ref(0)
const studentCount = ref(0)
const classCount = ref(0)
const learnCount = ref(0)
const majorCount = ref(0)
// 获取汇总分析数据
async function getQryCounts() {
  const result = await requestQryCounts()
  const { code, response } = result
  if (code === 1) {
    sxrjCount.value = response.sxrjCount
    kcCount.value = response.kcCount
    studentCount.value = response.studentCount
    classCount.value = response.classCount
    learnCount.value = response.learnCount
    majorCount.value = response.majorCount
  }
}
const interactionCount = ref(0)
const overallAttendanceRate = ref(0)
const attendanceAnalysisRef = ref()
const interactionsChartRef = ref()
// 获取授课分析数据
async function getDataAnalysis() {
  const params = {
    days: teachingAnalysisTimer.value
  }
  const result = await requestLectureAnalysis(params)
  const { code, response } = result
  if (code === 1) {
    interactionCount.value = response.interactionCount
    overallAttendanceRate.value = response.overallAttendanceRate
    interactionsChartRef.value.setChartData(response.interactionList)
    const xAxisData = []
    const seriesData = []
    if (response?.attendanceRateList?.length > 0) {
      response.attendanceRateList.forEach((item) => {
        xAxisData.push(item.date)
        seriesData.push(item.attendanceRate)
      })
    }
    attendanceAnalysisRef.value.setChartData({
      color: '#FF875C',
      xAxisData,
      seriesData
    })
  } else {
    interactionCount.value = 0
    overallAttendanceRate.value = 0
    attendanceAnalysisRef.value.setChartData({
      color: '#FF875C',
      xAxisData: [],
      seriesData: []
    })
    interactionsChartRef.value.setChartData([])
  }
}
const initiateExamCount = ref(0)
const examStudentCount = ref(0)
const examPassRate = ref(0)
const examReferRate = ref(0)
const passingAnalysisRef = ref()
const scoreAnalysisRef = ref()
// 获取学习分析数据
async function getExamAnalysis() {
  const params = {
    days: learningAnalysisTimer.value
  }
  const result = await requestExamAnalysis(params)
  const { code, response } = result
  if (code === 1) {
    initiateExamCount.value = response.initiateExamCount
    examStudentCount.value = response.examStudentCount
    examPassRate.value = response.examPassRate
    examReferRate.value = response.examReferRate
    const xAxisData = []
    const seriesData = []
    if (response?.examPassRateList?.length > 0) {
      response.examPassRateList.forEach((item) => {
        xAxisData.push(item.date)
        seriesData.push(item.passedRate)
      })
    }
    passingAnalysisRef.value.setChartData({
      color: '#FF875C',
      xAxisData,
      seriesData
    })
    scoreAnalysisRef.value.setChartData(response.scoreDistribution)
  } else {
    initiateExamCount.value = 0
    examStudentCount.value = 0
    examPassRate.value = 0
    examReferRate.value = 0
    passingAnalysisRef.value.setChartData({
      color: '#FF875C',
      xAxisData: [],
      seriesData: []
    })
    scoreAnalysisRef.value.setChartData([])
  }
}
onMounted(() => {
  getQryCounts()
  getDataAnalysis()
  getExamAnalysis()
})
</script>

<style lang="scss" scoped>
.teacher-index {
  height: 100%;
  width: 100%;

  .teacher-index-contiainer {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    .teacher-index__left {
      &__top {
        height: 92px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 16px;
        margin-bottom: 16px;
      }
      &__bottom {
        padding: 24px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 4px;
        .left-bottom__header {
          width: 100%;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          &--left {
            .left-title {
              font-weight: 500;
              font-size: 16px;
              color: #000000;
              line-height: 16px;
              margin-bottom: 8px;
            }
            .left-bar {
              width: 120px;
              height: 4px;
              background: linear-gradient(90deg, #e95520 0%, rgba(255, 255, 255, 0) 100%);
            }
          }
        }
        .left-bottom__content {
          height: 84px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-gap: 8px;
          margin-bottom: 24px;
        }
      }
    }
    .teacher-index__right {
      &__top {
        height: 92px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 16px;
        margin-bottom: 16px;
      }
      &__bottom {
        padding: 24px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 4px;

        .right-bottom__header {
          width: 100%;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          &--left {
            .left-title {
              font-weight: 500;
              font-size: 16px;
              color: #000000;
              line-height: 16px;
              margin-bottom: 8px;
            }
            .left-bar {
              width: 120px;
              height: 4px;
              background: linear-gradient(90deg, #e95520 0%, rgba(255, 255, 255, 0) 100%);
            }
          }
        }
        .right-bottom__content {
          height: 84px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-gap: 8px;
          margin-bottom: 24px;
        }
      }
    }
    :deep(.el-radio-button__inner) {
      color: #000000;
      background: rgba(0, 0, 0, 0.05);
    }
    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
      color: #ffffff;
      background: #ff875c;
    }
  }
}
</style>
