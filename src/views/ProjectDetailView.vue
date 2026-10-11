<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useDevModeStore } from '@/stores/devMode'
import { useToast } from '@/composables/useToast'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import ImageSlider from '@/components/ui/ImageSlider.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { formatCurrency, formatArea } from '@/utils/formatters'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()
const devModeStore = useDevModeStore()
const { error, success } = useToast()

const project = computed(() => projectsStore.getProjectById(route.params.id as string))
const loading = ref(true)
const currentSlide = ref(0)

const sliderImages = computed(() => {
  if (!project.value) return []
  const images = project.value.images || [project.value.image]
  return images.map((src, index) => ({
    id: `${project.value!.id}-${index}`,
    src,
    alt: `${project.value!.title} - Imagem ${index + 1}`
  }))
})

const metaItems = computed(() => {
  if (!project.value) return []
  const items = []
  if (project.value.area) items.push({ label: 'Área', value: formatArea(project.value.area) })
  if (project.value.bedrooms) items.push({ label: 'Quartos', value: String(project.value.bedrooms) })
  if (project.value.bathrooms) items.push({ label: 'Banheiros', value: String(project.value.bathrooms) })
  if (project.value.garage) items.push({ label: 'Vagas', value: String(project.value.garage) })
  if (project.value.floors) items.push({ label: 'Pavimentos', value: String(project.value.floors) })
  items.push({ label: 'Categoria', value: project.value.category })
  return items
})

async function handleFavorite() {
  if (!project.value) return
  try {
    await projectsStore.toggleFeatured(project.value.id)
    success(project.value.featured ? 'Removido dos destaques' : 'Adicionado aos destaques')
  } catch {
    error('Erro ao atualizar destaque')
  }
}

async function handleFeature() {
  if (!project.value) return
  try {
    await projectsStore.toggleHero(project.value.id)
    success(project.value.hero ? 'Removido do hero' : 'Definido como projeto principal')
  } catch {
    error('Erro ao atualizar hero')
  }
}

async function handleDelete() {
  if (!project.value) return
  try {
    await projectsStore.deleteProject(project.value.id)
    success('Projeto excluído com sucesso')
    await router.push({ name: 'Projects' })
  } catch {
    error('Erro ao excluir projeto')
  }
}

function goBack() {
  router.back()
}
</script>

<template>
  <DefaultLayout>
    <section v-if="project" class="project-detail-hero reveal" aria-labelledby="project-title">
      <div class="slider-container">
        <ImageSlider
          :images="sliderImages"
          :autoplay="true"
          :interval="6000"
          @change="currentSlide = $event"
        />
      </div>

      <div class="container-custom" style="margin-top: var(--bs-spacing-lg);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--bs-spacing-md); margin-bottom: var(--bs-spacing-md);">
          <div>
            <span class="section-label" style="background: var(--bs-accent-color); color: var(--bs-white); padding: 0.25rem 0.75rem; border-radius: 2px;">{{ project.category }}</span>
            <h1 id="project-title">{{ project.title }}</h1>
          </div>

          <div v-if="devModeStore.enabled" style="display: flex; gap: var(--bs-spacing-sm);">
            <BaseButton variant="ghost" size="sm" @click="handleFavorite" :class="{ 'btn-accent': project.featured }">
              {{ project.featured ? '★ Destaque' : '☆ Destaque' }}
            </BaseButton>
            <BaseButton variant="ghost" size="sm" @click="handleFeature" :class="{ 'btn-accent': project.hero }">
              {{ project.hero ? '◆ Hero' : '◇ Hero' }}
            </BaseButton>
            <BaseButton variant="ghost" size="sm" @click="handleDelete" class="btn-error" style="border-color: #c00; color: #c00;">
              Excluir
            </BaseButton>
          </div>
        </div>

        <div class="project-meta-bar" role="list" aria-label="Detalhes do projeto">
          <div v-for="item in metaItems" :key="item.label" role="listitem">
            <strong>{{ item.label }}</strong>
            <span>{{ item.value }}</span>
          </div>
        </div>

        <div style="margin-top: var(--bs-spacing-lg);">
          <BaseButton variant="ghost" @click="goBack" class="btn-icon" style="gap: 0.5rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Voltar aos Projetos
          </BaseButton>
        </div>
      </div>
    </section>

    <section v-if="project" class="section reveal" aria-labelledby="description-title">
      <div class="container-custom">
        <div class="grid-2">
          <div>
            <h2 id="description-title">Sobre o Projeto</h2>
            <p>{{ project.description }}</p>

            <div v-if="project.tags && project.tags.length" style="margin-top: var(--bs-spacing-lg);">
              <h3 style="font-size: 1rem; margin-bottom: var(--bs-spacing-sm);">Tags</h3>
              <div style="display: flex; flex-wrap: wrap; gap: var(--bs-spacing-xs);">
                <span
                  v-for="tag in project.tags"
                  :key="tag"
                  style="background: var(--bs-light-gray); color: var(--bs-dark-gray); padding: 0.25rem 0.75rem; border-radius: 2px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>

          <div class="padded-text">
            <div class="card" style="padding: var(--bs-spacing-lg);">
              <h3 style="margin-bottom: var(--bs-spacing-md);">Investimento</h3>
              <div class="card-price" style="font-size: 2.5rem; margin-bottom: var(--bs-spacing-md);">{{ formatCurrency(project.price) }}</div>
              <p style="color: var(--bs-dark-gray); margin-bottom: var(--bs-spacing-lg);">
                Valor referente ao projeto arquitetônico completo. 
                Não inclui custos de construção, licenças e aprovações.
              </p>
              <BaseButton variant="accent" full-width @click="router.push({ name: 'Auth', query: { redirect: route.fullPath } })">
                Solicitar Orçamento
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <CTASection />
  </DefaultLayout>
</template>

<style scoped>
.btn-error:hover {
  background: #c00 !important;
  color: var(--bs-white) !important;
}
</style>