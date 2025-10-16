import { onMounted } from 'vue'
import service from '@/utils/request'
import { ElMessage } from 'element-plus'

export const useCrud = (options) => {
  // 默认配置
  const defaultOptions = {
    needMountedQuery: true, // 是否在创建页面时，调用数据列表接口
    queryUrl: '', // 查询接口url
    queryMethod: 'get', // 查询方式，仅支持 get 和 post
    queryParams: {}, // 查询参数
    queryDataList: [], // 数据列表
    responseKey: 'data.record', // 数据列表在返回结果中对应的字段
    deleteUrl: '', // 删除接口url
    needPage: true, // 是否需要分页
    current: 1, // 分页 当前页
    size: 10, // 分页 每页条数
    total: 0, // 分页 数据总条数
    pageSizes: [10, 20, 50, 100, 200, 500, 1000], // 分页 每页显示条数
    layout: 'sizes, prev, pager, next, total', // 分页 组件布局
    queryLoading: false, // 查询Loading
    tableKey: 'id', // table 行数据的 Key
    tableSelections: [], // el-table checkbox选中行
    tableSelectionKeys: [] //  // el-table checkbox选中行keys
  }

  // merge方法
  const mergeDefaultOptions = (options, props) => {
    for (const key in options) {
      if (!Object.getOwnPropertyDescriptor(props, key)) {
        props[key] = options[key]
      }
    }
    return props
  }

  // 参数覆盖默认值
  const crudOptions = mergeDefaultOptions(defaultOptions, options)

  onMounted(() => {
    if (crudOptions.needMountedQuery) {
      queryMethod()
    }
  })

  // 查询请求
  const queryMethod = () => {
    crudOptions.queryLoading = true
    // 请求参数
    const { queryParams, needPage, current, size } = crudOptions
    const fetchParams = {
      ...queryParams,
      ...(needPage ? { current, size } : {})
    }
    // 请求查询接口
    service({
      url: crudOptions.queryUrl,
      method: crudOptions.queryMethod,
      ...(crudOptions.queryMethod === 'get' ? {
        params: fetchParams
      } : {
        data: fetchParams
      })
    }).then(res => {
      crudOptions.queryDataList = crudOptions.needPage ? getNestedKeys(res, crudOptions.responseKey) : res.data
      crudOptions.total = crudOptions.needPage ? res.data?.total : 0
    }).finally(() => {
      crudOptions.queryLoading = false
    })
  }

  // 根据配置取返回结果数据
  function getNestedKeys(obj, path) {
    // 将路径字符串按 '.' 分割成数组
    const keys = path.split('.')

    // 使用 reduce 来逐步访问对象的嵌套属性
    return keys.reduce((acc, key) => {
      // 如果对象或键为 undefined，则返回 undefined
      return acc && acc[key] !== undefined ? acc[key] : undefined
    }, obj)
  }

  // 查询
  const queryDataList = (queryCurrentPage = false) => {
    // 传入queryCurrentPage为true时，查询当前页，否则查询第一页
    !queryCurrentPage && (crudOptions.current = 1)
    queryMethod()
  }

  // 分页size改变
  const handleSizeChange = (val) => {
    crudOptions.current = 1
    crudOptions.size = val
    queryMethod()
  }

  // 分页当前页改变
  const handleCurrentChange = (val) => {
    crudOptions.current = val
    queryMethod()
  }

  // el-table多选
  const handleSelectionChange = (selections) => {
    crudOptions.tableSelections = selections
    crudOptions.tableSelectionKeys = selections.map((item) => crudOptions.tableKey && item[crudOptions.tableKey])
  }

  // 删除
  const handleDelete = (row) => {
    service({
      url: crudOptions.deleteUrl,
      method: 'delete',
      params: {
        id: row.id
      }
    }).then(() => {
      ElMessage.success('删除成功')

      queryMethod()
    })
  }

  // 批量删除
  const handleBatchDelete = () => {
    const ids = crudOptions.tableSelectionKeys.join(',')

    service({
      url: `/tBaseProduct/${ids}`,
      method: 'delete'
    }).then(() => {
      ElMessage.success('删除成功')

      queryMethod()
    })
  }

  // 查询表单重置
  const queryReset = (formRef) => {
    console.log(formRef)
    formRef.resetFields()

    queryDataList()
  }

  return {
    queryDataList, // 查询
    handleSizeChange, // 分页size改变
    handleCurrentChange, // 分页当前页改变
    handleSelectionChange, // el-table多选
    handleDelete, // 删除
    handleBatchDelete, // 批量删除
    queryReset // 查询表单重置
  }
}
