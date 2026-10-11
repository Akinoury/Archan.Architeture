import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Archan Architecture - Projetos de Arquitetura Moderna' }
  },
  {
    path: '/projetos',
    name: 'Projects',
    component: () => import('@/views/ProjectsView.vue'),
    meta: { title: 'Projetos - Archan Architecture' }
  },
  {
    path: '/projetos/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/ProjectDetailView.vue'),
    meta: { title: 'Detalhes do Projeto - Archan Architecture' }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('@/views/BlogView.vue'),
    meta: { title: 'Blog - Archan Architecture' }
  },
  {
    path: '/blog/:slug',
    name: 'BlogPost',
    component: () => import('@/views/BlogPostView.vue'),
    meta: { title: 'Artigo - Archan Architecture' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/AuthView.vue'),
    meta: { title: 'Login - Archan Architecture', guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/AuthView.vue'),
    meta: { title: 'Cadastro - Archan Architecture', guest: true }
  },
  {
    path: '/sobre',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'Sobre Nós - Archan Architecture' }
  },
  {
    path: '/contato',
    name: 'Contact',
    component: () => import('@/views/ContactView.vue'),
    meta: { title: 'Contato - Archan Architecture' }
  },
  {
    path: '/privacidade',
    name: 'Privacy',
    component: () => import('@/views/PrivacyView.vue'),
    meta: { title: 'Política de Privacidade - Archan Architecture' }
  },
  {
    path: '/termos',
    name: 'Terms',
    component: () => import('@/views/TermsView.vue'),
    meta: { title: 'Termos de Uso - Archan Architecture' }
  },
  {
    path: '/cookies',
    name: 'Cookies',
    component: () => import('@/views/CookiesView.vue'),
    meta: { title: 'Política de Cookies - Archan Architecture' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: 'Dashboard - Archan Architecture', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Página não encontrada - Archan Architecture' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  // Legacy GitHub Pages path (e.g. /Archan.Architeture/projetos) -> root-based path.
  // The app is now served from the domain root by the Cloudflare Worker.
  if (to.path === '/Archan.Architeture' || to.path.startsWith('/Archan.Architeture/')) {
    next({ path: to.fullPath.replace(/^\/Archan\.Architeture/, '') || '/', replace: true })
    return
  }

  const authStore = useAuthStore()

  // Initialize auth if not already done
  if (!authStore.initialized) {
    await authStore.init()
  }

  // Update document title
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // Check authentication requirements
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    next({ name: 'Home' })
    return
  }

  // Redirect authenticated users away from guest pages
  if (to.meta.guest && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }

  next()
})

export default router