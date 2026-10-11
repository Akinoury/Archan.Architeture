<script setup lang="ts">
import { computed } from 'vue'
import { useDevModeStore } from '@/stores/devMode'
import { formatCurrency } from '@/utils/formatters'

interface Props {
  title: string
  meta?: string
  description?: string
  price?: number
  image: string
  imageAlt?: string
  featured?: boolean
  hero?: boolean
  showActions?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  meta: '',
  description: '',
  price: 0,
  imageAlt: '',
  featured: false,
  hero: false,
  showActions: false,
  loading: false
})

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent]
  favorite: [event: MouseEvent]
  feature: [event: MouseEvent]
  delete: [event: MouseEvent]
}>()

const devModeStore = useDevModeStore()

function handleClick(event: MouseEvent | KeyboardEvent) {
  if (!props.loading) {
    emit('click', event)
  }
}

function handleFavorite(event: MouseEvent) {
  event.stopPropagation()
  emit('favorite', event)
}

function handleFeature(event: MouseEvent) {
  event.stopPropagation()
  emit('feature', event)
}

function handleDelete(event: MouseEvent) {
  event.stopPropagation()
  emit('delete', event)
}
</script>

<template>
  <article
    class="card"
    :class="{ 'dev-mode': devModeStore.enabled }"
    @click="handleClick"
    tabindex="0"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <div class="card-img-wrapper">
      <img
        v-if="!props.loading"
        :src="props.image"
        :alt="props.imageAlt || props.title"
        class="card-img"
        loading="lazy"
      />
      <div v-else class="card-skeleton" aria-hidden="true">
        <div class="skeleton-image" />
      </div>

      <!-- Dev mode action buttons -->
      <button
        v-if="devModeStore.enabled"
        class="card-del-btn"
        @click="handleDelete"
        aria-label="Excluir projeto"
        title="Excluir"
      >
        ×
      </button>
      <button
        v-if="devModeStore.enabled && props.showActions"
        class="card-star-btn"
        :class="{ active: props.featured }"
        @click="handleFavorite"
        :aria-label="props.featured ? 'Remover destaque' : 'Marcar como destaque'"
        :title="props.featured ? 'Remover destaque' : 'Marcar como destaque'"
      >
        ★
      </button>
      <button
        v-if="devModeStore.enabled && props.showActions"
        class="card-hero-btn"
        :class="{ active: props.hero }"
        @click="handleFeature"
        :aria-label="props.hero ? 'Remover hero' : 'Definir como hero'"
        :title="props.hero ? 'Remover hero' : 'Definir como hero'"
      >
        ◆
      </button>
    </div>

    <div class="card-body">
      <h3 class="card-title">{{ props.title }}</h3>
      <span v-if="props.meta" class="card-meta">{{ props.meta }}</span>
      <p v-if="props.description" class="card-desc">{{ props.description }}</p>
      <div v-if="props.price" class="card-price">{{ formatCurrency(props.price) }}</div>
    </div>
  </article>
</template>

<style scoped>
.card-skeleton {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skeleton-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, var(--bs-light-gray) 25%, #f0e6d8 50%, var(--bs-light-gray) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>