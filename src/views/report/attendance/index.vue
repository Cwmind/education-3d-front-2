<template>
  <div class="attendance">
    <BasicPageTopBottom :marginGap="1">
      <template #top>
        <el-card shadow="never" body-class="attendance-search">
          <BasicTableSearch
            labelWidth="84"
            :queryParams="queryParams"
            :handleSearch="handleSearch"
            :handleReset="handleReset"
          >
            <template #searchItems>
              <template v-if="activeName === 'analysis'">
                <el-col :span="6">
                  <el-form-item label="月份" prop="analysisMonth">
                    <el-date-picker
                      v-model="queryParams.analysisMonth"
                      type="month"
                      value-format="YYYY-MM"
                      :disabled-date="analysisDisabledDate"
                      :clearable="false"
                    />
                  </el-form-item>
                </el-col>
              </template>
              <template v-if="activeName === 'monthly'">
                <el-col :span="6">
                  <el-form-item label="部门" prop="monthlyDept">
                    <el-select v-model="queryParams.monthlyDept" placeholder="请选择部门">
                      <el-option
                        v-for="item in allDeptConfig"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="月份" prop="month">
                    <el-date-picker
                      v-model="queryParams.month"
                      type="month"
                      value-format="YYYY-MM"
                      :disabled-date="monthlyDisabledDate"
                      :clearable="false"
                    />
                  </el-form-item>
                </el-col>
              </template>
              <template v-if="activeName === 'weekly'">
                <el-col :span="6">
                  <el-form-item label="部门" prop="weeklyDept">
                    <el-select v-model="queryParams.weeklyDept" placeholder="请选择部门">
                      <el-option
                        v-for="item in allDeptConfig"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="周开始日期" prop="weekStartDate">
                    <el-date-picker
                      v-model="queryParams.weekStartDate"
                      type="date"
                      value-format="YYYY-MM-DD"
                      :disabled-date="weeklyDisabledDate"
                      :clearable="false"
                    />
                  </el-form-item>
                </el-col>
              </template>
              <template v-if="activeName === 'details'">
                <el-col :span="6">
                  <el-form-item label="部门" prop="detailsDept">
                    <el-select v-model="queryParams.detailsDept" placeholder="请选择部门" clearable>
                      <el-option
                        v-for="item in deptConfig"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="姓名/工号" prop="nameOrUuid">
                    <el-input v-model="queryParams.nameOrUuid" placeholder="请输入姓名/工号" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="日期" prop="detailsRangeDate">
                    <el-date-picker
                      v-model="queryParams.rangeDate"
                      type="daterange"
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="YYYY-MM-DD"
                      :disabled-date="detailsDisabledDate"
                    />
                  </el-form-item>
                </el-col>
              </template>
            </template>
          </BasicTableSearch>
        </el-card>
      </template>
      <template #content>
        <div class="height-100 attendance-content">
          <el-tabs v-model="activeName" class="content-tabs" @tab-click="handleTabClick">
            <el-tab-pane label="考勤分析" name="analysis">
              <attendance-analysis ref="attendanceAnalysisRef" />
            </el-tab-pane>
            <el-tab-pane label="月度统计" name="monthly">
              <attendance-monthly ref="attendanceMonthlyRef" />
            </el-tab-pane>
            <el-tab-pane label="周度统计" name="weekly">
              <attendance-weekly ref="attendanceWeeklyRef" />
            </el-tab-pane>
            <el-tab-pane label="考勤明细" name="details">
              <attendance-details ref="attendanceDetailsRef" />
            </el-tab-pane>
          </el-tabs>
          <div v-if="activeName === 'details'" class="content-import">
            <el-button icon="Upload" @click="handleAttendanceImport"> 导入 </el-button>
          </div>
        </div>
      </template>
    </BasicPageTopBottom>
    <attendance-import ref="attendanceImportRef" @refresh-list="loadContentData" />
  </div>
</template>

<script setup>
import { dayjs } from 'element-plus'
import { deptConfig, allDeptConfig } from '@/config/deptConfig'
import AttendanceAnalysis from './components/attendance-analysis.vue'
import AttendanceImport from './components/attendance-import.vue'
import AttendanceMonthly from './components/attendance-monthly.vue'
import AttendanceWeekly from './components/attendance-weekly.vue'
import AttendanceDetails from './components/attendance-details.vue'

const analysisDisabledDate = (time) => {
  return time.getTime() > Date.now()
}
const monthlyDisabledDate = (time) => {
  return time.getTime() > Date.now()
}
const weeklyDisabledDate = (time) => {
  // 获取当前日期的星期几，0 表示周日，1 表示周一
  const day = time.getDay()
  return day !== 1 || time.getTime() > Date.now()
}
const detailsDisabledDate = (time) => {
  return time.getTime() > Date.now()
}
const activeName = ref('analysis')
const queryParams = ref({
  analysisMonth: dayjs().subtract(1, 'month').format('YYYY-MM'),
  monthlyDept: '数字工程分院',
  month: dayjs().subtract(1, 'month').format('YYYY-MM'),
  weeklyDept: '数字工程分院',
  weekStartDate: dayjs().startOf('week').subtract(1, 'week').add(1, 'day').format('YYYY-MM-DD'),
  detailsDept: '',
  nameOrUuid: '',
  detailsRangeDate: []
})
function loadContentData() {
  if (activeName.value === 'analysis') {
    loadAttendanceAnalysis()
  } else if (activeName.value === 'monthly') {
    loadAttendanceMonthly()
  } else if (activeName.value === 'weekly') {
    loadAttendanceWeekly()
  } else if (activeName.value === 'details') {
    console.log('考勤明细')
    loadAttendanceDetails()
  }
}
// 考勤分析
const attendanceAnalysisRef = ref(null)
const computedAnalysisParams = computed(() => {
  return {
    month: queryParams.value.analysisMonth
  }
})
function loadAttendanceAnalysis() {
  attendanceAnalysisRef.value?.loadPage(computedAnalysisParams.value)
}
// 月度统计
const attendanceMonthlyRef = ref(null)
const computedMonthlyParams = computed(() => {
  return {
    dept: queryParams.value.monthlyDept,
    month: queryParams.value.month
  }
})
function loadAttendanceMonthly() {
  attendanceMonthlyRef.value?.loadPage(computedMonthlyParams.value)
}
// 周度统计
const attendanceWeeklyRef = ref(null)
const computedWeeklyParams = computed(() => {
  return {
    dept: queryParams.value.weeklyDept,
    weekStartDate: queryParams.value.weekStartDate
  }
})
function loadAttendanceWeekly() {
  attendanceWeeklyRef.value?.loadPage(computedWeeklyParams.value)
}
// 考勤明细
const attendanceDetailsRef = ref(null)
const computedDetailsParams = computed(() => {
  return {
    dept: queryParams.value.detailsDept,
    nameOrUuid: queryParams.value.nameOrUuid,
    startDate: queryParams.value.detailsRangeDate?.length
      ? queryParams.value.detailsRangeDate[0]
      : '',
    endDate: queryParams.value.detailsRangeDate?.length ? queryParams.value.detailsRangeDate[1] : ''
  }
})
// 获取考勤明细数据
function loadAttendanceDetails() {
  attendanceDetailsRef.value?.loadPage(computedDetailsParams.value)
}
const attendanceImportRef = ref()
function handleAttendanceImport() {
  attendanceImportRef.value.openDialog()
}

// 重置按钮
function handleReset() {
  initQueryParams()
  loadContentData()
}
// 查询按钮
function handleSearch() {
  loadContentData()
}
function handleTabClick() {
  initQueryParams()
  loadContentData()
}
function initQueryParams() {
  queryParams.value = {
    analysisMonth: dayjs().subtract(1, 'month').format('YYYY-MM'),
    monthlyDept: '数字工程分院',
    month: dayjs().subtract(1, 'month').format('YYYY-MM'),
    weeklyDept: '数字工程分院',
    weekStartDate: dayjs().startOf('week').subtract(1, 'week').add(1, 'day').format('YYYY-MM-DD'),
    detailsDept: '',
    nameOrUuid: '',
    detailsRangeDate: []
  }
}
onMounted(() => {
  loadContentData()
})
</script>

<style lang="scss">
.attendance-search {
  padding: 24px;
}
</style>
<style lang="scss" scoped>
.attendance {
  width: 100%;
  height: 100%;
  .attendance-content {
    position: relative;
    .content-tabs {
      height: 100%;
      :deep(.el-tabs__header) {
        margin: 0 0 24px;
      }
      :deep(.el-tabs__content) {
        padding: 0 24px 24px;
      }
      :deep(.el-tabs__nav-scroll) {
        padding: 16px 24px 0 24px;
      }
      :deep(.el-tabs__item) {
        height: 22px;
        margin: 13px 16px;
        padding: 0;
      }
      :deep(.el-tab-pane) {
        height: 100%;
      }
    }
    .content-import {
      position: absolute;
      top: 24px;
      right: 24px;
    }
  }
}

:deep(.el-card) {
  background-color: #f8f8f8;
  border: none;
}
</style>
