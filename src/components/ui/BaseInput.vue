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
  toggleable?: boolean
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
  autocomplete: 'off',
  toggleable: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  input: [event: Event]
}>()

const inputId = computed(() => props.id || `input-${props.name || Math.random().toString(36).slice(2)}`)
const describedBy = computed(() => [props.error && `${inputId.value}-error`, props.hint && `${inputId.value}-hint`].filter(Boolean).join(' ') || undefined)

const revealed = ref(false)
const hasToggle = computed(() => props.toggleable && props.type === 'password')
const resolvedType = computed(() => (hasToggle.value && revealed.value ? 'text' : props.type))

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
    <div class="input-wrap" :class="{ 'has-toggle': hasToggle }">
      <input
        :id="inputId"
        :name="props.name"
        :type="resolvedType"
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
      <button
        v-if="hasToggle"
        type="button"
        class="password-toggle"
        :aria-label="revealed ? 'Ocultar senha' : 'Mostrar senha'"
        :aria-pressed="revealed"
        :disabled="props.disabled"
        tabindex="-1"
        @click="revealed = !revealed"
      >
        <svg v-if="revealed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </div>
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

.input-wrap {
  position: relative;
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

.input-wrap.has-toggle .form-control {
  padding-right: 3rem;
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

.password-toggle {
  position: absolute;
  top: 50%;
  right: 0.25rem;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--bs-dark-gray);
  cursor: pointer;
  border-radius: 4px;
  transition: color var(--bs-transition), background var(--bs-transition);
}

.password-toggle:hover {
  color: var(--bs-accent-color);
}

.password-toggle:focus-visible {
  outline: 2px solid var(--bs-accent-color);
  outline-offset: 2px;
}

.password-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.password-toggle svg {
  width: 1.15rem;
  height: 1.15rem;
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
