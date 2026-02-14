<template>
  <div class="knowledge-graph-page">
    <div class="sidebar">
      <h2>知识图谱控制面板</h2>

      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索知识点..."
          clearable
          @input="handleSearch"
        >
          <template #suffix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <el-button class="btn-primary" type="primary" @click="loadFullGraph">
        加载完整图谱
      </el-button>

      <el-button class="btn-secondary" type="success" @click="testConnection">
        测试连接
      </el-button>

      <div class="stats">
        <p><strong>图谱统计</strong></p>
        <p>节点数: <span>{{ nodeCount }}</span></p>
        <p>关系数: <span>{{ edgeCount }}</span></p>
      </div>

      <div class="legend">
        <p><strong>节点分类</strong></p>
        <div class="legend-item">
          <div class="legend-dot" style="background: #1890ff"></div>
          <span>原理</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot" style="background: #52c41a"></div>
          <span>材料</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot" style="background: #faad14"></div>
          <span>设备</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot" style="background: #722ed1"></div>
          <span>工序</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot" style="background: #eb2f96"></div>
          <span>性能</span>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div ref="networkContainer" class="network-container"></div>

      <div v-if="selectedNode || selectedEdge" class="info-panel active">
        <el-button class="close-btn" circle type="danger" @click="closeInfoPanel">
          <el-icon><Close /></el-icon>
        </el-button>
        <div v-if="selectedNode" class="info-content">
          <h3>节点属性</h3>
          <div class="info-item">
            <div class="label">分类</div>
            <div
              class="value"
              :style="{ color: getNodeColor(selectedNode.group), fontWeight: 'bold' }"
            >
              {{ getGroupName(selectedNode.group) }}
            </div>
          </div>
          <div class="info-item">
            <div class="label">节点 ID</div>
            <div class="value">{{ selectedNode.id }}</div>
          </div>
          <div class="info-item">
            <div class="label">中文名</div>
            <div class="value">
              {{ selectedNode.properties?.中文名 || selectedNode.properties?.chineseName || '-' }}
            </div>
          </div>
          <div class="info-item">
            <div class="label">英文名</div>
            <div class="value">
              {{ selectedNode.properties?.英文名 || selectedNode.properties?.englishName || '-' }}
            </div>
          </div>
          <div class="info-item">
            <div class="label">文字描述</div>
            <div class="value">
              {{
                selectedNode.properties?.文字描述 ||
                selectedNode.properties?.textDescription ||
                '-'
              }}
            </div>
          </div>
          <div
            v-if="
              (selectedNode.properties?.链接 || selectedNode.properties?.link) &&
              (selectedNode.properties?.链接 || selectedNode.properties?.link) !== 'null'
            "
            class="info-item"
          >
            <div class="label">链接</div>
            <div class="value">
              <a
                :href="selectedNode.properties?.链接 || selectedNode.properties?.link"
                target="_blank"
                style="color: #1890ff"
              >
                {{ selectedNode.properties?.链接 || selectedNode.properties?.link }}
              </a>
            </div>
          </div>
        </div>
        <div v-if="selectedEdge" class="info-content">
          <h3>关系属性</h3>
          <div class="info-item">
            <div class="label">关系类型</div>
            <div class="value" style="color: #1890ff; font-weight: bold">
              {{ selectedEdge.label }}
            </div>
          </div>
          <div class="info-item">
            <div class="label">起始节点</div>
            <div class="value">{{ selectedEdge.fromLabel }}</div>
          </div>
          <div class="info-item">
            <div class="label">目标节点</div>
            <div class="value">{{ selectedEdge.toLabel }}</div>
          </div>
          <div class="info-item">
            <div class="label">关系描述</div>
            <div class="value">
              {{ selectedEdge.fromLabel }} {{ selectedEdge.label }} {{ selectedEdge.toLabel }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Close } from '@element-plus/icons-vue'
import request from '@/utils/request'

const networkContainer = ref(null)
const searchKeyword = ref('')
const nodeCount = ref(0)
const edgeCount = ref(0)
const selectedNode = ref(null)
const selectedEdge = ref(null)

let network = null
let allNodesData = []
let allEdgesData = []

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

  const data = {
    nodes: new window.vis.DataSet([]),
    edges: new window.vis.DataSet([])
  }

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
    } else if (params.edges.length > 0) {
      showEdgeInfo(params.edges[0])
    } else {
      closeInfoPanel()
    }
  })

  // 稳定化完成后禁用物理引擎
  network.once('stabilizationIterationsDone', () => {
    console.log('布局稳定化完成')
    network.setOptions({ physics: false })
  })

  console.log('网络图初始化完成')
}

// 加载完整图谱
async function loadFullGraph() {
  try {
    const result = await request({
      url: '/admin/knowledge-graph/full',
      method: 'get'
    })

    if (result.code === 1) {
      const graphData = result.response

      if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
        ElMessage.warning('没有找到图谱数据')
        return
      }

      updateGraph(graphData)
      ElMessage.success('图谱加载成功')
    } else {
      ElMessage.error('加载失败: ' + result.message)
    }
  } catch (error) {
    console.error('加载图谱失败:', error)
    ElMessage.error('加载图谱失败: ' + error.message)
  }
}

// 更新图谱数据
function updateGraph(graphData) {
  allNodesData = graphData.nodes
  allEdgesData = graphData.edges

  const nodes = allNodesData.map((node) => ({
    id: node.id,
    label: node.label,
    title: node.title || node.label,
    color: {
      background: getNodeColor(node.group),
      border: darkenColor(getNodeColor(node.group)),
      highlight: {
        background: getNodeColor(node.group),
        border: '#000'
      }
    },
    group: node.group,
    properties: node.properties
  }))

  const edges = allEdgesData.map((edge) => ({
    id: `${edge.from}-${edge.to}`,
    from: edge.from,
    to: edge.to,
    label: edge.label,
    title: edge.label
  }))

  network.setData({
    nodes: new window.vis.DataSet(nodes),
    edges: new window.vis.DataSet(edges)
  })

  // 更新统计信息
  nodeCount.value = nodes.length
  edgeCount.value = edges.length

  console.log('图谱数据已更新')
}

// 显示节点信息
function showNodeInfo(nodeId) {
  const node = allNodesData.find((n) => n.id === nodeId)
  if (!node) return

  selectedNode.value = node
  selectedEdge.value = null
}

// 显示边信息
function showEdgeInfo(edgeId) {
  const edge = allEdgesData.find((e) => `${e.from}-${e.to}` === edgeId)
  if (!edge) return

  const fromNode = allNodesData.find((n) => n.id === edge.from)
  const toNode = allNodesData.find((n) => n.id === edge.to)

  selectedEdge.value = {
    ...edge,
    fromLabel: fromNode ? fromNode.label : edge.from,
    toLabel: toNode ? toNode.label : edge.to
  }
  selectedNode.value = null
}

// 关闭信息面板
function closeInfoPanel() {
  selectedNode.value = null
  selectedEdge.value = null
}

// 测试连接
async function testConnection() {
  try {
    const result = await request({
      url: '/admin/knowledge-graph/test',
      method: 'get'
    })
    ElMessage.success(result.response || result.message)
  } catch (error) {
    ElMessage.error('连接失败: ' + error.message)
  }
}

// 搜索功能
function handleSearch() {
  const keyword = searchKeyword.value.toLowerCase()

  if (!network) return

  const nodes = network.body.data.nodes
  const allNodes = nodes.get()

  if (!keyword) {
    // 恢复所有节点颜色
    allNodes.forEach((node) => {
      const originalNode = allNodesData.find((n) => n.id === node.id)
      if (originalNode) {
        nodes.update({
          id: node.id,
          color: {
            background: getNodeColor(originalNode.group),
            border: darkenColor(getNodeColor(originalNode.group))
          }
        })
      }
    })
    return
  }

  // 高亮匹配的节点
  allNodes.forEach((node) => {
    const label = (node.label || '').toLowerCase()
    if (label.includes(keyword)) {
      nodes.update({
        id: node.id,
        color: {
          background: '#ff4d4f',
          border: '#cf1322'
        }
      })
    } else {
      nodes.update({
        id: node.id,
        color: {
          background: '#d9d9d9',
          border: '#bfbfbf'
        }
      })
    }
  })
}

onMounted(() => {
  // 确保 vis-network 已加载
  if (typeof window.vis === 'undefined') {
    ElMessage.error('vis-network 未加载')
    return
  }

  initNetwork()
})

onBeforeUnmount(() => {
  if (network) {
    network.destroy()
    network = null
  }
})
</script>

<style lang="scss" scoped>
.knowledge-graph-page {
  display: flex;
  height: calc(100vh - 84px);
  background: #f5f5f5;
}

.sidebar {
  width: 280px;
  background: white;
  padding: 15px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;

  h2 {
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
  }

  .search-box {
    margin-bottom: 10px;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }

  .stats {
    padding: 12px;
    background: #e6f7ff;
    border-radius: 4px;

    p {
      margin: 5px 0;
      font-size: 13px;
    }
  }

  .legend {
    padding: 12px;
    background: #f0f0f0;
    border-radius: 4px;

    p {
      margin: 5px 0;
      font-size: 13px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 5px 0;

      .legend-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
    }
  }
}

.main-content {
  flex: 1;
  display: flex;
  position: relative;
}

.network-container {
  width: 100%;
  height: 100%;
  background: #fafafa;
}

.info-panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 350px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow-y: auto;
  transform: translateX(100%);
  transition: transform 0.3s ease;

  &.active {
    transform: translateX(0);
  }

  .close-btn {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  h3 {
    margin-bottom: 15px;
    color: #1890ff;
    padding-right: 40px;
  }

  .info-item {
    margin-bottom: 12px;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 4px;

    .label {
      font-weight: bold;
      color: #666;
      font-size: 12px;
      margin-bottom: 5px;
    }

    .value {
      color: #333;
      font-size: 14px;
      word-break: break-all;
    }
  }
}
</style>
