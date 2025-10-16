<template>
  <BasicPageTopBottom :marginGap="1">
    <template #top>
      <el-card shadow="never" body-class="practical-teaching-search">
        <BasicTableSearch
          ref="queryRef"
          labelWidth="64"
          :queryParams="queryParams"
          :handleSearch="handleSearch"
          :handleReset="handleReset"
        >
          <template #searchItems>
            <el-col :span="6">
              <el-form-item label="软件名称" prop="courseId">
                <el-select v-model="queryParams.courseId" placeholder="请选择软件名称" clearable>
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
      <el-card shadow="never" body-class="practical-teaching-list" class="basic-table-card">
        <div class="height-100 basic-result">
          <div class="basic-result__header">
            <div class="basic-result__header--left">
              <div class="left-title">实训信息</div>
              <div class="left-bar"></div>
            </div>
            <div class="basic-result__header--right">
              <el-button
                :loading="buttonLoading"
                class="custom-btn"
                icon="Download"
                @click="handlePracticalDownload"
              >
                下载
              </el-button>
            </div>
          </div>
          <div v-if="queryDataList.length > 0" v-loading="contentLoading" class="basic-result__body">
            <template v-for="(item, index) in queryDataList" :key="index">
              <practical-item :practicalInfo="item" @practical-detail="loadPracticalDetail(item)" />
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
import PracticalItem from './practical-item.vue'
import {
  requestSelectDataQry,
  requestPracticalPage,
  requestPracticalTeaching,
  requestExportPractical
} from '@/api/practical/practicalTeaching'

const emit = defineEmits(['view-detail'])
const buttonLoading = ref(false)
const contentLoading = ref(false)
const queryParams = ref({
  courseId: '',
  teacherUuid: ''
})
const courseList = ref([])
const teacherList = ref([])
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

const queryDataList = ref([])
const pageParams = ref({
  pageIndex: 1,
  pageSize: 9
})
const total = ref(0)
// 获取实训列表
async function getPracticalTeaching() {
  const params = {
    ...queryParams.value,
    ...pageParams.value
  }
  contentLoading.value = true
  const result = await requestPracticalPage(params)
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
function handleSearch() {
  pageParams.value.pageIndex = 1
  getPracticalTeaching()
}
function handleReset() {
  queryParams.value = {
    courseId: '',
    teacherUuid: ''
  }
  pageParams.value.pageIndex = 1
  getPracticalTeaching()
}
function handleCurrentChange(val) {
  pageParams.value.pageIndex = val
  getPracticalTeaching()
}
function handleSizeChange(val) {
  pageParams.value.pageIndex = 1
  pageParams.value.pageSize = val
  getPracticalTeaching()
}
// 下载实训列表
async function handlePracticalDownload() {
  try {
    const params = {
      ...queryParams.value
    }
    buttonLoading.value = true
    const result = await requestExportPractical(params)
    const a = window.document.createElement('a')
    const downUrl = window.URL.createObjectURL(result)
    a.href = downUrl
    a.download = '实训列表.xlsx'
    a.click()
    window.URL.revokeObjectURL(downUrl)
    buttonLoading.value = false
  } catch (error) {
    buttonLoading.value = false
    console.log('handleStudentExport error', error)
  }
}
// 查看实训详情
function loadPracticalDetail(item) {
  const { courseId, classId } = item
  requestPracticalTeaching({ courseId, classId })
  emit('view-detail', item)
}

onMounted(() => {
  getSelectDataQry()
  getPracticalTeaching()
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
.practical-teaching-search {
  padding: 24px;
}
.practical-teaching-list {
  padding: 10px 24px 24px 24px
}
</style>
