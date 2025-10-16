import * as echarts from 'echarts/core'

import {
  BarChart,
  CustomChart,
  GaugeChart,
  BoxplotChart,
  LineChart,
  MapChart,
  PictorialBarChart,
  PieChart,
  RadarChart,
  ScatterChart,
  GraphChart,
  TreemapChart
} from 'echarts/charts'

import {
  AriaComponent,
  CalendarComponent,
  DataZoomComponent,
  DatasetComponent,
  TransformComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  ParallelComponent,
  PolarComponent,
  RadarComponent,
  TimelineComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import { UniversalTransition } from 'echarts/features';

import { SVGRenderer,CanvasRenderer } from 'echarts/renderers'

echarts.use([
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  UniversalTransition,
  DatasetComponent,
  TransformComponent,
  CanvasRenderer,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  BarChart,
  LineChart,
  GraphChart,
  PieChart,
  MapChart,
  RadarChart,
  BoxplotChart,
  GaugeChart,
  TreemapChart,
  SVGRenderer,
  PictorialBarChart,
  RadarComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
  MarkLineComponent,
  CustomChart,
  MarkPointComponent,
  MarkAreaComponent,
  ScatterChart
])

export default echarts
