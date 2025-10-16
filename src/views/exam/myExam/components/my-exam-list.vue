<template>
  <BasicPageTopBottom :marginGap="1">
    <template #top>
      <el-card shadow="never" body-class="my-exam-search">
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
              <el-form-item label="分数" prop="scoreLevel">
                <el-select v-model="queryParams.scoreLevel" placeholder="请选择类型" clearable>
                  <el-option
                    v-for="item in scoreLevelOption"
                    :key="item.itemKey"
                    :label="item.itemName"
                    :value="item.itemKey"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="考试时间" prop="examDate">
                <el-date-picker
                  v-model="queryParams.examDate"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD"
                  :disabled-date="disabledDate"
                />
              </el-form-item>
            </el-col>
          </template>
        </BasicTableSearch>
      </el-card>
    </template>
    <template #content>
      <el-card shadow="never" body-class="my-exam-list" class="basic-table-card">
        <div class="height-100 basic-result">
          <div
            v-if="queryDataList.length > 0"
            v-loading="contentLoading"
            class="basic-result__body"
          >
            <div v-for="item in queryDataList" :key="item.examId" class="basic-result__body__item">
              <div class="item-left">
                <div v-if="computedExamState(item)" class="item-left__score">
                  <div :class="computedScoreClass(item)">
                    <span class="item-left__score__label">{{ item.score }}</span>
                    <span class="item-left__score__unit">分</span>
                  </div>
                  <div v-if="item.rank" class="item-left__score__rank">第{{ item.rank }}名</div>
                </div>
                <div v-else class="item-left__label">
                  {{ item.label }}
                </div>
              </div>
              <div class="item-right">
                <div class="item-right__courseName">
                  {{ item.courseName }}
                </div>
                <div v-if="computedExamState(item)" class="item-right__info">
                  <span class="exam-item">{{ item.label }}</span>
                  <span>{{ item.submitTime }}</span>
                </div>
                <div v-else class="item-right__info">
                  <span v-if="item.examTime" class="exam-item">{{ item.examTime }}</span>
                  <span v-else class="exam-item">立即考试</span>
                  <span>授课老师：{{ item.teacherName }}</span>
                </div>
                <div class="item-right__btn">
                  <el-button
                    v-if="computedExamState(item)"
                    type="primary"
                    @click="handleViewDetail(item, 'detail')"
                  >
                    查看详情
                  </el-button>
                  <el-button v-else type="primary" @click="handleViewDetail(item, 'start')">
                    开始考试
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <BasicNoData v-else />
          <div class="basic-result__pagination">
            <div class="pagination--tip">共 {{ total }} 条记录</div>
            <el-pagination
              v-model:current-page="pageParams.pageIndex"
              :page-size="pageParams.pageSize"
              background
              :total="total"
              :default-page-size="9"
              layout="sizes, prev, pager, next, jumper"
              :page-sizes="[9, 18, 45, 90]"
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
import { ref } from 'vue'
import { ElMessage, dayjs } from 'element-plus'
import getScoreLevelOption from '@/hooks/scoreLevelOption'
import { requestSelectDataQry, requestExamPaperList } from '@/api/exam/myExam'

const emit = defineEmits(['view-detail'])
const contentLoading = ref(false)
const { scoreLevelOption } = getScoreLevelOption()
const queryParams = ref({
  courseType: '',
  courseId: '',
  examDate: [],
  scoreLevel: ''
})
const courseTypesList = ref([])
const coursesList = ref([])
const disabledDate = (time) => {
  return time.getTime() > Date.now()
}
// 获取下拉数据
async function getSelectDataQry() {
  const result = await requestSelectDataQry()
  const { code, response } = result
  if (code === 1) {
    const { courseTypes } = response
    courseTypesList.value = courseTypes
  } else {
    courseTypesList.value = []
  }
}
function handleCourseTypeChange(val) {
  queryParams.value.courseId = ''
  coursesListFilter(val)
}
function coursesListFilter(val) {
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

const queryDataList = ref([])
const pageParams = ref({
  pageIndex: 1,
  pageSize: 9
})
const total = ref(0)
const computedQueryParams = computed(() => {
  return {
    courseType: queryParams.value.courseType,
    courseId: queryParams.value.courseId,
    scoreLevel: Number(queryParams.value.scoreLevel),
    startDate: queryParams.value.examDate?.length ? queryParams.value.examDate[0] : '',
    endDate: queryParams.value.examDate?.length ? queryParams.value.examDate[1] : ''
  }
})
const computedExamState = computed(() => {
  return (item) => {
    return item.score || item.score === 0
  }
})
const computedScoreClass = computed(() => {
  return (item) => {
    if (item.score >= 90) {
      return 'score-level--A'
    } else {
      return 'score-level--B'
    }
  }
})
// 获取我的考试列表
async function getExamPaperList() {
  try {
    const params = {
      ...computedQueryParams.value,
      ...pageParams.value
    }
    contentLoading.value = true
    const result = await requestExamPaperList(params)
    contentLoading.value = false
    const { code, response } = result
    if (code === 1) {
      const { list, total: listTotal } = response
      queryDataList.value = list
      total.value = listTotal
    } else {
      queryDataList.value = []
      total.value = 0
    }
  } catch (error) {
    contentLoading.value = false
    queryDataList.value = []
    total.value = 0
  }
}
// 重置筛选条件
function handleReset() {
  queryParams.value = {
    courseType: '',
    courseId: '',
    examDate: [],
    scoreLevel: ''
  }
  pageParams.value.pageIndex = 1
  getExamPaperList()
}
// 点击搜索按钮
function handleSearch() {
  pageParams.value.pageIndex = 1
  getExamPaperList()
}
// 分页
function handleCurrentChange(val) {
  pageParams.value.pageIndex = val
  getExamPaperList()
}
function handleSizeChange(val) {
  pageParams.value.pageIndex = 1
  pageParams.value.pageSize = val
  getExamPaperList()
}
// 跳转考试详情
function handleViewDetail(detail, type) {
  if (type === 'start') {
    const { examTime } = detail
    if (new Date(examTime) > new Date()) {
      ElMessage.error('未到考试时间')
      return
    }
  }
  emit('view-detail', { detail: detail, type })
}
// 初始化筛选条件
async function initQueryParams(params) {
  await getSelectDataQry()
  coursesListFilter(params.courseType)
  queryParams.value.courseType = params.courseType
  queryParams.value.courseId = params.courseId
  queryParams.value.examDate = [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
  getExamPaperList()
}
onMounted(() => {
  if (history.state?.params) {
    initQueryParams(history.state.params)
    delete history.state.params
  } else {
    getSelectDataQry()
    getExamPaperList()
  }
})
</script>

<style lang="scss" scoped>
:deep(.el-card) {
  background-color: #f8f8f8;
  border: none;
}
.basic-result__header {
  width: 100%;
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
.basic-result__body {
  flex: 1;
  overflow: auto;
  width: 100%;
  display: grid;
  align-content: baseline;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  &__item {
    height: 200px;
    background: #ffffff;
    border-radius: 4px;
    padding: 30px 32px 30px 37px;
    display: flex;
    .item-left {
      width: 140px;
      height: 140px;
      background-image: url('@/assets/images/exam/exam-item-bg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center;
      margin-right: 24px;
      display: flex;
      justify-content: center;
      .item-left__label {
        width: 88px;
        text-align: center;
        padding-top: 60px;
        font-weight: 400;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.7);
        line-height: 24px;
      }
      .item-left__score {
        padding-top: 42px;
        padding-bottom: 27px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        .item-left__score__label {
          font-weight: bold;
          font-size: 32px;
        }
        .item-left__score__unit {
          font-weight: 500;
          font-size: 16px;
        }
        .score-level--A {
          color: #38a70e;
        }
        .score-level--B {
          color: #ff875c;
        }
        .item-left__score__rank {
          font-weight: 500;
          font-size: 16px;
          color: rgba(0, 0, 0, 0.5);
        }
      }
    }
    .item-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .item-right__courseName {
        font-weight: 500;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.8);
        line-height: 20px;
        margin-top: 10px;
      }
      .item-right__info {
        font-weight: 500;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.4);
        line-height: 18px;
        .exam-item {
          margin-right: 16px;
        }
      }
      .item-right__btn {
        :deep(.el-button--primary) {
          width: 96px;
          border-radius: 4px;
        }
      }
    }
  }
}
.basic-result__pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .pagination--tip {
    width: 203px;
    font-weight: 400;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    line-height: 22px;
  }
}
</style>
<style lang="scss">
.my-exam-search {
  padding: 24px;
}
.my-exam-list {
  padding: 24px;
}
</style>
