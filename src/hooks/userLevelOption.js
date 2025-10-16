/**
 * 获取字典维护的年级数据
 */
import { ref, onMounted } from 'vue'
import { getAllDictByType } from '@/api/basic/common'

export default function getUserLevelOption() {
  const userLevelOption = ref([])
  const loadUserLevelOption = async () => {
    const result = await getAllDictByType({ type: 'userLevel' })
    const { code, response } = result
    if (code === 1 && response) {
      userLevelOption.value = response.children
    } else {
      userLevelOption.value = []
    }
  }
  onMounted(() => {
    loadUserLevelOption()
  })
  return {
    userLevelOption
  }
}
