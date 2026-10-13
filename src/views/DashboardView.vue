<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
import type { BlogPost, Project } from '@/types'

const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const blogStore = useBlogStore()
const devModeStore = useDevModeStore()
const { success, error } = useToast()

const activeTab = ref<'projects' | 'blog' | 'create'>('projects')
const editingProjectId = ref<string | null>(null)
const editingPostId = ref<string | null>(null)

const DEFAULT_PROJECT_IMAGE = '/assets/images/hero_exterior_1776171883335.png'
const DEFAULT_POST_IMAGE = '/assets/images/project_render_1776171965188.png'

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
  image: DEFAULT_PROJECT_IMAGE,
  featured: false,
  hero: false,
  category: 'residential' as 'residential' | 'commercial' | 'interior',
  tags: '',
  currency: 'BRL' as 'BRL' | 'USD'
})

const newPost = ref({
  title: '',
  excerpt: '',
  content: '',
  image: DEFAULT_POST_IMAGE,
  tags: '',
  featured: false
})

const projectErrors = ref<Record<string, string>>({})
const postErrors = ref<Record<string, string>>({})

// Reactive so the sidebar counters update as content is created/removed.
const projectTabs = computed(() => [
  { id: 'projects', label: 'Projetos', count: projectsStore.projects.length },
  { id: 'blog', label: 'Blog', count: blogStore.posts.length },
  { id: 'create', label: 'Criar', count: 0 }
])

function splitTags(value: string): string[] {
  return value.split(',').map(t => t.trim()).filter(Boolean)
}

function validateProject(): boolean {
  const errors: Record<string, string> = {}
  if (!newProject.value.title.trim()) errors.title = 'Informe o título do projeto.'
  if (!newProject.value.description.trim()) errors.description = 'Informe uma descrição.'
  if (Number(newProject.value.price) < 0) errors.price = 'Valor inválido.'
  if (Number(newProject.value.area) < 0) errors.area = 'Área inválida.'
  projectErrors.value = errors
  return Object.keys(errors).length === 0
}

function validatePost(): boolean {
  const errors: Record<string, string> = {}
  if (!newPost.value.title.trim()) errors.title = 'Informe o título do artigo.'
  if (!newPost.value.excerpt.trim()) errors.excerpt = 'Informe um resumo.'
  postErrors.value = errors
  return Object.keys(errors).length === 0
}

function loadProject(project: Project) {
  newProject.value = {
    title: project.title,
    description: project.description,
    price: project.price,
    area: project.area,
    bedrooms: project.bedrooms,
    bathrooms: project.bathrooms,
    garage: project.garage,
    floors: project.floors,
    image: project.image || DEFAULT_PROJECT_IMAGE,
    featured: project.featured,
    hero: project.hero ?? false,
    category: project.category,
    tags: project.tags.join(', '),
    currency: (project.currency as 'BRL' | 'USD') || 'BRL'
  }
  editingProjectId.value = project.id
  projectErrors.value = {}
}

function loadPost(post: BlogPost) {
  newPost.value = {
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image || DEFAULT_POST_IMAGE,
    tags: post.tags.join(', '),
    featured: post.featured
  }
  editingPostId.value = post.id
  postErrors.value = {}
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
    image: DEFAULT_PROJECT_IMAGE,
    featured: false,
    hero: false,
    category: 'residential',
    tags: '',
    currency: 'BRL'
  }
  projectErrors.value = {}
}

function resetNewPost() {
  newPost.value = {
    title: '',
    excerpt: '',
    content: '',
    image: DEFAULT_POST_IMAGE,
    tags: '',
    featured: false
  }
  postErrors.value = {}
}

function clearEditQuery() {
  if (!route.query.edit && !route.query.tab && !route.query.type) return
  const query = { ...route.query }
  delete query.edit
  delete query.tab
  delete query.type
  router.replace({ query })
}

function exitEdit() {
  editingProjectId.value = null
  editingPostId.value = null
  resetNewProject()
  resetNewPost()
}

function cancelEdit() {
  const wasProject = !!editingProjectId.value
  exitEdit()
  activeTab.value = wasProject ? 'projects' : 'blog'
  clearEditQuery()
}

async function handleProjectSubmit() {
  if (!validateProject()) {
    error('Corrija os campos destacados.')
    return
  }
  try {
    const payload = {
      ...newProject.value,
      image: newProject.value.image.trim() || DEFAULT_PROJECT_IMAGE,
      title: newProject.value.title.trim(),
      description: newProject.value.description.trim(),
      tags: splitTags(newProject.value.tags),
      currency: newProject.value.currency
    }
    if (editingProjectId.value) {
      await projectsStore.updateProject(editingProjectId.value, payload)
      success('Projeto atualizado com sucesso!')
    } else {
      await projectsStore.addProject(payload)
      success('Projeto criado com sucesso!')
    }
    exitEdit()
    activeTab.value = 'projects'
    clearEditQuery()
  } catch {
    error('Erro ao salvar projeto')
  }
}

async function handlePostSubmit() {
  if (!validatePost()) {
    error('Corrija os campos destacados.')
    return
  }
  try {
    const payload = {
      ...newPost.value,
      image: newPost.value.image.trim() || DEFAULT_POST_IMAGE,
      title: newPost.value.title.trim(),
      excerpt: newPost.value.excerpt.trim(),
      author: authStore.user?.name || 'Archan Team',
      publishedAt: new Date().toISOString(),
      tags: splitTags(newPost.value.tags)
    }
    if (editingPostId.value) {
      await blogStore.updatePost(editingPostId.value, payload)
      success('Artigo atualizado com sucesso!')
    } else {
      await blogStore.addPost(payload)
      success('Artigo criado com sucesso!')
    }
    exitEdit()
    activeTab.value = 'blog'
    clearEditQuery()
  } catch {
    error('Erro ao salvar artigo')
  }
}

// Open the editor directly from the query string (?tab=create&type=project&edit=ID).
// Used by the "Editar" button on the public cards / dashboard cards.
function syncFromRoute() {
  const editId = (route.query.edit as string) || ''
  const type = (route.query.type as string) || ''
  const tab = (route.query.tab as string) || ''

  if (!editId) {
    if (tab === 'blog') activeTab.value = 'blog'
    else if (tab === 'create') activeTab.value = 'create'
    return
  }

  if (type === 'post') {
    const post = blogStore.getPostById(editId)
    if (post) {
      editingProjectId.value = null
      loadPost(post)
      activeTab.value = 'create'
    }
  } else {
    const project = projectsStore.getProjectById(editId)
    if (project) {
      editingPostId.value = null
      loadProject(project)
      activeTab.value = 'create'
    }
  }
}

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    error('Imagem muito grande. Máximo 5MB.')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    newProject.value.image = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function handlePostFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    error('Imagem muito grande. Máximo 5MB.')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    newPost.value.image = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

onMounted(syncFromRoute)
watch(() => route.fullPath, syncFromRoute)
</script>

<template>
  <DefaultLayout>
    <section class="section reveal" aria-labelledby="dashboard-title">
      <div class="container-custom">
        <header class="dashboard-header">
          <h1 id="dashboard-title">Dashboard</h1>
          <p>Gerencie projetos, artigos e o conteúdo do site.</p>
        </header>

        <div v-if="devModeStore.enabled" class="dev-banner" role="status">
          <span class="dev-dot" aria-hidden="true"></span>
          <div>
            <strong>Modo Admin/Dev ativo</strong>
            <span>Crie, edite, destaque ou exclua conteúdo. As alterações ficam salvas neste navegador.</span>
          </div>
        </div>

        <div class="dashboard-layout">
          <aside class="dashboard-sidebar" aria-label="Navegação do dashboard">
            <h3>Menu</h3>
            <nav class="dashboard-nav">
              <button
                v-for="tab in projectTabs"
                :key="tab.id"
                :class="['btn', 'btn-full', 'btn-ghost', 'btn-sm', { 'btn-accent': activeTab === tab.id }]"
                @click="activeTab = tab.id as any"
                type="button"
              >
                {{ tab.label }}
                <span class="status-pill" :class="tab.count === 0 ? 'off' : ''">{{ tab.count }}</span>
              </button>
            </nav>

            <div class="dashboard-card dashboard-stats">
              <h3>Estatísticas Rápidas</h3>
              <div class="dashboard-stats-grid">
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
              <div class="tab-head">
                <h2>Projetos ({{ projectsStore.projects.length }})</h2>
                <BaseButton variant="accent" @click="editingProjectId = null; editingPostId = null; resetNewProject(); resetNewPost(); activeTab = 'create'">
                  + Novo Projeto
                </BaseButton>
              </div>

              <div v-if="projectsStore.projects.length === 0" class="tab-empty">
                <p>Nenhum projeto cadastrado.</p>
                <BaseButton variant="accent" @click="activeTab = 'create'">
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
              <div class="tab-head">
                <h2>Artigos do Blog ({{ blogStore.posts.length }})</h2>
                <BaseButton variant="accent" @click="editingPostId = null; editingProjectId = null; resetNewPost(); resetNewProject(); activeTab = 'create'">
                  + Novo Artigo
                </BaseButton>
              </div>

              <div v-if="blogStore.posts.length === 0" class="tab-empty">
                <p>Nenhum artigo cadastrado.</p>
                <BaseButton variant="accent" @click="activeTab = 'create'">
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

            <!-- Create / Edit Tab -->
            <div v-if="activeTab === 'create'" role="tabpanel" id="tab-create">
              <div v-if="editingProjectId || editingPostId" class="edit-banner">
                <span>
                  Editando {{ editingProjectId ? 'projeto' : 'artigo' }}:
                  <strong>{{ editingProjectId ? (newProject.title || 'sem título') : (newPost.title || 'sem título') }}</strong>
                </span>
                <BaseButton variant="ghost" size="sm" type="button" @click="cancelEdit">
                  Cancelar edição
                </BaseButton>
              </div>

              <div class="form-grid form-grid-full form-grid-lg">
                <div v-if="!editingPostId" class="card edit-card edit-card--wide">
                  <h3>{{ editingProjectId ? 'Editar Projeto' : 'Novo Projeto' }}</h3>
                  <form @submit.prevent="handleProjectSubmit" novalidate>
                    <BaseInput v-model="newProject.title" label="Título" required placeholder="Título do projeto" :error="projectErrors.title" />
                    <BaseInput v-model="newProject.description" label="Descrição" required placeholder="Descrição curta" :error="projectErrors.description" />
                    <div class="form-grid form-grid-3">
                      <div class="form-group">
                        <label class="form-label" for="currency">Moeda</label>
                        <select id="currency" v-model="newProject.currency" class="form-control">
                          <option value="BRL">BRL</option>
                          <option value="USD">USD</option>
                        </select>
                      </div>
                      <BaseInput v-model.number="newProject.price" type="number" label="Preço" required min="0" step="1000" :error="projectErrors.price" />
                      <BaseInput v-model.number="newProject.area" type="number" label="Área (m²)" required min="0" step="1" :error="projectErrors.area" />
                    </div>
                    <div class="form-grid form-grid-4">
                      <BaseInput v-model.number="newProject.bedrooms" type="number" label="Quartos" min="0" />
                      <BaseInput v-model.number="newProject.bathrooms" type="number" label="Banheiros" min="0" />
                      <BaseInput v-model.number="newProject.garage" type="number" label="Vagas" min="0" />
                      <BaseInput v-model.number="newProject.floors" type="number" label="Pavimentos" min="1" />
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="project-image">Imagem</label>
                      <input id="project-image" type="file" accept="image/*" class="form-control" @change="handleFileUpload" />
                      <img v-if="newProject.image" :src="newProject.image" alt="Pré-visualização" class="image-preview" />
                      <small class="form-hint">Upload de arquivo (máx. 5MB). Salvo localmente no navegador.</small>
                    </div>
                    <BaseInput v-model="newProject.tags" label="Tags (separadas por vírgula)" placeholder="Moderno, Sustentável, Luxo" />
                    <div class="form-grid form-grid-2 checkbox-row">
                      <label class="check-inline">
                        <input type="checkbox" v-model="newProject.featured" /> Destaque
                      </label>
                      <label class="check-inline">
                        <input type="checkbox" v-model="newProject.hero" /> Hero Principal
                      </label>
                    </div>
                    <div class="form-actions">
                      <BaseButton variant="accent" type="submit" :loading="projectsStore.loading">
                        {{ editingProjectId ? 'Salvar Alterações' : 'Criar Projeto' }}
                      </BaseButton>
                      <BaseButton v-if="editingProjectId" variant="ghost" type="button" @click="cancelEdit">
                        Cancelar
                      </BaseButton>
                    </div>
                  </form>
                </div>

                <div v-if="!editingProjectId" class="card edit-card">
                  <h3>{{ editingPostId ? 'Editar Artigo' : 'Novo Artigo' }}</h3>
                  <form @submit.prevent="handlePostSubmit" novalidate>
                    <BaseInput v-model="newPost.title" label="Título" required placeholder="Título do artigo" :error="postErrors.title" />
                    <BaseInput v-model="newPost.excerpt" label="Resumo" required placeholder="Resumo curto para listagem" :error="postErrors.excerpt" />
                    <BaseInput v-model="newPost.content" label="Conteúdo (HTML)" placeholder="<h2>Título</h2><p>Conteúdo...</p>" />
                    <div class="form-group">
                      <label class="form-label" for="post-image">Imagem</label>
                      <input id="post-image" type="file" accept="image/*" class="form-control" @change="handlePostFileUpload" />
                      <img v-if="newPost.image" :src="newPost.image" alt="Pré-visualização" class="image-preview" />
                      <small class="form-hint">Upload de arquivo (máx. 5MB). Salvo localmente no navegador.</small>
                    </div>
                    <BaseInput v-model="newPost.tags" label="Tags (separadas por vírgula)" placeholder="Arquitetura, Sustentabilidade, Tendências" />
                    <div class="checkbox-row">
                      <label class="check-inline">
                        <input type="checkbox" v-model="newPost.featured" /> Artigo em Destaque
                      </label>
                    </div>
                    <div class="form-actions">
                      <BaseButton variant="accent" type="submit" :loading="blogStore.loading">
                        {{ editingPostId ? 'Salvar Alterações' : 'Criar Artigo' }}
                      </BaseButton>
                      <BaseButton v-if="editingPostId" variant="ghost" type="button" @click="cancelEdit">
                        Cancelar
                      </BaseButton>
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
.dashboard-header {
  margin-bottom: var(--bs-spacing-lg);
}

.dashboard-header p {
  color: var(--bs-dark-gray);
}

.dashboard-nav {
  display: flex;
  flex-direction: column;
  gap: var(--bs-spacing-xs);
}

.dashboard-nav .btn {
  text-align: left;
  justify-content: space-between;
}

.dashboard-stats {
  margin-top: var(--bs-spacing-lg);
  max-width: 100%;
  overflow: hidden;
}

.dashboard-stats h3 {
  font-size: 0.85rem;
  margin-bottom: var(--bs-spacing-sm);
}

.dashboard-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--bs-spacing-sm);
  font-size: 0.8rem;
  word-break: break-word;
}

@media (max-width: 1200px) {
  .dashboard-stats-grid {
    grid-template-columns: 1fr;
  }
}

.dev-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.9rem 1.1rem;
  margin-bottom: var(--bs-spacing-lg);
  background: rgba(181, 140, 73, 0.12);
  border: 1px solid rgba(181, 140, 73, 0.4);
  border-left: 4px solid var(--bs-accent-color);
  font-size: 0.85rem;
  color: var(--bs-text-color);
}

.dev-banner strong {
  display: block;
}

.dev-banner span {
  color: var(--bs-dark-gray);
}

.dev-dot {
  flex-shrink: 0;
  width: 9px;
  height: 9px;
  margin-top: 0.35rem;
  border-radius: 50%;
  background: #27ae60;
  box-shadow: 0 0 0 4px rgba(39, 174, 96, 0.18);
}

.tab-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--bs-spacing-md);
  flex-wrap: wrap;
  gap: var(--bs-spacing-sm);
}

.tab-empty {
  text-align: center;
  padding: var(--bs-spacing-xl);
  color: var(--bs-dark-gray);
}

.tab-empty .btn {
  margin-top: var(--bs-spacing-md);
}

.edit-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--bs-spacing-sm);
  padding: 0.75rem 1rem;
  margin-bottom: var(--bs-spacing-md);
  background: var(--bs-white);
  border-left: 4px solid var(--bs-accent-color);
  box-shadow: var(--bs-card-shadow);
  font-size: 0.9rem;
}

.form-grid {
  display: grid;
  gap: var(--bs-spacing-sm);
}

.form-grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.form-grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.form-grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

.form-grid-full {
  grid-template-columns: minmax(0, 1fr) !important;
  width: 100%;
  max-width: 100%;
}

.edit-card {
  padding: clamp(var(--bs-spacing-md), 3vw, var(--bs-spacing-lg));
  width: 100%;
  max-width: 100%;
}

.edit-card--wide {
  grid-column: 1 / -1;
  width: 100%;
  max-width: 100%;
}

.edit-card h3 {
  margin-bottom: var(--bs-spacing-md);
}

.checkbox-row {
  margin-top: var(--bs-spacing-sm);
}

.check-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  min-height: var(--bs-touch-target-min);
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bs-spacing-sm);
  margin-top: var(--bs-spacing-md);
}

@media (max-width: 960px) {
  .form-grid-3,
  .form-grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .form-grid-2,
  .form-grid-3,
  .form-grid-4 {
    grid-template-columns: 1fr;
  }

  .form-grid-lg {
    gap: var(--bs-spacing-md);
  }
  .edit-card {
    padding: var(--bs-spacing-md);
  }
}

.image-preview {
  margin-top: 0.75rem;
  max-width: 100%;
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border: 1px solid var(--bs-light-gray);
  box-shadow: var(--bs-card-shadow);
}

.edit-card {
  min-width: 0;
}
</style>
