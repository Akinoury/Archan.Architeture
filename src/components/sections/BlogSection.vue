<script setup lang="ts">
import { computed } from 'vue'
import { useBlogStore } from '@/stores/blog'
import { formatDate } from '@/utils/formatters'
import BlogCard from '@/components/ui/BlogCard.vue'

const blogStore = useBlogStore()

const featuredPosts = computed(() => blogStore.featuredPosts.slice(0, 3))
</script>

<template>
  <section class="section section-alt reveal" aria-labelledby="blog-title">
    <div class="container-custom">
      <header class="section-header" style="margin-bottom: var(--bs-spacing-lg);">
        <span class="section-label">Artigos Recentes</span>
        <h2 id="blog-title">Insights & Tendências</h2>
        <p style="max-width: 600px;">
          Acompanhe as últimas tendências em arquitetura, design de interiores 
          e mercado imobiliário através dos nossos artigos especializados.
        </p>
      </header>

      <div style="display: flex; flex-direction: column; gap: var(--bs-spacing-md);" role="list" aria-label="Posts do blog">
        <article
          v-for="post in featuredPosts"
          :key="post.id"
          class="blog-entry reveal"
          role="listitem"
        >
          <img :src="post.image" :alt="post.title" loading="lazy" />
          <div class="blog-entry-body">
            <span class="card-meta">{{ formatDate(post.publishedAt) }}</span>
            <h3>{{ post.title }}</h3>
            <p>{{ post.excerpt }}</p>
            <RouterLink :to="`/blog/${post.id}`" class="btn btn-ghost btn-sm" style="width: fit-content; margin-top: var(--bs-spacing-xs);">
              Ler mais
            </RouterLink>
          </div>
        </article>
      </div>

      <div class="text-center" style="margin-top: var(--bs-spacing-lg);">
        <RouterLink to="/blog" class="btn btn-accent">
          Ver Todos os Artigos
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