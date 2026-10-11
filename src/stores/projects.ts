import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Project } from '@/types'

const STORAGE_KEY = 'archan_projects'

function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed as Project[]
    }
  } catch {
    // Ignore malformed storage and fall back to the demo data.
  }
  return demoProjects.map(p => ({ ...p }))
}

// Demo projects data matching the original design
const demoProjects: Project[] = [
  {
    id: '1',
    title: 'Residência Horizonte',
    description: 'Uma residência moderna com linhas limpas e integração total com a natureza. Projeto focado em sustentabilidade e conforto térmico.',
    price: 850000,
    area: 320,
    bedrooms: 4,
    bathrooms: 3,
    garage: 2,
    floors: 2,
    image: '/assets/images/hero_exterior_1776171883335.png',
    images: [
      '/assets/images/hero_exterior_1776171883335.png',
      '/assets/images/interior_shot_1776171949307.png',
      '/assets/images/living_room_background.jpg'
    ],
    featured: true,
    hero: true,
    category: 'residential',
    tags: ['Moderno', 'Sustentável', 'Vista Panorâmica'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Loft Compacto',
    description: 'Loft urbano otimizado para espaços reduzidos com design inteligente e acabamentos premium.',
    price: 420000,
    area: 85,
    bedrooms: 1,
    bathrooms: 1,
    garage: 1,
    floors: 1,
    image: '/assets/images/compact_loft_exterior.png',
    images: [
      '/assets/images/compact_loft_exterior.png',
      '/assets/images/interior_shot_1776171949307.png'
    ],
    featured: true,
    hero: false,
    category: 'residential',
    tags: ['Compacto', 'Urbano', 'Investimento'],
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-20T10:00:00Z'
  },
  {
    id: '3',
    title: 'Casa de Campo',
    description: 'Residência de campo com arquitetura vernacular contemporânea, priorizando materiais locais.',
    price: 1200000,
    area: 450,
    bedrooms: 5,
    bathrooms: 4,
    garage: 3,
    floors: 2,
    image: '/assets/images/exterior_render_2.png',
    images: [
      '/assets/images/exterior_render_2.png',
      '/assets/images/project_render_1776171965188.png'
    ],
    featured: true,
    hero: false,
    category: 'residential',
    tags: ['Campo', 'Vernacular', 'Luxo'],
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z'
  },
  {
    id: '4',
    title: 'Escritório Corporativo',
    description: 'Espaço corporativo flexível com design biofílico para bem-estar e produtividade.',
    price: 2100000,
    area: 800,
    bedrooms: 0,
    bathrooms: 6,
    garage: 10,
    floors: 3,
    image: '/assets/images/project_render_1776171965188.png',
    images: [
      '/assets/images/project_render_1776171965188.png'
    ],
    featured: false,
    hero: false,
    category: 'commercial',
    tags: ['Corporativo', 'Biofílico', 'Flexível'],
    createdAt: '2024-04-05T10:00:00Z',
    updatedAt: '2024-04-05T10:00:00Z'
  },
  {
    id: '5',
    title: 'Apartamento Decorado',
    description: 'Projeto de interiores completo para apartamento de alto padrão com mobiliário sob medida.',
    price: 180000,
    area: 120,
    bedrooms: 3,
    bathrooms: 2,
    garage: 1,
    floors: 1,
    image: '/assets/images/interior_shot_1776171949307.png',
    images: [
      '/assets/images/interior_shot_1776171949307.png',
      '/assets/images/living_room_background.jpg'
    ],
    featured: false,
    hero: false,
    category: 'interior',
    tags: ['Interiores', 'Alto Padrão', 'Sob Medida'],
    createdAt: '2024-05-12T10:00:00Z',
    updatedAt: '2024-05-12T10:00:00Z'
  },
  {
    id: '6',
    title: 'Pavilhão Comercial',
    description: 'Estrutura modular para varejo com rápida montagem e design atemporal.',
    price: 950000,
    area: 600,
    bedrooms: 0,
    bathrooms: 4,
    garage: 20,
    floors: 1,
    image: '/assets/images/floor_plan_1776171933189.png',
    images: [
      '/assets/images/floor_plan_1776171933189.png',
      '/assets/images/floor_plan_2.png'
    ],
    featured: false,
    hero: false,
    category: 'commercial',
    tags: ['Modular', 'Varejo', 'Rápida Montagem'],
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-06-01T10:00:00Z'
  }
]

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>(loadProjects())
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Persist admin/dev changes so they survive a page reload.
  watch(
    projects,
    value => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch {
        // Storage might be unavailable/full — ignore.
      }
    },
    { deep: true }
  )

  const featuredProjects = computed(() => projects.value.filter(p => p.featured))
  const heroProject = computed(() => projects.value.find(p => p.hero) || projects.value[0])
  const projectsByCategory = computed(() => {
    const categories: Record<string, Project[]> = {}
    projects.value.forEach(project => {
      if (!categories[project.category]) {
        categories[project.category] = []
      }
      categories[project.category].push(project)
    })
    return categories
  })

  function getProjectById(id: string): Project | undefined {
    return projects.value.find(p => p.id === id)
  }

  function getProjectBySlug(slug: string): Project | undefined {
    return projects.value.find(p => p.id === slug || p.title.toLowerCase().replace(/\s+/g, '-') === slug)
  }

  async function addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const newProject: Project = {
        ...project,
        id: String(Date.now()),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      projects.value.unshift(newProject)
      return newProject
    } catch (err) {
      error.value = 'Erro ao criar projeto'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProject(id: string, updates: Partial<Project>) {
    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = {
          ...projects.value[index],
          ...updates,
          updatedAt: new Date().toISOString()
        }
        return projects.value[index]
      }
      throw new Error('Projeto não encontrado')
    } catch (err) {
      error.value = 'Erro ao atualizar projeto'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteProject(id: string) {
    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value.splice(index, 1)
        return true
      }
      throw new Error('Projeto não encontrado')
    } catch (err) {
      error.value = 'Erro ao excluir projeto'
      throw err
    } finally {
      loading.value = false
    }
  }

  function toggleFeatured(id: string) {
    const project = projects.value.find(p => p.id === id)
    if (project) {
      project.featured = !project.featured
      project.updatedAt = new Date().toISOString()
    }
  }

  function toggleHero(id: string) {
    // Only one hero project allowed
    projects.value.forEach(p => {
      if (p.hero) p.hero = false
    })
    const project = projects.value.find(p => p.id === id)
    if (project) {
      project.hero = true
      project.updatedAt = new Date().toISOString()
    }
  }

  return {
    projects,
    loading,
    error,
    featuredProjects,
    heroProject,
    projectsByCategory,
    getProjectById,
    getProjectBySlug,
    addProject,
    updateProject,
    deleteProject,
    toggleFeatured,
    toggleHero
  }
})