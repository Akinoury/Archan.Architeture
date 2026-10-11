<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { validate, required, email, minLength } from '@/utils/validation'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { error, success } = useToast()

const isLogin = computed(() => route.name === 'Login')
const redirect = route.query.redirect as string || '/dashboard'

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const form = ref<FormData>({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = ref<Partial<Record<keyof FormData, string[]>>>({})
const submitting = ref(false)

const nameRules = [required('Nome é obrigatório'), minLength(2, 'Nome deve ter pelo menos 2 caracteres')]
const emailRules = [required('E-mail é obrigatório'), email('E-mail inválido')]
const passwordRules = [required('Senha é obrigatória'), minLength(6, 'Senha deve ter pelo menos 6 caracteres')]
const confirmPasswordRules = [required('Confirmação é obrigatória')]

function validateField(field: keyof FormData, rules: any[]) {
  const result = validate(form.value[field], rules)
  errors.value[field] = result.errors
  return result.valid
}

function validateForm() {
  let valid = true
  valid = validateField('name', nameRules) && valid
  valid = validateField('email', emailRules) && valid
  valid = validateField('password', passwordRules) && valid
  if (!isLogin.value) {
    valid = validateField('confirmPassword', confirmPasswordRules) && valid
    if (form.value.password !== form.value.confirmPassword) {
      errors.value.confirmPassword = ['As senhas não coincidem']
      valid = false
    }
  }
  return valid
}

async function handleSubmit(event: Event) {
  event.preventDefault()

  if (!validateForm()) return

  submitting.value = true

  try {
    if (isLogin.value) {
      await authStore.login(form.value.email, form.value.password)
      success('Bem-vindo de volta!')
    } else {
      await authStore.register(form.value.name, form.value.email, form.value.password)
      success('Conta criada com sucesso!')
    }
    await router.push(redirect)
  } catch (err: any) {
    error(err.message || 'Erro ao processar solicitação')
  } finally {
    submitting.value = false
  }
}

function switchMode() {
  router.push({ name: isLogin.value ? 'Register' : 'Login', query: { redirect } })
  errors.value = {}
}
</script>

<template>
  <DefaultLayout>
    <section class="auth-page reveal" aria-labelledby="auth-title">
      <div class="auth-box">
        <h1 id="auth-title">{{ isLogin ? 'Entrar' : 'Criar Conta' }}</h1>
        <p class="auth-subtitle">
          {{ isLogin ? 'Acesse sua conta para gerenciar projetos' : 'Cadastre-se para começar' }}
        </p>

        <form @submit="handleSubmit" novalidate>
          <BaseInput
            v-if="!isLogin"
            v-model="form.name"
            type="text"
            label="Nome completo"
            placeholder="Seu nome"
            :error="errors.name?.[0]"
            :disabled="submitting"
            required
            autocomplete="name"
          />

          <BaseInput
            v-model="form.email"
            type="email"
            label="E-mail"
            placeholder="seu@email.com"
            :error="errors.email?.[0]"
            :disabled="submitting"
            required
            autocomplete="email"
          />

          <BaseInput
            v-model="form.password"
            type="password"
            label="Senha"
            placeholder="••••••••"
            :error="errors.password?.[0]"
            :disabled="submitting"
            required
            autocomplete="current-password"
          />

          <BaseInput
            v-if="!isLogin"
            v-model="form.confirmPassword"
            type="password"
            label="Confirmar senha"
            placeholder="••••••••"
            :error="errors.confirmPassword?.[0]"
            :disabled="submitting"
            required
            autocomplete="new-password"
          />

          <BaseButton
            variant="accent"
            full-width
            type="submit"
            :loading="submitting"
            :disabled="submitting"
          >
            {{ isLogin ? 'Entrar' : 'Cadastrar' }}
          </BaseButton>
        </form>

        <p class="auth-footer-link">
          {{ isLogin ? 'Não tem conta?' : 'Já tem conta?' }}
          <a @click.prevent="switchMode" style="cursor: pointer;">{{ isLogin ? 'Cadastre-se' : 'Entre' }}</a>
        </p>

        <div v-if="isLogin" style="margin-top: var(--bs-spacing-md); padding-top: var(--bs-spacing-md); border-top: 1px solid var(--bs-light-gray); text-align: center; font-size: 0.8rem; color: var(--bs-dark-gray);">
          <p style="margin-bottom: var(--bs-spacing-xs);"><strong>Demo Admin:</strong> admin@archan.com / archan2024</p>
          <p><strong>Demo User:</strong> user@archan.com / user2024</p>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>