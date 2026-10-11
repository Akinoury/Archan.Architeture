import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Developer (content editing) mode.
 *
 * This mode is NEVER exposed to regular visitors: there is no visible button
 * and no keyboard shortcut. It is enabled exclusively by signing in with a
 * privileged account (see `App.vue`, which syncs it with the admin role).
 */
export const useDevModeStore = defineStore('devMode', () => {
  const enabled = ref(false)
  const editingId = ref<string | null>(null)
  const editableElements = ref<Map<string, HTMLElement>>(new Map())

  const isEditing = computed(() => editingId.value !== null)

  function setEnabled(value: boolean) {
    if (enabled.value === value) return
    enabled.value = value
    document.body.classList.toggle('dev-mode', value)

    if (!value) {
      // Leave any element that was being edited in a clean state.
      if (editingId.value) {
        editableElements.value.get(editingId.value)?.removeAttribute('contenteditable')
      }
      editingId.value = null
      editableElements.value.clear()
    }
  }

  function enable() {
    setEnabled(true)
  }

  function disable() {
    setEnabled(false)
  }

  function toggle() {
    setEnabled(!enabled.value)
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
    enable,
    disable,
    toggle,
    startEditing,
    stopEditing,
    registerEditable,
    unregisterEditable
  }
})
