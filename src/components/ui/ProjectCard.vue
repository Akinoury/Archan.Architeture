<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseCard from './BaseCard.vue'
import { useProjectsStore } from '@/stores/projects'
import { useDevModeStore } from '@/stores/devMode'
import { useToast } from '@/composables/useToast'
import { useModal } from '@/composables/useModal'

const router = useRouter()

const props = defineProps<{
  project: {
    id: string
    title: string
    description: string
    price: number
    area: number
    bedrooms: number
    bathrooms: number
    garage: number
    floors: number
    image: string
    featured: boolean
    hero: boolean
    category: string
    tags: string[]
  }
}>()

const projectsStore = useProjectsStore()
const devModeStore = useDevModeStore()
const { success, error } = useToast()
const { confirmDialog } = useModal()

const meta = computed(() => {
  const parts = []
  if (props.project.area) parts.push(`${props.project.area} m²`)
  if (props.project.bedrooms) parts.push(`${props.project.bedrooms} quartos`)
  if (props.project.bathrooms) parts.push(`${props.project.bathrooms} banheiros`)
  if (props.project.garage) parts.push(`${props.project.garage} vagas`)
  return parts.join(' • ')
})

async function handleFavorite(event: MouseEvent) {
  event.stopPropagation()
  // Read the state *before* toggling so the message is always accurate.
  const wasFeatured = props.project.featured
  try {
    await projectsStore.toggleFeatured(props.project.id)
    success(wasFeatured ? 'Removido dos destaques' : 'Adicionado aos destaques')
  } catch {
    error('Erro ao atualizar destaque')
  }
}

async function handleFeature(event: MouseEvent) {
  event.stopPropagation()
  const wasHero = props.project.hero
  try {
    await projectsStore.toggleHero(props.project.id)
    success(wasHero ? 'Removido do hero' : 'Definido como projeto principal')
  } catch {
    error('Erro ao atualizar hero')
  }
}

async function handleEdit(event: MouseEvent) {
  event.stopPropagation()
  router.push({ name: 'Dashboard', query: { tab: 'create', type: 'project', edit: props.project.id } })
}

async function handleDelete(event: MouseEvent) {
  event.stopPropagation()
  const confirmed = await confirmDialog({
    title: 'Excluir Projeto',
    message: `Tem certeza que deseja excluir "${props.project.title}"? Esta ação não pode ser desfeita.`,
    confirmText: 'Excluir',
    type: 'danger'
  })
  if (!confirmed) return
  try {
    await projectsStore.deleteProject(props.project.id)
    success('Projeto excluído com sucesso')
  } catch {
    error('Erro ao excluir projeto')
  }
}

function navigateToDetail() {
  router.push({ name: 'ProjectDetail', params: { id: props.project.id } })
}
</script>

<template>
  <BaseCard
    :title="props.project.title"
    :meta="meta"
    :description="props.project.description"
    :price="props.project.price"
    :image="props.project.image"
    :image-alt="props.project.title"
    :featured="props.project.featured"
    :hero="props.project.hero"
    :show-actions="devModeStore.enabled"
    @click="navigateToDetail"
    @favorite="handleFavorite"
    @feature="handleFeature"
    @edit="handleEdit"
    @delete="handleDelete"
  />
</template>