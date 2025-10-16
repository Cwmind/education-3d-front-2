<template>
  <el-table :data="queryDataList" height="100%">
    <el-table-column label="姓名" prop="realName" />
    <el-table-column label="人员编码" prop="userUuid" />
    <el-table-column label="部门" prop="dept" />
    <el-table-column label="个人工时（h）" prop="avgIndividual" />
    <el-table-column label="平均工时（h）" prop="avgDept" />
    <el-table-column label="工时贡献度（%）" prop="proportion">
      <template #default="{ row, $index }">
        <span :style="{ color: $index < 5 ? '#3a5cc2' : '#F56C6C' }">{{ row.proportion }}%</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
const queryDataList = ref([])
function setTableData(data) {
  queryDataList.value = data
}
defineExpose({
  setTableData
})
</script>

<style lang="scss" scoped></style>
