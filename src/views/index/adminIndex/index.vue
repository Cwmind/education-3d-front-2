<template>
  <div class="admin-index">
    <div class="admin-index-contiainer">
      <div ref="adminIndexContiainerRef" class="contiainer-fullscreen">
        <div class="content__header">
          <div class="content__header-title">新能源锂离子电池制造工艺实训平台</div>
        </div>
        <el-row :gutter="16">
          <el-col :span="8">
            <card-item title="整体指标分析">
              <index-analysis ref="indexAnalysisRef" />
            </card-item>
            <card-item title="平台访问趋势分析">
              <trend-analysis ref="trendAnalysisRef" />
            </card-item>
            <card-item title="人气教师排行">
              <teacher-ranking ref="teacherRankingRef" />
            </card-item>
          </el-col>
          <el-col :span="8">
            <teaching-analysis ref="teachingAnalysisRef" />
          </el-col>
          <el-col :span="8">
            <card-item title="成绩分布">
              <score-distribution ref="scoreDistributionRef" />
            </card-item>
            <card-item title="专业分布">
              <major-distribution ref="majorDistributionRef" />
            </card-item>
            <card-item title="学霸排行">
              <student-ranking ref="studentRankingRef" />
            </card-item>
          </el-col>
        </el-row>
        <div class="content__btn content__btn--fullscreen" @click="toggleFullScreen">
          <img src="@/assets/icons/practical/fullscreen.svg" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CardItem from './components/card-item.vue'
import IndexAnalysis from './components/index-analysis.vue'
import TrendAnalysis from './components/trend-analysis.vue'
import TeacherRanking from './components/teacher-ranking.vue'
import ScoreDistribution from './components/score-distribution.vue'
import MajorDistribution from './components/major-distribution.vue'
import StudentRanking from './components/student-ranking.vue'
import TeachingAnalysis from './components/teaching-analysis.vue'
import {
  requestSummaryData,
  requestBrowseAnalysis,
  requestTeacherPopularRank,
  requestRealTimeClassAnalysis,
  requestScoreDistribution,
  requestMajorDistribution,
  requestStudentScoreRank
} from '@/api/index/adminIndex'
import { ref } from 'vue'

const adminIndexContiainerRef = ref()

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    adminIndexContiainerRef.value.requestFullscreen().catch((err) => {
      console.error(`无法进入全屏模式: ${err.message}`)
    })
  } else {
    document.exitFullscreen().catch((err) => {
      console.error(`无法退出全屏模式: ${err.message}`)
    })
  }
}
// 整体指标分析
const indexAnalysisRef = ref()
async function getSummaryData() {
  const result = await requestSummaryData()
  const { code, response } = result
  if (code === 1) {
    indexAnalysisRef.value.setData(response)
  } else {
    indexAnalysisRef.value.setData()
  }
}
// 平台访问趋势分析
const trendAnalysisRef = ref()
async function getBrowseAnalysis() {
  const result = await requestBrowseAnalysis()
  const { code, response } = result
  if (code === 1) {
    trendAnalysisRef.value.setData(response)
  } else {
    trendAnalysisRef.value.setData()
  }
}
// 人气老师排行
const teacherRankingRef = ref()
async function getTeacherPopularRank() {
  const result = await requestTeacherPopularRank()
  const { code, response } = result
  if (code === 1) {
    teacherRankingRef.value.setData(response)
  } else {
    teacherRankingRef.value.setData([])
  }
}
// 实时课堂分析
const teachingAnalysisRef = ref()
async function getRealTimeClassAnalysis() {
  const result = await requestRealTimeClassAnalysis()
  const { code, response } = result
  if (code === 1) {
    teachingAnalysisRef.value.setData(response)
  } else {
    teachingAnalysisRef.value.setData()
  }
}
// 成绩分布
const scoreDistributionRef = ref()
async function getScoreDistribution() {
  const result = await requestScoreDistribution()
  const { code, response } = result
  if (code === 1) {
    scoreDistributionRef.value.setData(response)
  } else {
    scoreDistributionRef.value.setData()
  }
}
// 专业分布
const majorDistributionRef = ref()
async function getMajorDistribution() {
  const result = await requestMajorDistribution()
  const { code, response } = result
  if (code === 1) {
    majorDistributionRef.value.setData(response)
  } else {
    majorDistributionRef.value.setData()
  }
}
// 学霸排行
const studentRankingRef = ref()
async function getStudentScoreRank() {
  const result = await requestStudentScoreRank()
  const { code, response } = result
  if (code === 1) {
    studentRankingRef.value.setData(response)
  } else {
    studentRankingRef.value.setData([])
  }
}

const setIntervalTimer = ref()
function queryData() {
  getSummaryData()
  getBrowseAnalysis()
  getTeacherPopularRank()
  getRealTimeClassAnalysis()
  getScoreDistribution()
  getMajorDistribution()
  getStudentScoreRank()
}

onMounted(() => {
  queryData()
  setIntervalTimer.value = setInterval(() => {
    queryData()
  }, 10000)
})
onBeforeUnmount(() => {
  clearInterval(setIntervalTimer.value)
})
</script>

<style lang="scss" scoped>
.admin-index {
  width: 100%;
  height: 100%;
  .admin-index-contiainer {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    .contiainer-fullscreen {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: #e9e9e9 url('@/assets/index/admin-index-bg.png') no-repeat;
      background-size: 100% 100%;
      overflow-y: auto;
      overflow-x: hidden;
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
      .content__btn--fullscreen {
        position: absolute;
        top: 16px;
        right: 16px;
      }
    }
  }
}
</style>
