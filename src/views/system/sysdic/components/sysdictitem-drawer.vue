<template>
  <el-drawer
    v-model="drawerVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="drawerTitle"
    width="520px"
    append-to-body
    :before-close="handleCancel"
  >
    <el-form
      ref="dictItemFormRef"
      :model="dictItemForm"
      :rules="dictItemRules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-form-item label="字典项Key" prop="itemKey">
        <el-input
          v-model="dictItemForm.itemKey"
          :disabled="drawerType === 'edit'"
          placeholder="请输入字典项Key"
        />
      </el-form-item>
      <el-form-item label="字典项名称" prop="itemName">
        <el-input v-model="dictItemForm.itemName" placeholder="请输入字典项名称" />
      </el-form-item>
      <el-form-item label="字典项名称（英文）" prop="itemNameEnUS">
        <el-input v-model="dictItemForm.itemNameEnUS" placeholder="请输入字典项名称（英文）" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dictItemForm.remark" placeholder="请输入备注" type="textarea" />
      </el-form-item>
      <el-form-item label="排序" prop="orderNum">
        <el-input-number
          v-model="dictItemForm.orderNum"
          :min="0"
          :precision="0"
          controls-position="right"
          placeholder="请输入排序"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmitForm">保存</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { requestAddSysdictitem, requestUpdateSysdictitem } from '@/api/system/sysdic'

const props = defineProps({
  sysdictInfo: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['refresh-list'])

const dictItemFormDefault = {
  itemKey: '',
  itemName: '',
  itemNameEnUS: '',
  remark: '',
  orderNum: 1
}
const dictItemRules = reactive({
  itemKey: [{ required: true, message: '请输入字典项Key', trigger: 'blur' }],
  itemName: [{ required: true, message: '请输入字典项名称', trigger: 'blur' }],
  orderNum: [{ required: true, message: '请输入排序', trigger: 'blur' }]
})
const drawerType = ref('add')
const drawerTitle = ref('')
const dictItemFormRef = ref()
const drawerVisible = ref(false)
const dictItemForm = ref(dictItemFormDefault)

function openDrawer(item) {
  if (item) {
    dictItemForm.value = {
      id: item.id,
      itemKey: item.itemKey,
      itemName: item.itemName,
      itemNameEnUS: item.itemNameEnUS,
      remark: item.remark,
      orderNum: item.orderNum,
      version: item.version
    }
    drawerType.value = 'edit'
    drawerTitle.value = '字典项信息'
  } else {
    dictItemForm.value = dictItemFormDefault
    drawerType.value = 'add'
    drawerTitle.value = '新增'
  }
  drawerVisible.value = true
}
// 新增字典项
async function addDictItem() {
  const { id, type } = props.sysdictInfo
  const params = {
    dictId: id,
    itemKey: dictItemForm.value.itemKey,
    itemName: dictItemForm.value.itemName,
    itemNameEnUS: dictItemForm.value.itemNameEnUS,
    remark: dictItemForm.value.remark,
    orderNum: dictItemForm.value.orderNum,
    type
  }
  const result = await requestAddSysdictitem(params)
  const { code } = result
  if (code === 1) {
    ElMessage.success('保存成功')
    handleCancel()
    emit('refresh-list')
  } else {
    ElMessage.error('保存失败')
  }
}
// 编辑字典项
async function editDictItem() {
  const { id, type } = props.sysdictInfo
  const params = {
    id: dictItemForm.value.id,
    dictId: id,
    itemKey: dictItemForm.value.itemKey,
    itemName: dictItemForm.value.itemName,
    itemNameEnUS: dictItemForm.value.itemNameEnUS,
    remark: dictItemForm.value.remark,
    orderNum: dictItemForm.value.orderNum,
    type,
    version: dictItemForm.value.version
  }
  const result = await requestUpdateSysdictitem(params)
  const { code } = result
  if (code === 1) {
    ElMessage.success('保存成功')
    handleCancel()
    emit('refresh-list')
  } else {
    ElMessage.error('保存失败')
  }
}
// 点击保存按钮
function handleSubmitForm() {
  dictItemFormRef.value.validate((valid) => {
    if (valid) {
      if (drawerType.value === 'add') {
        addDictItem()
      } else {
        editDictItem()
      }
    }
  })
}
// 点击取消按钮
function handleCancel() {
  drawerVisible.value = false
  dictItemFormRef.value.resetFields()
}

defineExpose({
  openDrawer
})
</script>

<style lang="scss" scoped>
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
