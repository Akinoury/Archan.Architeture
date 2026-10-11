import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

const TOKEN_KEY = 'archan_auth_token'
const USER_KEY = 'archan_user'
const USERS_KEY = 'archan_users'

// Internal account record: the public `User` shape plus the demo password.
interface StoredUser extends User {
  password: string
}

// Demo accounts. `admin@archan.com` is seeded, so it "exists" without ever
// going through the registration flow (no verification needed). Every other
// login must match an e-mail that was actually created.
const seedUsers: StoredUser[] = [
  { id: '1', name: 'Admin Archan', email: 'admin@archan.com', password: 'archan2024', role: 'admin' },
  { id: '2', name: 'Usuário Demo', email: 'user@archan.com', password: 'user2024', role: 'user' }
]

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        // Always guarantee the seeded demo accounts exist (e.g. the admin can
        // sign in without having registered).
        const missing = seedUsers.filter(
          seed => !parsed.some((u: StoredUser) => normalizeEmail(u.email) === seed.email)
        )
        return [...(parsed as StoredUser[]), ...missing]
      }
    }
  } catch {
    // Ignore malformed storage and fall back to the seeds.
  }
  return seedUsers.map(u => ({ ...u }))
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const initialized = ref(false)

  // Registry of "existing" accounts, persisted in the browser.
  const users = ref<StoredUser[]>(loadUsers())

  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users.value))
  }

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  function persistUsers() {
    localStorage.setItem(USERS_KEY, JSON.stringify(users.value))
  }

  function setAuth(newToken: string, newUser: User) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))
  }

  function clearAuth() {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  async function init() {
    if (initialized.value) return

    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)

    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        // Here you would typically validate the token with your backend
        // For now, we'll trust the localStorage
      } catch {
        clearAuth()
      }
    }

    initialized.value = true
  }

  function emailExists(email: string): boolean {
    const normalized = normalizeEmail(email)
    return users.value.some(u => normalizeEmail(u.email) === normalized)
  }

  async function login(email: string, password: string): Promise<boolean> {
    isLoading.value = true

    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 700))

      const normalized = normalizeEmail(email)
      const found = users.value.find(u => normalizeEmail(u.email) === normalized)

      // Only e-mails that already exist may sign in.
      if (!found) {
        throw new Error('E-mail não cadastrado. Crie uma conta para continuar.')
      }

      if (found.password !== password) {
        throw new Error('Senha incorreta. Verifique e tente novamente.')
      }

      const authUser: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role
      }
      setAuth('demo-jwt-token-' + Date.now(), authUser)
      return true
    } finally {
      isLoading.value = false
    }
  }

  async function register(name: string, email: string, password: string): Promise<boolean> {
    isLoading.value = true

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 700))

      const normalized = normalizeEmail(email)
      if (emailExists(normalized)) {
        throw new Error('Este e-mail já está cadastrado. Faça login.')
      }

      const newUser: StoredUser = {
        id: String(Date.now()),
        name: name.trim(),
        email: normalized,
        password,
        role: 'user'
      }

      users.value.push(newUser)
      persistUsers()

      const authUser: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
      setAuth('demo-jwt-token-' + Date.now(), authUser)
      return true
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    clearAuth()
  }

  function updateUser(updates: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...updates }
      localStorage.setItem(USER_KEY, JSON.stringify(user.value))
    }
  }

  return {
    user,
    token,
    isLoading,
    initialized,
    users,
    isAuthenticated,
    isAdmin,
    setAuth,
    clearAuth,
    init,
    emailExists,
    login,
    register,
    logout,
    updateUser
  }
})
