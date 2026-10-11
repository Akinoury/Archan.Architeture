import { inject, provide, type InjectionKey } from 'vue'
import { useUIStore } from '@/stores/ui'

const ModalSymbol: InjectionKey<ReturnType<typeof useUIStore>> = Symbol('modal')

export function provideModal() {
  const uiStore = useUIStore()
  provide(ModalSymbol, uiStore)
  return uiStore
}

export function useModal() {
  const uiStore = inject(ModalSymbol)
  if (!uiStore) {
    throw new Error('useModal must be used within a component that has provideModal()')
  }
  return {
    openModal: uiStore.openModal,
    closeModal: uiStore.closeModal,
    confirmDialog: uiStore.confirmDialog,
    modals: uiStore.modals
  }
}