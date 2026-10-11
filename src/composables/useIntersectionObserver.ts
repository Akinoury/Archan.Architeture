import { onMounted, onUnmounted, ref, type Ref } from 'vue'

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  target: Ref<HTMLElement | null>
  onIntersect?: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void
  once?: boolean
}

export function useIntersectionObserver(options: UseIntersectionObserverOptions) {
  const { target, onIntersect, once = true, ...observerOptions } = options
  const isIntersecting = ref(false)

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!target.value) return

    observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      isIntersecting.value = entry.isIntersecting

      if (onIntersect) {
        onIntersect(entry.isIntersecting, entry)
      }

      if (once && entry.isIntersecting && target.value) {
        observer?.unobserve(target.value)
      }
    }, observerOptions)

    observer.observe(target.value)
  })

  onUnmounted(() => {
    if (observer && target.value) {
      observer.unobserve(target.value)
    }
    observer = null
  })

  return { isIntersecting }
}

// Composable for reveal animations
export function useReveal(target: Ref<HTMLElement | null>, options: IntersectionObserverInit = {}) {
  const { isIntersecting } = useIntersectionObserver({
    target,
    onIntersect: (intersecting) => {
      if (intersecting && target.value) {
        target.value.classList.add('reveal-visible')
      }
    },
    once: true,
    rootMargin: '0px 0px -50px 0px',
    ...options
  })

  return { isIntersecting }
}