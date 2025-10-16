<template>
  <BasicPageTopBottom :marginGap="1">
    <template #top>
      <el-card shadow="never" body-class="exam-management-search">
        <BasicTableSearch
          ref="queryRef"
          labelWidth="64"
          :queryParams="queryParams"
          :handleSearch="handleSearch"
          :handleReset="handleReset"
        >
          <template #searchItems>
            <el-col :span="6">
              <el-form-item label="种类" prop="courseType">
                <el-select
                  v-model="queryParams.courseType"
                  placeholder="请选择种类"
                  clearable
                  @change="handleCourseTypeChange"
                >
                  <el-option
                    v-for="item in courseTypesList"
                    :key="item.courseType"
                    :label="item.courseTypeName"
                    :value="item.courseType"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="类型" prop="courseId">
                <el-select v-model="queryParams.courseId" placeholder="请选择类型" clearable>
                  <el-option
                    v-for="item in coursesList"
                    :key="item.courseId"
                    :label="item.courseName"
                    :value="item.courseId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="考试名称" prop="examName">
                <el-input v-model="queryParams.examName" placeholder="请输入考试名称" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="班级" prop="classId">
                <el-select v-model="queryParams.classId" placeholder="请选择班级" clearable>
                  <el-option
                    v-for="item in classesList"
                    :key="item.classId"
                    :label="item.className"
                    :value="item.classId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <template v-if="isExpand">
              <el-col :span="6">
                <el-form-item label="发起人" prop="createUser">
                  <el-select v-model="queryParams.createUser" placeholder="请选择发起人" clearable>
                    <el-option
                      v-for="item in createUsersList"
                      :key="item.createUser"
                      :label="item.userName"
                      :value="item.createUser"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="考试日期" prop="examDate">
                  <el-date-picker
                    v-model="queryParams.examDate"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD"
                    :disabled-date="disabledDate"
                    @calendar-change="calendarChange"
                  />
                </el-form-item>
              </el-col>
            </template>
          </template>
        </BasicTableSearch>
        <div class="management-search-more">
          <img
            v-if="!isExpand"
            src="@/assets/images/search-expand.png"
            @click="handleExpandEvent"
          />
          <img v-else src="@/assets/images/search-close.png" alt="" @click="handleExpandEvent" />
        </div>
      </el-card>
    </template>
    <template #content>
      <el-card shadow="never" body-class="exam-management-content" class="basic-table-card">
        <div class="exam-management-chart">
          <card-item title="参考人数分析">
            <number-analysis ref="numberAnalysisRef" />
          </card-item>
          <card-item title="成绩分析">
            <score-analysis ref="scoreAnalysisRef" />
          </card-item>
          <card-item title="综合分析">
            <comprehensive-analysis ref="comprehensiveAnalysisRef" />
          </card-item>
        </div>
        <div class="basic-result__content exam-management-table">
          <div class="basic-result__header">
            <div class="basic-result__header--left">
              <div class="left-title">成绩清单</div>
              <div class="left-bar"></div>
            </div>
            <div class="basic-result__header--right">
              <el-input
                v-model="studentUuidValue"
                style="width: 194px; margin-right: 8px"
                placeholder="请输入学生学号或姓名"
                suffix-icon="Search"
                @input="handleStudentUuidSearch"
              />
              <el-button
                :loading="buttonLoading"
                icon="Download"
                class="custom-btn"
                @click="handleScoreExport"
              >
                下载
              </el-button>
            </div>
          </div>
          <el-table v-loading="queryLoading" :data="queryDataList" class="basic-result__table">
            <el-table-column type="index" width="80" label="序号" align="center">
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="考试名称" prop="examName" width="240" />
            <el-table-column label="种类" prop="courseType" width="120" />
            <el-table-column label="类型" prop="courseName" width="240" />
            <el-table-column label="考试说明" prop="examInstruction" width="200" />
            <el-table-column label="授课老师" prop="teacherName" width="180" />
            <el-table-column label="考试班级" prop="className" width="160" />
            <el-table-column label="学号" prop="userUuid" width="160" />
            <el-table-column label="姓名" prop="realName" width="160" />
            <el-table-column label="专业" prop="major" width="120" />
            <el-table-column label="成绩" prop="score" width="100" />
            <el-table-column label="考试时长(mim)" prop="examDuration" width="120" />
            <el-table-column label="考试开始时间" prop="examStartTime" width="230" />
            <el-table-column label="考试结束时间" prop="examEndTime" width="230" />
            <el-table-column fixed="right" label="操作" width="120">
              <template #default="scope">
                <el-button link type="primary" @click="handleViewDetail(scope.row)">
                  查看试卷
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="basic-result__pagination">
            <div class="pagination--tip">共 {{ total }} 条记录</div>
            <el-pagination
              v-model:current-page="pageParams.pageIndex"
              :page-size="pageParams.pageSize"
              background
              :total="total"
              :default-page-size="10"
              layout="sizes, prev, pager, next, jumper"
              :page-sizes="[10, 20, 50, 100]"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </div>
        </div>
      </el-card>
    </template>
  </BasicPageTopBottom>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { debounce } from 'lodash'
import CardItem from './card-item.vue'
import NumberAnalysis from './number-analysis.vue'
import ScoreAnalysis from './score-analysis.vue'
import ComprehensiveAnalysis from './comprehensive-analysis.vue'
import {
  requestSelectDataQry,
  requestExamStudentAnalysis,
  requestScoreRangeAnalysis,
  requestExamScoreAnalysis,
  requestScoreList,
  requestExportScore
} from '@/api/exam/examManagement'

const emit = defineEmits(['view-detail'])

const buttonLoading = ref(false)
const isExpand = ref(false)
function handleExpandEvent() {
  isExpand.value = !isExpand.value
}
const queryParams = ref({
  courseType: '',
  courseId: null,
  examName: '',
  classId: null,
  createUser: '',
  examDate: []
})
const courseTypesList = ref([])
const coursesList = ref([])
const classesList = ref([])
const createUsersList = ref([])

// 获取下拉数据
async function getSelectDataQry() {
  const result = await requestSelectDataQry()
  const { code, response } = result
  if (code === 1) {
    const { courseTypes, classes, createUsers } = response
    courseTypesList.value = courseTypes
    classesList.value = classes
    createUsersList.value = createUsers
  } else {
    courseTypesList.value = []
    classesList.value = []
    createUsersList.value = []
  }
}
function handleCourseTypeChange(val) {
  queryParams.value.courseId = null
  if (val) {
    coursesList.value = courseTypesList.value
      .find((item) => item.courseType === val)
      .courses.map((item) => ({
        courseName: item.courseName,
        courseId: item.courseId
      }))
  } else {
    coursesList.value = []
  }
}
const computedQueryParams = computed(() => {
  return {
    courseType: queryParams.value.courseType,
    courseId: queryParams.value.courseId,
    examName: queryParams.value.examName,
    classId: queryParams.value.classId,
    createUser: queryParams.value.createUser,
    startDate: queryParams.value.examDate?.length ? queryParams.value.examDate[0] : '',
    endDate: queryParams.value.examDate?.length ? queryParams.value.examDate[1] : ''
  }
})

const selectDate = ref(null)
const disabledDate = (time) => {
  if (selectDate.value !== null) {
    const threeMonthsAgo = new Date(selectDate.value)
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    const threeMonthsLater = new Date(selectDate.value)
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3)
    const minTime = threeMonthsAgo.getTime()
    const maxTime = threeMonthsLater.getTime()
    return time.getTime() < minTime || time.getTime() > maxTime
  }
  return false
}
const calendarChange = (obj) => {
  const minDate = obj[0]
  selectDate.value = minDate ? minDate.getTime() : null
}

// 获取参考人数分析
const numberAnalysisRef = ref(null)
async function getNumberAnalysis() {
  const params = {
    ...computedQueryParams.value
  }
  const result = await requestExamStudentAnalysis(params)
  const { code, response } = result
  if (code === 1) {
    numberAnalysisRef.value?.setChartData(response)
  } else {
    numberAnalysisRef.value?.setChartData({})
  }
}
// 获取成绩分析
const scoreAnalysisRef = ref(null)
async function getScoreAnalysis() {
  const params = {
    ...computedQueryParams.value
  }
  const result = await requestScoreRangeAnalysis(params)
  const { code, response } = result
  if (code === 1) {
    scoreAnalysisRef.value?.setChartData(response)
  } else {
    scoreAnalysisRef.value?.setChartData([])
  }
}
// 获取综合分析
const comprehensiveAnalysisRef = ref(null)
async function getComprehensiveAnalysis() {
  const params = {
    ...computedQueryParams.value
  }
  const result = await requestExamScoreAnalysis(params)
  const { code, response } = result
  if (code === 1) {
    comprehensiveAnalysisRef.value?.setAnalysisData(response)
  } else {
    comprehensiveAnalysisRef.value?.setAnalysisData([])
  }
}

// 获取发起考试
const queryDataList = ref([])
const queryLoading = ref(false)
const pageParams = ref({
  pageIndex: 1,
  pageSize: 10
})
const total = ref(0)
async function getScoreList() {
  queryLoading.value = true
  const params = {
    studentUuidOrName: studentUuidValue.value,
    ...computedQueryParams.value,
    ...pageParams.value
  }
  const result = await requestScoreList(params)
  queryLoading.value = false
  const { code, response } = result
  if (code === 1) {
    const { list, total: listTotal } = response
    queryDataList.value = list
    total.value = listTotal
  } else {
    queryDataList.value = []
    total.value = 0
  }
}
function handleSearch() {
  pageParams.value.pageIndex = 1
  getAllPageData()
}
function handleReset() {
  queryParams.value = {
    courseType: '',
    courseId: null,
    examName: '',
    classId: null,
    createUser: '',
    examDate: []
  }
  pageParams.value.pageIndex = 1
  getAllPageData()
}
function handleCurrentChange(val) {
  pageParams.value.pageIndex = val
  getScoreList()
}
function handleSizeChange(val) {
  pageParams.value.pageIndex = 1
  pageParams.value.pageSize = val
  getScoreList()
}
const studentUuidValue = ref('')
const handleStudentUuidSearch = debounce((value) => {
  getScoreList()
}, 500)
async function handleScoreExport() {
  try {
    const params = {
      ...computedQueryParams.value
    }
    buttonLoading.value = true
    const result = await requestExportScore(params)
    const a = window.document.createElement('a')
    const downUrl = window.URL.createObjectURL(result)
    a.href = downUrl
    a.download = '学生考试成绩列表.xlsx'
    a.click()
    window.URL.revokeObjectURL(downUrl)
    buttonLoading.value = false
  } catch (error) {
    buttonLoading.value = false
    console.log('handleScoreExport error', error)
  }
}
function handleViewDetail(row) {
  emit('view-detail', row)
}

function getAllPageData() {
  getNumberAnalysis()
  getScoreAnalysis()
  getComprehensiveAnalysis()
  getScoreList()
}
onMounted(() => {
  getSelectDataQry()
  getAllPageData()
})
</script>

<style lang="scss" scoped>
:deep(.el-card) {
  background-color: #f8f8f8;
  border: none;
}
.basic-result__header {
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  &--right {
    .custom-btn {
      --el-button-border-color: #dcdcdc;
      --el-button-bg-color: #f8f8f8;
      --el-button-text-color: #7d7d7d;
    }
    .danger-btn {
      --el-button-bg-color: #f8f8f8;
    }
  }
}
.management-search-more {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  img {
    width: 32px;
    height: 16px;
    cursor: pointer;
  }
}
.exam-management-chart {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  height: 300px;
  width: 100%;
}
.exam-management-table {
  display: flex;
  flex-direction: column;
  .basic-result__table {
    flex: 1;
  }
  .basic-result__pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    .pagination--tip {
      width: 203px;
      font-weight: 400;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
      line-height: 22px;
    }
  }
}
</style>
<style lang="scss">
.exam-management-search {
  padding: 24px;
  position: relative;
}
.exam-management-content {
  padding: 24px;
  overflow-y: auto;
}
</style>
