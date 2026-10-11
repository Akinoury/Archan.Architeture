<script setup lang="ts">
import { watch } from 'vue'
import { useDevModeStore } from '@/stores/devMode'
import { useAuthStore } from '@/stores/auth'
import { provideToast, provideModal } from '@/composables'
import { RouterView } from 'vue-router'

const devModeStore = useDevModeStore()
const authStore = useAuthStore()

// Provide global toast and modal
provideToast()
provideModal()

// Developer/content-editing mode is bound to the privileged account.
// Regular visitors can never see or reach it: there is no button and no
// shortcut — signing in with the admin credentials is the only way in.
watch(
  () => authStore.user?.role ?? null,
  (role) => {
    if (role === 'admin') {
      devModeStore.enable()
    } else {
      devModeStore.disable()
    }
  },
  { immediate: true }
)
</script>

<template>
  <RouterView v-slot="{ Component }">
    <component :is="Component" />
  </RouterView>
</template>

<style>
/* Global styles are imported in main.ts */
</style>
