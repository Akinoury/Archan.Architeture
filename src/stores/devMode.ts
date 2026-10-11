import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDevModeStore = defineStore('devMode', () => {
  const enabled = ref(false)
  const editingId = ref<string | null>(null)
  const editableElements = ref<Map<string, HTMLElement>>(new Map())

  const isEditing = computed(() => editingId.value !== null)

  function toggle() {
    enabled.value = !enabled.value
    document.body.classList.toggle('dev-mode', enabled.value)

    if (!enabled.value) {
      editingId.value = null
      editableElements.value.clear()
    }

    // Save to localStorage
    localStorage.setItem('archan_dev_mode', String(enabled.value))
  }

  function init() {
    const saved = localStorage.getItem('archan_dev_mode')
    if (saved === 'true') {
      enabled.value = true
      document.body.classList.add('dev-mode')
    }
  }

  function startEditing(id: string, element: HTMLElement) {
    if (!enabled.value) return
    editingId.value = id
    element.setAttribute('contenteditable', 'true')
    element.focus()
    editableElements.value.set(id, element)
  }

  function stopEditing() {
    if (editingId.value) {
      const element = editableElements.value.get(editingId.value)
      if (element) {
        element.removeAttribute('contenteditable')
      }
      editableElements.value.delete(editingId.value)
      editingId.value = null
    }
  }

  function registerEditable(id: string, element: HTMLElement) {
    editableElements.value.set(id, element)
  }

  function unregisterEditable(id: string) {
    editableElements.value.delete(id)
  }

  return {
    enabled,
    editingId,
    editableElements,
    isEditing,
    toggle,
    init,
    startEditing,
    stopEditing,
    registerEditable,
    unregisterEditable
  }
})