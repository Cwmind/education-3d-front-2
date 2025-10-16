<template>
  <div class="weekly-management">
    <BasicPageTopBottom :marginGap="1">
      <template #top>
        <el-card shadow="never" body-class="weekly-management-search">
          <BasicTableSearch
            labelWidth="84"
            :queryParams="queryParams"
            :handleSearch="handleSearch"
            :handleReset="handleReset"
          >
            <template #searchItems>
              <el-col :span="6">
                <el-form-item label="部门" prop="dept">
                  <el-select v-model="queryParams.dept" placeholder="请选择部门" clearable>
                    <el-option v-for="item in deptConfig" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="姓名/工号" prop="nameOrUuid">
                  <el-input v-model="queryParams.nameOrUuid" placeholder="请输入姓名/工号" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="日期" prop="rangeDate">
                  <el-date-picker
                    v-model="queryParams.rangeDate"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
            </template>
          </BasicTableSearch>
        </el-card>
      </template>
      <template #content>
        <el-card shadow="never" body-class="weekly-managemen-table" class="basic-table-card">
          <div class="height-100 basic-result">
            <div class="basic-result__header">
              <div class="basic-result__header--left">
                <div class="left-title">周报信息</div>
                <div class="left-bar"></div>
              </div>
            </div>
            <el-table v-loading="queryLoading" :data="queryDataList" height="100%">
              <el-table-column type="index" width="80" label="序号" align="center">
                <template #default="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column label="部门" prop="dept" width="140" />
              <el-table-column label="姓名" prop="realName" width="120" />
              <el-table-column label="工号" prop="userUuid" width="140" />
              <el-table-column label="周开始日期" prop="dateStr" width="120" />
              <el-table-column label="周报内容" prop="content" min-width="450">
                <template #default="scope">
                  <div class="text-ellipsis">{{ scope.row.content }}</div>
                </template>
              </el-table-column>
              <el-table-column label="下周计划" prop="nextPlan" min-width="450">
                <template #default="scope">
                  <div class="text-ellipsis">{{ scope.row.nextPlan }}</div>
                </template>
              </el-table-column>
              <el-table-column label="提交时间" prop="createTimeStr" width="160" />
              <el-table-column fixed="right" label="操作" width="160">
                <template #default="scope">
                  <el-button link type="primary" @click="handleWeeklyDetail(scope.row)">
                    详情
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
    </BasicPageTopBottom>
    <weekly-drawer ref="weeklyDrawerRef" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { deptConfig } from '@/config/deptConfig'
import WeeklyDrawer from './components/weekly-drawer.vue'
import { requestPageWeekly } from '@/api/report/weeklyManagement'

// 筛选表单
const queryParams = ref({
  dept: '',
  nameOrUuid: '',
  rangeDate: []
})

// table数据
const queryDataList = ref([])
const queryLoading = ref(false)
const pageParams = ref({
  pageIndex: 1,
  pageSize: 10
})
const total = ref(0)
// 格式化筛选条件
const computedQueryParams = computed(() => {
  return {
    dept: queryParams.value.dept,
    nameOrUuid: queryParams.value.nameOrUuid,
    startDate: queryParams.value.rangeDate?.length ? queryParams.value.rangeDate[0] : '',
    endDate: queryParams.value.rangeDate?.length ? queryParams.value.rangeDate[1] : ''
  }
})
const weeklyDrawerRef = ref(null)
onMounted(() => {
  getPageWeekly()
})
// 查询周报内容
async function getPageWeekly() {
  queryLoading.value = true
  const params = {
    ...computedQueryParams.value,
    ...pageParams.value
  }
  const result = await requestPageWeekly(params)
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
}
//
function handleWeeklyDetail(row) {
  weeklyDrawerRef.value.openDrawer(row)
}
// 重置按钮
function handleReset() {
  queryParams.value = {
    dept: '',
    nameOrUuid: '',
    rangeDate: []
  }
  pageParams.value.pageIndex = 1
  getPageWeekly()
}
// 查询按钮
function handleSearch() {
  pageParams.value.pageIndex = 1
  getPageWeekly()
}
// 分页
function handleCurrentChange(val) {
  pageParams.value.pageIndex = val
  getPageWeekly()
}
function handleSizeChange(val) {
  pageParams.value.pageIndex = 1
  pageParams.value.pageSize = val
  getPageWeekly()
}
</script>

<style lang="scss" scoped>
.weekly-management {
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
  .text-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
:deep(.el-card) {
  background-color: #f8f8f8;
  border: none;
}
</style>
<style lang="scss">
.weekly-management-search {
  padding: 24px;
}
.weekly-managemen-table {
  padding: 10px 24px 24px 24px;
}
</style>
