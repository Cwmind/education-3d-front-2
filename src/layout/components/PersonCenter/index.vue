<template>
  <el-dialog
    v-model="dialogVisible"
    :append-to-body="false"
    :close-on-click-modal="false"
    title="个人中心"
    width="800"
    class="person-center-dialog"
  >
    <div class="dialog-content">
      <el-form
        ref="personFormRef"
        :model="personForm"
        :rules="personRules"
        label-position="top"
        require-asterisk-position="right"
      >
        <el-form-item label="账号" prop="userUuid">
          <el-input v-model="personForm.userUuid" placeholder="请输入账号" disabled />
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="personForm.realName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-select v-model="personForm.major" placeholder="请选择专业" clearable>
            <el-option
              v-for="item in majorOption"
              :key="item.itemKey"
              :label="item.itemName"
              :value="item.itemKey"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="personForm.sex" placeholder="请选择性别">
            <el-option
              v-for="item in sexOption"
              :key="item.itemKey"
              :label="item.itemName"
              :value="item.itemKey"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="personForm.phone" placeholder="请输入手机号码" maxlength="11" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="personForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
            autocomplete="new-password"
          />
        </el-form-item>
      </el-form>
      <div class="form-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmitForm">保存</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'
import getMajorOption from '@/hooks/majorOption'
import getSexOption from '@/hooks/sexOption'

const userStore = useUserStore()
const { majorOption } = getMajorOption()
const { sexOption } = getSexOption()

const personFormRef = ref(null)
const personFormDefault = {
  userUuid: '',
  realName: '',
  major: '',
  sex: '',
  phone: ''
}
const personRules = reactive({
  userUuid: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  major: [{ required: true, message: '请选择专业', trigger: 'change' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入正确的手机号码', trigger: 'blur' },
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
})
const personForm = ref(personFormDefault)
const dialogVisible = ref(false)
function openDialog() {
  dialogVisible.value = true
  personForm.value = {
    id: userStore.userInfo.id,
    userUuid: userStore.userInfo.userUuid,
    realName: userStore.userInfo.realName,
    major: userStore.userInfo.major,
    sex: userStore.userInfo.sex?.toString(),
    phone: userStore.userInfo.phone,
    password: ''
  }
}
// 提交表单
function handleSubmitForm() {
  personFormRef.value.validate((valid) => {
    if (valid) {
      userStore
        .updateUserInfo(personForm.value)
        .then(() => {
          ElMessage.success('保存成功')
          handleCancel()
        })
        .catch(() => {
          ElMessage.error('保存失败')
        })
    }
  })
}
// 点击取消
function handleCancel() {
  dialogVisible.value = false
  personFormRef.value.resetFields()
}

defineExpose({
  openDialog
})
</script>

<style lang="scss">
.person-center-dialog {
  .el-dialog__body {
    display: flex;
    justify-content: center;
  }
  .dialog-content {
    width: 400px;
    .form-footer {
      margin-top: 40px;
      text-align: center;
    }
  }
}
</style>
