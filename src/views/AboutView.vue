<script setup lang="ts">
import { ref } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import StatsSection from '@/components/sections/StatsSection.vue'
import CTASection from '@/components/sections/CTASection.vue'

const introRef = ref<HTMLElement | null>(null)
const valuesRef = ref<HTMLElement | null>(null)

useIntersectionObserver({ target: introRef, once: true })
useIntersectionObserver({ target: valuesRef, once: true })

const values = [
  {
    icon: '🏛️',
    title: 'Excelência',
    text: 'Cada projeto é desenvolvido com rigor técnico, atenção aos detalhes e acabamento de alto padrão.'
  },
  {
    icon: '🌿',
    title: 'Sustentabilidade',
    text: 'Priorizamos soluções que respeitam o meio ambiente, o conforto térmico e a eficiência energética.'
  },
  {
    icon: '🤝',
    title: 'Compromisso',
    text: 'Acompanhamos todas as etapas, do conceito à obra, garantindo prazos e resultados para o seu investimento.'
  }
]
</script>

<template>
  <DefaultLayout>
    <section class="section reveal" ref="introRef" aria-labelledby="about-title">
      <div class="container-custom">
        <header class="section-header">
          <span class="section-label">Sobre Nós</span>
          <h1 id="about-title">Archan Arquitetura</h1>
          <p>
            Estúdio de arquitetura moderna focado em projetos funcionais,
            estéticos e orientados ao investimento imobiliário.
          </p>
        </header>

        <div class="about-split">
          <div class="about-text">
            <h2>Design que valoriza o seu espaço</h2>
            <p>
              A Archan Arquitetura nasceu da vontade de unir beleza e propósito.
              Acreditamos que um bom projeto vai muito além da estética: ele
              melhora a forma como as pessoas vivem, trabalham e se relacionam
              com a cidade.
            </p>
            <p>
              Do conceito inicial à entrega da obra, trabalhamos lado a lado com
              nossos clientes para criar espaços únicos, funcionais e que
              valorizam o seu patrimônio. Nossa equipe combina experiência em
              arquitetura residencial, comercial e de interiores.
            </p>
            <RouterLink to="/contato" class="btn btn-accent">
              Fale Conosco
            </RouterLink>
          </div>

          <div class="about-image">
            <img
              src="/assets/images/interior_shot_1776171949307.png"
              alt="Interior contemporâneo projetado pela Archan Arquitetura"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="section section-alt reveal" ref="valuesRef" aria-labelledby="values-title">
      <div class="container-custom">
        <header class="section-header">
          <span class="section-label">Nossos Valores</span>
          <h2 id="values-title">O que nos guia</h2>
        </header>

        <div class="grid-3" role="list" aria-label="Valores da Archan Arquitetura">
          <article
            v-for="value in values"
            :key="value.title"
            class="value-card"
            role="listitem"
          >
            <div class="value-icon" aria-hidden="true">{{ value.icon }}</div>
            <h3>{{ value.title }}</h3>
            <p>{{ value.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <StatsSection />

    <CTASection
      title="Vamos criar o seu próximo projeto?"
      description="Conte-nos sua ideia e descubra como podemos transformar o seu espaço com arquitetura de excelência."
      primary-button-text="Ver Projetos"
      primary-button-link="/projetos"
      secondary-button-text="Fale Conosco"
      secondary-button-link="/contato"
    />
  </DefaultLayout>
</template>

<style scoped>
.about-split {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: var(--bs-spacing-xl);
  align-items: center;
}

.about-text h2 {
  margin-bottom: var(--bs-spacing-md);
}

.about-text p {
  color: var(--bs-dark-gray);
  margin-bottom: var(--bs-spacing-md);
  line-height: 1.8;
}

.about-image img {
  width: 100%;
  height: 100%;
  max-height: 480px;
  object-fit: cover;
  border-radius: 0;
}

.value-card {
  background: var(--bs-bg-color);
  padding: var(--bs-spacing-lg);
  border: 1px solid var(--bs-light-gray);
  text-align: center;
  height: 100%;
}

.value-icon {
  font-size: 2.5rem;
  margin-bottom: var(--bs-spacing-sm);
}

.value-card h3 {
  margin-bottom: var(--bs-spacing-xs);
}

.value-card p {
  color: var(--bs-dark-gray);
  line-height: 1.7;
  margin: 0;
}

@media (max-width: 960px) {
  .about-split {
    grid-template-columns: 1fr;
    gap: var(--bs-spacing-lg);
  }
}
</style>
