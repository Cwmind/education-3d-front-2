<template>
  <div class="student-management">
    <BasicPageTopBottom :marginGap="1">
      <template #top>
        <el-card shadow="never" body-class="student-search">
          <BasicTableSearch
            ref="queryRef"
            labelWidth="64"
            :queryParams="queryParams"
            :handleSearch="handleSearch"
            :handleReset="handleReset"
          >
            <template #searchItems>
              <el-col :span="6">
                <el-form-item label="学号" prop="userUuid">
                  <el-input v-model="queryParams.userUuid" placeholder="请输入学号" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="姓名" prop="realName">
                  <el-input v-model="queryParams.realName" placeholder="请输入姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="专业" prop="major">
                  <el-select v-model="queryParams.major" placeholder="请选择专业" clearable>
                    <el-option
                      v-for="item in majorOption"
                      :key="item.itemKey"
                      :label="item.itemName"
                      :value="item.itemKey"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="年级" prop="userLevel">
                  <el-select v-model="queryParams.userLevel" placeholder="请选择年级" clearable>
                    <el-option
                      v-for="item in userLevelOption"
                      :key="item.itemKey"
                      :label="item.itemName"
                      :value="item.itemKey"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </template>
          </BasicTableSearch>
        </el-card>
      </template>
      <template #content>
        <el-card shadow="never" body-class="student-table" class="basic-table-card">
          <div class="height-100 basic-result">
            <div class="basic-result__header">
              <div class="basic-result__header--left">
                <div class="left-title">学生信息</div>
                <div class="left-bar"></div>
              </div>
              <div class="basic-result__header--right">
                <el-button
                  v-hasRole="ADMIN"
                  :loading="buttonLoading"
                  type="primary"
                  icon="Plus"
                  @click="handleStudentAdd"
                >
                  新增
                </el-button>
                <el-button
                  v-hasRole="ADMIN"
                  :loading="buttonLoading"
                  class="custom-btn"
                  icon="Upload"
                  @click="handleStudentImport"
                >
                  导入
                </el-button>
                <el-button
                  :loading="buttonLoading"
                  class="custom-btn"
                  icon="Download"
                  @click="handleStudentExport"
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
              <el-table-column label="学号" prop="userUuid" min-width="80" />
              <el-table-column label="姓名" prop="realName" width="160" />
              <el-table-column label="专业" prop="majorName" width="160" />
              <el-table-column label="性别" prop="sexName" width="100" />
              <el-table-column label="年级" prop="userLevel" width="120" />
              <el-table-column label="手机号" prop="phone" width="160" />
              <el-table-column label="创建者" prop="createUser" width="120" />
              <el-table-column label="创建时间" prop="createTime" width="230" />
              <el-table-column label="最后修改者" prop="modifyUser" width="120" />
              <el-table-column label="最后修改时间" prop="modifyTime" width="230" />
              <el-table-column fixed="right" label="操作" width="160">
                <template #default="scope">
                  <el-button link type="primary" @click="handleStudentEdit(scope.row)">
                    编辑
                  </el-button>
                  <el-button v-hasRole="TEACHER" link @click="handleStudentReset(scope.row)">
                    重置密码
                  </el-button>
                  <el-popover
                    popper-class="more-btn-popover"
                    effect="dark"
                    placement="bottom"
                    :width="100"
                    :offset="6"
                  >
                    <template #reference>
                      <el-button v-hasRole="ADMIN" link>更多</el-button>
                    </template>
                    <div class="more-btn">
                      <div class="more-btn__item" @click="handleStudentReset(scope.row)">
                        重置密码
                      </div>
                      <div
                        class="more-btn__item item--danger"
                        @click="handleStudentDelete(scope.row)"
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
      <student-drawer
        ref="studentDrawerRef"
        :sexList="sexOption"
        :majorList="majorOption"
        :userLevelList="userLevelOption"
        @refresh-list="handleRefreshList"
      />
      <student-import ref="studentImportRef" @refresh-list="handleRefreshList" />
    </BasicPageTopBottom>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ADMIN, TEACHER } from '@/config/rolesConfig'
import StudentDrawer from './components/student-drawer.vue'
import StudentImport from './components/student-import.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  requestStudentList,
  requestDeleteStudent,
  requestExportStudent
} from '@/api/basicManagement/studentManagement'
import { requestResetPwd } from '@/api/basic/common'
import getUserLevelOption from '@/hooks/userLevelOption'
import getMajorOption from '@/hooks/majorOption'
import getSexOption from '@/hooks/sexOption'

const { userLevelOption } = getUserLevelOption()
const { majorOption } = getMajorOption()
const { sexOption } = getSexOption()

const buttonLoading = ref(false)
// 筛选表单
const queryParams = ref({
  userUuid: '',
  realName: '',
  major: '',
  userLevel: ''
})
// table数据
const queryDataList = ref([])
const queryLoading = ref(false)
const pageParams = ref({
  pageIndex: 1,
  pageSize: 10
})
const total = ref(0)
// 获取学生列表
async function getStudentList() {
  try {
    queryLoading.value = true
    const params = {
      ...queryParams.value,
      ...pageParams.value
    }
    const result = await requestStudentList(params)
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
    console.log('getStudentList', error)
  }
}
// 重置按钮
function handleReset() {
  queryParams.value = {
    userUuid: '',
    realName: '',
    major: '',
    userLevel: ''
  }
  pageParams.value.pageIndex = 1
  getStudentList()
}
// 查询按钮
function handleSearch() {
  pageParams.value.pageIndex = 1
  getStudentList()
}
const studentDrawerRef = ref()
function handleStudentAdd() {
  studentDrawerRef.value.openDrawer()
}
function handleStudentEdit(row) {
  row.sex = row.sex.toString()
  studentDrawerRef.value.openDrawer(row)
}
function handleStudentDelete(row) {
  ElMessageBox.confirm(
    '信息删除后，该账号将无法登录系统，账号信息将不进入统计，是否确定删除。',
    '删除学生信息'
  )
    .then(async () => {
      const result = await requestDeleteStudent(row.id)
      const { code } = result
      if (code === 1) {
        ElMessage.success('删除成功')
        handleRefreshList()
      } else {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      console.log('取消删除')
    })
}
const studentImportRef = ref()
// 学生导入
function handleStudentImport() {
  studentImportRef.value.openDialog()
}
// 学生导出
async function handleStudentExport() {
  try {
    const params = {
      ...queryParams.value,
      role: 'student'
    }
    buttonLoading.value = true
    console.log('handleStudentExport params', params)
    const result = await requestExportStudent(params)
    const a = window.document.createElement('a')
    const downUrl = window.URL.createObjectURL(result)
    a.href = downUrl
    a.download = '学生列表.xlsx'
    a.click()
    window.URL.revokeObjectURL(downUrl)
    buttonLoading.value = false
  } catch (error) {
    buttonLoading.value = false
    console.log('handleStudentExport error', error)
  }
}
async function handleStudentReset(row) {
  try {
    const result = await requestResetPwd({ id: row.id })
    const { code } = result
    if (code === 1) {
      ElMessage.success('重置成功')
    } else {
      ElMessage.error('重置失败')
    }
  } catch (error) {
    console.log('handleStudentReset error', error)
  }
}
function handleCurrentChange(val) {
  pageParams.value.pageIndex = val
  getStudentList()
}
function handleSizeChange(val) {
  pageParams.value.pageIndex = 1
  pageParams.value.pageSize = val
  getStudentList()
}
function handleRefreshList() {
  pageParams.value.pageIndex = 1
  getStudentList()
}

onMounted(() => {
  getStudentList()
})
</script>

<style lang="scss" scoped>
.student-management {
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
.student-search {
  padding: 24px;
}
.student-table {
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
