<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const mobileMenuOpen = ref(false)

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Projetos', path: '/projetos' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contatos', path: '/contato' }
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
  document.body.classList.toggle('nav-open', mobileMenuOpen.value)
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
  document.body.classList.remove('nav-open')
}

async function handleLogout() {
  authStore.logout()
  await router.push({ name: 'Home' })
}

// Keep the menu closed when navigating
watch(() => route.fullPath, () => closeMobileMenu())

const DESKTOP_BREAKPOINT = 960

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeMobileMenu()
}

// If the viewport grows past the mobile breakpoint while the menu is open,
// close it so the body scroll-lock doesn't get stuck.
function handleResize() {
  if (window.innerWidth > DESKTOP_BREAKPOINT) closeMobileMenu()
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="Navegação principal">
    <RouterLink to="/" class="nav-brand" aria-label="Archan Architecture - Início">
      Archan
    </RouterLink>

    <button
      class="nav-toggle"
      @click="toggleMobileMenu"
      :aria-expanded="mobileMenuOpen"
      aria-controls="mobile-menu"
      aria-label="Alternar menu"
      type="button"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <div
      v-if="mobileMenuOpen"
      class="nav-backdrop"
      aria-hidden="true"
      @click="closeMobileMenu"
    ></div>

    <ul id="mobile-menu" class="nav-links" :class="{ open: mobileMenuOpen }">
      <li v-for="link in navLinks" :key="link.name">
        <RouterLink
          :to="link.path"
          class="nav-link"
          :class="{ active: isActive(link.path) }"
        >
          {{ link.name }}
        </RouterLink>
      </li>

      <li v-if="authStore.isAuthenticated">
        <RouterLink
          to="/dashboard"
          class="nav-link"
          :class="{ active: isActive('/dashboard') }"
        >
          Dashboard
        </RouterLink>
      </li>

      <!-- Auth actions inside the mobile sidebar -->
      <li class="nav-mobile-auth">
        <div class="nav-actions">
          <template v-if="!authStore.isAuthenticated">
            <RouterLink to="/login" class="btn btn-ghost btn-sm">Entrar</RouterLink>
            <RouterLink to="/register" class="btn btn-accent btn-sm">Cadastrar</RouterLink>
          </template>
          <template v-else>
            <span class="user-name">{{ authStore.user?.name }}</span>
            <BaseButton variant="ghost" size="sm" @click="handleLogout">Sair</BaseButton>
          </template>
        </div>
      </li>
    </ul>

    <!-- Auth actions, desktop only -->
    <div class="nav-actions desktop-only">
      <template v-if="!authStore.isAuthenticated">
        <RouterLink to="/login" class="nav-login">Entrar</RouterLink>
        <RouterLink to="/register" class="btn btn-accent btn-sm">Cadastrar</RouterLink>
      </template>
      <template v-else>
        <RouterLink
          to="/dashboard"
          class="nav-link nav-link-inline"
          :class="{ active: isActive('/dashboard') }"
        >
          Dashboard
        </RouterLink>
        <span class="user-name">{{ authStore.user?.name }}</span>
        <BaseButton variant="ghost" size="sm" @click="handleLogout">Sair</BaseButton>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  height: var(--bs-nav-height);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--bs-spacing-sm);
  border-bottom: 1px solid var(--bs-light-gray);
  position: sticky;
  top: 0;
  background-color: rgba(252, 249, 242, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 1000;
  padding: 0 var(--bs-section-px);
}

.nav-brand {
  font-family: var(--bs-font-special);
  font-size: 1.75rem;
  line-height: 1;
  color: var(--bs-text-color);
  text-decoration: none;
  flex-shrink: 0;
  transition: color var(--bs-transition), opacity var(--bs-transition);
}

.nav-brand:hover {
  opacity: 1;
  color: var(--bs-accent-color);
}

.nav-links {
  display: flex;
  gap: var(--bs-spacing-md);
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  color: var(--bs-text-color);
  text-decoration: none;
  transition: color var(--bs-transition);
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0.2rem;
  width: 0;
  height: 1px;
  background: var(--bs-accent-color);
  transition: width var(--bs-transition);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.nav-link:hover,
.nav-link.active {
  color: var(--bs-accent-color);
  opacity: 1;
}

.nav-link-inline {
  font-size: 0.82rem;
}

.nav-login {
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 500;
  color: var(--bs-text-color);
  text-decoration: none;
  padding: 0.5rem 0.25rem;
  transition: color var(--bs-transition);
}

.nav-login:hover {
  color: var(--bs-accent-color);
  opacity: 1;
}

.nav-actions {
  display: flex;
  gap: var(--bs-spacing-sm);
  align-items: center;
}

.user-name {
  font-size: 0.85rem;
  color: var(--bs-dark-gray);
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;
  width: 44px;
  height: 44px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.nav-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  margin: 0;
  background: var(--bs-text-color);
  border-radius: 2px;
  transition: transform var(--bs-transition), opacity var(--bs-transition);
}

.nav-toggle[aria-expanded="true"] span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.nav-toggle[aria-expanded="true"] span:nth-child(2) {
  opacity: 0;
}

.nav-toggle[aria-expanded="true"] span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Auth actions inside the sidebar are hidden on desktop */
.nav-mobile-auth {
  display: none;
}

/* Invisible click-catcher shown behind the open mobile menu so taps outside
   only dismiss the menu (they never reach the page underneath).
   Sized explicitly because the navbar's backdrop-filter makes it the
   containing block for fixed descendants. */
.nav-backdrop {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  z-index: 998;
  background: transparent;
}

.desktop-only {
  display: flex;
}

/* Desktop: keep the brand pinned left, the links centered in the viewport,
   and the actions pinned right (3-column grid keeps the middle truly centered
   regardless of the widths on each side). */
@media (min-width: 961px) {
  .navbar {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
  }

  .nav-brand {
    justify-self: start;
  }

  .nav-links {
    justify-self: center;
  }

  .nav-actions.desktop-only {
    justify-self: end;
  }
}

@media (max-width: 960px) {
  .nav-toggle {
    display: flex;
  }

  .nav-backdrop {
    display: block;
  }

  .desktop-only {
    display: none;
  }

  .nav-links {
    position: fixed;
    top: 0;
    right: 0;
    width: min(320px, 85vw);
    height: 100vh;
    height: 100dvh;
    background: var(--bs-bg-color);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--bs-spacing-md);
    transform: translateX(100%);
    transition: transform var(--bs-transition-smooth);
    border-left: 1px solid var(--bs-light-gray);
    box-shadow: -10px 0 40px rgba(0, 0, 0, 0.12);
    padding: var(--bs-spacing-xl) var(--bs-spacing-md);
    padding-bottom: calc(var(--bs-spacing-xl) + env(safe-area-inset-bottom));
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    z-index: 999;
  }

  .nav-links.open {
    transform: translateX(0);
  }

  .nav-links li {
    width: 100%;
    text-align: center;
  }

  .nav-link {
    display: inline-block;
    font-size: 1.1rem;
    padding: 0.5rem 0;
  }

  .nav-mobile-auth {
    display: block;
    margin-top: var(--bs-spacing-sm);
    padding-top: var(--bs-spacing-md);
    border-top: 1px solid var(--bs-light-gray);
  }

  .nav-mobile-auth .nav-actions {
    flex-direction: column;
    gap: var(--bs-spacing-sm);
    width: 100%;
    padding: 0;
  }

  .nav-mobile-auth .nav-actions .btn {
    width: 100%;
  }

  .nav-mobile-auth .user-name {
    max-width: none;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding-left: var(--bs-spacing-sm);
    padding-right: var(--bs-spacing-sm);
  }

  .nav-brand {
    font-size: 1.5rem;
  }
}
</style>
