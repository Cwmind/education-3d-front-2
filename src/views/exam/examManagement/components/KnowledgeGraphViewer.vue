<template>
  <div class="knowledge-graph-viewer">
    <div class="graph-toolbar">
      <div class="stats-info">
        <span class="stat-item">节点数: {{ nodeCount }}</span>
        <span class="stat-item">边数: {{ edgeCount }}</span>
        <span class="stat-item">总题目数: {{ totalQuestions }}</span>
      </div>
      <div class="toolbar-actions">
        <el-button size="small" @click="resetLayout">重置布局</el-button>
        <el-button size="small" @click="fitView">适应画布</el-button>
      </div>
    </div>
    <div ref="networkContainer" class="network-container"></div>
    <div v-if="selectedNode" class="info-panel">
      <div class="panel-header">
        <span>节点详情</span>
        <el-icon class="close-icon" @click="closeInfoPanel"><Close /></el-icon>
      </div>
      <div class="panel-content">
        <div class="info-item">
          <span class="label">分类:</span>
          <span class="value" :style="{ color: getNodeColor(selectedNode.group) }">
            {{ getGroupName(selectedNode.group) }}
          </span>
        </div>
        <div class="info-item">
          <span class="label">中文名:</span>
          <span class="value">{{ selectedNode.properties?.chineseName || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">英文名:</span>
          <span class="value">{{ selectedNode.properties?.englishName || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">描述:</span>
          <span class="value">{{ selectedNode.properties?.textDescription || '-' }}</span>
        </div>
        <div v-if="selectedNode.properties?.questionCount" class="info-item">
          <span class="label">题目数量:</span>
          <span class="value">{{ selectedNode.properties.questionCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Close } from '@element-plus/icons-vue'

const props = defineProps({
  graphData: {
    type: Object,
    default: null
  }
})

const networkContainer = ref(null)
const selectedNode = ref(null)
const nodeCount = ref(0)
const edgeCount = ref(0)
const totalQuestions = ref(0)

let network = null
let nodes = null
let edges = null

// 节点分类映射
const groupNames = {
  principle: '原理',
  material: '材料',
  equipment: '设备',
  process: '工序',
  performance: '性能'
}

// 节点颜色映射
const nodeColors = {
  principle: '#1890ff',
  material: '#52c41a',
  equipment: '#faad14',
  process: '#722ed1',
  performance: '#eb2f96',
  default: '#8c8c8c'
}

// 获取节点颜色
function getNodeColor(group) {
  return nodeColors[group] || nodeColors.default
}

// 加深颜色（用于边框）
function darkenColor(color) {
  const darkColors = {
    '#1890ff': '#0050b3',
    '#52c41a': '#237804',
    '#faad14': '#ad6800',
    '#722ed1': '#391085',
    '#eb2f96': '#9e1068',
    '#8c8c8c': '#595959'
  }
  return darkColors[color] || '#000'
}

// 获取分类名称
function getGroupName(group) {
  return groupNames[group] || '未分类'
}

// 初始化网络图
function initNetwork() {
  if (!networkContainer.value) return

  // 创建数据集
  nodes = new window.vis.DataSet([])
  edges = new window.vis.DataSet([])

  const data = { nodes, edges }

  const options = {
    nodes: {
      shape: 'dot',
      size: 16,
      font: {
        size: 12,
        color: '#333'
      },
      borderWidth: 2,
      borderWidthSelected: 3
    },
    edges: {
      width: 1.5,
      color: {
        color: '#cccccc',
        highlight: '#1890ff',
        hover: '#1890ff'
      },
      arrows: {
        to: {
          enabled: true,
          scaleFactor: 0.5
        }
      },
      smooth: {
        type: 'continuous',
        roundness: 0.5
      },
      font: {
        size: 11,
        color: '#666',
        strokeWidth: 0
      }
    },
    physics: {
      enabled: true,
      solver: 'forceAtlas2Based',
      forceAtlas2Based: {
        gravitationalConstant: -50,
        centralGravity: 0.01,
        springLength: 100,
        springConstant: 0.08,
        damping: 0.4,
        avoidOverlap: 0.5
      },
      stabilization: {
        enabled: true,
        iterations: 200,
        updateInterval: 25
      }
    },
    interaction: {
      hover: true,
      tooltipDelay: 100,
      hideEdgesOnDrag: true,
      hideEdgesOnZoom: true
    }
  }

  network = new window.vis.Network(networkContainer.value, data, options)

  // 节点点击事件
  network.on('click', (params) => {
    if (params.nodes.length > 0) {
      showNodeInfo(params.nodes[0])
    } else {
      closeInfoPanel()
    }
  })

  // 稳定化完成后禁用物理引擎
  network.once('stabilizationIterationsDone', () => {
    console.log('布局稳定化完成')
    network.setOptions({ physics: false })
  })
}

// 更新图谱数据
function updateGraph(graphData) {
  if (!graphData || !network) return

  // 类型映射：将中文类型映射到英文 group
  const typeToGroup = {
    '原理': 'principle',
    '材料': 'material',
    '设备': 'equipment',
    '工序': 'process',
    '性能': 'performance'
  }

  const nodesData = (graphData.nodes || []).map((node) => {
    // 兼容后端返回的 type 字段和 group 字段
    const group = node.group || typeToGroup[node.type] || 'default'
    // 兼容后端返回的 name 字段和 label 字段
    const label = node.label || node.name || node.properties?.chineseName || node.id

    return {
      id: node.id,
      label: label,
      title: node.properties?.chineseName || label,
      color: {
        background: getNodeColor(group),
        border: darkenColor(getNodeColor(group)),
        highlight: {
          background: getNodeColor(group),
          border: '#000'
        }
      },
      group: group,
      properties: node.properties
    }
  })

  const edgesData = (graphData.edges || []).map((edge) => {
    // 兼容后端返回的 source/target 和 from/to 字段
    const from = edge.from || edge.source
    const to = edge.to || edge.target
    // 兼容后端返回的 type 和 label 字段
    const label = edge.label || edge.type || ''

    return {
      id: `${from}-${to}`,
      from: from,
      to: to,
      label: label,
      title: label
    }
  })

  nodes.clear()
  edges.clear()
  nodes.add(nodesData)
  edges.add(edgesData)

  // 更新统计信息
  nodeCount.value = nodesData.length
  edgeCount.value = edgesData.length
  totalQuestions.value = graphData.statistics?.totalQuestions || 0
}

// 显示节点信息
function showNodeInfo(nodeId) {
  const nodeData = nodes.get(nodeId)
  if (nodeData) {
    selectedNode.value = nodeData
  }
}

// 关闭信息面板
function closeInfoPanel() {
  selectedNode.value = null
}

// 重置布局
function resetLayout() {
  if (network) {
    network.setOptions({ physics: { enabled: true }})
    network.stabilize()
    setTimeout(() => {
      network.setOptions({ physics: { enabled: false }})
    }, 2000)
  }
}

// 适应画布
function fitView() {
  if (network) {
    network.fit({
      animation: {
        duration: 500,
        easingFunction: 'easeInOutQuad'
      }
    })
  }
}

// 监听 graphData 变化
watch(
  () => props.graphData,
  (newData) => {
    console.log('KnowledgeGraphViewer: graphData changed', newData)
    if (newData) {
      updateGraph(newData)
    }
  },
  { deep: true }
)

onMounted(() => {
  console.log('KnowledgeGraphViewer: mounted')
  // 确保 vis-network 已加载
  if (typeof window.vis === 'undefined') {
    console.error('vis-network 未加载')
    return
  }

  initNetwork()

  // 如果初始化时已有数据，则更新图谱
  if (props.graphData) {
    console.log('KnowledgeGraphViewer: initial graphData', props.graphData)
    updateGraph(props.graphData)
  }
})

onBeforeUnmount(() => {
  if (network) {
    network.destroy()
    network = null
  }
})
</script>

<style lang="scss" scoped>
.knowledge-graph-viewer {
  position: relative;
  width: 100%;
  height: 500px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.graph-toolbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  z-index: 10;
}

.stats-info {
  display: flex;
  gap: 20px;

  .stat-item {
    font-size: 13px;
    color: #606266;
  }
}

.toolbar-actions {
  display: flex;
  gap: 10px;
}

.network-container {
  width: 100%;
  height: 100%;
  background: #fafafa;
}

.info-panel {
  position: absolute;
  right: 0;
  top: 40px;
  bottom: 0;
  width: 300px;
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 20;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #dcdfe6;
  font-weight: 500;
  color: #303133;

  .close-icon {
    cursor: pointer;
    font-size: 18px;
    color: #909399;

    &:hover {
      color: #303133;
    }
  }
}

.panel-content {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}

.info-item {
  margin-bottom: 15px;

  .label {
    display: block;
    font-size: 12px;
    color: #909399;
    margin-bottom: 5px;
  }

  .value {
    display: block;
    font-size: 14px;
    color: #303133;
    word-break: break-all;
  }
}
</style>
