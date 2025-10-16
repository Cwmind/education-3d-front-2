export const getDictLabel = (value,dictOptions) =>{
  let item = dictOptions.find(x => x.value === value)
  return item ? item.label : null
}

export const getDictLabels = (valueArr,dictOptions) =>{
  let arr =  valueArr.map(item => dictOptions.find(el => item === el.value))
  return arr.length ? arr.map(item =>item.label) : []
}

export const isInvalidValue = (value)=>{
  return value === '' || value === null || value === undefined
}

export const getDisableDate = (time) => {
  return time.getTime() > Date.now()
}
