<template>
  <div class="attendance-monthly height-100 basic-result">
    <el-table v-loading="queryLoading" :data="queryDataList" height="100%">
      <el-table-column type="index" width="80" label="序号" align="center">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="部门" prop="dept" width="200" />
      <el-table-column label="月份" prop="month" />
      <el-table-column label="工号" prop="userUuid" />
      <el-table-column label="姓名" prop="realName" />
      <el-table-column label="个人工时（h）" prop="avgIndividual" />
      <el-table-column label="平均工时（h）" prop="avgDept" />
      <el-table-column label="工时贡献度（%）" prop="proportion">
        <template #default="scope"> {{ scope.row.proportion }}% </template>
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
</template>

<script setup>
import { requestMonthlyAttendance } from '@/api/report/attendance'

const queryDataList = ref([])
const queryLoading = ref(false)
const queryParams = ref({})
const pageParams = ref({
  pageIndex: 1,
  pageSize: 10
})
const total = ref(0)

function loadPage(params) {
  queryParams.value = params
  pageParams.value.pageIndex = 1
  getMonthlyAttendance()
}
async function getMonthlyAttendance() {
  try {
    queryLoading.value = true
    const params = {
      ...queryParams.value,
      ...pageParams.value
    }
    const result = await requestMonthlyAttendance(params)
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
  }
}
function handleCurrentChange(val) {
  pageParams.value.pageIndex = val
  getMonthlyAttendance()
}
function handleSizeChange(val) {
  pageParams.value.pageIndex = 1
  pageParams.value.pageSize = val
  getMonthlyAttendance()
}
defineExpose({
  loadPage
})
</script>

<style lang="scss" scoped>
.attendance-monthly {
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
