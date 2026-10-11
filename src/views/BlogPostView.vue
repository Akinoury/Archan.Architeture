<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import { useDevModeStore } from '@/stores/devMode'
import { useToast } from '@/composables/useToast'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import ImageSlider from '@/components/ui/ImageSlider.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CTASection from '@/components/sections/CTASection.vue'
import { formatDate } from '@/utils/formatters'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()
const devModeStore = useDevModeStore()
const { error, success } = useToast()

const post = computed(() => blogStore.getPostById(route.params.slug as string))
const loading = ref(true)

function goBack() {
  router.back()
}

async function handleFeature() {
  if (!post.value) return
  try {
    await blogStore.toggleFeatured(post.value.id)
    success(post.value.featured ? 'Removido dos destaques' : 'Adicionado aos destaques')
  } catch {
    error('Erro ao atualizar destaque')
  }
}

async function handleDelete() {
  if (!post.value) return
  try {
    await blogStore.deletePost(post.value.id)
    success('Artigo excluído com sucesso')
    await router.push({ name: 'Blog' })
  } catch {
    error('Erro ao excluir artigo')
  }
}
</script>

<template>
  <DefaultLayout>
    <article v-if="post" class="reveal">
      <header class="section section-alt" style="padding: var(--bs-spacing-xl) 0;">
        <div class="container-custom">
          <div style="max-width: 800px; margin: 0 auto; text-align: center;">
            <span class="section-label" style="color: var(--bs-accent-color);">{{ post.category || 'Artigo' }}</span>
            <h1 style="margin-top: var(--bs-spacing-md); margin-bottom: var(--bs-spacing-lg);">{{ post.title }}</h1>

            <div style="display: flex; justify-content: center; align-items: center; gap: var(--bs-spacing-md); flex-wrap: wrap; margin-bottom: var(--bs-spacing-lg); color: var(--bs-dark-gray); font-size: 0.9rem;">
              <span>{{ formatDate(post.publishedAt) }}</span>
              <span>•</span>
              <span>{{ post.author }}</span>
              <span v-if="post.tags.length">•</span>
              <span v-for="tag in post.tags" :key="tag" style="background: var(--bs-light-gray); padding: 0.2rem 0.75rem; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem;">{{ tag }}</span>
            </div>

            <div v-if="devModeStore.enabled" style="display: flex; gap: var(--bs-spacing-sm); justify-content: center; margin-top: var(--bs-spacing-lg);">
              <BaseButton variant="ghost" size="sm" @click="handleFeature" :class="{ 'btn-accent': post.featured }">
                {{ post.featured ? '★ Destaque' : '☆ Destaque' }}
              </BaseButton>
              <BaseButton variant="ghost" size="sm" @click="handleDelete" class="btn-error" style="border-color: #c00; color: #c00;">
                Excluir
              </BaseButton>
            </div>
          </div>
        </div>
      </header>

      <section class="section" aria-labelledby="content-title">
        <div class="container-custom">
          <div style="max-width: 800px; margin: 0 auto;">
            <figure style="margin-bottom: var(--bs-spacing-xl);">
              <img
                :src="post.image"
                :alt="post.title"
                style="width: 100%; height: auto; border-radius: 0;"
                loading="eager"
              />
            </figure>

            <div
              id="content-title"
              class="prose"
              v-html="post.content"
              style="font-size: 1.05rem; line-height: 1.85; color: var(--bs-dark-gray);"
            />

            <div style="margin-top: var(--bs-spacing-xl); padding-top: var(--bs-spacing-lg); border-top: 1px solid var(--bs-light-gray);">
              <BaseButton variant="ghost" @click="goBack" class="btn-icon" style="gap: 0.5rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Voltar ao Blog
              </BaseButton>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </article>
  </DefaultLayout>
</template>

<style scoped>
.prose h2 {
  margin-top: var(--bs-spacing-lg);
  margin-bottom: var(--bs-spacing-sm);
}

.prose h3 {
  margin-top: var(--bs-spacing-md);
  margin-bottom: var(--bs-spacing-sm);
}

.prose p {
  margin-bottom: var(--bs-spacing-md);
}

.prose ul, .prose ol {
  margin-bottom: var(--bs-spacing-md);
  padding-left: var(--bs-spacing-lg);
}

.prose li {
  margin-bottom: var(--bs-spacing-xs);
}

.prose strong {
  color: var(--bs-text-color);
}

.prose a {
  color: var(--bs-accent-color);
  text-decoration: underline;
}

.prose a:hover {
  opacity: 0.8;
}

.btn-error:hover {
  background: #c00 !important;
  color: var(--bs-white) !important;
}
</style>