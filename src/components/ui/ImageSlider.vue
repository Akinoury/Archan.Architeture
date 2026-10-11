<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  images: Array<{ id: string; src: string; alt: string }>
  autoplay?: boolean
  interval?: number
  showArrows?: boolean
  showDots?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  images: () => [],
  autoplay: true,
  interval: 5000,
  showArrows: true,
  showDots: true
})

const emit = defineEmits<{
  change: [index: number]
}>()

const currentIndex = ref(0)
const isHovering = ref(false)
let autoplayTimer: number | null = null

const wrapperStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * 100}%)`
}))

function goToSlide(index: number) {
  if (index >= 0 && index < props.images.length) {
    currentIndex.value = index
    emit('change', index)
  }
}

function nextSlide() {
  goToSlide((currentIndex.value + 1) % props.images.length)
}

function prevSlide() {
  goToSlide((currentIndex.value - 1 + props.images.length) % props.images.length)
}

function startAutoplay() {
  if (!props.autoplay || props.images.length <= 1) return
  stopAutoplay()
  autoplayTimer = window.setInterval(() => {
    if (!isHovering.value) {
      nextSlide()
    }
  }, props.interval)
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

function handleMouseEnter() {
  isHovering.value = true
}

function handleMouseLeave() {
  isHovering.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    prevSlide()
  } else if (event.key === 'ArrowRight') {
    nextSlide()
  }
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})

watch(() => props.images, () => {
  if (currentIndex.value >= props.images.length) {
    currentIndex.value = 0
  }
  startAutoplay()
})
</script>

<template>
  <div
    class="slider-container"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @keydown="handleKeydown"
    tabindex="0"
    role="region"
    aria-label="Galeria de imagens"
  >
    <div class="slider-wrapper" :style="wrapperStyle">
      <div
        v-for="image in props.images"
        :key="image.id"
        class="slider-slide"
        :aria-hidden="currentIndex !== props.images.indexOf(image)"
      >
        <img :src="image.src" :alt="image.alt" loading="lazy" />
      </div>
    </div>

    <button
      v-if="props.showArrows && props.images.length > 1"
      class="slider-btn prev"
      @click="prevSlide"
      aria-label="Imagem anterior"
      type="button"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>

    <button
      v-if="props.showArrows && props.images.length > 1"
      class="slider-btn next"
      @click="nextSlide"
      aria-label="Próxima imagem"
      type="button"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>

    <div
      v-if="props.showDots && props.images.length > 1"
      class="slider-dots"
      role="tablist"
      aria-label="Navegação de slides"
    >
      <button
        v-for="(image, index) in props.images"
        :key="image.id"
        class="slider-dot"
        :class="{ active: index === currentIndex }"
        @click="goToSlide(index)"
        :aria-label="`Ir para imagem ${index + 1}`"
        :aria-selected="index === currentIndex"
        role="tab"
        type="button"
      />
    </div>
  </div>
</template>