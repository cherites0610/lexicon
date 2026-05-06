<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTranslationStore } from '../../stores/translation'
import { useGeminiTranslate } from '../../composables/useGeminiTranslate'

const translationStore = useTranslationStore()
const { isLoading } = storeToRefs(translationStore)
const { translate } = useGeminiTranslate()

const inputText = ref('')

async function handleTranslate() {
  if (!inputText.value.trim()) return
  await translate(inputText.value)
  inputText.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <n-input
      v-model:value="inputText"
      type="textarea"
      placeholder="輸入要翻譯的文字..."
      :autosize="{ minRows: 3, maxRows: 6 }"
      @keydown.enter.exact.prevent="handleTranslate"
    />
    <n-button
      type="primary"
      :loading="isLoading"
      :disabled="!inputText.trim()"
      @click="handleTranslate"
    >
      翻譯
    </n-button>
  </div>
</template>
