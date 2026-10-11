<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useDevModeStore } from '@/stores/devMode'
import { provideToast, provideModal } from '@/composables'
import { RouterView } from 'vue-router'

const devModeStore = useDevModeStore()

// Provide global toast and modal
provideToast()
provideModal()

// Keyboard shortcut for dev mode: Ctrl+Shift+D
const handleKeydown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.shiftKey && event.key === 'D') {
    event.preventDefault()
    devModeStore.toggle()
  }
}

onMounted(() => {
  // Initialize dev mode
  devModeStore.init()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <RouterView v-slot="{ Component }">
    <component :is="Component" />
  </RouterView>
</template>

<style>
/* Global styles are imported in main.ts */
</style>