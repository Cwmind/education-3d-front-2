import { ref, onMounted } from 'vue'
import { requestTeacherSelect } from '@/api/basicManagement/classManagement'
/**
 * 获取授课教师数据-班级管理条件查询
 */
export default function getTeacherSelectOption() {
  const teacherSelectOption = ref([])
  const loadTeacherSelectOption = async (params) => {
    const result = await requestTeacherSelect(params)
    const { code, response } = result
    if (code === 1 && response) {
      teacherSelectOption.value = response
    } else {
      teacherSelectOption.value = []
    }
  }
  onMounted(() => {
    loadTeacherSelectOption()
  })
  return {
    teacherSelectOption,
    loadTeacherSelectOption
  }
}
