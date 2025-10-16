<template>
  <div class="teacher-management">
    <BasicPageTopBottom :marginGap="1">
      <template #top>
        <el-card shadow="never" body-class="teacher-search">
          <BasicTableSearch
            ref="queryRef"
            labelWidth="64"
            :queryParams="queryParams"
            :handleSearch="handleSearch"
            :handleReset="handleReset"
          >
            <template #searchItems>
              <el-col :span="6">
                <el-form-item label="工号" prop="userUuid">
                  <el-input v-model="queryParams.userUuid" placeholder="请输入工号" />
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
            </template>
          </BasicTableSearch>
        </el-card>
      </template>
      <template #content>
        <el-card shadow="never" body-class="teacher-table" class="basic-table-card">
          <div class="height-100 basic-result">
            <div class="basic-result__header">
              <div class="basic-result__header--left">
                <div class="left-title">老师信息</div>
                <div class="left-bar"></div>
              </div>
              <div class="basic-result__header--right">
                <el-button
                  :loading="buttonLoading"
                  type="primary"
                  icon="Plus"
                  @click="handleTeacherAdd"
                >
                  新增
                </el-button>
                <el-button
                  :loading="buttonLoading"
                  class="custom-btn"
                  icon="Upload"
                  @click="handleTeacherImport"
                >
                  导入
                </el-button>
                <el-button
                  :loading="buttonLoading"
                  class="custom-btn"
                  icon="Download"
                  @click="handleTeacherExport"
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
              <el-table-column label="工号" prop="userUuid" min-width="80" />
              <el-table-column label="姓名" prop="realName" width="160" />
              <el-table-column label="专业" prop="majorName" width="160" />
              <el-table-column label="性别" prop="sexName" width="100" />
              <el-table-column label="手机号" prop="phone" width="160" />
              <el-table-column label="创建者" prop="createUser" width="160" />
              <el-table-column label="创建时间" prop="createTime" width="260" />
              <el-table-column label="最后修改者" prop="modifyUser" width="160" />
              <el-table-column label="最后修改时间" prop="modifyTime" width="260" />
              <el-table-column fixed="right" label="操作" width="160">
                <template #default="scope">
                  <el-button link type="primary" @click="handleTeacherEdit(scope.row)">
                    编辑
                  </el-button>
                  <el-popover
                    popper-class="more-btn-popover"
                    effect="dark"
                    placement="bottom"
                    :width="100"
                    :offset="6"
                  >
                    <template #reference>
                      <el-button link>更多</el-button>
                    </template>
                    <div class="more-btn">
                      <div class="more-btn__item" @click="handleTeacherReset(scope.row)">
                        重置密码
                      </div>
                      <div
                        class="more-btn__item item--danger"
                        @click="handleTeacherDelete(scope.row)"
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
      <teacher-drawer
        ref="teacherDrawerRef"
        :sexList="sexOption"
        :majorList="majorOption"
        @refresh-list="handleRefreshList"
      />
      <teacher-import ref="teacherImportRef" @refresh-list="handleRefreshList" />
    </BasicPageTopBottom>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TeacherDrawer from './components/teacher-drawer.vue'
import TeacherImport from './components/teacher-import.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  requestTeacherList,
  requestDeleteTeacher,
  requestExportTeacher
} from '@/api/basicManagement/teacherManagement'
import { requestResetPwd } from '@/api/basic/common'
import getMajorOption from '@/hooks/majorOption'
import getSexOption from '@/hooks/sexOption'

const { majorOption } = getMajorOption()
const { sexOption } = getSexOption()

const buttonLoading = ref(false)
// 筛选表单
const queryParams = ref({
  userUuid: '',
  realName: '',
  major: ''
})

// table数据
const queryDataList = ref([])
const queryLoading = ref(false)
const pageParams = ref({
  pageIndex: 1,
  pageSize: 10
})
const total = ref(0)
// 获取老师列表
async function getTeacherList() {
  queryLoading.value = true
  const params = {
    ...queryParams.value,
    ...pageParams.value
  }
  const result = await requestTeacherList(params)
  queryLoading.value = false
  const { code, response } = result
  if (code === 1) {
    const { list, total: listTotal } = response
    queryDataList.value = list
    total.value = listTotal
  } else {
    queryDataList.value = []
  }
}
// 重置按钮
function handleReset() {
  queryParams.value = {
    userUuid: '',
    realName: '',
    majorId: ''
  }
  pageParams.value.pageIndex = 1
  getTeacherList()
}
// 查询按钮
function handleSearch() {
  pageParams.value.pageIndex = 1
  getTeacherList()
}
const teacherDrawerRef = ref()

function handleTeacherAdd() {
  teacherDrawerRef.value.openDrawer()
}
function handleTeacherEdit(row) {
  row.sex = row.sex.toString()
  teacherDrawerRef.value.openDrawer(row)
}
function handleTeacherDelete(row) {
  ElMessageBox.confirm(
    '信息删除后，该账号将无法登录系统，账号信息将不进入统计，是否确定删除。',
    '删除老师信息'
  )
    .then(async () => {
      const result = await requestDeleteTeacher(row.id)
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
const teacherImportRef = ref()
function handleTeacherImport() {
  teacherImportRef.value.openDialog()
}
async function handleTeacherExport() {
  try {
    buttonLoading.value = true
    const params = {
      ...queryParams.value,
      role: 'teacher'
    }
    const result = await requestExportTeacher(params)
    const a = window.document.createElement('a')
    const downUrl = window.URL.createObjectURL(result)
    a.href = downUrl
    a.download = '老师列表.xlsx'
    a.click()
    window.URL.revokeObjectURL(downUrl)
    buttonLoading.value = false
  } catch (error) {
    buttonLoading.value = false
    console.log('handleTeacherExport error', error)
  }
}
async function handleTeacherReset(row) {
  const result = await requestResetPwd({ id: row.id })
  const { code } = result
  if (code === 1) {
    ElMessage.success('重置成功')
  } else {
    ElMessage.error('重置失败')
  }
}
function handleCurrentChange(val) {
  pageParams.value.pageIndex = val
  getTeacherList()
}
function handleSizeChange(val) {
  pageParams.value.pageIndex = 1
  pageParams.value.pageSize = val
  getTeacherList()
}
function handleRefreshList() {
  pageParams.value.pageIndex = 1
  getTeacherList()
}

onMounted(() => {
  getTeacherList()
})
</script>

<style lang="scss" scoped>
.teacher-management {
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
.teacher-search {
  padding: 24px;
}
.teacher-table {
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
