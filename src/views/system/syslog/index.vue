<template>
  <div class="syslog">
    <BasicPageTopBottom :marginGap="1">
      <template #top>
        <el-card shadow="never" body-class="syslog-search">
          <BasicTableSearch
            ref="queryRef"
            labelWidth="64"
            :queryParams="queryParams"
            :handleSearch="handleSearch"
            :handleReset="handleReset"
          >
            <template #searchItems>
              <el-col :span="6">
                <el-form-item label="操作菜单" prop="operMenu">
                  <el-select v-model="queryParams.operMenu" placeholder="请选择操作菜单" clearable>
                    <el-option
                      v-for="item in operMenuList"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="账号" prop="userUuid">
                  <el-input v-model="queryParams.userUuid" placeholder="请输入账号" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="操作时间" prop="operaterDate">
                  <el-date-picker
                    v-model="queryParams.operaterDate"
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
        <el-card shadow="never" body-class="syslog-table" class="basic-table-card">
          <div class="height-100 basic-result">
            <div class="basic-result__header">
              <div class="basic-result__header--left">
                <div class="left-title">操作日志</div>
                <div class="left-bar"></div>
              </div>
              <div class="basic-result__header--right">
                <el-button
                  :loading="buttonLoading"
                  class="custom-btn"
                  icon="Download"
                  @click="handleSyslogExport"
                >
                  下载
                </el-button>
              </div>
            </div>
            <el-table v-loading="queryLoading" :data="queryDataList" style="height: 100%">
              <el-table-column type="index" width="80" label="序号" align="center">
                <template #default="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column label="操作时间" prop="operTime" width="230" />
              <el-table-column label="操作菜单" prop="operMenu" width="160" />
              <el-table-column label="操作按钮" prop="operButton" width="200" />
              <el-table-column label="操作内容" prop="content" />
              <el-table-column label="操作结果" prop="operResult" width="160" />
              <el-table-column label="操作账号" prop="userUuid" width="160" />
              <el-table-column label="操作人" prop="realName" width="160" />
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage, dayjs } from 'element-plus'
import { requestSelectMenuData, requestSyslogList, requestExportSyslog } from '@/api/system/syslog'

const buttonLoading = ref(false)
// 筛选表单
const queryParams = ref({
  operMenu: '',
  userUuid: '',
  operaterDate: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
})
const operMenuList = ref([])

async function getSelectMenuData() {
  const result = await requestSelectMenuData()
  const { code, response } = result
  if (code === 1) {
    operMenuList.value = response
  } else {
    operMenuList.value = []
  }
}

const computedQueryParams = computed(() => {
  return {
    operMenu: queryParams.value.operMenu,
    userUuid: queryParams.value.userUuid,
    operTimeStart: queryParams.value.operaterDate?.length ? queryParams.value.operaterDate[0] : '',
    operTimeEnd: queryParams.value.operaterDate?.length ? queryParams.value.operaterDate[1] : ''
  }
})
// table数据
const queryDataList = ref([])
const queryLoading = ref(false)
const pageParams = ref({
  pageIndex: 1,
  pageSize: 10
})
const total = ref(0)
async function getSyslogList() {
  try {
    queryLoading.value = true
    const params = {
      ...computedQueryParams.value,
      ...pageParams.value
    }
    const result = await requestSyslogList(params)
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
    queryDataList.value = []
  }
}
// 重置按钮
function handleReset() {
  queryParams.value = {
    operMenu: '',
    userUuid: '',
    operaterDate: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
  }
  pageParams.value.pageIndex = 1
  getSyslogList()
}
// 查询按钮
function handleSearch() {
  pageParams.value.pageIndex = 1
  getSyslogList()
}
// 操作日志导出
async function handleSyslogExport() {
  try {
    const params = {
      ...computedQueryParams.value
    }
    buttonLoading.value = true
    const result = await requestExportSyslog(params)
    const a = window.document.createElement('a')
    const downUrl = window.URL.createObjectURL(result)
    a.href = downUrl
    a.download = '操作日志.xlsx'
    a.click()
    window.URL.revokeObjectURL(downUrl)
    buttonLoading.value = false
  } catch (error) {
    buttonLoading.value = false
    console.log('handleSyslogExport error', error)
  }
}
function handleCurrentChange(val) {
  pageParams.value.pageIndex = val
  getSyslogList()
}
function handleSizeChange(val) {
  pageParams.value.pageIndex = 1
  pageParams.value.pageSize = val
  getSyslogList()
}

onMounted(() => {
  getSelectMenuData()
  getSyslogList()
})
</script>

<style lang="scss" scoped>
.syslog {
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
.syslog-search {
  padding: 24px;
}
.syslog-table {
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
