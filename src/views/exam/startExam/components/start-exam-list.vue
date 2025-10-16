<template>
  <BasicPageTopBottom :marginGap="1">
    <template #top>
      <el-card shadow="never" body-class="start-exam-search">
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
                <el-select v-model="queryParams.courseId" placeholder="请选择种类" clearable>
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
            </template>
          </template>
        </BasicTableSearch>
        <div class="exam-search-more">
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
      <el-card shadow="never" body-class="start-exam-table" class="basic-table-card">
        <div class="height-100 basic-result">
          <div class="basic-result__header">
            <div class="basic-result__header--left">
              <div class="left-title">发起考试</div>
              <div class="left-bar"></div>
            </div>
            <div v-hasRole="TEACHER" class="basic-result__header--right">
              <el-button type="primary" icon="Plus" @click="handleStartExamAdd">新增</el-button>
            </div>
          </div>
          <el-table v-loading="queryLoading" :data="queryDataList" height="100%">
            <el-table-column type="index" width="80" label="序号" align="center">
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="考试名称" prop="examName" width="240" />
            <el-table-column label="种类" prop="courseType" width="120" />
            <el-table-column label="类型" prop="courseName" width="240" />
            <el-table-column label="考试说明" prop="examInstruction" width="200" />
            <el-table-column label="考试班级" prop="className" width="160" />
            <el-table-column label="发起人" prop="createUser" width="140" />
            <el-table-column label="限时" prop="timeLimit" width="120" />
            <el-table-column label="考试工艺/章节" prop="label" width="140">
              <template #default="scope">
                <el-tag>{{ scope.row.label }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="考试时间" prop="examTime" width="160" />
            <el-table-column label="试题所属工艺/章节" prop="labelList" width="140">
              <template #default="scope">
                <el-tag>{{ scope.row.labelList }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="组卷规则" prop="specificRules" width="180">
              <template #default="scope">
                <span>{{ computedSpecificRules(scope.row.specificRules) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="发起时间" prop="createTime" width="160" />
            <el-table-column fixed="right" label="操作" width="120">
              <template #default="scope">
                <el-button link type="primary" @click="handleExamDetail(scope.row)">
                  详情
                </el-button>
                <el-button
                  v-hasRole="TEACHER"
                  link
                  type="danger"
                  @click="handleExamDelete(scope.row)"
                >
                  删除
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
    <start-exam-drawer ref="startExamDrawerRef" @refresh-list="handleRefreshList" />
  </BasicPageTopBottom>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { TEACHER } from '@/config/rolesConfig'
import { ElMessage, ElMessageBox } from 'element-plus'
import StartExamDrawer from './start-exam-drawer.vue'
import { requestStartExamList, requestSelectDataQry, requestExamDelete } from '@/api/exam/startExam'

const emit = defineEmits(['view-detail'])

const isExpand = ref(false)
function handleExpandEvent() {
  isExpand.value = !isExpand.value
}
const queryParams = ref({
  courseType: '',
  courseId: '',
  examName: '',
  classId: '',
  createUser: ''
})
const courseTypesList = ref([])
const coursesList = ref([])
const classesList = ref([])
const createUsersList = ref([])

const computedSpecificRules = computed(() => {
  return (specificRules) => {
    let rules = ''
    if (specificRules?.length > 0) {
      specificRules.forEach(item => {
        const { userName, questionType, num } = item
        if (questionType === 1) {
          rules += `来自${userName}单选题${num}题，`
        } else if (questionType === 2) {
          rules += `来自${userName}多选题${num}题，`
        }
      })
    }
    return rules.slice(0, -1)
  }
})

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
  queryParams.value.courseId = ''
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
const queryLoading = ref(false)
const pageParams = ref({
  pageIndex: 1,
  pageSize: 10
})
const total = ref(0)
async function getStartExamList() {
  try {
    queryLoading.value = true
    const params = {
      ...queryParams.value,
      ...pageParams.value,
      qrySource: 'ksgl'
    }
    const result = await requestStartExamList(params)
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
  } catch (error) {
    queryLoading.value = false
    queryDataList.value = []
    total.value = 0
    console.log('getStartExamList error', error)
  }
}
function handleReset() {
  queryParams.value = {
    courseType: '',
    courseId: '',
    examName: '',
    classId: '',
    createUser: ''
  }
  pageParams.value.pageIndex = 1
  getStartExamList()
}
function handleSearch() {
  pageParams.value.pageIndex = 1
  getStartExamList()
}
function handleCurrentChange(val) {
  pageParams.value.pageIndex = val
  getStartExamList()
}
function handleSizeChange(val) {
  pageParams.value.pageIndex = 1
  pageParams.value.pageSize = val
  getStartExamList()
}
function handleRefreshList() {
  pageParams.value.pageIndex = 1
  getSelectDataQry()
  getStartExamList()
}

const startExamDrawerRef = ref()
function handleStartExamAdd() {
  startExamDrawerRef.value.openDrawer()
}
function handleExamDetail(row) {
  emit('view-detail', row)
}
function handleExamDelete(row) {
  ElMessageBox.confirm('确定删除该考试记录吗？', '删除考试信息').then(async () => {
    const result = await requestExamDelete(row.id)
    const { code } = result
    if (code === 1) {
      ElMessage.success('删除成功')
      handleRefreshList()
    } else {
      ElMessage.warning(result.message)
    }
  })
}

onMounted(() => {
  getSelectDataQry()
  getStartExamList()
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
.exam-search-more {
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
.start-exam-search {
  padding: 24px;
  position: relative;
}
.start-exam-table {
  padding: 10px 24px 24px 24px;
}
</style>
