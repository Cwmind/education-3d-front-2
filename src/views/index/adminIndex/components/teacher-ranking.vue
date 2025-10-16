<template>
  <div class="teacher-ranking">
    <table class="header-table">
      <tr>
        <th v-for="(column, index) in columns" :key="index" :width="column.width">
          {{ column.label }}
        </th>
      </tr>
    </table>
    <div class="table-container">
      <Vue3SeamlessScroll
        v-if="tableData?.length"
        ref="scrollRef"
        v-bind="scrollOptions"
        :key="Math.random()"
        :list="tableData"
      >
        <table class="body-table">
          <tr v-for="(row, index) in tableData" :key="index">
            <td v-for="(column, colIndex) in columns" :key="colIndex" :width="column.width">
              <div v-if="column.field === 'order'" class="td-order">
                <img
                  v-if="row[column.field] === 1"
                  class="rank-img"
                  src="@/assets/index/rank-first.png"
                  alt=""
                />
                <img
                  v-else-if="row[column.field] === 2"
                  class="rank-img"
                  src="@/assets/index/rank-second.png"
                  alt=""
                />
                <img
                  v-else-if="row[column.field] === 3"
                  class="rank-img"
                  src="@/assets/index/rank-third.png"
                  alt=""
                />
                <span v-else> {{ row[column.field] }}</span>
              </div>
              <div v-else>
                {{ row[column.field] }}
              </div>
            </td>
          </tr>
        </table>
      </Vue3SeamlessScroll>
      <BasicNoData v-else style="opacity: 0.5" />
    </div>
  </div>
</template>

<script setup>
const columns = ref([
  {
    label: '排行榜',
    field: 'order',
    width: 100
  },
  {
    label: '工号',
    field: 'teacherUuid',
    width: 140
  },
  {
    label: '姓名',
    field: 'teacherName',
    width: 120
  },
  {
    label: '授课数',
    field: 'teachCount',
    width: 100
  },
  {
    label: '平均评分',
    field: 'avgScore',
    width: 100
  }
])
const scrollOptions = {
  hover: true,
  limitScrollNum: 50,
  singleHeight: 42,
  isWatch: true,
  wheel: true
}

const tableData = ref([])
function setData(data) {
  tableData.value = data
}

defineExpose({
  setData
})
</script>

<style lang="scss" scoped>
.teacher-ranking {
  height: 350px;
  margin-bottom: 19px;
  overflow-y: hidden;
  overflow-x: auto;
  table {
    width: 100%;
    table-layout: fixed;
  }
  th,
  td {
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  th {
    padding: 10px 16px;
    font-weight: 400;
    font-size: 16px;
    color: #ffffffb3;
    line-height: 16px;
    background: rgba(30, 32, 83, 0.2);
    text-align: center;
  }

  td {
    padding: 10px 16px;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #ffffff;
    text-align: center;
    .td-order {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 22px;
        height: 22px;
      }
      span {
        width: 22px;
        height: 22px;
        text-align: center;
      }
    }
  }
  .body-table tr {
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }
  .table-container {
    width: 560px;
    height: 300px;
    overflow: hidden;
  }
}
</style>
