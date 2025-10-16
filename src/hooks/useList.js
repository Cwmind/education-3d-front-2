/*
* api 请求方法
* queryParams 初始化的查询参数
* dataCallBack 请求后的数据转换
*  */

const defaultPageSize = 10
export function useList(
  api,
  queryParams,
  dataCallBack,
  needPagination = true) {
  const dataSource = ref({
    records: [],
    total: 0,
    current: 1,
    size: defaultPageSize
  })
  const loading = ref(false)
  const exportLoading = ref(false)
  const defaultQueryParams = JSON.parse(JSON.stringify(queryParams.value))
  const getList = async() => {
    loading.value = true
    try {
      // 先把初始化参数和分页参数放到总参数里面
      const params = {
        ...queryParams.value,
        current: !needPagination ? undefined : dataSource.value.current,
        size: !needPagination ? undefined : dataSource.value.size
      }
      params.choseTimes = undefined
      let { data } = await api(params)
      dataCallBack && (data = dataCallBack(data))
      if (needPagination) {
        dataSource.value.records = data.records
        dataSource.value.total = data.total
      }
      loading.value = false
    } catch (error) {
      loading.value = false
    }
  }

  // 查询指定分页 不传参数为第一页
  const sizeChange = (current = 1, page = 10) => {
    if (needPagination) {
      dataSource.value.current = current
      dataSource.value.size = page
    }
    getList()
  }

  // 删除之后的分页刷新
  const refreshAfterDelete = (deleteNum) => {
    // dataSource.value
  }

  // 导出
  const doExport = async(api, name) => {
    exportLoading.value = true
    let isFail = false
    const params = {
      ...queryParams.value,
      current: !needPagination ? undefined : dataSource.value.current,
      size: !needPagination ? undefined : dataSource.value.size
    }
    const res = await api(params).catch(e => {
      isFail = true
      exportLoading.value = false
    })
    if (isFail) {
      return
    }
    const a = window.document.createElement('a')
    const downUrl = window.URL.createObjectURL(res)
    a.href = downUrl
    a.download = name
    a.click()
    window.URL.revokeObjectURL(downUrl)
    exportLoading.value = false
  }

  // 重置查询 分页和查询参数初始化
  const resetQuery = (willGetList = true) => {
    queryParams.value = JSON.parse(JSON.stringify(defaultQueryParams))
    if (willGetList) {
      dataSource.value.size = defaultPageSize
      sizeChange()
    }
  }

  return {
    getList,
    dataSource,
    resetQuery,
    loading,
    exportLoading,
    doExport,
    sizeChange
  }
}

