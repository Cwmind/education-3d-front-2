<template>
  <div class="daily">
    <BasicPageTopBottom :marginGap="1">
      <template #top>
        <el-card shadow="never" body-class="daily-search">
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
        <el-card shadow="never" body-class="daily-table" class="basic-table-card">
          <div class="height-100 basic-result">
            <div class="basic-result__header">
              <div class="basic-result__header--left">
                <div class="left-title">日报信息</div>
                <div class="left-bar"></div>
              </div>
              <div class="basic-result__header--right">
                <el-button type="primary" icon="Plus" @click="handleDailyAdd"> 新增 </el-button>
              </div>
            </div>
            <el-table v-loading="queryLoading" :data="queryDataList" height="100%">
              <el-table-column type="index" width="80" label="序号" align="center">
                <template #default="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column label="日期" prop="date" width="140" />
              <el-table-column label="工作内容" prop="content" min-width="500">
                <template #default="scope">
                  <div class="text-ellipsis">{{ scope.row.content }}</div>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" prop="createTime" width="160" />
              <el-table-column fixed="right" label="操作" width="160">
                <template #default="scope">
                  <el-button link type="primary" @click="handleDailyEdit(scope.row)">
                    编辑
                  </el-button>
                  <el-button link type="danger" @click="handleDailyDelete(scope.row)">
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
    <daily-drawer ref="dailyDrawerRef" @refresh-list="handleRefreshList" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import DailyDrawer from './components/daily-drawer.vue'
import { requestPageDaily, requestDeleteDaily } from '@/api/report/daily'

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
const dailyDrawerRef = ref(null)

onMounted(() => {
  getPageDaily()
})

// 查询日报内容
async function getPageDaily() {
  queryLoading.value = true
  const params = {
    ...computedQueryParams.value,
    ...pageParams.value
  }
  const result = await requestPageDaily(params)
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
function handleDailyAdd() {
  dailyDrawerRef.value.openDrawer()
}
// 点击编辑按钮
function handleDailyEdit(row) {
  dailyDrawerRef.value.openDrawer(row)
}
// 点击删除按钮
function handleDailyDelete(row) {
  ElMessageBox.confirm('确定删除该日报吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const result = await requestDeleteDaily(row.id)
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
  getPageDaily()
}
// 重置按钮
function handleReset() {
  queryParams.value = {
    rangeDate: []
  }
  pageParams.value.pageIndex = 1
  getPageDaily()
}
// 查询按钮
function handleSearch() {
  pageParams.value.pageIndex = 1
  getPageDaily()
}
// 分页
function handleCurrentChange(val) {
  pageParams.value.pageIndex = val
  getPageDaily()
}
function handleSizeChange(val) {
  pageParams.value.pageIndex = 1
  pageParams.value.pageSize = val
  getPageDaily()
}
</script>

<style lang="scss">
.student-search {
  padding: 24px;
}
.daily-table {
  padding: 10px 24px 24px 24px;
}
</style>
<style lang="scss" scoped>
.daily {
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
