<script setup lang="ts">
import BaseCard from './BaseCard.vue'
import { useBlogStore } from '@/stores/blog'
import { useDevModeStore } from '@/stores/devMode'
import { useToast } from '@/composables/useToast'
import { formatDate } from '@/utils/formatters'
import { useRouter } from 'vue-router'

const props = defineProps<{
  post: {
    id: string
    title: string
    excerpt: string
    image: string
    author: string
    publishedAt: string
    featured: boolean
    tags: string[]
  }
}>()

const blogStore = useBlogStore()
const devModeStore = useDevModeStore()
const { success, error } = useToast()
const router = useRouter()

function navigateToPost() {
  router.push({ name: 'BlogPost', params: { slug: props.post.id } })
}

async function handleFavorite(event: MouseEvent) {
  event.stopPropagation()
  try {
    await blogStore.toggleFeatured(props.post.id)
    success(props.post.featured ? 'Removido dos destaques' : 'Adicionado aos destaques')
  } catch {
    error('Erro ao atualizar destaque')
  }
}

async function handleDelete(event: MouseEvent) {
  event.stopPropagation()
  try {
    await blogStore.deletePost(props.post.id)
    success('Post excluído com sucesso')
  } catch {
    error('Erro ao excluir post')
  }
}
</script>

<template>
  <BaseCard
    :title="props.post.title"
    :meta="formatDate(props.post.publishedAt)"
    :description="props.post.excerpt"
    :image="props.post.image"
    :image-alt="props.post.title"
    :featured="props.post.featured"
    :show-actions="devModeStore.enabled"
    @click="navigateToPost"
    @favorite="handleFavorite"
    @delete="handleDelete"
  />
</template>