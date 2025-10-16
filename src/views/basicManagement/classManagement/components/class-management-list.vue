<template>
  <BasicPageLeftRight :marginGap="16">
    <template #left>
      <div class="height-100 basic-result">
        <div class="basic-result__content class-management">
          <div class="basic-result__content__title class-management__title">
            <div class="title-left">
              <div class="title-left__name">分类</div>
              <div class="title-left__bar"></div>
            </div>
            <div v-hasRole="TEACHER" class="title-right">
              <el-button type="primary" icon="Plus" @click="handleClassificationAdd">
                新增
              </el-button>
            </div>
          </div>
          <div class="basic-result__content__tree">
            <el-tree
              ref="treeRef"
              class="tree__content"
              :data="courseTreeData"
              :indent="0"
              :current-node-key="sceneKey"
              :default-expand-all="true"
              node-key="itemKey"
              @node-click="handleTreeNodeClick"
            >
              <template #default="{ node, data }">
                <div v-if="data.type === 'parent'" class="parent-tree-node">
                  <div class="custom-tree-node__label">{{ node.label }}</div>
                </div>
                <div v-else class="child-tree-node">
                  <div class="custom-tree-node__label">{{ node.label }}</div>
                  <div v-if="!data.classId" v-hasRole="TEACHER" class="custom-tree-node__action">
                    <el-tooltip effect="dark" content="编辑" placement="top">
                      <div class="action__item" @click="handleClassificationEdit(data)">
                        <img src="@/assets/icons/svg/edit-pen.svg" alt="" />
                      </div>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除" placement="top">
                      <div class="action__item" @click="handleClassificationDelete(data)">
                        <img src="@/assets/icons/svg/delete.svg" alt="" />
                      </div>
                    </el-tooltip>
                  </div>
                </div>
              </template>
            </el-tree>
          </div>
        </div>
      </div>
    </template>
    <template #right>
      <BasicPageTopBottom :marginGap="1">
        <template #top>
          <el-card shadow="never" body-class="class-search">
            <BasicTableSearch
              ref="queryRef"
              labelWidth="64"
              :queryParams="queryParams"
              :handleSearch="handleSearch"
              :handleReset="handleReset"
            >
              <template #searchItems>
                <el-col :span="7">
                  <el-form-item label="班级" prop="classId">
                    <el-select v-model="queryParams.classId" placeholder="请选择班级" clearable>
                      <el-option
                        v-for="item in classSelectOption"
                        :key="item.classId"
                        :label="item.className"
                        :value="item.classId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="授课老师" prop="userUuid">
                    <el-select
                      v-model="queryParams.userUuid"
                      placeholder="请选择授课老师"
                      clearable
                    >
                      <el-option
                        v-for="item in teacherSelectOption"
                        :key="item.userUuid"
                        :label="item.userName"
                        :value="item.userUuid"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </template>
            </BasicTableSearch>
          </el-card>
        </template>
        <template #content>
          <el-card shadow="never" body-class="class-table" class="basic-table-card">
            <div class="height-100 basic-result">
              <div class="basic-result__header">
                <div class="basic-result__header--left">
                  <div class="left-title">班级信息</div>
                  <div class="left-bar"></div>
                </div>
                <div v-hasRole="TEACHER" class="basic-result__header--right">
                  <el-button
                    type="primary"
                    icon="Plus"
                    :disabled="!sceneKey"
                    @click="handleClassAdd"
                  >
                    新增
                  </el-button>
                </div>
              </div>
              <el-table
                v-loading="queryLoading"
                :data="queryDataList"
                height="100%"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="index" width="80" label="序号" align="center">
                  <template #default="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column label="班级" prop="className" width="150" />
                <el-table-column label="班级容量" prop="capacity" width="80">
                  <template #default="scope">
                    <span style="color: #ff875c">{{ scope.row.capacity }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="当前人数" prop="currentNum" width="80" />
                <el-table-column label="有效期" prop="validityPeriod" width="210" />
                <el-table-column label="授课老师" prop="teacherName" width="180" />
                <el-table-column label="创建者" prop="createUser" width="180" />
                <el-table-column label="创建时间" prop="createTime" width="180" />
                <el-table-column label="最后修改者" prop="modifyUser" width="180" />
                <el-table-column label="最后修改时间" prop="modifyTime" width="180" />
                <el-table-column fixed="right" label="操作" width="140">
                  <template #default="scope">
                    <el-button link type="primary" @click="handleClassDetail(scope.row)">
                      详情
                    </el-button>
                    <el-popover
                      popper-class="more-btn-popover"
                      effect="dark"
                      placement="bottom"
                      :width="100"
                      :offset="6"
                    >
                      <template #reference>
                        <el-button v-hasRole="TEACHER" link>更多</el-button>
                      </template>
                      <div class="more-btn">
                        <div class="more-btn__item" @click="handleClassEdit(scope.row)">编辑</div>
                        <div
                          class="more-btn__item item--danger"
                          @click="handleClassDelete(scope.row)"
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
                  v-model:page-size="pageParams.pageSize"
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
    <class-drawer ref="classDrawerRef" :sceneData="sceneData" @refresh-list="handleRefreshList" />
    <classification-dialog
      ref="classificationDialogRef"
      :classificationType="classificationType"
      @refresh-tree="handleRefreshTree"
    />
  </BasicPageLeftRight>
</template>

<script setup>
import { ref } from 'vue'
import { TEACHER } from '@/config/rolesConfig'
import ClassDrawer from './class-drawer.vue'
import ClassificationDialog from './classification-dialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  requestCourseTree,
  requestDeleteCourse,
  requestClassList,
  requestDeleteClass
} from '@/api/basicManagement/classManagement'
import getClassSelectOption from '@/hooks/classSelectOption'
import getTeacherSelectOption from '@/hooks/teacherSelectOption'

const emit = defineEmits(['view-detail'])

const { classSelectOption, loadClassSelectOption } = getClassSelectOption()
const { teacherSelectOption, loadTeacherSelectOption } = getTeacherSelectOption()

// 应用场景数据
const treeRef = ref()
const sceneKey = ref('')
const sceneData = ref({})
const courseTreeData = ref([])
// 获取分类树结构数据
async function getCourseTree() {
  try {
    const result = await requestCourseTree()
    const { code, response } = result
    if (code === 1 && response?.length > 0) {
      const treeData = response.map((item) => ({
        itemKey: item.courseType,
        label: item.courseTypeName,
        type: 'parent',
        children:
          item.courseDtos?.map((child) => ({
            courseType: item.courseType,
            courseTypeName: item.courseTypeName,
            relId: child.relId,
            courseId: child.courseId,
            courseName: child.courseName,
            itemKey: child.courseId,
            label: child.courseName,
            classId: child.classId,
            type: 'child'
          })) || []
      }))
      courseTreeData.value = treeData
      nextTick(() => {
        const key = sceneKey.value
        if (key) {
          treeRef.value.setCurrentKey(key)
        }
      })
    } else {
      courseTreeData.value = []
    }
  } catch (error) {
    console.log('getCourseTree error', error)
  }
}
const classificationDialogRef = ref()
function handleClassificationAdd() {
  classificationDialogRef.value.openDialog()
}
function handleClassificationEdit(item) {
  const { courseType, courseId, relId } = item
  classificationDialogRef.value.openDialog({
    courseType,
    courseId,
    relId
  })
}
async function handleClassificationDelete(item) {
  const { relId, itemKey } = item
  try {
    const result = await requestDeleteCourse(relId)
    const { code } = result
    if (code === 1) {
      ElMessage.success('删除分类成功')
      if (itemKey === sceneKey.value) {
        sceneKey.value = ''
      }
      getCourseTree()
    } else {
      ElMessage.error('删除分类失败')
    }
  } catch (error) {
    console.log('handleClassificationDelete error', error)
  }
}
function handleRefreshTree() {
  getCourseTree()
}
function handleTreeNodeClick(data) {
  const { type, itemKey } = data
  if (type === 'child') {
    sceneKey.value = itemKey
    sceneData.value = data
    initQueryParams()
    getClassList()
    loadClassSelectOption({ courseId: itemKey })
    loadTeacherSelectOption({ courseId: itemKey })
  }
}
// 筛选表单
const queryParams = ref({
  classId: '',
  userUuid: ''
})
function initQueryParams() {
  queryParams.value = {
    classId: '',
    userUuid: ''
  }
}
// table数据
const queryDataList = ref([])
const queryLoading = ref(false)
// 分页数据
const pageParams = ref({
  pageIndex: 1,
  pageSize: 10
})
const total = ref(0)

async function getClassList() {
  try {
    queryLoading.value = true
    const params = {
      courseId: sceneKey.value,
      ...queryParams.value,
      ...pageParams.value
    }
    console.log('getClassList params', params)
    const result = await requestClassList(params)
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
    console.log('getClassList error', error)
  }
}
// 重置搜索条件
function handleReset() {
  pageParams.value.pageIndex = 1
  initQueryParams()
  getClassList()
}
// 点击搜索按钮
function handleSearch() {
  pageParams.value.pageIndex = 1
  getClassList()
}

const classDrawerRef = ref()
function handleClassAdd() {
  classDrawerRef.value.openDrawer()
}
function handleClassEdit(row) {
  classDrawerRef.value.openDrawer(row)
}
function handleClassDetail(row) {
  emit('view-detail', row)
}
function handleClassDelete(row) {
  ElMessageBox.confirm('确定删除该班级吗？', '删除班级信息').then(async () => {
    const result = await requestDeleteClass({ classId: row.id })
    const { code } = result
    if (code === 1) {
      ElMessage.success('删除成功')
      handleRefreshList()
    } else {
      ElMessage.error('删除失败')
    }
  })
}

// 修改分页信息
function handleCurrentChange(val) {
  pageParams.value.pageIndex = val
  getClassList()
}
// 修改分页条数
function handleSizeChange(val) {
  pageParams.value.pageIndex = 1
  pageParams.value.pageSize = val
  getClassList()
}
function handleRefreshList() {
  pageParams.value.pageIndex = 1
  getCourseTree()
  getClassList()
}
onMounted(() => {
  getCourseTree()
  getClassList()
})
</script>

<style lang="scss" scoped>
:deep(.el-card) {
  background-color: #f8f8f8;
  border: none;
}
.class-management {
  width: 368px;
  padding: 24px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);

  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    .title-left {
      &__name {
        font-weight: 500;
        font-size: 16px;
        color: #000000;
        line-height: 16px;
        margin-bottom: 8px;
      }
      &__bar {
        width: 120px;
        height: 4px;
        background: linear-gradient(90deg, #e95520 0%, rgba(255, 255, 255, 0) 100%);
      }
    }
  }
  .basic-result__content__tree {
    .tree__content {
      background: none;
      --el-tree-node-hover-bg-color: none;
      :deep(.el-tree-node__expand-icon) {
        color: #ff875c;
      }
      :deep(.el-tree-node__content) {
        height: fit-content;
        margin-bottom: 1px;
      }
      :deep(.is-current > .el-tree-node__content) {
        .child-tree-node {
          background: rgba(0, 0, 0, 0.05);
        }
      }
      .parent-tree-node {
        color: #ff875c;
      }
      .child-tree-node {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 290px;
        padding: 6px 8px;
        height: fit-content;
        border-radius: 6px;
        &:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        .custom-tree-node__label {
          width: 214px;
          white-space: normal;
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        .custom-tree-node__action {
          display: flex;
          .action__item {
            margin-left: 12px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover {
              background: rgba(0, 0, 0, 0.05);
              border-radius: 4px;
            }
          }
        }
      }
    }
  }
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
.class-search {
  padding: 24px;
}
.class-table {
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
