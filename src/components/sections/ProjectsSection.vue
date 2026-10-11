<script setup lang="ts">
import { computed } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useDevModeStore } from '@/stores/devMode'

const projectsStore = useProjectsStore()
const devModeStore = useDevModeStore()

const featuredProjects = computed(() => projectsStore.featuredProjects.filter(p => !p.hero).map(p => ({
  ...p,
  hero: p.hero ?? false
})))

const categoryLabels: Record<string, string> = {
  residential: 'Residencial',
  commercial: 'Comercial',
  interior: 'Interiores'
}
</script>

<template>
  <section class="section reveal" aria-labelledby="projects-title">
    <div class="container-custom">
      <header class="section-header" style="margin-bottom: var(--bs-spacing-lg);">
        <span class="section-label">Nossos Projetos</span>
        <h2 id="projects-title">Projetos em Destaque</h2>
        <p style="max-width: 600px;">
          Seleção dos nossos melhores projetos arquitetônicos, 
          combinando estética, funcionalidade e valor de investimento.
        </p>
      </header>

      <div class="grid-3" role="list" aria-label="Projetos em destaque">
        <ProjectCard
          v-for="project in featuredProjects"
          :key="project.id"
          :project="project"
          role="listitem"
        />
      </div>

      <div class="text-center" style="margin-top: var(--bs-spacing-lg);">
        <RouterLink to="/projetos" class="btn btn-accent">
          Ver Todos os Projetos
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-header {
  text-align: center;
}

.section-header p {
  margin: var(--bs-spacing-sm) auto 0;
  color: var(--bs-dark-gray);
}

.text-center {
  text-align: center;
}
</style>