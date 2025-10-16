import { ref, onMounted } from 'vue'
import { requestClassSelect } from '@/api/basicManagement/classManagement'
/**
 * 获取用户班级数据
 */
export default function getClassSelectOption() {
  const classSelectOption = ref([])
  const loadClassSelectOption = async (params) => {
    const result = await requestClassSelect(params)
    const { code, response } = result
    if (code === 1 && response) {
      classSelectOption.value = response
    } else {
      classSelectOption.value = []
    }
  }
  onMounted(() => {
    loadClassSelectOption()
  })
  return {
    classSelectOption,
    loadClassSelectOption
  }
}
