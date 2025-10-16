<template>
  <div class="weekly">
    <BasicPageTopBottom :marginGap="1">
      <template #top>
        <el-card shadow="never" body-class="weekly-search">
          <BasicTableSearch
            labelWidth="64"
            :queryParams="queryParams"
            :handleSearch="handleSearch"
            :handleReset="handleReset"
          >
            <template #searchItems>
              <el-col :span="6">
                <el-form-item label="日期" prop="rangeDate">
                  <el-date-picker
                    v-model="queryParams.rangeDate"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD"
                    :disabled-date="disabledDate"
                  />
                </el-form-item>
              </el-col>
            </template>
          </BasicTableSearch>
        </el-card>
      </template>
      <template #content>
        <el-card shadow="never" body-class="weekly-table" class="basic-table-card">
          <div class="height-100 basic-result">
            <div class="basic-result__header">
              <div class="basic-result__header--left">
                <div class="left-title">周报信息</div>
                <div class="left-bar"></div>
              </div>
              <div class="basic-result__header--right">
                <el-button type="primary" icon="Plus" @click="handleWeeklyAdd"> 新增 </el-button>
              </div>
            </div>
            <el-table v-loading="queryLoading" :data="queryDataList" height="100%">
              <el-table-column type="index" width="80" label="序号" align="center">
                <template #default="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column label="周开始日期" prop="date" width="140" />
              <el-table-column label="周报内容" prop="content" min-width="500">
                <template #default="scope">
                  <div class="text-ellipsis">{{ scope.row.content }}</div>
                </template>
              </el-table-column>
              <el-table-column label="下周计划" prop="nextPlan" min-width="500">
                <template #default="scope">
                  <div class="text-ellipsis">{{ scope.row.nextPlan }}</div>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" prop="createTime" width="160" />
              <el-table-column fixed="right" label="操作" width="160">
                <template #default="scope">
                  <el-button link type="primary" @click="handleWeeklyEdit(scope.row)">
                    编辑
                  </el-button>
                  <el-button link type="danger" @click="handleWeeklyDelete(scope.row)">
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
    </BasicPageTopBottom>
    <weekly-drawer ref="weeklyDrawerRef" @refresh-list="handleRefreshList" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import WeeklyDrawer from './components/weekly-drawer.vue'
import { requestPageWeekly, requestDeleteWeekly } from '@/api/report/weekly'

// 筛选表单
const queryParams = ref({
  rangeDate: []
})
const disabledDate = (time) => {
  return time.getTime() > Date.now()
}
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
    startDate: queryParams.value.rangeDate?.length ? queryParams.value.rangeDate[0] : '',
    endDate: queryParams.value.rangeDate?.length ? queryParams.value.rangeDate[1] : ''
  }
})
// 抽屉ref
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
// 点击新增按钮
function handleWeeklyAdd() {
  weeklyDrawerRef.value.openDrawer()
}
// 点击编辑按钮
function handleWeeklyEdit(row) {
  weeklyDrawerRef.value.openDrawer(row)
}
// 点击删除按钮
function handleWeeklyDelete(row) {
  ElMessageBox.confirm('确定删除该周报吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const result = await requestDeleteWeekly(row.id)
      const { code } = result
      if (code === 1) {
        ElMessage.success('删除成功')
        handleRefreshList()
      } else {
        ElMessage.error(result.message)
      }
    })
    .catch(() => {
      console.log('取消删除')
    })
}

// 刷新列表
function handleRefreshList() {
  pageParams.value.pageIndex = 1
  getPageWeekly()
}
// 重置按钮
function handleReset() {
  queryParams.value = {
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

<style lang="scss">
.weekly-search {
  padding: 24px;
}
.weekly-table {
  padding: 10px 24px 24px 24px;
}
</style>
<style lang="scss" scoped>
.weekly {
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
