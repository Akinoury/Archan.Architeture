<script setup lang="ts">
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()

const toastClasses = computed(() => (toast: any) => [
  'toast',
  toast.type
].filter(Boolean).join(' '))
</script>

<template>
  <div class="toast-container" aria-live="polite" aria-atomic="true">
    <div
      v-for="toast in uiStore.toasts"
      :key="toast.id"
      :class="toastClasses(toast)"
      role="alert"
    >
      <div class="toast-content">
        <strong>{{ toast.title }}</strong>
        <p v-if="toast.message">{{ toast.message }}</p>
      </div>
      <button
        class="toast-close"
        @click="uiStore.removeToast(toast.id)"
        aria-label="Fechar notificação"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.toast {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  background: var(--bs-white);
  border-left: 4px solid var(--bs-accent-color);
  padding: 1rem 1.5rem;
  box-shadow: var(--bs-card-shadow-hover);
  border-radius: 0 4px 4px 0;
  min-width: 280px;
  max-width: 400px;
  animation: slideIn 0.3s var(--bs-transition-smooth);
}

.toast.error {
  border-left-color: #c00;
}

.toast.success {
  border-left-color: #27ae60;
}

.toast.warning {
  border-left-color: #f39c12;
}

.toast.info {
  border-left-color: #3498db;
}

.toast-content {
  flex: 1;
}

.toast-content strong {
  display: block;
  margin-bottom: 0.25rem;
}

.toast-content p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--bs-dark-gray);
}

.toast-close {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: var(--bs-dark-gray);
  border-radius: 4px;
  flex-shrink: 0;
  opacity: 0.6;
  transition: opacity var(--bs-transition), background var(--bs-transition);
}

.toast-close:hover {
  opacity: 1;
  background: var(--bs-light-gray);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>