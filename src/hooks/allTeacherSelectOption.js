import { ref, onMounted } from 'vue'
import { requestAllTeacherSelect } from '@/api/basicManagement/classManagement'
/**
 * 获取全部授课教师数据
 */
export default function getAllTeacherSelectOption() {
  const allTeacherSelectOption = ref([])
  const loadAllTeacherSelectOption = async (params) => {
    const result = await requestAllTeacherSelect(params)
    const { code, response } = result
    if (code === 1 && response) {
      allTeacherSelectOption.value = response
    } else {
      allTeacherSelectOption.value = []
    }
  }
  onMounted(() => {
    loadAllTeacherSelectOption()
  })
  return {
    allTeacherSelectOption,
    loadAllTeacherSelectOption
  }
}
