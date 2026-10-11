<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue: string
  type?: string
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  id?: string
  name?: string
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  label: '',
  placeholder: '',
  error: '',
  hint: '',
  disabled: false,
  required: false,
  id: '',
  name: '',
  autocomplete: 'off'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  input: [event: Event]
}>()

const inputId = computed(() => props.id || `input-${props.name || Math.random().toString(36).slice(2)}`)
const describedBy = computed(() => [props.error && `${inputId.value}-error`, props.hint && `${inputId.value}-hint`].filter(Boolean).join(' ') || undefined)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('input', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}
</script>

<template>
  <div class="form-group">
    <label v-if="props.label" :for="inputId" class="form-label">
      {{ props.label }}
      <span v-if="props.required" class="text-danger" aria-hidden="true">*</span>
    </label>
    <input
      :id="inputId"
      :name="props.name"
      :type="props.type"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :required="props.required"
      :autocomplete="props.autocomplete"
      :aria-invalid="!!props.error"
      :aria-describedby="describedBy"
      :aria-required="props.required"
      class="form-control"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />
    <span v-if="props.error" :id="`${inputId}-error`" class="form-error" role="alert">{{ props.error }}</span>
    <span v-else-if="props.hint" :id="`${inputId}-hint`" class="form-hint">{{ props.hint }}</span>
  </div>
</template>

<style scoped>
.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.4rem;
  color: var(--bs-dark-gray);
  font-weight: 600;
}

.form-label .text-danger {
  color: #c00;
  margin-left: 0.25rem;
}

.form-control {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid var(--bs-light-gray);
  border-bottom: 2px solid #ccc;
  font-family: var(--bs-font-primary);
  font-size: 1rem;
  background: var(--bs-bg-color);
  color: var(--bs-text-color);
  transition: border-color var(--bs-transition), background var(--bs-transition);
  border-radius: 0;
}

.form-control:focus {
  outline: none;
  border-bottom-color: var(--bs-accent-color);
  background: var(--bs-white);
  border-color: var(--bs-accent-color);
  box-shadow: none;
}

.form-control:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--bs-light-gray);
}

.form-control[aria-invalid="true"] {
  border-color: #c00;
  border-bottom-color: #c00;
}

.form-error {
  display: block;
  color: #c00;
  font-size: 0.8rem;
  margin-top: 0.35rem;
}

.form-hint {
  display: block;
  color: var(--bs-dark-gray);
  font-size: 0.8rem;
  margin-top: 0.35rem;
  opacity: 0.7;
}
</style>