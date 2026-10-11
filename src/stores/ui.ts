import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export interface Modal {
  id: string
  title: string
  content: string | (() => import('vue').VNode)
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showClose?: boolean
  onConfirm?: () => void | Promise<void>
  confirmText?: string
  cancelText?: string
}

export const useUIStore = defineStore('ui', () => {
  const toasts = ref<Toast[]>([])
  const modals = ref<Modal[]>([])

  function addToast(toast: Omit<Toast, 'id'>) {
    const id = String(Date.now())
    const newToast = { ...toast, id }
    toasts.value.push(newToast)

    // Auto remove
    const duration = toast.duration ?? 5000
    setTimeout(() => removeToast(id), duration)

    return id
  }

  function removeToast(id: string) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  function success(title: string, message?: string) {
    return addToast({ type: 'success', title, message })
  }

  function error(title: string, message?: string) {
    return addToast({ type: 'error', title, message, duration: 8000 })
  }

  function warning(title: string, message?: string) {
    return addToast({ type: 'warning', title, message })
  }

  function info(title: string, message?: string) {
    return addToast({ type: 'info', title, message })
  }

  function openModal(modal: Omit<Modal, 'id'>) {
    const id = String(Date.now())
    const newModal = { ...modal, id }
    modals.value.push(newModal)
    document.body.style.overflow = 'hidden'
    return id
  }

  function closeModal(id: string) {
    const index = modals.value.findIndex(m => m.id === id)
    if (index !== -1) {
      modals.value.splice(index, 1)
      if (modals.value.length === 0) {
        document.body.style.overflow = ''
      }
    }
  }

  function confirmDialog(options: {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'primary'
  }): Promise<boolean> {
    return new Promise((resolve) => {
      openModal({
        title: options.title,
        content: options.message,
        confirmText: options.confirmText || (options.type === 'danger' ? 'Excluir' : 'Confirmar'),
        cancelText: options.cancelText || 'Cancelar',
        onConfirm: async () => {
          closeModal(modals.value[modals.value.length - 1].id)
          resolve(true)
        }
      })
    })
  }

  return {
    toasts,
    modals,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    openModal,
    closeModal,
    confirmDialog
  }
})