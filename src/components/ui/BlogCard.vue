<script setup lang="ts">
import BaseCard from './BaseCard.vue'
import { useBlogStore } from '@/stores/blog'
import { useDevModeStore } from '@/stores/devMode'
import { useToast } from '@/composables/useToast'
import { useModal } from '@/composables/useModal'
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
const { confirmDialog } = useModal()
const router = useRouter()

function navigateToPost() {
  router.push({ name: 'BlogPost', params: { slug: props.post.id } })
}

async function handleFavorite(event: MouseEvent) {
  event.stopPropagation()
  const wasFeatured = props.post.featured
  try {
    await blogStore.toggleFeatured(props.post.id)
    success(wasFeatured ? 'Removido dos destaques' : 'Adicionado aos destaques')
  } catch {
    error('Erro ao atualizar destaque')
  }
}

async function handleEdit(event: MouseEvent) {
  event.stopPropagation()
  router.push({ name: 'Dashboard', query: { tab: 'create', type: 'post', edit: props.post.id } })
}

async function handleDelete(event: MouseEvent) {
  event.stopPropagation()
  const confirmed = await confirmDialog({
    title: 'Excluir Artigo',
    message: `Tem certeza que deseja excluir "${props.post.title}"? Esta ação não pode ser desfeita.`,
    confirmText: 'Excluir',
    type: 'danger'
  })
  if (!confirmed) return
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
    @edit="handleEdit"
    @delete="handleDelete"
  />
</template>