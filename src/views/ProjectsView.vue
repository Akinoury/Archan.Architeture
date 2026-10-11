<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import { useProjectsStore } from '@/stores/projects'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const projectsStore = useProjectsStore()

const categoryFilter = ref<'all' | 'residential' | 'commercial' | 'interior'>('all')
const searchQuery = ref('')

const categories = [
  { value: 'all', label: 'Todos' },
  { value: 'residential', label: 'Residencial' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'interior', label: 'Interiores' }
] as const

const filteredProjects = computed(() => {
  let result = projectsStore.projects

  if (categoryFilter.value !== 'all') {
    result = result.filter(p => p.category === categoryFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query))
    )
  }

  return result.map(p => ({ ...p, hero: p.hero ?? false }))
})

const projectsSectionRef = ref<HTMLElement | null>(null)
const ctaSectionRef = ref<HTMLElement | null>(null)

useIntersectionObserver({ target: projectsSectionRef, once: true })
useIntersectionObserver({ target: ctaSectionRef, once: true })
</script>

<template>
  <DefaultLayout>
    <section class="section reveal" ref="projectsSectionRef" aria-labelledby="projects-page-title">
      <div class="container-custom">
        <header class="section-header" style="margin-bottom: var(--bs-spacing-lg); text-align: center;">
          <span class="section-label">Portfólio</span>
          <h1 id="projects-page-title">Nossos Projetos</h1>
          <p style="max-width: 700px; margin: var(--bs-spacing-sm) auto 0;">
            Explore nosso portfólio completo de projetos arquitetônicos.
            Filtre por categoria ou busque por características específicas.
          </p>
        </header>

        <!-- Filters -->
        <div class="filters" style="display: flex; flex-wrap: wrap; gap: var(--bs-spacing-sm); justify-content: center; margin-bottom: var(--bs-spacing-lg);">
          <div style="display: flex; gap: var(--bs-spacing-sm); flex-wrap: wrap; justify-content: center;">
            <button
              v-for="cat in categories"
              :key="cat.value"
              :class="['btn', categoryFilter === cat.value ? 'btn-accent' : 'btn-ghost', 'btn-sm']"
              @click="categoryFilter = cat.value"
              type="button"
            >
              {{ cat.label }}
            </button>
          </div>
        </div>

        <!-- Search -->
        <div style="max-width: 500px; margin: 0 auto var(--bs-spacing-lg);">
          <input
            type="search"
            v-model="searchQuery"
            placeholder="Buscar projetos..."
            class="form-control"
            aria-label="Buscar projetos"
            style="border-radius: 4px; border: 1px solid var(--bs-light-gray);"
          />
        </div>

        <!-- Results count -->
        <p v-if="filteredProjects.length === 0" style="text-align: center; color: var(--bs-dark-gray); padding: var(--bs-spacing-lg);">
          Nenhum projeto encontrado com os filtros atuais.
        </p>
        <p v-else style="text-align: center; color: var(--bs-dark-gray); margin-bottom: var(--bs-spacing-md); font-size: 0.9rem;">
          {{ filteredProjects.length }} projeto{{ filteredProjects.length !== 1 ? 's' : '' }} encontrado{{ filteredProjects.length !== 1 ? 's' : '' }}
        </p>

        <!-- Projects Grid -->
        <div class="grid-3" role="list" aria-label="Lista de projetos" v-if="filteredProjects.length > 0">
          <ProjectCard
            v-for="project in filteredProjects"
            :key="project.id"
            :project="project"
            role="listitem"
          />
        </div>
      </div>
    </section>

    <CTASection ref="ctaSectionRef" />
  </DefaultLayout>
</template>