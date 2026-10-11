<script setup lang="ts">
import { useProjectsStore } from '@/stores/projects'
import ProjectCard from '@/components/ui/ProjectCard.vue'

const projectsStore = useProjectsStore()
const heroProject = projectsStore.heroProject
const featuredProjects = projectsStore.featuredProjects
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <img
      v-if="heroProject"
      :src="heroProject.image"
      :alt="`Projeto em destaque: ${heroProject.title}`"
      class="hero-bg-img"
      aria-hidden="true"
    />

    <div class="hero-content reveal">
      <span class="kicker">Projeto em Destaque</span>
      <h1 id="hero-title" v-if="heroProject">{{ heroProject.title }}</h1>
      <p v-if="heroProject">{{ heroProject.description }}</p>

      <div class="hero-cta">
        <RouterLink
          v-if="heroProject"
          :to="`/projetos/${heroProject.id}`"
          class="btn btn-accent"
        >
          Ver Projeto
        </RouterLink>
        <RouterLink to="/projetos" class="btn btn-ghost">
          Ver Todos
        </RouterLink>
      </div>
    </div>
  </section>
</template>