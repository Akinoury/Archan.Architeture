<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'accent' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  iconOnly?: boolean
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  tag?: string
  to?: string | object
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  fullWidth: false,
  iconOnly: false,
  loading: false,
  disabled: false,
  type: 'button',
  tag: 'button'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const classes = computed(() => [
  'btn',
  `btn-${props.variant}`,
  `btn-${props.size}`,
  props.fullWidth && 'btn-full',
  props.iconOnly && 'btn-icon-only',
  props.loading && 'loading',
  props.disabled && 'disabled'
].filter(Boolean).join(' '))

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <component
    :is="props.tag === 'button' ? 'button' : (props.to ? 'RouterLink' : 'a')"
    :class="classes"
    :type="props.tag === 'button' ? props.type : undefined"
    :to="props.to"
    :disabled="props.disabled || props.loading"
    :aria-busy="props.loading"
    :aria-disabled="props.disabled || props.loading"
    @click="handleClick"
  >
    <span v-if="props.loading" class="spinner" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="31.4 31.4">
          <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
        </circle>
      </svg>
    </span>
    <slot />
  </component>
</template>

<style scoped>
.btn-icon-only {
  padding: 0.85rem;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  display: inline-flex;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading .spinner {
  display: inline-flex;
}

.loading > *:not(.spinner) {
  opacity: 0;
}
</style>