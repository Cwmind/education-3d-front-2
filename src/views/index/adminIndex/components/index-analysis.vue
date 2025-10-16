<template>
  <div class="index-analysis">
    <div class="index-analysis-list">
      <div class="index-analysis-list-item">
        <div class="item-left">
          <img src="@/assets/index/software-num.png" alt="" />
        </div>
        <div class="item-right">
          <el-statistic :value="sxrjCountValue" />
          <div class="item-title">实训软件数</div>
        </div>
      </div>
      <div class="index-analysis-list-item">
        <div class="item-left">
          <img src="@/assets/index/courses-num.png" alt="" />
        </div>
        <div class="item-right">
          <el-statistic :value="kcCountValue" />
          <div class="item-title">课程数</div>
        </div>
      </div>
      <div class="index-analysis-list-item">
        <div class="item-left">
          <img src="@/assets/index/teachers-num.png" alt="" />
        </div>
        <div class="item-right">
          <el-statistic :value="teacherCountValue" />
          <div class="item-title">教师数</div>
        </div>
      </div>
    </div>
    <div class="index-analysis-list">
      <div class="index-analysis-list-item">
        <div class="item-left">
          <img src="@/assets/index/classes-num.png" alt="" />
        </div>
        <div class="item-right">
          <el-statistic :value="classCountValue" />
          <div class="item-title">班级数</div>
        </div>
      </div>
      <div class="index-analysis-list-item">
        <div class="item-left">
          <img src="@/assets/index/students-num.png" alt="" />
        </div>
        <div class="item-right">
          <el-statistic :value="studentCountValue" />
          <div class="item-title">学生数</div>
        </div>
      </div>
      <div class="index-analysis-list-item">
        <div class="item-left">
          <img src="@/assets/index/majors-num.png" alt="" />
        </div>
        <div class="item-right">
          <el-statistic :value="majorCountValue" />
          <div class="item-title">专业数</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTransition } from '@vueuse/core'

const sxrjCount = ref(0)
const sxrjCountValue = useTransition(sxrjCount, {
  duration: 1000
})
const kcCount = ref(0)
const kcCountValue = useTransition(kcCount, {
  duration: 1000
})
const teacherCount = ref(0)
const teacherCountValue = useTransition(teacherCount, {
  duration: 1000
})
const classCount = ref(0)
const classCountValue = useTransition(classCount, {
  duration: 1000
})
const studentCount = ref(0)
const studentCountValue = useTransition(studentCount, {
  duration: 1000
})
const majorCount = ref(0)
const majorCountValue = useTransition(majorCount, {
  duration: 1000
})

function setData(data) {
  if (data) {
    sxrjCount.value = data.sxrjCount
    kcCount.value = data.kcCount
    teacherCount.value = data.teacherCount
    classCount.value = data.classCount
    studentCount.value = data.studentCount
    majorCount.value = data.majorCount
  } else {
    sxrjCount.value = 0
    kcCount.value = 0
    teacherCount.value = 0
    classCount.value = 0
    studentCount.value = 0
    majorCount.value = 0
  }
}

defineExpose({
  setData
})
</script>

<style lang="scss" scoped>
.index-analysis {
  padding: 7px 0 0;
  &-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    margin-bottom: 31px;
    &-item {
      display: flex;
      .item-left {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 50%;
        margin-right: 8px;
        img {
          width: 20px;
          height: 20px;
        }
      }
      .item-right {
        :deep(.el-statistic__number) {
          font-weight: bold;
          font-size: 24px;
          color: #ffffff;
        }
        .item-title {
          font-weight: 500;
          font-size: 14px;
          color: #d6d6d6;
        }
      }
    }
  }
}
</style>
