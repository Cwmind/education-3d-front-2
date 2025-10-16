<!-- 给el-select 二次封装 options属性 -->
<template>
  <el-select
    v-model="_value"
    :placeholder="placeholder"
    :clearable="clearable"
    :teleported="teleported"
    @change="change"
  >
    <el-option
      v-for="dict in options"
      :key="dict[valueKey]"
      :label="dict[labelKey]"
      :value="dict[valueKey]"
    />
  </el-select>
</template>

<script setup>
const props = defineProps({
  value: {
    type: [String, Number, null, undefined],
    default: undefined
  },
  options: {
    type: Array,
    default: () => []
  },
  clearable: {
    type: Boolean,
    default: false
  },
  teleported: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  valueKey: {
    type: String,
    default: 'value'
  },
  labelKey: {
    type: String,
    default: 'label'
  }
})
const emit = defineEmits(['update:value'])
const _value = ref(props.value)
watch(props.value, (val) => {
  _value.value = val
}, {
  immediate: true
})
const change = (e) => {
  emit('update:value', e)
}

</script>

<style scoped lang="scss">
</style>
