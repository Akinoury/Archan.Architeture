<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDevModeStore } from '@/stores/devMode'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const devModeStore = useDevModeStore()

const mobileMenuOpen = ref(false)

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Projetos', path: '/projetos' },
  { name: 'Blog', path: '/blog' }
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
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="Navegação principal">
    <div class="nav-brand-container">
      <RouterLink to="/" class="nav-brand" aria-label="Archan Arquiteture - Início">
        <span class="special-font">Archan</span>
      </RouterLink>
    </div>

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

    <ul
      id="mobile-menu"
      class="nav-links"
      :class="{ open: mobileMenuOpen }"
      role="menubar"
    >
      <li v-for="link in navLinks" :key="link.name" role="none">
        <RouterLink
          :to="link.path"
          class="nav-link"
          :class="{ active: isActive(link.path) }"
          @click="closeMobileMenu"
          role="menuitem"
        >
          {{ link.name }}
        </RouterLink>
      </li>

      <li v-if="authStore.isAuthenticated" role="none">
        <RouterLink
          to="/dashboard"
          class="nav-link"
          @click="closeMobileMenu"
          role="menuitem"
        >
          Dashboard
        </RouterLink>
      </li>

      <li role="none">
        <div class="nav-actions" role="group" aria-label="Ações do usuário">
          <RouterLink
            v-if="!authStore.isAuthenticated"
            to="/login"
            class="btn btn-ghost btn-sm"
            @click="closeMobileMenu"
          >
            Entrar
          </RouterLink>
          <RouterLink
            v-if="!authStore.isAuthenticated"
            to="/register"
            class="btn btn-accent btn-sm"
            @click="closeMobileMenu"
          >
            Cadastrar
          </RouterLink>

          <div v-else class="nav-actions" style="flex-direction: row;">
            <BaseButton
              variant="ghost"
              size="sm"
              @click="handleLogout"
            >
              Sair
            </BaseButton>
            <span class="user-name" style="font-size: 0.85rem; color: var(--bs-dark-gray);">
              {{ authStore.user?.name }}
            </span>
          </div>
        </div>
      </li>
    </ul>

    <div class="nav-actions desktop-only" role="group" aria-label="Ações do usuário">
      <RouterLink
        v-if="!authStore.isAuthenticated"
        to="/login"
        class="btn btn-ghost btn-sm"
      >
        Entrar
      </RouterLink>
      <RouterLink
        v-if="!authStore.isAuthenticated"
        to="/register"
        class="btn btn-accent btn-sm"
      >
        Cadastrar
      </RouterLink>

      <div v-else style="display: flex; align-items: center; gap: var(--bs-spacing-sm);">
        <RouterLink
          to="/dashboard"
          class="btn btn-ghost btn-sm"
        >
          Dashboard
        </RouterLink>
        <span class="user-name" style="font-size: 0.85rem; color: var(--bs-dark-gray);">
          {{ authStore.user?.name }}
        </span>
        <BaseButton
          variant="ghost"
          size="sm"
          @click="handleLogout"
        >
          Sair
        </BaseButton>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-brand-container {
  flex-shrink: 0;
}

.nav-brand {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--bs-text-color);
  text-decoration: none;
  display: flex;
  align-items: center;
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

.nav-links a {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 400;
  padding: 0.5rem 0;
  position: relative;
  color: var(--bs-text-color);
  text-decoration: none;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--bs-accent-color);
  transition: width var(--bs-transition);
}

.nav-links a:hover::after,
.nav-links a.active::after {
  width: 100%;
}

.nav-links a:hover {
  opacity: 1;
  color: var(--bs-accent-color);
}

.nav-links a.active {
  color: var(--bs-accent-color);
}

.nav-actions {
  display: flex;
  gap: var(--bs-spacing-sm);
  align-items: center;
}

.nav-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
}

.nav-toggle span {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--bs-text-color);
  transition: var(--bs-transition);
}

.nav-toggle[aria-expanded="true"] span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.nav-toggle[aria-expanded="true"] span:nth-child(2) {
  opacity: 0;
}

.nav-toggle[aria-expanded="true"] span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

.desktop-only {
  display: flex;
}

@media (max-width: 960px) {
  .nav-toggle {
    display: flex;
  }

  .desktop-only {
    display: none;
  }

  .nav-links {
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100vh;
    background: var(--bs-bg-color);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--bs-spacing-lg);
    transform: translateX(100%);
    transition: transform var(--bs-transition-smooth);
    border-left: 1px solid var(--bs-light-gray);
    box-shadow: -10px 0 40px rgba(0, 0, 0, 0.1);
    padding: var(--bs-spacing-xl) var(--bs-spacing-lg);
    overflow-y: auto;
  }

  .nav-links.open {
    transform: translateX(0);
  }

  .nav-links a {
    font-size: 1.25rem;
  }

  .nav-links .nav-actions {
    flex-direction: column;
    gap: var(--bs-spacing-sm);
    width: 100%;
  }

  .nav-links .nav-actions .btn {
    width: 100%;
    text-align: center;
  }

  .nav-links li:not(:last-child) {
    width: 100%;
    text-align: center;
  }

  body.nav-open {
    overflow: hidden;
  }
}
</style>