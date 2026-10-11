<script setup lang="ts">
import { computed } from 'vue'
import { useDevModeStore } from '@/stores/devMode'

const devModeStore = useDevModeStore()

const indicatorClass = computed(() => [
  'dev-indicator',
  devModeStore.enabled ? 'active' : ''
].join(' '))

function toggleDevMode() {
  devModeStore.toggle()
}
</script>

<template>
  <button
    :class="indicatorClass"
    @click="toggleDevMode"
    :aria-pressed="devModeStore.enabled"
    aria-label="Alternar modo desenvolvedor"
    type="button"
  >
    <span v-if="devModeStore.enabled">⚙️ Modo Dev Ativo</span>
    <span v-else>⚙️ Modo Dev</span>
  </button>
</template>

<style scoped>
.dev-indicator {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--bs-accent-color);
  color: var(--bs-white);
  padding: 0.5rem 1.1rem;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  z-index: 9999;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all var(--bs-transition);
  white-space: nowrap;
}

.dev-indicator:hover {
  background: var(--bs-accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
}

.dev-indicator.active {
  background: #27ae60;
}

.dev-indicator.active:hover {
  background: #219a52;
}
</style>