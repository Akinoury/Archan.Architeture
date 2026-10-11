import { ref, watch, type Ref, type ShallowRef } from 'vue'

export function useDebounce<T>(value: Ref<T>, delay: number): Ref<T> {
  const debouncedValue = ref(value.value) as Ref<T>

  watch(value, (newValue) => {
    const timer = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)

    return () => clearTimeout(timer)
  })

  return debouncedValue
}

export function useThrottle<T>(value: Ref<T>, delay: number): Ref<T> {
  const throttledValue = ref(value.value) as Ref<T>
  let lastUpdate = 0

  watch(value, (newValue) => {
    const now = Date.now()
    if (now - lastUpdate >= delay) {
      throttledValue.value = newValue
      lastUpdate = now
    } else {
      setTimeout(() => {
        throttledValue.value = newValue
        lastUpdate = Date.now()
      }, delay - (now - lastUpdate))
    }
  })

  return throttledValue
}