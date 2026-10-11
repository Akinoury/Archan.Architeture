import { inject, provide, type InjectionKey } from 'vue'
import { useUIStore } from '@/stores/ui'

const ToastSymbol: InjectionKey<ReturnType<typeof useUIStore>> = Symbol('toast')

export function provideToast() {
  const uiStore = useUIStore()
  provide(ToastSymbol, uiStore)
  return uiStore
}

export function useToast() {
  const uiStore = inject(ToastSymbol)
  if (!uiStore) {
    throw new Error('useToast must be used within a component that has provideToast()')
  }
  return {
    success: uiStore.success,
    error: uiStore.error,
    warning: uiStore.warning,
    info: uiStore.info,
    removeToast: uiStore.removeToast
  }
}