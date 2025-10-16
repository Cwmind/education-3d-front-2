<template>
  <div class="teaching-analysis">
    <div class="teaching-analysis-top">
      <div class="teaching-analysis-top__analysis">
        <analysis-card title="当前班数" :value="classCount" :icon="nowClasses" />
        <analysis-card title="到课人数" :value="totalOnlineCount" :icon="classAttendance" />
        <analysis-card title="缺课人数" :value="totalOfflineCount" :icon="missSchool" />
      </div>
      <teaching-analysis-class ref="teachingAnalysisClassRef" />
    </div>
    <teaching-analysis-lecture ref="teachingAnalysisLectureRef" />
  </div>
</template>

<script setup>
import AnalysisCard from './analysis-card.vue'
import nowClasses from '@/assets/index/now-classes.png'
import classAttendance from '@/assets/index/class-attendance.png'
import missSchool from '@/assets/index/miss-school.png'
import TeachingAnalysisClass from './teaching-analysis-class.vue'
import TeachingAnalysisLecture from './teaching-analysis-lecture.vue'

// 当前班数
const classCount = ref(0)
// 到课人数
const totalOnlineCount = ref(0)
// 缺课人数
const totalOfflineCount = ref(0)
// 班级人数统计
const teachingAnalysisClassRef = ref()
// 实时授课分析
const teachingAnalysisLectureRef = ref()

function setData(data) {
  if (data) {
    classCount.value = data.classCount || 0
    totalOnlineCount.value = data.totalOnlineCount || 0
    totalOfflineCount.value = data.totalOfflineCount || 0
    teachingAnalysisClassRef.value.setData(data.classInfoList)
    teachingAnalysisLectureRef.value.setData(data.lectureInfoList)
  }
}
defineExpose({
  setData
})
</script>

<style lang="scss" scoped>
.teaching-analysis {
  padding: 24px;
  border-radius: 4px;
  background: none;
  &-top {
    margin-bottom: 24px;
    &__analysis {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 24px;
    }
  }
}
</style>
