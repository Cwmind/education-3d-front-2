<template>
  <BasicPageTopBottom :marginGap="16">
    <template #top>
      <div class="detail-header">
        <div class="detail-header-back" @click="handleBackClick">
          <img src="@/assets/images/back-icon.png" alt="" />
          <span>返回上一级</span>
        </div>
        <div class="detail-header-content">
          <div class="content-item">
            <div class="content-item-data">
              <div class="data-top">班级</div>
              <div :title="classInfo.className" class="data-bottom className">{{ classInfo.className }}</div>
            </div>
          </div>
          <div class="content-item">
            <div class="content-item-data">
              <div class="data-top">授课老师</div>
              <div class="data-bottom teacherName">{{ classInfo.teacherName }}</div>
            </div>
          </div>
          <div class="content-item">
            <div class="content-item-data">
              <div class="data-top">班级容量</div>
              <div class="data-bottom capacity">{{ classInfo.capacity }}</div>
            </div>
          </div>
          <div class="content-item">
            <div class="content-item-data">
              <div class="data-top">当前人数</div>
              <div class="data-bottom currentNum">{{ classInfo.currentNum }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #content>
      <el-card shadow="never" body-class="class-table" class="basic-table-card">
        <div class="height-100 basic-result">
          <div class="basic-result__header">
            <div class="basic-result__header--left">
              <div class="left-title">班级学生</div>
              <div class="left-bar"></div>
            </div>
            <div class="basic-result__header--right">
              <el-input
                v-model="studentUuidValue"
                style="width: 174px; margin-right: 8px"
                placeholder="请输入学生学号"
                suffix-icon="Search"
                @input="handleStudentUuidSearch"
              />
              <el-button
                v-hasRole="TEACHER"
                icon="Upload"
                class="custom-btn"
                @click="handleClassStudentImport"
              >
                导入
              </el-button>
            </div>
          </div>
          <el-table v-loading="queryLoading" :data="queryDataList" row-key="id" height="100%">
            <el-table-column type="index" width="80" label="序号" align="center">
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="学号" prop="userUuid" />
            <el-table-column label="姓名" prop="realName" />
            <el-table-column label="专业" prop="major" />
            <el-table-column label="性别" prop="sex" />
            <el-table-column label="创建者" prop="createUser" />
            <el-table-column label="创建时间" prop="createTime" />
            <el-table-column v-hasRole="TEACHER" fixed="right" label="操作" width="120">
              <template #default="scope">
                <el-button link type="primary" @click="handleClassStudentDelete(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="basic-result__pagination">
            <el-pagination
              v-model:current-page="pageParams.pageIndex"
              v-model:page-size="pageParams.pageSize"
              background
              :total="total"
              :default-page-size="10"
              layout="sizes, prev, pager, next, total"
              :page-sizes="[10, 20, 50, 100]"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </div>
        </div>
      </el-card>
    </template>
    <class-student-import ref="classStudentImportRef" @refresh-list="handleRefreshList" />
  </BasicPageTopBottom>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { debounce } from 'lodash'
import { TEACHER } from '@/config/rolesConfig'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  requestClassStudentList,
  requestDeleteClassRelStudent
} from '@/api/basicManagement/classManagement'
import ClassStudentImport from './class-student-import.vue'

const props = defineProps({
  classInfo: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['back-click'])

const handleBackClick = () => {
  emit('back-click', 0)
}
const queryDataList = ref([])
const queryLoading = ref(false)
const pageParams = ref({
  pageIndex: 1,
  pageSize: 10
})
const total = ref(0)
async function getStudentList() {
  try {
    queryLoading.value = true
    const params = {
      classId: props.classInfo.id,
      studentUuid: studentUuidValue.value,
      ...pageParams.value
    }
    const result = await requestClassStudentList(params)
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
  }
}
const studentUuidValue = ref('')
const handleStudentUuidSearch = debounce((value) => {
  getStudentList()
}, 500)
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
const classStudentImportRef = ref()
function handleClassStudentImport() {
  classStudentImportRef.value.openDialog(props.classInfo)
}
function handleClassStudentDelete(row) {
  ElMessageBox.confirm('确定删除该学生吗？', '删除学生信息').then(async () => {
    const result = await requestDeleteClassRelStudent(row.relId)
    const { code } = result
    if (code === 1) {
      ElMessage.success('删除成功')
      getStudentList()
    } else {
      ElMessage.error('删除失败')
    }
  })
}
onMounted(() => {
  getStudentList()
})
</script>

<style lang="scss" scoped>
:deep(.el-card) {
  background: rgba(255, 255, 255, 0.5);
  border: none;
}
.detail-header {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 24px;
  &-back {
    height: 16px;
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    cursor: pointer;
    img {
      width: 16px;
      height: 16px;
      margin-right: 7px;
    }
    span {
      font-weight: 500;
      font-size: 16px;
      color: #ff7c4d;
      line-height: 24px;
    }
  }
  &-content {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    .content-item {
      height: 84px;
      background: #ffffff;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      &-data {
        .data-top {
          font-weight: 500;
          font-size: 14px;
          color: #7f7f7f;
          line-height: 21px;
        }
        .className {
          font-weight: bold;
          font-size: 24px;
          color: #ff7c4d;
          width: 360px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .teacherName {
          font-weight: bold;
          font-size: 24px;
          color: #090909;
        }
        .capacity {
          font-weight: bold;
          font-size: 24px;
          color: #ff7c4d;
        }
        .currentNum {
          font-weight: bold;
          font-size: 24px;
          color: #34bf00;
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
</style>
