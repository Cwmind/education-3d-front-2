<template>
  <div class="attendance-details height-100 basic-result">
    <el-table v-loading="queryLoading" :data="queryDataList" height="100%">
      <el-table-column type="index" width="80" label="序号" align="center">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="部门" prop="dept" width="200" />
      <el-table-column label="工号" prop="userUuid" />
      <el-table-column label="姓名" prop="realName" />
      <el-table-column label="星期" prop="week" />
      <el-table-column label="上班打卡时间" prop="clockInTime" />
      <el-table-column label="下班打卡时间" prop="clockOutTime" />
      <el-table-column label="工作时长（分钟）" prop="workdayMinutes" />
      <el-table-column label="考勤日期" prop="dateStr" />
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
import { requestPageAttendance } from '@/api/report/attendance'

const queryDataList = ref([])
const queryLoading = ref(false)
const queryParams = ref({})
const pageParams = ref({
  pageIndex: 1,
  pageSize: 10
})
const total = ref(0)

function loadPage(parmas) {
  queryParams.value = parmas || {}
  pageParams.value.pageIndex = 1
  getPageAttendance()
}
async function getPageAttendance() {
  try {
    queryLoading.value = true
    const params = {
      ...queryParams.value,
      ...pageParams.value
    }
    const result = await requestPageAttendance(params)
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
  getPageAttendance()
}
function handleSizeChange(val) {
  pageParams.value.pageIndex = 1
  pageParams.value.pageSize = val
  getPageAttendance()
}
defineExpose({
  loadPage
})
</script>

<style lang="scss" scoped>
.attendance-details {
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
