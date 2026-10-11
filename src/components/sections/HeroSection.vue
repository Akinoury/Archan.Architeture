<script setup lang="ts">
import { computed } from 'vue'
import { useProjectsStore } from '@/stores/projects'

const projectsStore = useProjectsStore()

// Use the hero project's image as the background of the brand hero.
const heroImage = computed(() => projectsStore.heroProject?.image)
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <img
      v-if="heroImage"
      :src="heroImage"
      alt=""
      class="hero-bg-img"
      aria-hidden="true"
    />
    <div class="hero-overlay" aria-hidden="true"></div>

    <div class="hero-content reveal">
      <span class="kicker">Arquitetura &amp; Design</span>
      <h1 id="hero-title" class="hero-title">Archan Arquitetura</h1>
      <p class="hero-tagline">
        Estúdio de arquitetura moderna focado em projetos funcionais,
        estéticos e orientados ao investimento imobiliário.
      </p>

      <div class="hero-cta">
        <RouterLink to="/sobre" class="btn btn-accent btn-lg">
          Sobre Nós
        </RouterLink>
      </div>
    </div>
  </section>
</template>
