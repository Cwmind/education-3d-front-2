<template>
  <BasicPageTopBottom :marginGap="1">
    <template #top>
      <el-card shadow="never" body-class="course-center-search">
        <BasicTableSearch
          ref="queryRef"
          labelWidth="64"
          :queryParams="queryParams"
          :handleSearch="handleSearch"
          :handleReset="handleReset"
        >
          <template #searchItems>
            <el-col :span="6">
              <el-form-item label="课程名称" prop="courseId">
                <el-select v-model="queryParams.courseId" placeholder="请选择课程名称" clearable>
                  <el-option
                    v-for="item in courseList"
                    :key="item.courseId"
                    :label="item.courseName"
                    :value="item.courseId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="授课老师" prop="teacherUuid">
                <el-select v-model="queryParams.teacherUuid" placeholder="请选择授课老师" clearable>
                  <el-option
                    v-for="item in teacherList"
                    :key="item.teacherUuid"
                    :label="item.teacherName"
                    :value="item.teacherUuid"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </template>
        </BasicTableSearch>
      </el-card>
    </template>
    <template #content>
      <el-card shadow="never" body-class="course-center-list" class="basic-table-card">
        <div class="height-100 basic-result">
          <div class="basic-result__header">
            <div class="basic-result__header--left">
              <div class="left-title">课程信息</div>
              <div class="left-bar"></div>
            </div>
            <div class="basic-result__header--right">
              <el-button
                :loading="buttonLoading"
                class="custom-btn"
                icon="Download"
                @click="handleCourseDownload"
              >
                下载
              </el-button>
            </div>
          </div>
          <div
            v-if="queryDataList.length > 0"
            v-loading="contentLoading"
            class="basic-result__body"
          >
            <template v-for="item in queryDataList" :key="item">
              <course-item :courseInfo="item" @course-detail="loadCourseDetail(item)" />
            </template>
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
import { ref, onMounted } from 'vue'
import CourseItem from './course-item.vue'
import {
  requestSelectDataQry,
  requestCoursePage,
  requestExportCourse,
  requestCourseTeaching
} from '@/api/course/courseCenter'

const emit = defineEmits(['view-detail'])

const buttonLoading = ref(false)
const contentLoading = ref(false)
const queryParams = ref({
  courseId: '',
  teacherUuid: ''
})
const courseList = ref([])
const teacherList = ref([])
const queryDataList = ref([])
const pageParams = ref({
  pageIndex: 1,
  pageSize: 9
})
const total = ref(0)
// 获取下拉数据
async function getSelectDataQry() {
  const result = await requestSelectDataQry()
  const { code, response } = result
  if (code === 1) {
    courseList.value = response.courseList
    teacherList.value = response.teacherList
  } else {
    courseList.value = []
    teacherList.value = []
  }
}
// 查询课程列表
async function getCourseCenterList() {
  const params = {
    ...queryParams.value,
    ...pageParams.value
  }
  contentLoading.value = true
  const result = await requestCoursePage(params)
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
}
// 搜索课程信息
function handleSearch() {
  pageParams.value.pageIndex = 1
  getCourseCenterList()
}
function handleReset() {
  queryParams.value = {
    courseId: '',
    teacherUuid: ''
  }
  pageParams.value.pageIndex = 1
  getCourseCenterList()
}
function handleCurrentChange(val) {
  pageParams.value.pageIndex = val
  getCourseCenterList()
}
function handleSizeChange(val) {
  pageParams.value.pageIndex = 1
  pageParams.value.pageSize = val
  getCourseCenterList()
}
// 导出课程列表
async function handleCourseDownload() {
  try {
    buttonLoading.value = true
    const params = {
      ...queryParams.value
    }
    const result = await requestExportCourse(params)
    const a = window.document.createElement('a')
    const downUrl = window.URL.createObjectURL(result)
    a.href = downUrl
    a.download = '课程列表.xlsx'
    a.click()
    window.URL.revokeObjectURL(downUrl)
    buttonLoading.value = false
  } catch (error) {
    buttonLoading.value = false
    console.log('handleCourseDownload error', error)
  }
}
// 查看课程详情
function loadCourseDetail(item) {
  const { courseId, classId } = item
  requestCourseTeaching({ courseId, classId })
  emit('view-detail', item)
}

onMounted(() => {
  getSelectDataQry()
  getCourseCenterList()
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
.basic-result__body {
  flex: 1;
  overflow: auto;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  place-items: center;
  align-content: baseline;
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
.course-center-search {
  padding: 24px;
}
.course-center-list {
  padding: 10px 24px 24px 24px;
}
</style>
