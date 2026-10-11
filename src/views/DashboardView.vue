<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import { useBlogStore } from '@/stores/blog'
import { useDevModeStore } from '@/stores/devMode'
import { useToast } from '@/composables/useToast'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import BlogCard from '@/components/ui/BlogCard.vue'
import { formatCurrency } from '@/utils/formatters'
import { useModal } from '@/composables/useModal'

const router = useRouter()

const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const blogStore = useBlogStore()
const devModeStore = useDevModeStore()
const { success, error } = useToast()
const { openModal, closeModal, confirmDialog } = useModal()

const activeTab = ref<'projects' | 'blog' | 'create'>('projects')
const showCreateProject = ref(false)
const showCreatePost = ref(false)

const ariaLabelledBy = computed(() => `tab-${activeTab.value}`)

const newProject = ref({
  title: '',
  description: '',
  price: 0,
  area: 0,
  bedrooms: 0,
  bathrooms: 0,
  garage: 0,
  floors: 1,
  image: '/assets/images/hero_exterior_1776171883335.png',
  featured: false,
  hero: false,
  category: 'residential' as 'residential' | 'commercial' | 'interior',
  tags: ''
})

const newPost = ref({
  title: '',
  excerpt: '',
  content: '',
  image: '/assets/images/project_render_1776171965188.png',
  tags: '',
  featured: false
})

const projectTabs = [
  { id: 'projects', label: 'Projetos', count: projectsStore.projects.length },
  { id: 'blog', label: 'Blog', count: blogStore.posts.length },
  { id: 'create', label: 'Criar', count: 0 }
] as const

async function handleCreateProject() {
  try {
    await projectsStore.addProject({
      ...newProject.value,
      tags: newProject.value.tags.split(',').map(t => t.trim()).filter(Boolean)
    })
    success('Projeto criado com sucesso!')
    showCreateProject.value = false
    activeTab.value = 'projects'
    resetNewProject()
  } catch {
    error('Erro ao criar projeto')
  }
}

async function handleCreatePost() {
  try {
    await blogStore.addPost({
      ...newPost.value,
      author: authStore.user?.name || 'Archan Team',
      publishedAt: new Date().toISOString(),
      tags: newPost.value.tags.split(',').map(t => t.trim()).filter(Boolean)
    })
    success('Artigo criado com sucesso!')
    showCreatePost.value = false
    activeTab.value = 'blog'
    resetNewPost()
  } catch {
    error('Erro ao criar artigo')
  }
}

async function handleDeleteProject(id: string) {
  const confirmed = await confirmDialog({
    title: 'Excluir Projeto',
    message: 'Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.',
    confirmText: 'Excluir',
    type: 'danger'
  })
  if (confirmed) {
    try {
      await projectsStore.deleteProject(id)
      success('Projeto excluído')
    } catch {
      error('Erro ao excluir projeto')
    }
  }
}

async function handleDeletePost(id: string) {
  const confirmed = await confirmDialog({
    title: 'Excluir Artigo',
    message: 'Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.',
    confirmText: 'Excluir',
    type: 'danger'
  })
  if (confirmed) {
    try {
      await blogStore.deletePost(id)
      success('Artigo excluído')
    } catch {
      error('Erro ao excluir artigo')
    }
  }
}

function resetNewProject() {
  newProject.value = {
    title: '',
    description: '',
    price: 0,
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    garage: 0,
    floors: 1,
    image: '/assets/images/hero_exterior_1776171883335.png',
    featured: false,
    hero: false,
    category: 'residential',
    tags: ''
  }
}

function resetNewPost() {
  newPost.value = {
    title: '',
    excerpt: '',
    content: '',
    image: '/assets/images/project_render_1776171965188.png',
    tags: '',
    featured: false
  }
}
</script>

<template>
  <DefaultLayout>
    <section class="section reveal" aria-labelledby="dashboard-title">
      <div class="container-custom">
        <header style="margin-bottom: var(--bs-spacing-lg);">
          <h1 id="dashboard-title">Dashboard Administrativo</h1>
          <p style="color: var(--bs-dark-gray);">Gerencie projetos, artigos e configurações do site.</p>
        </header>

        <div class="dashboard-layout">
          <aside class="dashboard-sidebar" aria-label="Navegação do dashboard">
            <h3>Menu</h3>
            <nav style="display: flex; flex-direction: column; gap: var(--bs-spacing-xs);">
              <button
                v-for="tab in projectTabs"
                :key="tab.id"
                :class="['btn', 'btn-full', 'btn-ghost', 'btn-sm', { 'btn-accent': activeTab === tab.id }]"
                @click="activeTab = tab.id as any"
                style="text-align: left; justify-content: space-between;"
                type="button"
              >
                {{ tab.label }}
                <span class="status-pill" :class="tab.count === 0 ? 'off' : ''">{{ tab.count }}</span>
              </button>
            </nav>

            <div class="dashboard-card" style="margin-top: var(--bs-spacing-lg);">
              <h3 style="font-size: 0.85rem; margin-bottom: var(--bs-spacing-sm);">Estatísticas Rápidas</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--bs-spacing-sm); font-size: 0.85rem;">
                <div><strong>Projetos:</strong> {{ projectsStore.projects.length }}</div>
                <div><strong>Destaques:</strong> {{ projectsStore.featuredProjects.length }}</div>
                <div><strong>Artigos:</strong> {{ blogStore.posts.length }}</div>
                <div><strong>Destaques Blog:</strong> {{ blogStore.featuredPosts.length }}</div>
              </div>
            </div>
          </aside>

          <main class="dashboard-main" role="tabpanel" :aria-labelledby="ariaLabelledBy">
            <!-- Projects Tab -->
            <div v-if="activeTab === 'projects'" role="tabpanel" id="tab-projects">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--bs-spacing-md); flex-wrap: wrap; gap: var(--bs-spacing-sm);">
                <h2>Projetos ({{ projectsStore.projects.length }})</h2>
                <BaseButton variant="accent" @click="activeTab = 'create'">
                  + Novo Projeto
                </BaseButton>
              </div>

              <div v-if="projectsStore.projects.length === 0" style="text-align: center; padding: var(--bs-spacing-xl); color: var(--bs-dark-gray);">
                <p>Nenhum projeto cadastrado.</p>
                <BaseButton variant="accent" @click="activeTab = 'create'" style="margin-top: var(--bs-spacing-md);">
                  Criar Primeiro Projeto
                </BaseButton>
              </div>

              <div v-else class="grid-3" role="list" aria-label="Lista de projetos para gerenciamento">
                <ProjectCard
                  v-for="project in projectsStore.projects.map(p => ({ ...p, hero: p.hero ?? false }))"
                  :key="project.id"
                  :project="project"
                  role="listitem"
                />
              </div>
            </div>

            <!-- Blog Tab -->
            <div v-if="activeTab === 'blog'" role="tabpanel" id="tab-blog">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--bs-spacing-md); flex-wrap: wrap; gap: var(--bs-spacing-sm);">
                <h2>Artigos do Blog ({{ blogStore.posts.length }})</h2>
                <BaseButton variant="accent" @click="activeTab = 'create'">
                  + Novo Artigo
                </BaseButton>
              </div>

              <div v-if="blogStore.posts.length === 0" style="text-align: center; padding: var(--bs-spacing-xl); color: var(--bs-dark-gray);">
                <p>Nenhum artigo cadastrado.</p>
                <BaseButton variant="accent" @click="activeTab = 'create'" style="margin-top: var(--bs-spacing-md);">
                  Criar Primeiro Artigo
                </BaseButton>
              </div>

              <div v-else class="blog-grid" role="list" aria-label="Lista de artigos para gerenciamento">
                <BlogCard
                  v-for="post in blogStore.posts"
                  :key="post.id"
                  :post="post"
                  role="listitem"
                />
              </div>
            </div>

            <!-- Create Tab -->
            <div v-if="activeTab === 'create'" role="tabpanel" id="tab-create">
              <div class="form-grid form-grid-2" style="gap: var(--bs-spacing-lg);">
                <div class="card" style="padding: var(--bs-spacing-lg);">
                  <h3 style="margin-bottom: var(--bs-spacing-md);">Novo Projeto</h3>
                  <form @submit.prevent="handleCreateProject">
                    <BaseInput v-model="newProject.title" label="Título" required placeholder="Título do projeto" />
                    <BaseInput v-model="newProject.description" label="Descrição" required placeholder="Descrição curta" />
                    <div class="form-grid form-grid-2">
                      <BaseInput v-model.number="newProject.price" type="number" label="Preço (R$)" required min="0" step="1000" />
                      <BaseInput v-model.number="newProject.area" type="number" label="Área (m²)" required min="0" step="1" />
                    </div>
                    <div class="form-grid form-grid-4">
                      <BaseInput v-model.number="newProject.bedrooms" type="number" label="Quartos" min="0" />
                      <BaseInput v-model.number="newProject.bathrooms" type="number" label="Banheiros" min="0" />
                      <BaseInput v-model.number="newProject.garage" type="number" label="Vagas" min="0" />
                      <BaseInput v-model.number="newProject.floors" type="number" label="Pavimentos" min="1" />
                    </div>
                    <BaseInput v-model="newProject.image" label="Imagem (URL)" placeholder="/assets/images/..." />
                    <BaseInput v-model="newProject.tags" label="Tags (separadas por vírgula)" placeholder="Moderno, Sustentável, Luxo" />
                    <div class="form-grid form-grid-2" style="margin-top: var(--bs-spacing-sm);">
                      <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                        <input type="checkbox" v-model="newProject.featured" /> Destaque
                      </label>
                      <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                        <input type="checkbox" v-model="newProject.hero" /> Hero Principal
                      </label>
                    </div>
                    <div style="margin-top: var(--bs-spacing-md);">
                      <BaseButton variant="accent" type="submit" full-width>Criar Projeto</BaseButton>
                    </div>
                  </form>
                </div>

                <div class="card" style="padding: var(--bs-spacing-lg);">
                  <h3 style="margin-bottom: var(--bs-spacing-md);">Novo Artigo</h3>
                  <form @submit.prevent="handleCreatePost">
                    <BaseInput v-model="newPost.title" label="Título" required placeholder="Título do artigo" />
                    <BaseInput v-model="newPost.excerpt" label="Resumo" required placeholder="Resumo curto para listagem" />
                    <BaseInput v-model="newPost.content" label="Conteúdo (HTML)" placeholder="<h2>Título</h2><p>Conteúdo...</p>" />
                    <BaseInput v-model="newPost.image" label="Imagem (URL)" placeholder="/assets/images/..." />
                    <BaseInput v-model="newPost.tags" label="Tags (separadas por vírgula)" placeholder="Arquitetura, Sustentabilidade, Tendências" />
                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; margin-top: var(--bs-spacing-sm);">
                      <input type="checkbox" v-model="newPost.featured" /> Artigo em Destaque
                    </label>
                    <div style="margin-top: var(--bs-spacing-md);">
                      <BaseButton variant="accent" type="submit" full-width>Criar Artigo</BaseButton>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<style scoped>
.form-grid {
  display: grid;
  gap: var(--bs-spacing-sm);
}

.form-grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.form-grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 960px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }

  .dashboard-sidebar {
    border-right: none;
    border-bottom: 1px solid var(--bs-light-gray);
    padding-right: 0;
    padding-bottom: var(--bs-spacing-md);
  }

  .dashboard-main {
    margin-top: var(--bs-spacing-lg);
  }

  .form-grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .form-grid-2,
  .form-grid-4 {
    grid-template-columns: 1fr;
  }

  .dashboard-main {
    margin-top: var(--bs-spacing-md);
  }
}
</style>