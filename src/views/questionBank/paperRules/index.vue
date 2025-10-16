<template>
  <div class="paper-rules">
    <BasicPageTopBottom :marginGap="1">
      <template #top>
        <el-card shadow="never" body-class="paper-rules-search">
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
                <el-form-item label="规则名称" prop="ruleName">
                  <el-input v-model="queryParams.ruleName" placeholder="请输入规则名称" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="试题来源" prop="source">
                  <el-select v-model="queryParams.source" placeholder="请选择规则来源" clearable>
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
          <div class="rules-search-more">
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
        <el-card shadow="never" body-class="paper-rules-table" class="basic-table-card">
          <div class="height-100 basic-result">
            <div class="basic-result__header">
              <div class="basic-result__header--left">
                <div class="left-title">组卷规则</div>
                <div class="left-bar"></div>
              </div>
              <div v-hasRole="TEACHER" class="basic-result__header--right">
                <el-button type="primary" icon="Plus" @click="handlePaperRulesAdd">新增</el-button>
              </div>
            </div>
            <el-table v-loading="queryLoading" :data="queryDataList" height="100%">
              <el-table-column type="index" width="80" label="序号" align="center">
                <template #default="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column label="种类" prop="courseTypeName" width="120" />
              <el-table-column label="类型" prop="courseName" min-width="290" />
              <el-table-column label="规则名称" prop="ruleName" width="200" />
              <el-table-column label="规则来源" prop="source" width="160" />
              <el-table-column label="标签" prop="labelList" width="140">
                <template #default="scope">
                  <el-tag>{{ scope.row.label }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="创建者" prop="createUser" width="180" />
              <el-table-column label="创建日期" prop="createTime" width="160" />
              <el-table-column label="最后修改者" prop="updateUser" width="180" />
              <el-table-column label="最后修改日期" prop="updateTime" width="160" />
              <el-table-column v-hasRole="TEACHER" fixed="right" label="操作" min-width="120">
                <template #default="scope">
                  <el-button
                    v-if="scope.row.source === '人工创建'"
                    link
                    type="primary"
                    @click="handlePaperRulesEdit(scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    v-if="scope.row.source === '人工创建'"
                    link
                    type="danger"
                    @click="handlePaperRulesDelete(scope.row)"
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
      <paper-rules-drawer ref="paperRulesDrawerRef" @refresh-list="handleRefreshList" />
    </BasicPageTopBottom>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { TEACHER } from '@/config/rolesConfig'
import { ElMessage, ElMessageBox } from 'element-plus'
import PaperRulesDrawer from './components/paper-rules-drawer.vue'
import {
  requestPaperRuleList,
  requestConditionDataQry,
  requestPaperRuleDelete
} from '@/api/questionBank/paperRules'

const isExpand = ref(false)
function handleExpandEvent() {
  isExpand.value = !isExpand.value
}
const queryParams = ref({
  courseType: '',
  courseId: '',
  ruleName: '',
  source: '',
  createUser: ''
})
const courseTypesList = ref([])
const coursesList = ref([])
const sourcesList = ref([])
const createUsersList = ref([])

async function getConditionDataQry() {
  const result = await requestConditionDataQry()
  const { code, response } = result
  if (code === 1) {
    const { courseTypes, sources, createUsers } = response
    courseTypesList.value = courseTypes
    sourcesList.value = sources
    createUsersList.value = createUsers
  } else {
    courseTypesList.value = []
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

const queryDataList = ref([])
const queryLoading = ref(false)
const pageParams = ref({
  pageIndex: 1,
  pageSize: 10
})
const total = ref(0)

async function getPaperRulesList() {
  try {
    queryLoading.value = true
    const params = {
      ...queryParams.value,
      ...pageParams.value
    }
    const result = await requestPaperRuleList(params)
    queryLoading.value = false
    const { code, response } = result
    if (code === 1) {
      const { list, total: listTotal } = response
      queryDataList.value = list
      total.value = listTotal
    } else {
      queryDataList.value = []
    }
  } catch (error) {
    queryLoading.value = false
    queryDataList.value = []
    console.log('getPaperRulesList error', error)
  }
}
function handleReset() {
  queryParams.value = {
    courseType: '',
    category: '',
    ruleName: '',
    ruleOrigin: '',
    createUser: ''
  }
  pageParams.value.pageIndex = 1
  getPaperRulesList()
}
function handleSearch() {
  pageParams.value.pageIndex = 1
  getPaperRulesList()
}
function handleCurrentChange(val) {
  pageParams.value.pageIndex = val
  getPaperRulesList()
}
function handleSizeChange(val) {
  pageParams.value.pageIndex = 1
  pageParams.value.pageSize = val
  getPaperRulesList()
}
function handleRefreshList() {
  pageParams.value.pageIndex = 1
  getConditionDataQry()
  getPaperRulesList()
}

const paperRulesDrawerRef = ref()
function handlePaperRulesAdd() {
  paperRulesDrawerRef.value.openDrawer()
}
function handlePaperRulesEdit(row) {
  paperRulesDrawerRef.value.openDrawer(row)
}
function handlePaperRulesDelete(row) {
  ElMessageBox.confirm('确定删除该组卷规则吗？', '删除规则信息').then(async () => {
    const result = await requestPaperRuleDelete(row.id)
    const { code } = result
    if (code === 1) {
      ElMessage.success('删除成功')
      handleRefreshList()
    } else {
      ElMessage.error(result.message)
    }
  })
}

onMounted(() => {
  getConditionDataQry()
  getPaperRulesList()
})
</script>

<style lang="scss" scoped>
:deep(.el-card) {
  background-color: #f8f8f8;
  border: none;
}
.paper-rules {
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
  .rules-search-more {
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
</style>
<style lang="scss">
.paper-rules-search {
  padding: 24px;
  position: relative;
}
.paper-rules-table {
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
