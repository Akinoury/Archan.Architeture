<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  description?: string
  primaryButtonText?: string
  primaryButtonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  variant?: 'default' | 'accent'
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Pronto para Transformar seu Espaço?',
  description: 'Agende uma consulta gratuita e descubra como podemos valorizar seu imóvel com arquitetura de excelência.',
  primaryButtonText: 'Agendar Consulta',
  primaryButtonLink: '/contato',
  secondaryButtonText: 'Ver Projetos',
  secondaryButtonLink: '/projetos',
  variant: 'default'
})

const variantClasses = computed(() => props.variant === 'accent' ? 'section-alt' : '')
const variantStyles = computed(() => props.variant === 'accent' ? { background: 'var(--bs-accent-color)', color: 'var(--bs-white)' } : {})
const primaryButtonClass = computed(() => props.variant === 'accent' ? 'btn-ghost' : 'btn-accent')
</script>

<template>
  <section
    :class="['section', 'reveal', variantClasses]"
    :style="variantStyles"
    aria-labelledby="cta-title"
  >
    <div class="container-custom" style="text-align: center; max-width: 760px;">
      <span class="kicker" v-if="props.variant === 'accent'" style="color: var(--bs-white);">Consulta Gratuita</span>
      <h2 id="cta-title">{{ props.title }}</h2>
      <p>{{ props.description }}</p>

      <div class="hero-cta" style="margin-top: var(--bs-spacing-lg);">
        <RouterLink
          :to="props.primaryButtonLink"
          :class="['btn', primaryButtonClass]"
        >
          {{ props.primaryButtonText }}
        </RouterLink>
        <RouterLink
          :to="props.secondaryButtonLink"
          class="btn btn-ghost"
        >
          {{ props.secondaryButtonText }}
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Uses global section and button styles */
</style>