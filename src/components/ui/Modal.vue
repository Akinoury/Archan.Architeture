<script setup lang="ts">
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import type { Modal as ModalType } from '@/stores/ui'

const uiStore = useUIStore()

const props = defineProps<{
  modal: ModalType
}>()

const emit = defineEmits<{
  close: [id: string]
  confirm: [id: string]
}>()

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  }
  return sizes[props.modal.size || 'md']
})

const modalTitleId = computed(() => `modal-title-${props.modal.id}`)

async function handleConfirm() {
  if (props.modal.onConfirm) {
    await props.modal.onConfirm()
  }
  emit('confirm', props.modal.id)
}

function handleClose() {
  emit('close', props.modal.id)
}

function handleOverlayClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}
</script>

<template>
  <Transition name="modal">
    <div
      class="modal-overlay"
      @click="handleOverlayClick"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="modalTitleId"
    >
      <div class="modal-content" :class="sizeClasses">
        <header class="modal-header">
          <h2 :id="modalTitleId" class="modal-title">{{ props.modal.title }}</h2>
          <button
            v-if="props.modal.showClose !== false"
            class="modal-close"
            @click="handleClose"
            aria-label="Fechar modal"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        <div class="modal-body">
  <component :is="typeof props.modal.content === 'function' ? props.modal.content() : 'div'" v-html="typeof props.modal.content === 'string' ? props.modal.content : undefined" />
</div>

        <footer v-if="props.modal.onConfirm" class="modal-footer">
          <button
            class="btn btn-ghost"
            @click="handleClose"
            type="button"
          >
            {{ props.modal.cancelText || 'Cancelar' }}
          </button>
          <button
            class="btn btn-accent"
            @click="handleConfirm"
            type="button"
          >
            {{ props.modal.confirmText || 'Confirmar' }}
          </button>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(56, 36, 20, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--bs-spacing-md);
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: var(--bs-white);
  border-radius: 0;
  width: 100%;
  max-height: 90vh;
  max-height: 90dvh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s var(--bs-transition-smooth);
}

.modal-header {
  padding: var(--bs-spacing-md) var(--bs-spacing-lg);
  border-bottom: 1px solid var(--bs-light-gray);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--bs-spacing-sm);
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--bs-dark-gray);
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background var(--bs-transition), color var(--bs-transition);
}

.modal-close:hover {
  background: var(--bs-light-gray);
  color: var(--bs-text-color);
}

.modal-body {
  padding: var(--bs-spacing-lg);
}

.modal-footer {
  padding: var(--bs-spacing-md) var(--bs-spacing-lg);
  border-top: 1px solid var(--bs-light-gray);
  display: flex;
  justify-content: flex-end;
  gap: var(--bs-spacing-sm);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: var(--bs-spacing-sm);
    padding-bottom: calc(var(--bs-spacing-sm) + env(safe-area-inset-bottom));
  }

  .modal-header {
    padding: var(--bs-spacing-md);
  }

  .modal-body {
    padding: var(--bs-spacing-md);
  }

  .modal-footer {
    padding: var(--bs-spacing-md);
    flex-direction: column-reverse;
  }

  .modal-footer .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .modal-content {
    max-height: 95dvh;
  }

  .modal-title {
    font-size: 1.125rem;
  }
}
</style>