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
      ref="sysdictFormRef"
      :model="sysdictForm"
      :rules="sysdictRules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-form-item label="分类" prop="type">
        <el-input
          v-model="sysdictForm.type"
          :disabled="drawerType === 'edit'"
          placeholder="请输入分类"
        />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="sysdictForm.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="名称（英文）" prop="nameEnUS">
        <el-input v-model="sysdictForm.nameEnUS" placeholder="请输入名称（英文）" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="sysdictForm.remark" placeholder="请输入备注" type="textarea" />
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
import { requestAddSysdict, requestUpdateSysdict } from '@/api/system/sysdic'

const emit = defineEmits(['refresh-dict'])

const sysdictFormDefault = {
  type: '',
  name: '',
  remark: '',
  nameEnUS: ''
}
const sysdictRules = reactive({
  type: [{ required: true, message: '请输入分类', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
})
const drawerType = ref('add')
const drawerTitle = ref('')
const sysdictFormRef = ref()
const drawerVisible = ref(false)
const sysdictForm = ref(sysdictFormDefault)

function openDrawer(item) {
  if (item) {
    sysdictForm.value = {
      id: item.id,
      type: item.type,
      name: item.name,
      nameEnUS: item.nameEnUS,
      remark: item.remark,
      version: item.version
    }
    drawerType.value = 'edit'
    drawerTitle.value = '字典信息'
  } else {
    sysdictForm.value = sysdictFormDefault
    drawerType.value = 'add'
    drawerTitle.value = '新增'
  }
  drawerVisible.value = true
}
// 新增字典项
async function addSysdict() {
  const params = {
    type: sysdictForm.value.type,
    name: sysdictForm.value.name,
    nameEnUS: sysdictForm.value.nameEnUS,
    remark: sysdictForm.value.remark
  }
  const result = await requestAddSysdict(params)
  const { code } = result
  if (code === 1) {
    ElMessage.success('保存成功')
    handleCancel()
    emit('refresh-dict')
  } else {
    ElMessage.error('保存失败')
  }
}
// 编辑字典项
async function editSysdict() {
  const params = {
    id: sysdictForm.value.id,
    type: sysdictForm.value.type,
    name: sysdictForm.value.name,
    nameEnUS: sysdictForm.value.nameEnUS,
    remark: sysdictForm.value.remark,
    version: sysdictForm.value.version
  }
  const result = await requestUpdateSysdict(params)
  const { code } = result
  if (code === 1) {
    ElMessage.success('保存成功')
    handleCancel()
    emit('refresh-dict')
  } else {
    ElMessage.error('保存失败')
  }
}
// 点击保存按钮
function handleSubmitForm() {
  sysdictFormRef.value.validate((valid) => {
    if (valid) {
      if (drawerType.value === 'add') {
        addSysdict()
      } else {
        editSysdict()
      }
    }
  })
}
// 点击取消按钮
function handleCancel() {
  drawerVisible.value = false
  sysdictFormRef.value.resetFields()
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
