<script setup lang="ts">
import { useRouter } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()

function goHome() {
  router.push({ name: 'Home' })
}
</script>

<template>
  <DefaultLayout>
    <section class="section" style="min-height: 60vh; display: flex; align-items: center; justify-content: center; text-align: center;">
      <div class="container-custom">
        <div style="max-width: 500px; margin: 0 auto;">
          <h1 style="font-size: 6rem; font-weight: 700; color: var(--bs-accent-color); line-height: 1; margin-bottom: var(--bs-spacing-md);">404</h1>
          <h2 style="margin-bottom: var(--bs-spacing-md);">Página não encontrada</h2>
          <p style="color: var(--bs-dark-gray); margin-bottom: var(--bs-spacing-lg);">
            A página que você procura não existe ou foi movida. 
            Verifique o endereço ou navegue pelas opções abaixo.
          </p>
          <div style="display: flex; gap: var(--bs-spacing-sm); justify-content: center; flex-wrap: wrap;">
            <BaseButton variant="accent" @click="goHome">Voltar ao Início</BaseButton>
            <BaseButton variant="ghost" to="/projetos">Ver Projetos</BaseButton>
            <BaseButton variant="ghost" to="/blog">Ler Blog</BaseButton>
          </div>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>