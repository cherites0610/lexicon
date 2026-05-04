<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { CheckmarkCircleOutline, CloseCircleOutline } from '@vicons/ionicons5'
import { useModelTest } from '../../composables/useModelTest'
import type { GeminiModel, ModelType } from '../../types'

interface Props {
  model?: GeminiModel | null
}

const props = withDefaults(defineProps<Props>(), { model: null })

const emit = defineEmits<{
  submit: [data: Omit<GeminiModel, 'id' | 'createdAt'>]
  cancel: []
}>()

const formData = ref({
  name: '',
  apiKey: '',
  modelName: 'gemini-1.5-flash',
  type: 'gemini' as ModelType,
  apiUrl: '',
})

const { testing, testResult, testError, testConnection, reset } = useModelTest()

watch(
  () => props.model,
  (model) => {
    if (model) {
      formData.value = {
        name: model.name,
        apiKey: model.apiKey,
        modelName: model.modelName,
        type: model.type ?? 'gemini',
        apiUrl: model.apiUrl ?? '',
      }
    } else {
      formData.value = { name: '', apiKey: '', modelName: 'gemini-1.5-flash', type: 'gemini', apiUrl: '' }
    }
    reset()
  },
  { immediate: true },
)

watch(
  () => formData.value.type,
  (type) => {
    formData.value.modelName = type === 'gemini' ? 'gemini-1.5-flash' : ''
    formData.value.apiUrl = ''
    reset()
  },
)

const isOpenAI = computed(() => formData.value.type === 'openai-compatible')

const isValid = computed(() => {
  const { apiKey, modelName, apiUrl } = formData.value
  if (!formData.value.name.trim() || !apiKey.trim() || !modelName.trim()) return false
  if (isOpenAI.value && !apiUrl.trim()) return false
  return true
})

const canTest = computed(() => {
  const { apiKey, modelName, apiUrl } = formData.value
  if (!apiKey.trim() || !modelName.trim()) return false
  if (isOpenAI.value && !apiUrl.trim()) return false
  return true
})

function handleSubmit() {
  if (!isValid.value) return
  const data: Omit<GeminiModel, 'id' | 'createdAt'> = {
    name: formData.value.name,
    apiKey: formData.value.apiKey,
    modelName: formData.value.modelName,
    type: formData.value.type,
    ...(isOpenAI.value && { apiUrl: formData.value.apiUrl }),
  }
  emit('submit', data)
}
</script>

<template>
  <n-form label-placement="top">
    <n-form-item label="模型類型">
      <n-radio-group v-model:value="formData.type">
        <n-radio value="gemini">Gemini</n-radio>
        <n-radio value="openai-compatible">OpenAI 相容</n-radio>
      </n-radio-group>
    </n-form-item>

    <n-form-item label="顯示名稱">
      <n-input v-model:value="formData.name" placeholder="例：我的模型" />
    </n-form-item>

    <n-form-item label="API Key">
      <n-input
        v-model:value="formData.apiKey"
        type="password"
        show-password-on="click"
        :placeholder="isOpenAI ? 'Bearer Token / API Key' : 'Gemini API Key'"
      />
    </n-form-item>

    <n-form-item v-if="isOpenAI" label="API URL">
      <n-input
        v-model:value="formData.apiUrl"
        placeholder="例：https://openrouter.ai/api/v1"
      />
    </n-form-item>

    <n-form-item label="模型識別碼">
      <n-input
        v-model:value="formData.modelName"
        :placeholder="isOpenAI ? '例：gpt-4o-mini' : '例：gemini-1.5-flash'"
      />
    </n-form-item>

    <div class="flex items-center justify-between pt-2">
      <div class="flex items-center gap-2 text-sm">
        <template v-if="testResult === 'success'">
          <n-icon color="#18a058" :size="16"><CheckmarkCircleOutline /></n-icon>
          <span class="text-green-500">連接成功</span>
        </template>
        <template v-else-if="testResult === 'error'">
          <n-icon color="#d03050" :size="16"><CloseCircleOutline /></n-icon>
          <span class="text-red-400 text-xs">{{ testError }}</span>
        </template>
      </div>

      <div class="flex gap-2">
        <n-button @click="emit('cancel')">取消</n-button>
        <n-button
          :loading="testing"
          :disabled="!canTest"
          @click="testConnection(formData)"
        >
          測試連接
        </n-button>
        <n-button type="primary" :disabled="!isValid" @click="handleSubmit">
          {{ props.model ? '儲存' : '新增' }}
        </n-button>
      </div>
    </div>
  </n-form>
</template>
