import { reactive, toRefs } from 'vue'

export function useList(api: (params: any) => Promise<Recordable>,
  initParam: object = {},
  isPageable = true, // 是否有分页
  dataCallBack?: (data: any) => any) {

  const state = reactive({
    records: [],
    total: 100,
    current: 1,
    size: 10
  })
  const dataSource = ref({
    dataSource:{
      records: [],
      total: 100,
      current: 1,
      size: 10
    }
  })
  const queryParams = ref({

  })

  const getList = async (parameter: any) => {
    try {
      // 先把初始化参数和分页参数放到总参数里面
      Object.assign(state.totalParam, initParam, isPageable ? parameter : {})
      let { data } = await api({
        ...state.searchInitParam,
        ...state.totalParam,
      })
      dataCallBack && (data = dataCallBack(data))
      // state.tableData = isPageable ? data.list : data;
      state.tableData = isPageable ? data : data
      // 解构后台返回的分页数据 (如果有分页更新分页信息)
      const { current, size, total } = data
      isPageable && updatePageable({ current, size, total })
    }
    catch (error) {
      console.log(error)
    }
  }
  const updatePageable = (resPageable: any) => {
    Object.assign(state.pageable, resPageable)
  }
  return {
    ...toRefs(state),
    getTableList,
  }
}

