<template>
  <div v-loading="queryLoading" class="attendance-analysis">
    <BasicNoData v-if="showNoData" />
    <template v-else>
      <div class="part-first mb20">
        <div class="title mb20">一、计算逻辑：</div>
        <div class="desc">数字院打卡工时贡献度 = 个人当月打卡工时/T3组织当月平均打卡工时*100%</div>
        <div class="desc">部门打卡工时贡献度 = 个人当月打卡工时/T4组织当月平均打卡工时*100%</div>
        <div class="desc">工时贡献度＜100%，即个人当月打卡工时小于T3/T4组织平均水平</div>
      </div>
      <div class="part-second mb20">
        <div class="title">二、数字工程分院当月工时贡献度统计：</div>
        <div class="desc mb20">
          <span> {{ queryParams.month }}月，数字工程分院</span>
          <template v-if="computedTotalAnalysis('小于100%', 'count') > 0">
            <span>
              个人工时贡献度小于100%的有{{ computedTotalAnalysis('小于100%', 'count') }}人，
            </span>
            <span class="black">占比{{ computedTotalAnalysis('小于100%', 'percentage') }}%</span>
          </template>
          <template v-else>
            <span>个人工时贡献度没有贡献度小于100%人员</span>
          </template>
          <template v-if="computedTotalAnalysis('100%-120%', 'count') > 0">
            <span>；在100%-120%之间的有{{ computedTotalAnalysis('100%-120%', 'count') }}人，</span>
            <span class="black">占比{{ computedTotalAnalysis('100%-120%', 'percentage') }}%</span>
          </template>
          <template v-else>
            <span>；没有贡献度在100%-120%之间的人员</span>
          </template>
          <template v-if="computedTotalAnalysis('大于120%', 'count') > 0">
            <span>；大于120%的有{{ computedTotalAnalysis('大于120%', 'count') }}人，</span>
            <span class="black">占比{{ computedTotalAnalysis('大于120%', 'percentage') }}%</span>
          </template>
          <template v-else>
            <span>；没有贡献度大于120%的人员</span>
          </template>
          <span>。数字工程分院工时贡献度占比分布如下图所示。</span>
        </div>
        <attendance-analysis-pie ref="totalAnalysisChartRef" />
      </div>
      <div class="part-third mb20">
        <div class="title">三、各部门情况分析：</div>
        <div class="desc">{{ queryParams.month }}月各部门项目打卡工时情况。</div>
        <div class="desc">
          <span class="black">AI算法研究部，</span>
          <span class="blue">部门平均打卡工时{{ computedAvgDeptData('AI算法研究部') }}h。</span>
          <span>个人打卡工时贡献度</span>
          <template v-if="computedAidAnalysis('小于100%', 'count') > 0">
            <span class="blue">
              小于100%的有{{ computedAidAnalysis('小于100%', 'count') }} 人，
            </span>
            <span class="blue font-wight-600">
              占比{{ computedAidAnalysis('小于100%', 'percentage') }}%
            </span>
          </template>
          <template v-else>
            <span>没有贡献度小于100%人员</span>
          </template>
          <template v-if="computedAidAnalysis('100%-120%', 'count') > 0">
            <span>；100%-120%的有{{ computedAidAnalysis('100%-120%', 'count') }}人，</span>
            <span class="black">占比{{ computedAidAnalysis('100%-120%', 'percentage') }}%</span>
          </template>
          <template v-else>
            <span>；没有贡献度在100%-120%之间的人员</span>
          </template>
          <template v-if="computedAidAnalysis('大于120%', 'count') > 0">
            <span>；大于120%的有{{ computedAidAnalysis('大于120%', 'count') }}人，</span>
            <span class="black">占比{{ computedAidAnalysis('大于120%', 'percentage') }}%</span>
            <span>。</span>
          </template>
          <template v-else>
            <span>；没有贡献度大于120%的人员。</span>
          </template>
        </div>
        <attendance-analysis-pie ref="aidAnalysisChartRef" />
        <div class="desc">
          <span class="black">数据系统研究部，</span>
          <span class="blue">部门平均打卡工时{{ computedAvgDeptData('数据系统研究部') }}h。</span>
          <span>个人打卡工时贡献度</span>
          <template v-if="computedDdAnalysis('小于100%', 'count') > 0">
            <span class="blue">小于100%的有{{ computedDdAnalysis('小于100%', 'count') }} 人，</span>
            <span class="blue font-wight-600">
              占比{{ computedDdAnalysis('小于100%', 'percentage') }}%
            </span>
          </template>
          <template v-else>
            <span>没有贡献度小于100%人员</span>
          </template>
          <template v-if="computedDdAnalysis('100%-120%', 'count') > 0">
            <span>；100%-120%的有{{ computedDdAnalysis('100%-120%', 'count') }}人，</span>
            <span class="black">占比{{ computedDdAnalysis('100%-120%', 'percentage') }}%</span>
          </template>
          <template v-else>
            <span>；没有贡献度在100%-120%之间的人员</span>
          </template>
          <template v-if="computedDdAnalysis('大于120%', 'count') > 0">
            <span>；大于120%的有{{ computedDdAnalysis('大于120%', 'count') }}人，</span>
            <span class="black">占比{{ computedDdAnalysis('大于120%', 'percentage') }}%</span>
            <span>。</span>
          </template>
          <template v-else>
            <span>；没有贡献度大于120%的人员。</span>
          </template>
        </div>
        <attendance-analysis-pie ref="ddAnalysisChartRef" />
        <div class="desc">
          <span class="black">软件系统研发部，</span>
          <span class="blue">部门平均打卡工时{{ computedAvgDeptData('软件系统研发部') }}h。</span>
          <span>个人打卡工时贡献度</span>
          <template v-if="computedSdAnalysis('小于100%', 'count') > 0">
            <span class="blue">小于100%的有{{ computedSdAnalysis('小于100%', 'count') }} 人，</span>
            <span class="blue font-wight-600">
              占比{{ computedSdAnalysis('小于100%', 'percentage') }}%
            </span>
          </template>
          <template v-else>
            <span>没有贡献度小于100%人员</span>
          </template>
          <template v-if="computedSdAnalysis('100%-120%', 'count') > 0">
            <span>；100%-120%的有{{ computedSdAnalysis('100%-120%', 'count') }}人，</span>
            <span class="black">占比{{ computedSdAnalysis('100%-120%', 'percentage') }}%</span>
          </template>
          <template v-else>
            <span>；没有贡献度在100%-120%之间的人员</span>
          </template>
          <template v-if="computedSdAnalysis('大于120%', 'count') > 0">
            <span>；大于120%的有{{ computedSdAnalysis('大于120%', 'count') }}人，</span>
            <span class="black">占比{{ computedSdAnalysis('大于120%', 'percentage') }}%</span>
            <span>。</span>
          </template>
          <template v-else>
            <span>；没有贡献度大于120%的人员。</span>
          </template>
        </div>
        <attendance-analysis-pie ref="sdAnalysisChartRef" />
        <div class="desc">
          <span class="black">数字运营平台部，</span>
          <span class="blue">部门平均打卡工时{{ computedAvgDeptData('数字运营平台部') }}h。</span>
          <span>个人打卡工时贡献度</span>
          <template v-if="computedDpdAnalysis('小于100%', 'count') > 0">
            <span class="blue">
              小于100%的有{{ computedDpdAnalysis('小于100%', 'count') }} 人，
            </span>
            <span class="blue font-wight-600">
              占比{{ computedDpdAnalysis('小于100%', 'percentage') }}%
            </span>
          </template>
          <template v-else>
            <span>没有贡献度小于100%人员</span>
          </template>
          <template v-if="computedDpdAnalysis('100%-120%', 'count') > 0">
            <span>；100%-120%的有{{ computedDpdAnalysis('100%-120%', 'count') }}人，</span>
            <span class="black">占比{{ computedDpdAnalysis('100%-120%', 'percentage') }}%</span>
          </template>
          <template v-else>
            <span>；没有贡献度在100%-120%之间的人员</span>
          </template>
          <template v-if="computedDpdAnalysis('大于120%', 'count') > 0">
            <span>；大于120%的有{{ computedDpdAnalysis('大于120%', 'count') }}人，</span>
            <span class="black">占比{{ computedDpdAnalysis('大于120%', 'percentage') }}%</span>
            <span>。</span>
          </template>
          <template v-else>
            <span>；没有贡献度大于120%的人员。</span>
          </template>
        </div>
        <attendance-analysis-pie ref="dpdAnalysisChartRef" />
      </div>
      <div class="part-four mb20">
        <div class="title">四、各部门个人情况分析</div>
        <div class="desc">
          {{ queryParams.month }}月各部门个人考勤打卡工时贡献率的前五名和后五名如下：
        </div>
        <div class="four-desc">AI算法研究部(前五名、后五名)</div>
        <attendance-analysis-table ref="aidAnalysisTableRef" />
        <div class="four-desc">数据系统研究部(前五名、后五名)</div>
        <attendance-analysis-table ref="ddAnalysisTableRef" />
        <div class="four-desc">软件系统研发部(前五名、后五名)</div>
        <attendance-analysis-table ref="sdAnalysisTableRef" />
        <div class="four-desc">数字运营平台部(前五名、后五名)</div>
        <attendance-analysis-table ref="dpdAnalysisTableRef" />
      </div>
    </template>
  </div>
</template>

<script setup>
import AttendanceAnalysisPie from './attendance-analysis-pie.vue'
import AttendanceAnalysisTable from './attendance-analysis-table.vue'
import { requestAttendanceAnalysisData } from '@/api/report/attendance'
import { computed, nextTick } from 'vue'
const queryLoading = ref(false)
const showNoData = ref(true)
const queryParams = ref({})
function loadPage(params) {
  queryParams.value = params
  getAttendanceAnalysisData()
}
const totalAnalysis = ref([])
const aidAnalysis = ref([])
const ddAnalysis = ref([])
const sdAnalysis = ref([])
const dpdAnalysis = ref([])
const avgDeptData = ref([])

const totalAnalysisChartRef = ref(null)
const aidAnalysisChartRef = ref(null)
const ddAnalysisChartRef = ref(null)
const sdAnalysisChartRef = ref(null)
const dpdAnalysisChartRef = ref(null)
const aidAnalysisTableRef = ref(null)
const ddAnalysisTableRef = ref(null)
const sdAnalysisTableRef = ref(null)
const dpdAnalysisTableRef = ref(null)

const computedTotalAnalysis = computed(() => {
  return (type, filter) => {
    const result = totalAnalysis.value.find((item) => item.intervalRange === type)
    if (filter === 'count') {
      return result ? result.count : 0
    } else if (filter === 'percentage') {
      return result ? result.percentage : '-'
    } else {
      return 0
    }
  }
})
const computedAidAnalysis = computed(() => {
  return (type, filter) => {
    const result = aidAnalysis.value.find((item) => item.intervalRange === type)
    if (filter === 'count') {
      return result ? result.count : 0
    } else if (filter === 'percentage') {
      return result ? result.percentage : '-'
    } else {
      return 0
    }
  }
})
const computedDdAnalysis = computed(() => {
  return (type, filter) => {
    const result = ddAnalysis.value.find((item) => item.intervalRange === type)
    if (filter === 'count') {
      return result ? result.count : 0
    } else if (filter === 'percentage') {
      return result ? result.percentage : '-'
    } else {
      return 0
    }
  }
})
const computedSdAnalysis = computed(() => {
  return (type, filter) => {
    const result = sdAnalysis.value.find((item) => item.intervalRange === type)
    if (filter === 'count') {
      return result ? result.count : 0
    } else if (filter === 'percentage') {
      return result ? result.percentage : '-'
    } else {
      return 0
    }
  }
})
const computedDpdAnalysis = computed(() => {
  return (type, filter) => {
    const result = dpdAnalysis.value.find((item) => item.intervalRange === type)
    if (filter === 'count') {
      return result ? result.count : 0
    } else if (filter === 'percentage') {
      return result ? result.percentage : '-'
    } else {
      return 0
    }
  }
})
const computedAvgDeptData = computed(() => {
  return (type) => {
    const result = avgDeptData.value.find((item) => item.dept === type)
    return result ? result.avgDept : '-'
  }
})

async function getAttendanceAnalysisData() {
  try {
    queryLoading.value = true
    const result = await requestAttendanceAnalysisData(queryParams.value)
    queryLoading.value = false
    const { code, response } = result
    if (code === 1 && response) {
      const { analysisData, rankData, deptData } = response
      if (analysisData && analysisData.length > 0) {
        showNoData.value = false
        avgDeptData.value = deptData
        const total = []
        const aid = []
        const dd = []
        const sd = []
        const dpd = []
        analysisData.forEach((item) => {
          if (item.dept === '数字工程分院') {
            total.push(item)
          } else if (item.dept === 'AI算法研究部') {
            aid.push(item)
          } else if (item.dept === '数据系统研究部') {
            dd.push(item)
          } else if (item.dept === '软件系统研发部') {
            sd.push(item)
          } else if (item.dept === '数字运营平台部') {
            dpd.push(item)
          }
        })
        const aidTableData = []
        const ddTableData = []
        const sdTableData = []
        const dpdTableData = []
        rankData.forEach((item) => {
          if (item.dept === 'AI算法研究部') {
            aidTableData.push(item)
          } else if (item.dept === '数据系统研究部') {
            ddTableData.push(item)
          } else if (item.dept === '软件系统研发部') {
            sdTableData.push(item)
          } else if (item.dept === '数字运营平台部') {
            dpdTableData.push(item)
          }
        })
        totalAnalysis.value = total
        aidAnalysis.value = aid
        ddAnalysis.value = dd
        sdAnalysis.value = sd
        dpdAnalysis.value = dpd
        nextTick(() => {
          totalAnalysisChartRef.value.setChartData({
            title: '数字工程分院工时贡献度分布',
            chartData: total
          })
          aidAnalysisChartRef.value.setChartData({
            title: 'AI算法研究部工时贡献度分布',
            chartData: aid
          })
          ddAnalysisChartRef.value.setChartData({
            title: '数据系统研究部工时贡献度分布',
            chartData: dd
          })
          sdAnalysisChartRef.value.setChartData({
            title: '软件系统研发部工时贡献度分布',
            chartData: sd
          })
          dpdAnalysisChartRef.value.setChartData({
            title: '数字运营平台部工时贡献度分布',
            chartData: dpd
          })
          aidAnalysisTableRef.value.setTableData(aidTableData)
          ddAnalysisTableRef.value.setTableData(ddTableData)
          sdAnalysisTableRef.value.setTableData(sdTableData)
          dpdAnalysisTableRef.value.setTableData(dpdTableData)
        })
      } else {
        showNoData.value = true
      }
    } else {
      showNoData.value = true
    }
  } catch (error) {
    queryLoading.value = false
    showNoData.value = true
  }
}
defineExpose({
  loadPage
})
</script>

<style lang="scss" scoped>
.attendance-analysis {
  width: 100%;
  height: 100%;
  user-select: none;
  overflow-x: hidden;
  overflow-y: auto;
  .title {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
  }
  .desc {
    font-size: 16px;
    color: #666;
    text-indent: 2em;
    margin-bottom: 8px;
    .black {
      font-weight: 600;
      color: #333;
    }
    .blue {
      color: #3a5cc2;
    }
    .font-wight-600 {
      font-weight: 600;
    }
  }
  .four-desc {
    color: #3a5cc2;
    font-weight: 600;
    font-size: 16px;
    margin: 18px 0;
    text-align: center;
  }
}
</style>
