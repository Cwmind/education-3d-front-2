<template>
  <div v-loading="contentLoading" class="teaching-analysis-class">
    <el-carousel
      v-if="classInfoList.length > 0"
      ref="carouselRef"
      :interval="1500"
      arrow="never"
      indicator-position="none"
      height="574px"
    >
      <el-carousel-item v-for="classItem in classInfoList" :key="classItem.classId">
        <div :ref="(el) => setChartContainerRef(el, classItem.classId)" class="chart-container">
          <div class="teacher-icon">
            <el-tooltip
              effect="dark"
              :content="classItem.teacherName"
              placement="bottom"
              :offset="-30"
              :show-arrow="false"
            >
              <img
                v-if="classItem.teacherSex === 1"
                src="@/assets/icons/svg/teacher-man.svg"
                alt=""
              />
              <img v-else src="@/assets/icons/svg/teacher-woman.svg" alt="" />
            </el-tooltip>
          </div>
          <div v-for="item in classItem.studentList" :key="item" class="student-icon">
            <el-tooltip
              effect="dark"
              :content="item.studentName"
              placement="top"
              :offset="-10"
              :show-arrow="false"
            >
              <template v-if="item.studentSex === 1">
                <img
                  v-if="item.onlineStatus === '1'"
                  src="@/assets/icons/svg/online-student-man.svg"
                  alt=""
                />
                <img v-else src="@/assets/icons/svg/offline-student-man.svg" alt="" />
              </template>
              <template v-else>
                <img
                  v-if="item.onlineStatus === '1'"
                  src="@/assets/icons/svg/online-student-woman.svg"
                  alt=""
                />
                <img v-else src="@/assets/icons/svg/offline-student-woman.svg" alt="" />
              </template>
            </el-tooltip>
          </div>
        </div>
        <div
          class="chart-more"
          :class="checkScrollbar(classItem.classId)"
          @click="handleMoreClick(classItem)"
        >
          查看更多
        </div>
      </el-carousel-item>
    </el-carousel>
    <div v-else class="class-noData">
      <BasicNoData style="opacity: 0.5" />
    </div>
    <teaching-analysis-dialog ref="teachingAnalysisDialogRef" />
  </div>
</template>

<script setup>
import { nextTick } from 'vue'
import TeachingAnalysisDialog from './teaching-analysis-dialog.vue'

const contentLoading = ref(false)
const chartContainerRefs = ref({})
const chartScrollbar = ref({})

function setChartContainerRef(el, classId) {
  if (el) {
    chartContainerRefs.value[classId] = el
    nextTick(() => {
      if (el.scrollHeight > el.clientHeight) {
        chartScrollbar.value[classId] = 1
      } else {
        chartScrollbar.value[classId] = 0
      }
    })
  }
}
const checkScrollbar = computed(() => {
  return (classId) => {
    return chartScrollbar.value[classId] ? 'enable' : 'disable'
  }
})
const carouselRef = ref()
const classInfoList = ref([])
function setData(data) {
  contentLoading.value = true
  classInfoList.value = []
  nextTick(() => {
    classInfoList.value = data || []
    carouselRef.value?.setActiveItem(0)
    contentLoading.value = false
  })
}
// 点击查看更多
const teachingAnalysisDialogRef = ref(null)
function handleMoreClick(classItem) {
  if (chartScrollbar.value[classItem.classId]) {
    teachingAnalysisDialogRef.value?.openDialog(classItem)
  }
}

defineExpose({
  setData
})
</script>

<style lang="scss" scoped>
.teaching-analysis-class {
  .chart-container {
    height: 524px;
    padding-right: 8px;
    overflow-x: hidden;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
    grid-auto-rows: 40px;
    gap: 8px;

    .teacher-icon {
      width: 88px;
      height: 88px;
      grid-column: span 2;
      grid-row: span 2;
      cursor: pointer;
    }
    .student-icon {
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
  }
  .chart-more {
    width: 100%;
    height: 44px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 14px;
    color: #ffffff;
    cursor: pointer;
  }
  .disable {
    cursor: default;
    color: rgba(255, 255, 255, 0.2);
  }
  .class-noData {
    height: 524px;
  }
  :deep(.el-loading-mask) {
    background: transparent;
  }
}
</style>
