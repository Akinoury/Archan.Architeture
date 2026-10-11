<script setup lang="ts">
const stats = [
  { value: '150+', label: 'Projetos Entregues', icon: '🏗️' },
  { value: '50k+', label: 'm² Projetados', icon: '📐' },
  { value: '98%', label: 'Satisfação', icon: '⭐' },
  { value: '15+', label: 'Anos de Experiência', icon: '🏆' }
]
</script>

<template>
  <section class="section reveal" aria-labelledby="stats-title">
    <div class="container-custom">
      <div class="grid-4" style="text-align: center;" role="list" aria-label="Estatísticas da empresa">
        <div v-for="stat in stats" :key="stat.label" class="stat-item" role="listitem">
          <div class="stat-icon" aria-hidden="true">{{ stat.icon }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stat-item {
  padding: var(--bs-spacing-md);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: var(--bs-spacing-sm);
}

.stat-value {
  font-family: var(--bs-font-serif);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 400;
  color: var(--bs-text-color);
  line-height: 1;
  margin-bottom: var(--bs-spacing-xs);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--bs-dark-gray);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

@media (max-width: 960px) {
  .grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .grid-4 {
    grid-template-columns: 1fr;
  }
}
</style>