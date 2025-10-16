export function useQuery(queryMethod, queryParams, defaultPageSize, noInit) {
  const queryRef = ref()

  // 分页参数
  const pageParams = ref({
    current: 1,
    size: defaultPageSize || 10
  })

  const queryLoading = ref(false)

  // 数据总量
  const total = ref(0)

  // 查询结果
  const queryDataList = ref([])

  // 查询方法
  const queryDataMethod = () => {
    queryLoading.value = true
    // 请求查询接口
    queryMethod({
      ...toValue(queryParams),
      ...pageParams.value
    }).then(res => {
      queryDataList.value = res.data?.records || res.data
      total.value = res.data?.total
    }).catch(() => {
      queryDataList.value = []
      total.value = 0
    }).finally(() => {
      queryLoading.value = false
    })
  }

  // 分页方法
  const handlePageChange = (currentPage, pageSize) => {
    pageParams.value.size = pageSize
    pageParams.value.current = currentPage
    queryDataMethod()
  }

  const handleQuery = (flag) => {
    // flag传true查当前页，否则查第一页
    !flag && (pageParams.value.current = 1)
    queryDataMethod()
  }

  const handleReset = async() => {
    const formEl = queryRef.value.queryFormRef
    if (!formEl) return
    await formEl.resetFields()

    // 重置后直接请求
    handleQuery()
  }

  const resetQuery = () => {
    queryDataList.value = []
    pageParams.value.current = 1
    pageParams.value.size = defaultPageSize
    total.value = 0
  }

  onMounted(() => {
    !noInit && queryDataMethod()
  })

  return {
    queryRef,
    handleQuery,
    handleReset,
    queryLoading,
    pageParams,
    queryDataList,
    total,
    queryDataMethod,
    handlePageChange,
    resetQuery
  }
}
