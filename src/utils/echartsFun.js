import variables from '@/assets/styles/variables.module.scss'
import { isInvalidValue } from '@/utils/fun'
import { deepClone } from '@/utils/index'
const baseColors = ['rgba(31, 120, 255, 1)','rgba(227, 77, 89, 1)']

const baseYAxis = {
  type: 'value',
  name: '',
  position: 'left',
  axisLabel: {
    color: variables.chartTextLightTheme
  },
  splitLine: {
    lineStyle: {
      color: variables.chartSplitLineLightTheme
    }
  },
  alignTicks:true,
  nameTextStyle: {
    align: 'right',
    color: variables.chartTextLightTheme,
  },
  axisTick:{
    show:false
  },
  color: variables.chartTextLightTheme,
  axisLine: {
    show: false
  }
}
const baseYAxisDark = {
  type: 'value',
  name: '',
  position: 'left',
  axisLabel: {
    color: variables.chartTextDarkTheme
  },
  splitLine: {
    lineStyle: {
      color: variables.chartSplitLineDarkTheme,
      type:[2,10],
      dashOffset:5,
    }
  },
  nameTextStyle: {
    align: 'right',
    color: variables.chartTextDarkTheme,
  },
  alignTicks:true,
  axisTick:{
    show:false
  },
  color: variables.chartTextDarkTheme,
  axisLine: {
    show: false,
  }
}
const getRandomData = (max = 100, length = 10) => {
  const arr = []
  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * max))
  }
  return arr
}
const baseOptions = {
  tooltip: {
    trigger: 'axis',
    confine:true,
    axisPointer: {
      type: 'cross'
    }
  },
  grid: {
    left: 80,
    right: 80,
    bottom:40,
  },
  color:baseColors,
  legend: {
    data: [],
    textStyle:{
      color: variables.chartTextLightTheme
    },
    right: 0
  },
  xAxis: [
    {
      type: 'category',
      name:'',
      axisTick: {
        show: false
      },
      axisLabel:{
        color: variables.chartTextLightTheme
      },
      nameTextStyle: {
        align: 'left',
        color: variables.chartTextLightTheme,
      },
      axisLine: {
        show: false
      },
      data: []
    }
  ],
  yAxis: [baseYAxis],
  series: []
}

const getDarkBaseOptions = ()=>{
  let optionsCopy = JSON.parse(JSON.stringify(baseOptions))
  optionsCopy.legend.textStyle.color = variables.chartTextDarkTheme
  optionsCopy.xAxis[0].axisLabel.color = variables.chartTextDarkTheme
  optionsCopy.xAxis[0].axisLine = {
    show:true,
    lineStyle:{
      color:'rgba(63, 79, 94, 1)'
    }
  }
  return optionsCopy
}

const getLinear = (color1,color2) =>{
  return {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [{
      offset: 0, color:color1 // 0% 处的颜色
    }, {
      offset: 1, color: color2 // 100% 处的颜色
    }],
    global: false // 缺省为 false
  }
}

// 生产一个不显示在chart上的series 用于调节y轴范围
// eg：标线为10 数据[1,0,3] 此时标线是不显示的 添加一个10的series y轴即可自适应
const getSilentSeriesForMarkLine = (yAxisIndex,data) => {
  return {
    yAxisIndex: yAxisIndex,
    type: 'scatter',
    symbol: 'none',
    silent: true,
    tooltip: {
      show: false // 不显示在 tooltip 中
    },
    data: [data]
  }
}

const getYAxis = (names,theme = 'light') =>{
  let yAxis = JSON.parse(JSON.stringify(theme === 'light' ? baseYAxis : baseYAxisDark))
  if(names.length === 1){
    yAxis.name = names[0]
    return [yAxis]
  }
  if(names.length > 1){
    let arr = [
      {
        ...yAxis
      },{
        ...JSON.parse(JSON.stringify(theme === 'light' ? baseYAxis : baseYAxisDark))
      },
    ]
    arr[0].name = names[0]
    arr[1].name = names[1]
    arr[1].position = 'right'
    arr[1].nameTextStyle.align = 'left'
    return arr
  }
  if(names.length === 0){
    return []
  }
}

const getMarkLineYAxis = (value,text,value2,text2,theme) =>{
  if(isInvalidValue(value)){
    return {}
  }
  let temp = {
    symbol: 'none', // 去掉辅助线首尾圆点和箭头
    data: [
      {
        yAxis: value, // 纵坐标的值，决定横向辅助线在y轴的位置
        label: {
          position:'insideStartTop',
          formatter: text,
          color: theme === 'light' ? baseColors[1] : baseColors[0],
        },
        lineStyle: {
          color: theme === 'light' ? baseColors[1] : baseColors[0],
          type: 'solid' // 实线
        },
      }
    ]
  }
  if(value2){
    temp.data.push({
      yAxis: value2, // 纵坐标的值，决定横向辅助线在y轴的位置
      label: {
        position:'insideEndTop',
        formatter: text2,
        color: theme === 'light' ? baseColors[1] : baseColors[0],
      },
      lineStyle: {
        color: theme === 'light' ? baseColors[1] : baseColors[0],
        type: 'solid' // 实线
      },
    })
  }
  return temp
}

export {
  baseOptions,
  getMarkLineYAxis,
  getLinear,
  getRandomData,
  baseColors,
  getSilentSeriesForMarkLine,
  getDarkBaseOptions,
  getYAxis
}
