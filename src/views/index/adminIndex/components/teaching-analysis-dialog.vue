<template>
  <el-dialog
    v-model="dialogVisible"
    :show-close="false"
    :append-to-body="false"
    :close-on-click-modal="false"
    width="616"
    class="teaching-analysis-dialog"
  >
    <template #header="{ close }">
      <div class="dialog__header">
        <div class="dialog__header--left">
          <div class="left-title">当前班级到课情况</div>
        </div>
        <div class="dialog__header--right">
          <el-icon color="#FFFFFF" size="20" @click="close"><CloseBold /></el-icon>
        </div>
      </div>
    </template>
    <div class="analysis-dialog__body">
      <div class="teacher-icon">
        <el-tooltip
          effect="dark"
          :content="classItem.teacherName"
          placement="bottom"
          :offset="-30"
          :show-arrow="false"
        >
          <img v-if="classItem.teacherSex === 1" src="@/assets/icons/svg/teacher-man.svg" alt="" />
          <img v-else src="@/assets/icons/svg/teacher-woman.svg" alt="" />
        </el-tooltip>
      </div>
      <div v-for="item in classItem.studentList" :key="item" class="student-icon">
        <el-tooltip
          effect="dark"
          :content="item.studentName"
          placement="top"
          :offset="-10"
          :show-arrow="false"
        >
          <template v-if="item.studentSex === 1">
            <img
              v-if="item.onlineStatus === '1'"
              src="@/assets/icons/svg/online-student-man.svg"
              alt=""
            />
            <img v-else src="@/assets/icons/svg/offline-student-man.svg" alt="" />
          </template>
          <template v-else>
            <img
              v-if="item.onlineStatus === '1'"
              src="@/assets/icons/svg/online-student-woman.svg"
              alt=""
            />
            <img v-else src="@/assets/icons/svg/offline-student-woman.svg" alt="" />
          </template>
        </el-tooltip>
      </div>
    </div>
    <div class="analysis-dialog__footer">
      <div class="footer-left">
        <div class="icon-teacher"></div>
        <div class="text">老师</div>
        <div class="icon-online-student"></div>
        <div class="text">在线学生</div>
        <div class="icon-offline-student"></div>
        <div class="text">离线学生</div>
      </div>
      <div class="footer-right">
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
const dialogVisible = ref(false)
const classItem = ref({})
function openDialog(item) {
  dialogVisible.value = true
  classItem.value = item
}

defineExpose({
  openDialog
})
</script>

<style lang="scss">
.teaching-analysis-dialog {
  background-color: transparent;
  background-image: url('@/assets/images/practical/practical-dialog-bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  padding: 24px 8px 24px 24px;
  border-radius: 6px;
  .dialog__header {
    width: 100%;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    &--left {
      .left-title {
        font-weight: 400;
        font-size: 16px;
        color: #ffffff;
        line-height: 16px;
        margin-bottom: 8px;
      }
    }
    &--right {
      height: 20px;
      cursor: pointer;
    }
  }
  .analysis-dialog__body {
    width: 100%;
    height: 524px;
    padding-right: 8px;
    overflow-x: hidden;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
    grid-auto-rows: 40px;
    gap: 8px;
    .teacher-icon {
      width: 88px;
      height: 88px;
      grid-column: span 2;
      grid-row: span 2;
      cursor: pointer;
    }
    .student-icon {
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
  }
  .analysis-dialog__footer {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 24px;
    padding-right: 16px;
    padding-left: 8px;
    .footer-left {
      display: flex;
      align-items: center;
      .icon-teacher {
        width: 6px;
        height: 6px;
        background: #ff7c4d;
        border-radius: 50%;
        margin-right: 4px;
      }
      .icon-online-student{
        width: 6px;
        height: 6px;
        background: #34BF00;
        border-radius: 50%;
        margin-right: 4px;
      }
      .icon-offline-student{
        width: 6px;
        height: 6px;
        background: #D8D8D8;
        border-radius: 50%;
        margin-right: 4px;
      }
      .text {
        font-weight: 400;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        margin-right: 8px;
      }
    }
  }
}
</style>
