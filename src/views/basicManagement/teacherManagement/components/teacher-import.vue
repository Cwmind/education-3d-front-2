<template>
  <el-dialog v-model="dialogVisible" width="580px" append-to-body>
    <template #header>
      <div class="dialog-header">
        <span class="dialog-header__title">导入信息</span>
        <el-link
          type="primary"
          :underline="false"
          class="dialog-header__link"
          href="./template/老师信息模板.xlsx"
          download="老师信息模板.xlsx"
        >
          下载导入模板
        </el-link>
      </div>
    </template>
    <template v-if="dialogType === 'upload'">
      <div class="dialog-content">选择文件<span>*</span></div>
      <el-upload
        accept=".xlsx, .xls"
        :auto-upload="false"
        :file-list="fileList"
        :on-change="handleChange"
        :on-remove="handleRemove"
        :limit="1"
        drag
      >
        <img src="@/assets/images/upload-img.png" alt="" class="el-upload__img" />
        <div class="el-upload__text">点击或拖拽文件到此处上传</div>
        <div class="el-upload__desc">请按照 Excel 模板上传</div>
      </el-upload>
    </template>
    <template v-else>
      <div class="dialog-content">导入结果</div>
      <div class="dialog-result">
        <div class="dialog-result__item">
          <div class="item-left">
            <img src="@/assets/images/file-excel.png" alt="" class="item-left__img" />
            <div class="item-left__info">
              <div class="info-fileName">{{ computedFileName }}</div>
              <div class="info-fileSize">{{ computedFileSize }}</div>
            </div>
          </div>
          <div class="item-right">
            <template v-if="uploadResult.fail > 0">
              <el-tooltip placement="bottom">
                <template #content>
                  <div
                    v-for="message in uploadResult.errorList"
                    :key="message"
                    class="tooltip-content"
                  >
                    {{ message }}
                  </div>
                </template>
                <el-icon color="#FF4444" size="16" style="margin-right: 4px">
                  <WarningFilled />
                </el-icon>
              </el-tooltip>
              <div class="item-right__info">导入失败，失败条数：{{ uploadResult.fail }}</div>
            </template>
            <div v-else class="item-right__info">
              导入成功，成功条数：{{ uploadResult.success }}
            </div>
            <div class="item-right__close" @click="handleResultClose">
              <el-icon size="16"><CloseBold /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <template v-if="dialogType === 'upload'">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="submitFileForm">导入</el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="handleImportClose">导入结束</el-button>
        </template>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getFileSize } from '@/utils/index'
import { requestImportTeacher } from '@/api/basicManagement/teacherManagement'

const emit = defineEmits(['refresh-list'])
const dialogVisible = ref(false)
const dialogType = ref('')
const uploadResult = ref()
const fileList = ref([])
const formData = new FormData()

const computedFileName = computed(() => {
  if (fileList.value.length > 0) {
    return fileList.value[0].name
  } else {
    return ''
  }
})
const computedFileSize = computed(() => {
  if (fileList.value.length > 0) {
    return getFileSize(fileList.value[0].size)
  } else {
    return ''
  }
})

function handleChange(file) {
  fileList.value = [file]
  formData.append('file', file.raw)
  return false
}

function openDialog() {
  fileList.value = []
  dialogType.value = 'upload'
  dialogVisible.value = true
}
async function submitFileForm() {
  if (fileList.value.length === 0) {
    ElMessage.error('请选择文件')
    return
  }
  const result = await requestImportTeacher(formData)
  const { code, response } = result
  if (code === 1) {
    dialogType.value = 'result'
    uploadResult.value = response
  }
}

function handleResultClose() {
  fileList.value = []
  formData.delete('file')
  dialogType.value = 'upload'
}

function handleImportClose() {
  handleCancel()
  emit('refresh-list')
}

function handleCancel() {
  fileList.value = []
  formData.delete('file')
  dialogType.value = 'upload'
  dialogVisible.value = false
}

defineExpose({
  openDialog
})
</script>

<style lang="scss" scoped>
.dialog-header {
  display: flex;
  align-items: center;
  &__title {
    font-weight: 500;
    font-size: 16px;
    color: #000000;
    margin-right: 15px;
  }
  &__link {
    font-weight: 400;
    font-size: 14px;
  }
}
.dialog-content {
  font-weight: 500;
  font-size: 14px;
  color: rgb(0 0 0 / 80%);
  margin-bottom: 4px;
  span {
    color: #f56c6c;
  }
}
.dialog-result {
  height: 180px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
  padding: 4px;
  &__item {
    width: 100%;
    height: 58px;
    padding: 13px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .item-left {
      display: flex;
      &__img {
        width: 32px;
        height: 32px;
        margin-right: 4px;
      }
      &__info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .info-fileName {
          font-weight: 400;
          font-size: 14px;
          color: #000000;
          width: 240px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .info-fileSize {
          font-weight: 400;
          font-size: 12px;
          color: rgb(0 0 0 / 40%);
        }
      }
    }
    .item-right {
      display: flex;
      align-items: center;
      &__info {
        font-weight: 400;
        font-size: 14px;
        color: #000000;
        margin-right: 16px;
        line-height: 21px;
      }
      &__close {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
    }
  }
}
.el-upload__img {
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
}
.el-upload__text {
  color: rgb(0 0 0 / 40%);
  font-weight: 400;
  font-size: 14px;
  margin-bottom: 8px;
}
.el-upload__desc {
  color: rgb(0 0 0 / 40%);
  font-weight: 400;
  font-size: 12px;
}
</style>
