<template>
  <div class="question-bank-info">
    <BasicPageTopBottom :marginGap="1">
      <template #top>
        <el-card shadow="never" body-class="question-search">
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
                <el-form-item label="试题类型" prop="questionType">
                  <el-select
                    v-model="queryParams.questionType"
                    placeholder="请选择试题类型"
                    clearable
                  >
                    <el-option
                      v-for="item in questionTypesList"
                      :key="item.questionType"
                      :label="item.questionTypeName"
                      :value="item.questionType"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="试题来源" prop="source">
                  <el-select v-model="queryParams.source" placeholder="请选择试题来源" clearable>
                    <el-option
                      v-for="item in sourcesList"
                      :key="item.source"
                      :label="item.sourceName"
                      :value="item.source"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <template v-if="isExpand">
                <el-col :span="12">
                  <el-form-item label="题干" prop="topic">
                    <el-input
                      v-model="queryParams.topic"
                      placeholder="请输入题干"
                      suffix-icon="Search"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="创建者" prop="createUser">
                    <el-select
                      v-model="queryParams.createUser"
                      placeholder="请选择创建者"
                      clearable
                    >
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
          <div class="question-search-more">
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
        <el-card shadow="never" body-class="question-table" class="basic-table-card">
          <div class="height-100 basic-result">
            <div class="basic-result__header">
              <div class="basic-result__header--left">
                <div class="left-title">题库信息</div>
                <div class="left-bar"></div>
              </div>
              <div v-hasRole="TEACHER" class="basic-result__header--right">
                <el-button
                  :loading="buttonLoading"
                  type="primary"
                  icon="Plus"
                  @click="handleQuestionBankAdd"
                >
                  新增
                </el-button>
                <el-button
                  :loading="buttonLoading"
                  class="custom-btn"
                  icon="Upload"
                  @click="handleQuestionBankImport"
                >
                  导入
                </el-button>
                <el-button
                  :loading="buttonLoading"
                  class="custom-btn"
                  icon="Download"
                  @click="handleQuestionBankDownload"
                >
                  下载
                </el-button>
              </div>
            </div>
            <el-table v-loading="queryLoading" :data="queryDataList" height="100%">
              <el-table-column type="index" width="80" label="序号" align="center">
                <template #default="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column label="种类" prop="courseTypeName" width="120" />
              <el-table-column label="类型" prop="courseName" width="240" />
              <el-table-column label="试题类型" prop="questionTypeName" width="100" />
              <el-table-column label="题干" prop="topic" width="280" />
              <el-table-column label="所属工艺/章节" prop="labelList" width="240">
                <template #default="scope">
                  <el-tag
                    v-for="item in scope.row.labelList"
                    :key="item"
                    style="margin-right: 8px; margin-bottom: 4px"
                  >
                    {{ item }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="试题来源" prop="sourceName" width="120" />
              <el-table-column label="创建者" prop="createUser" width="180" />
              <el-table-column label="创建日期" prop="createTime" width="160" />
              <el-table-column label="最后修改者" prop="updateUser" width="180" />
              <el-table-column label="最后修改日期" prop="updateTime" width="160" />
              <el-table-column fixed="right" label="操作" min-width="120">
                <template #default="scope">
                  <el-button link type="primary" @click="handleQuestionBankDetail(scope.row)">
                    预览
                  </el-button>
                  <el-popover
                    popper-class="more-btn-popover"
                    effect="dark"
                    placement="bottom"
                    :width="100"
                    :offset="6"
                  >
                    <template #reference>
                      <el-button v-if="scope.row.source === 2" v-hasRole="TEACHER" link>
                        更多
                      </el-button>
                    </template>
                    <div class="more-btn">
                      <div class="more-btn__item" @click="handleQuestionBankEdit(scope.row)">
                        编辑
                      </div>
                      <div
                        class="more-btn__item item--danger"
                        @click="handleQuestionBankDelete(scope.row)"
                      >
                        删除
                      </div>
                    </div>
                  </el-popover>
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
      <question-bank-drawer ref="questionBankDrawerRef" @refresh-list="handleRefreshList" />
      <question-bank-detail ref="questionBankDetailRef" />
      <question-bank-import ref="questionBankImportRef" @refresh-list="handleRefreshList" />
    </BasicPageTopBottom>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { TEACHER } from '@/config/rolesConfig'
import { ElMessage, ElMessageBox } from 'element-plus'
import QuestionBankDrawer from './components/question-bank-drawer.vue'
import QuestionBankDetail from './components/question-bank-detail.vue'
import questionBankImport from './components/question-bank-import.vue'
import {
  requestQuestionBankList,
  requestSelectDataQry,
  requestQuestionBankDelete,
  requestExportQuestionBank
} from '@/api/questionBank/questionBankInfo'

const isExpand = ref(false)
const buttonLoading = ref(false)
function handleExpandEvent() {
  isExpand.value = !isExpand.value
}

const queryParams = ref({
  courseType: '',
  courseId: '',
  questionType: '',
  source: '',
  topic: '',
  createUser: ''
})
const courseTypesList = ref([])
const coursesList = ref([])
const questionTypesList = ref([])
const sourcesList = ref([])
const createUsersList = ref([])
// 获取下拉数据
async function getSelectDataQry() {
  const result = await requestSelectDataQry()
  const { code, response } = result
  if (code === 1) {
    const { courseTypes, questionTypes, sources, createUsers } = response
    courseTypesList.value = courseTypes
    questionTypesList.value = questionTypes
    sourcesList.value = sources
    createUsersList.value = createUsers
  } else {
    courseTypesList.value = []
    questionTypesList.value = []
    sourcesList.value = []
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

// table数据
const queryDataList = ref([])
const queryLoading = ref(false)
const pageParams = ref({
  pageIndex: 1,
  pageSize: 10
})
const total = ref(0)
async function getQuestionBankList() {
  try {
    queryLoading.value = true
    const params = {
      ...queryParams.value,
      ...pageParams.value
    }
    console.log('getQuestionBankList params', params)
    const result = await requestQuestionBankList(params)
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
    console.log('getQuestionBankList', error)
  }
}
// 重置按钮
function handleReset() {
  queryParams.value = {
    courseType: '',
    courseId: '',
    questionType: '',
    source: '',
    topic: '',
    createUser: ''
  }
  pageParams.value.pageIndex = 1
  getQuestionBankList()
}
// 查询按钮
function handleSearch() {
  pageParams.value.pageIndex = 1
  getQuestionBankList()
}
function handleCurrentChange(val) {
  pageParams.value.pageIndex = val
  getQuestionBankList()
}
function handleSizeChange(val) {
  pageParams.value.pageIndex = 1
  pageParams.value.pageSize = val
  getQuestionBankList()
}
function handleRefreshList() {
  pageParams.value.pageIndex = 1
  getQuestionBankList()
}
const questionBankDetailRef = ref()
// 试题详情
function handleQuestionBankDetail(row) {
  questionBankDetailRef.value.openDrawer(row)
}
const questionBankDrawerRef = ref()
function handleQuestionBankAdd() {
  questionBankDrawerRef.value.openDrawer()
}
function handleQuestionBankEdit(row) {
  questionBankDrawerRef.value.openDrawer(row)
}
function handleQuestionBankDelete(row) {
  ElMessageBox.confirm('确定删除该试题吗？', '删除试题信息').then(async () => {
    const result = await requestQuestionBankDelete(row.questionId)
    const { code } = result
    if (code === 1) {
      ElMessage.success('删除成功')
      handleRefreshList()
    } else {
      ElMessage.error(result.message)
    }
  })
}
// 试题导入
const questionBankImportRef = ref()
function handleQuestionBankImport() {
  questionBankImportRef.value.openDialog()
}
// 试题导出
async function handleQuestionBankDownload() {
  try {
    const params = {
      ...queryParams.value
    }
    buttonLoading.value = true
    const result = await requestExportQuestionBank(params)
    const a = window.document.createElement('a')
    const downUrl = window.URL.createObjectURL(result)
    a.href = downUrl
    a.download = '试题列表.xlsx'
    a.click()
    window.URL.revokeObjectURL(downUrl)
    buttonLoading.value = false
  } catch (error) {
    buttonLoading.value = false
    console.log('handleQuestionBankDownload error', error)
  }
}

onMounted(() => {
  getSelectDataQry()
  getQuestionBankList()
})
</script>

<style lang="scss" scoped>
.question-bank-info {
  width: 100%;
  height: 100%;
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
  .question-search-more {
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
}
:deep(.el-card) {
  background-color: #f8f8f8;
  border: none;
}
</style>
<style lang="scss">
.question-search {
  padding: 24px;
  position: relative;
}
.question-table {
  padding: 10px 24px 24px 24px;
}
.more-btn-popover {
  min-width: 100px !important;
  padding: 0 !important;
  line-height: normal !important;
  .more-btn {
    padding: 8px;
    &__item {
      width: 84px;
      height: 32px;
      border-radius: 6px;
      font-weight: 400;
      font-size: 14px;
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding-left: 8px;
      &:hover {
        background: #5f5f5f;
      }
    }
    .item--danger {
      color: #ff4444;
    }
  }
}
</style>
