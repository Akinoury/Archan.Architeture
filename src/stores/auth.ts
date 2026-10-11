import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, AuthState } from '@/types'

const TOKEN_KEY = 'archan_auth_token'
const USER_KEY = 'archan_user'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const initialized = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

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

  async function login(email: string, password: string): Promise<boolean> {
    isLoading.value = true

    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Demo admin user
      if (email === 'admin@archan.com' && password === 'archan2024') {
        const adminUser: User = {
          id: '1',
          name: 'Admin Archan',
          email: 'admin@archan.com',
          role: 'admin'
        }
        const demoToken = 'demo-jwt-token-' + Date.now()
        setAuth(demoToken, adminUser)
        isLoading.value = false
        return true
      }

      // Demo regular user
      if (email === 'user@archan.com' && password === 'user2024') {
        const regularUser: User = {
          id: '2',
          name: 'Usuário Demo',
          email: 'user@archan.com',
          role: 'user'
        }
        const demoToken = 'demo-jwt-token-' + Date.now()
        setAuth(demoToken, regularUser)
        isLoading.value = false
        return true
      }

      throw new Error('Credenciais inválidas')
    } catch (error) {
      isLoading.value = false
      throw error
    }
  }

  async function register(name: string, email: string, password: string): Promise<boolean> {
    isLoading.value = true

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newUser: User = {
        id: String(Date.now()),
        name,
        email,
        role: 'user'
      }
      const demoToken = 'demo-jwt-token-' + Date.now()
      setAuth(demoToken, newUser)
      isLoading.value = false
      return true
    } catch (error) {
      isLoading.value = false
      throw error
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
    isAuthenticated,
    isAdmin,
    setAuth,
    clearAuth,
    init,
    login,
    register,
    logout,
    updateUser
  }
})