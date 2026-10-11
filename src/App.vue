<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDevModeStore } from '@/stores/devMode'
import { provideToast, provideModal } from '@/composables'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { RouterView } from 'vue-router'

const router = useRouter()
const devModeStore = useDevModeStore()

// Provide global toast and modal
provideToast()
provideModal()

onMounted(() => {
  // Initialize dev mode
  devModeStore.init()

  // Keyboard shortcut for dev mode: Ctrl+Shift+D
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'D') {
      event.preventDefault()
      devModeStore.toggle()
    }
  }

  document.addEventListener('keydown', handleKeydown)

  // Cleanup
  return () => {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <RouterView v-slot="{ Component }">
    <DefaultLayout>
      <component :is="Component" />
    </DefaultLayout>
  </RouterView>
</template>

<style>
/* Global styles are imported in main.ts */
</style>