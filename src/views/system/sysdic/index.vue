<template>
  <div class="sys-dic">
    <BasicPageLeftRight :marginGap="16">
      <template #left>
        <div class="height-100 basic-result">
          <div class="basic-result__content sys-dic-content">
            <el-tree
              class="tree__content"
              :data="sysdictTree"
              :props="defaultProps"
              :current-node-key="sceneKey"
              node-key="id"
              @node-click="handleTreeNodeClick"
            />
          </div>
        </div>
      </template>
      <template #right>
        <BasicPageTopBottom :marginGap="1">
          <template #top>
            <el-card shadow="never">
              <div class="sysdic-top">
                <div class="sysdic-top-header">
                  <div class="sysdic-top-header-left">
                    <div class="left-title">字典信息</div>
                    <div class="left-bar"></div>
                  </div>
                  <div class="sysdic-top-header-right">
                    <el-button type="primary" icon="Plus" @click="handleSysdictAdd">新增</el-button>
                    <el-button v-if="sceneKey" icon="Edit" @click="handleSysdictEdit">
                      修改
                    </el-button>
                    <el-button
                      v-if="sceneKey"
                      type="danger"
                      icon="Delete"
                      plain
                      @click="handleSysdictDelete"
                    >
                      删除
                    </el-button>
                  </div>
                </div>
                <div class="sysdic-top-content">
                  <el-descriptions title="">
                    <el-descriptions-item label="分类:">
                      {{ sysdictInfo.type }}
                    </el-descriptions-item>
                    <el-descriptions-item label="名称:">
                      {{ sysdictInfo.name }}
                    </el-descriptions-item>
                    <el-descriptions-item label="名称（英文）:">
                      {{ sysdictInfo.nameEnUS }}
                    </el-descriptions-item>
                    <el-descriptions-item label="备注:">
                      {{ sysdictInfo.remark }}
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>
            </el-card>
          </template>
          <template #content>
            <el-card shadow="never" class="basic-table-card">
              <div class="height-100 basic-result">
                <div class="basic-result__header">
                  <div class="basic-result__header--left">
                    <div class="left-title">字典项</div>
                    <div class="left-bar"></div>
                  </div>
                  <div v-if="sceneKey" class="basic-result__header--right">
                    <el-button type="primary" icon="Plus" @click="handleSysdictitemAdd">
                      新增
                    </el-button>
                  </div>
                </div>
                <el-table v-loading="queryLoading" :data="queryDataList" height="100%">
                  <el-table-column type="index" width="80" label="序号" align="center">
                    <template #default="scope">
                      {{ scope.$index + 1 }}
                    </template>
                  </el-table-column>
                  <el-table-column label="字典项Key" prop="itemKey" width="150" />
                  <el-table-column label="字典项名称" prop="itemName" width="200" />
                  <el-table-column label="字典项名称（英文）" prop="itemNameEnUS" width="200" />
                  <el-table-column label="备注" prop="remark" width="360" />
                  <el-table-column label="排序" prop="orderNum" width="140" />
                  <el-table-column label="创建时间" prop="createTime" width="190" />
                  <el-table-column fixed="right" label="操作" width="140">
                    <template #default="scope">
                      <el-button link type="primary" @click="handleSysdictitemEdit(scope.row)">
                        修改
                      </el-button>
                      <el-button link type="danger" @click="handleSysdictitemDelete(scope.row)">
                        删除
                      </el-button>
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
    </BasicPageLeftRight>
    <sysdict-drawer ref="sysdictDrawerRef" @refresh-dict="handleRefreshDict" />
    <sysdictitem-drawer
      ref="sysdictitemDrawerRef"
      :sysdict-info="sysdictInfo"
      @refresh-list="handleRefreshList"
    />
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import sysdictDrawer from './components/sysdict-drawer.vue'
import SysdictitemDrawer from './components/sysdictitem-drawer.vue'
import {
  requestSysdictTree,
  requestSysdictById,
  requestSysdictitem,
  requestDeleteSysdict,
  requestDeleteSysdictitem
} from '@/api/system/sysdic'

// 字典树数据
const sceneKey = ref('')
const sysdictTree = ref([])
const defaultProps = {
  children: 'children',
  label: 'name'
}
// 字典信息
const sysdictInfo = ref({})
// 字典抽屉
const sysdictDrawerRef = ref(null)
// 字典项抽屉
const sysdictitemDrawerRef = ref(null)
// table数据
const queryDataList = ref([])
const queryLoading = ref(false)
// 分页数据
const pageParams = ref({
  pageIndex: 1,
  pageSize: 10
})
const total = ref(0)
// 获取字典树数据
async function getSysdictTree() {
  const result = await requestSysdictTree()
  const { code, response } = result
  if (code === 1) {
    sysdictTree.value = response
  } else {
    sysdictTree.value = []
  }
}
// 字典树点击事件
function handleTreeNodeClick(data) {
  const { id } = data
  sceneKey.value = id
  getSysdictInfo()
  getSysdictitem()
}
// 获取字典信息
async function getSysdictInfo() {
  const result = await requestSysdictById(sceneKey.value)
  const { code, response } = result
  if (code === 1) {
    sysdictInfo.value = response
  } else {
    sysdictInfo.value = {}
  }
}
// 获取字典项数据
async function getSysdictitem() {
  queryLoading.value = true
  const params = {
    dictId: sceneKey.value,
    ...pageParams.value
  }
  const result = await requestSysdictitem(params)
  queryLoading.value = false
  const { code, response } = result
  if (code === 1) {
    queryDataList.value = response.list
    total.value = response.total
  } else {
    queryDataList.value = []
    total.value = 0
  }
}
// 修改分页信息
function handleCurrentChange(val) {
  pageParams.value.pageIndex = val
  getSysdictitem()
}
// 修改分页条数
function handleSizeChange(val) {
  pageParams.value.pageIndex = 1
  pageParams.value.pageSize = val
  getSysdictitem()
}
// 新增字典
function handleSysdictAdd() {
  sysdictDrawerRef.value.openDrawer()
}
function handleSysdictEdit() {
  sysdictDrawerRef.value.openDrawer(sysdictInfo.value)
}
function handleSysdictDelete() {
  ElMessageBox.confirm('确定删除该字典吗？', '删除字典').then(async () => {
    const result = await requestDeleteSysdict([
      {
        id: sysdictInfo.value.id
      }
    ])
    const { code } = result
    if (code === 1) {
      sceneKey.value = ''
      sysdictInfo.value = {}
      queryDataList.value = []
      ElMessage.success('删除成功')
      handleRefreshDict()
    } else {
      ElMessage.error('删除失败')
    }
  })
}
function handleRefreshDict() {
  getSysdictTree()
  if (sceneKey.value) {
    getSysdictInfo()
  }
}
// 新增字典项
function handleSysdictitemAdd() {
  sysdictitemDrawerRef.value.openDrawer()
}
// 修改字典项
function handleSysdictitemEdit(row) {
  sysdictitemDrawerRef.value.openDrawer(row)
}
// 删除字典项
function handleSysdictitemDelete(row) {
  ElMessageBox.confirm('确定删除该字典项吗？', '删除字典项').then(async () => {
    const result = await requestDeleteSysdictitem([{ id: row.id, version: row.version }])
    const { code } = result
    if (code === 1) {
      ElMessage.success('删除成功')
      handleRefreshList()
    } else {
      ElMessage.error('删除失败')
    }
  })
}
// 刷新列表
function handleRefreshList() {
  pageParams.value.pageIndex = 1
  getSysdictitem()
}

onMounted(() => {
  getSysdictTree()
})
</script>

<style lang="scss" scoped>
:deep(.el-card) {
  background-color: #f8f8f8;
  border: none;
}
.sys-dic {
  width: 100%;
  height: 100%;
  .sys-dic-content {
    width: 368px;
    padding: 24px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    .tree__content {
      background: transparent;
      --el-tree-node-hover-bg-color: #ebebeb;
      :deep(.is-current) {
        background-color: #ebebeb;
      }
    }
  }
  .sysdic-top {
    .sysdic-top-header {
      width: 100%;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .sysdic-top-header-left {
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
    .sysdic-top-content {
      height: 100px;
      :deep(.el-descriptions__body) {
        background: transparent;
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
</style>
