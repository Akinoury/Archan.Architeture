<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBlogStore } from '@/stores/blog'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import BlogCard from '@/components/ui/BlogCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CTASection from '@/components/sections/CTASection.vue'
import { formatDate } from '@/utils/formatters'

const blogStore = useBlogStore()

const searchQuery = ref('')
const tagFilter = ref('')

const allTags = computed(() => {
  const tags = new Set<string>()
  blogStore.posts.forEach(post => post.tags.forEach(tag => tags.add(tag)))
  return Array.from(tags).sort()
})

const filteredPosts = computed(() => {
  let result = blogStore.posts

  if (tagFilter.value) {
    result = result.filter(p => p.tags.includes(tagFilter.value))
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.excerpt.toLowerCase().includes(query) ||
      p.content.toLowerCase().includes(query)
    )
  }

  return result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
})

const blogSectionRef = ref<HTMLElement | null>(null)
const ctaSectionRef = ref<HTMLElement | null>(null)

useIntersectionObserver({ target: blogSectionRef, once: true })
useIntersectionObserver({ target: ctaSectionRef, once: true })
</script>

<template>
  <DefaultLayout>
    <section class="section reveal" ref="blogSectionRef" aria-labelledby="blog-page-title">
      <div class="container-custom">
        <header class="section-header" style="margin-bottom: var(--bs-spacing-lg); text-align: center;">
          <span class="section-label">Blog</span>
          <h1 id="blog-page-title">Artigos & Insights</h1>
          <p style="max-width: 700px; margin: var(--bs-spacing-sm) auto 0;">
            Acompanhe as últimas tendências, dicas e análises do mercado de arquitetura e design.
          </p>
        </header>

        <!-- Filters -->
        <div style="display: flex; flex-wrap: wrap; gap: var(--bs-spacing-sm); justify-content: center; margin-bottom: var(--bs-spacing-lg);">
          <div style="display: flex; gap: var(--bs-spacing-sm); flex-wrap: wrap; justify-content: center;">
            <BaseButton
              variant="ghost"
              size="sm"
              :class="{ 'btn-accent': !tagFilter }"
              @click="tagFilter = ''"
            >
              Todos
            </BaseButton>
            <BaseButton
              v-for="tag in allTags"
              :key="tag"
              variant="ghost"
              size="sm"
              :class="{ 'btn-accent': tagFilter === tag }"
              @click="tagFilter = tag"
            >
              {{ tag }}
            </BaseButton>
          </div>
        </div>

        <!-- Search -->
        <div style="max-width: 500px; margin: 0 auto var(--bs-spacing-lg);">
          <input
            type="search"
            v-model="searchQuery"
            placeholder="Buscar artigos..."
            class="form-control"
            aria-label="Buscar artigos"
            style="border-radius: 4px; border: 1px solid var(--bs-light-gray);"
          />
        </div>

        <!-- Results count -->
        <p v-if="filteredPosts.length === 0" style="text-align: center; color: var(--bs-dark-gray); padding: var(--bs-spacing-lg);">
          Nenhum artigo encontrado com os filtros atuais.
        </p>
        <p v-else style="text-align: center; color: var(--bs-dark-gray); margin-bottom: var(--bs-spacing-md); font-size: 0.9rem;">
          {{ filteredPosts.length }} artigo{{ filteredPosts.length !== 1 ? 's' : '' }} encontrado{{ filteredPosts.length !== 1 ? 's' : '' }}
        </p>

        <!-- Posts List -->
        <div class="blog-grid" role="list" aria-label="Lista de artigos" v-if="filteredPosts.length > 0">
          <BlogCard
            v-for="post in filteredPosts"
            :key="post.id"
            :post="post"
            role="listitem"
          />
        </div>
      </div>
    </section>

    <CTASection ref="ctaSectionRef" />
  </DefaultLayout>
</template>