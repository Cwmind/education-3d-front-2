<!-- 表格页面 表格组件 -->
<template>
  <div class="basic-result" :class="{'height-100':fullHeight}">
    <div v-if="$slots.operateButtons" class="basic-result__operate">
      <div class="width-100">
        <!-- 表格操作按钮 slot -->
        <slot name="operateButtons"></slot>
      </div>
      <div class="basic-result__operate__column-filter">
        <!-- 右侧操作按钮 可以筛选列 slot -->
        <right-toolbar
          v-if="showRightToolBar"
          :search="false"
          :columns="checkedColumns"
          @query-table="loadData"
        />
      </div>
    </div>
    <el-table
      ref="tableRef"
      v-loading="loading"
      size="large"
      :data="props.dataSource.records"
      :highlight-current-row="highlightCurrentRow"
      class="basic-result__table"
      :row-class-name="tableRowClassName"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @sort-change="sortChange"
    >
      <!-- 列筛选后的表格列配置 -->
      <el-table-column
        v-for="item in filteredColumns"
        v-bind="item"
        :key="item.prop"
        :formatter="replaceEmptyValue"
        :show-overflow-tooltip="item.hasOwnProperty('showOverflowTooltip') ? item.showOverflowTooltip : true"
      >
        <template v-if="item.tableChildren">
          <el-table-column
            v-for="x in item.tableChildren"
            v-bind="x"
            :key="x.prop"
            :formatter="replaceEmptyValue"
            :show-overflow-tooltip="x.hasOwnProperty('showOverflowTooltip') ? x.showOverflowTooltip : true"
          >
            <template v-if="x.slot" #default="scope">
              <slot :name="x.slot" :scope="scope"></slot>
            </template>
            <template v-else-if="x.dict" #default="scope">
              <span>{{ getDictLabel(scope.row[x.prop],dict[x.dict]) || '/' }}</span>
            </template>
          </el-table-column>
        </template>
        <template v-if="item.slot" #default="scope">
          <slot :name="item.slot" :scope="scope"></slot>
        </template>
        <template v-else-if="item.dict" #default="scope">
          <span>{{ getDictLabel(scope.row[item.prop],dict[item.dict]) || '/' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-if="props.dataSource.total > 0 && showPagination"
      class="width-100"
      :total="props.dataSource.total"
      :page="props.dataSource.current"
      :limit="props.dataSource.size"
      @pagination="pageChange"
    />
  </div>
</template>
<script setup>
import { getDictLabel } from '@/utils/fun'

const props = defineProps({
  // 表格列属性 element-plus的熟悉 参考 http://element-plus.org/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7
  columns: {
    type: Array,
    default: () => []
  },
  // 后端返回的列表数据 包含数量 分页和数据
  dataSource: {
    type: Object,
    default: () => {
      return {}
    }
  },
  // 字典
  // eg { nameOptions:[{label:是,value:1},{label:否,value:0}]}
  // 使用时传入字典集合的对象dict 然后在columns里配置 dict 值为在dick里的key
  dict: {
    type: Object,
    default: () => {
      return {}
    }
  },
  // 高亮当前选中行 开启后可单选
  highlightCurrentRow: {
    type: Boolean,
    default: false
  },
  // 右侧表格工具栏
  showRightToolBar: {
    type: Boolean,
    default: false
  },
  // 单选变化
  currentChange: {
    type: Function,
    default: () => {
    }
  },
  // 多选变化
  selectionChange: {
    type: Function,
    default: () => {
    }
  },
  // 列表查询方法
  loadData: {
    type: Function,
    default: () => {
    }
  },
  // 排序变化
  sortChange: {
    type: Function,
    default: () => {
    }
  },
  loading: {
    type: Boolean,
    default: false
  },
  // 自动100%高度
  fullHeight: {
    type: Boolean,
    default: true
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  activeIndex: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['paginationChange'])

const tableRef = ref()
// 筛选后的列 去除多选框的
const filteredColumns = computed(() => {
  return props.columns.filter(x => x.type === 'selection' || checkedColumns.value.some(e => e.prop === x.prop && e.visible))
})

const checkedColumns = ref(props.columns.filter(x => x.type !== 'selection').map(x => {
  return {
    ...x,
    visible: true
  }
}))

// 空值置为 /
const replaceEmptyValue = (row, prop) => {
  return row[prop.property] === 0 ? 0 : (row[prop.property] || '')
}

const tableRowClassName = ({
  row,
  rowIndex
}) => {
  return props.activeIndex.includes(rowIndex) ? 'active-row' : ''
}

// 获取多选已选中的行
const getSelectionRows = () => {
  return tableRef.value.getSelectionRows()
}
// 清空多选已选中的行
const clearSelection = () => {
  return tableRef.value.clearSelection()
}
// 清空排序
const clearSort = () => {
  return tableRef.value.clearSort()
}
// 更改分页或者页码
const pageChange = (params) => {
  emit('paginationChange', params.page, params.limit)
}

defineExpose({
  getSelectionRows,
  clearSort,
  clearSelection
})

</script>

<style lang="scss">
.el-table .active-row {
  background: rgb(252.5,245.7,235.5);
}
</style>

