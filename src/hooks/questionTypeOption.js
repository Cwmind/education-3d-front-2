/**
 * 获取字典维护的试题类型
 */
import { ref, onMounted } from 'vue'
import { getAllDictByType } from '@/api/basic/common'

export default function getQuestionTypeOption() {
  const questionTypeOption = ref([])
  const loadQuestionTypeOption = async () => {
    const result = await getAllDictByType({ type: 'questionType' })
    const { code, response } = result
    if (code === 1 && response) {
      questionTypeOption.value = response.children
    } else {
      questionTypeOption.value = []
    }
  }
  onMounted(() => {
    loadQuestionTypeOption()
  })
  return {
    questionTypeOption
  }
}
