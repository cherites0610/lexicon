<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMessage } from 'naive-ui'
import { AddOutline, CreateOutline, TrashOutline, WifiOutline } from '@vicons/ionicons5'
import { useModelsStore } from '../../stores/models'
import { useModelTest } from '../../composables/useModelTest'
import ModelForm from './ModelForm.vue'
import type { GeminiModel } from '../../types'

const modelsStore = useModelsStore()
const { models, activeModelId } = storeToRefs(modelsStore)
const message = useMessage()
const { testResult, testError, testConnection } = useModelTest()

const showForm = ref(false)
const editingModel = ref<GeminiModel | null>(null)
const testingId = ref<string | null>(null)

function openAdd() {
  editingModel.value = null
  showForm.value = true
}

function openEdit(model: GeminiModel) {
  editingModel.value = model
  showForm.value = true
}

function handleSubmit(data: Omit<GeminiModel, 'id' | 'createdAt'>) {
  if (editingModel.value) {
    modelsStore.updateModel(editingModel.value.id, data)
  } else {
    modelsStore.addModel(data)
  }
  showForm.value = false
}

async function handleTest(model: GeminiModel) {
  testingId.value = model.id
  await testConnection(model)
  testingId.value = null
  if (testResult.value === 'success') {
    message.success(`${model.name} 連接成功`)
  } else {
    message.error(testError.value || '連接失敗')
  }
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <span class="font-medium text-neutral-300">模型列表</span>
      <n-button size="small" @click="openAdd">
        <template #icon>
          <n-icon><AddOutline /></n-icon>
        </template>
        新增
      </n-button>
    </div>

    <n-empty v-if="models.length === 0" description="尚未設定模型" size="small" />

    <div v-else class="flex flex-col gap-2">
      <div
        v-for="model in models"
        :key="model.id"
        class="flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-colors"
        :class="
          activeModelId === model.id
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-neutral-700 hover:border-neutral-600'
        "
        @click="modelsStore.setActiveModel(model.id)"
      >
        <div class="flex flex-col min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="text-sm font-medium truncate">{{ model.name }}</span>
            <span
              class="shrink-0 text-[10px] px-1 py-px rounded font-mono"
              :class="model.type === 'openai-compatible'
                ? 'bg-purple-500/15 text-purple-400'
                : 'bg-blue-500/15 text-blue-400'"
            >{{ model.type === 'openai-compatible' ? 'OpenAI' : 'Gemini' }}</span>
          </div>
          <span class="text-xs text-neutral-400 truncate">{{ model.modelName }}</span>
        </div>
        <div class="flex gap-1 shrink-0">
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button
                size="tiny"
                quaternary
                :loading="testingId === model.id"
                :disabled="!!testingId && testingId !== model.id"
                @click.stop="handleTest(model)"
              >
                <template #icon>
                  <n-icon><WifiOutline /></n-icon>
                </template>
              </n-button>
            </template>
            測試連接
          </n-tooltip>
          <n-button size="tiny" quaternary @click.stop="openEdit(model)">
            <template #icon>
              <n-icon><CreateOutline /></n-icon>
            </template>
          </n-button>
          <n-button size="tiny" quaternary type="error" @click.stop="modelsStore.removeModel(model.id)">
            <template #icon>
              <n-icon><TrashOutline /></n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </div>

    <n-modal
      v-model:show="showForm"
      :title="editingModel ? '編輯模型' : '新增模型'"
      preset="card"
      style="width: 480px"
    >
      <ModelForm :model="editingModel" @submit="handleSubmit" @cancel="showForm = false" />
    </n-modal>
  </div>
</template>
