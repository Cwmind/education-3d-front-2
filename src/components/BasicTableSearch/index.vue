<!-- 表格页面头部查询组件 -->
<template>
  <div class="basic-search">
    <div class="basic-search-form">
      <el-form ref="queryRef" :model="queryParams" :label-width="labelWidth">
        <el-row :gutter="16">
          <slot name="searchItems"></slot>
          <slot v-if="expend" name="expendSearchItems"></slot>
        </el-row>
      </el-form>
    </div>

    <div class="basic-search-button">
      <div>
        <slot name="extraButtons"></slot>
        <el-button v-if="props.showReset" @click="handleReset(queryRef)" :icon="Refresh">
          重置
        </el-button>
        <el-button type="primary" @click="handleSearch" :icon="Search">查询</el-button>
      </div>
      <div v-if="$slots.expendSearchItems" class="basic-search-expend" @click="toggleExpend">
        <span class="basic-font-14">{{ expend ? '收起' : '展开' }}</span>
        <svg-icon
          icon-class="search-expend"
          class="basic-font-16"
          :class="{ 'rotate-180': !expend }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Search, Refresh } from '@element-plus/icons-vue'

const props = defineProps({
  // 查询参数
  queryParams: {
    type: Object,
    default: () => {}
  },
  // 是否展示重置按钮
  showReset: {
    type: Boolean,
    default: true
  },
  // 重置方法
  handleReset: {
    type: Function,
    default: () => {}
  },
  // 查询方法
  handleSearch: {
    type: Function,
    default: () => {}
  },
  // 查询条件label宽度 auto默认最大宽度
  labelWidth: {
    type: String,
    default: 'auto'
  }
})

const expend = ref(false)
const toggleExpend = () => {
  expend.value = !expend.value
}
</script>

<style lang="scss" scoped></style>
