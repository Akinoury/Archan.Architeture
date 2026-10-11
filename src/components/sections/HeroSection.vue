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

    <div class="hero-content reveal">
      <span class="kicker">Arquitetura &amp; Design</span>
      <h1 id="hero-title" class="hero-title">Archan Arquitetura</h1>
      <p>
        Estúdio de arquitetura moderna focado em projetos funcionais,
        estéticos e orientados ao investimento imobiliário.
      </p>

      <div class="hero-cta">
        <RouterLink to="/sobre" class="btn btn-accent">
          Sobre Nós
        </RouterLink>
        <RouterLink to="/projetos" class="btn btn-ghost">
          Ver Projetos
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-title {
  font-family: var(--bs-font-special);
  font-weight: 400;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 1.05;
  letter-spacing: 0.02em;
}

@media (max-width: 480px) {
  .hero-title {
    font-size: clamp(2rem, 9vw, 2.75rem);
  }
}
</style>
