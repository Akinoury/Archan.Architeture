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
const { error, success, info } = useToast()

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
const remember = ref(true)
const acceptTerms = ref(false)
const termsError = ref('')

const nameRules = [required('Nome é obrigatório'), minLength(2, 'Nome deve ter pelo menos 2 caracteres')]
const emailRules = [required('E-mail é obrigatório'), email('E-mail inválido')]
const passwordRules = [required('Senha é obrigatória'), minLength(6, 'Senha deve ter pelo menos 6 caracteres')]
const confirmPasswordRules = [required('Confirmação é obrigatória')]

const ruleMap: Record<keyof FormData, any[]> = {
  name: nameRules,
  email: emailRules,
  password: passwordRules,
  confirmPassword: confirmPasswordRules
}

function validateField(field: keyof FormData, rules: any[]) {
  const result = validate(form.value[field], rules)
  errors.value[field] = result.errors
  return result.valid
}

function clearError(field: keyof FormData) {
  if (errors.value[field]?.length) {
    errors.value[field] = []
  }
}

// Validate a field once the user leaves it (only if it already has content,
// so we don't shout at someone who is simply tabbing through the form).
function handleBlur(field: keyof FormData) {
  if (!form.value[field]) {
    if (errors.value[field]?.length) validateField(field, ruleMap[field])
    return
  }
  validateField(field, ruleMap[field])
  if (field === 'confirmPassword' || field === 'password') {
    if (!isLogin.value && form.value.confirmPassword && form.value.password !== form.value.confirmPassword) {
      errors.value.confirmPassword = ['As senhas não coincidem']
    } else if (field === 'confirmPassword') {
      errors.value.confirmPassword = []
    }
  }
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
    termsError.value = acceptTerms.value
      ? ''
      : 'É necessário aceitar os Termos e a Política de Privacidade.'
    if (!acceptTerms.value) valid = false
  }
  return valid
}

// Password strength (register only) — 0..4
const passwordStrength = computed(() => {
  const value = form.value.password
  if (!value) return 0
  let score = 0
  if (value.length >= 6) score++
  if (value.length >= 10) score++
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++
  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score++
  return Math.min(score, 4)
})

const strengthLabel = computed(() => ['', 'Fraca', 'Razoável', 'Boa', 'Forte'][passwordStrength.value])

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

function forgotPassword() {
  info('A recuperação de senha estará disponível em breve.')
}
</script>

<template>
  <DefaultLayout>
    <section class="auth-page reveal" aria-labelledby="auth-title">
      <div class="auth-card">
        <aside class="auth-visual" aria-hidden="true">
          <img
            src="/assets/images/interior_shot_1776171949307.png"
            alt=""
            loading="lazy"
            decoding="async"
          />
          <div class="auth-visual-overlay">
            <span class="auth-visual-brand">Archan</span>
            <p>Estúdio de arquitetura moderna focado em projetos funcionais, estéticos e orientados ao investimento imobiliário.</p>
          </div>
        </aside>

        <div class="auth-panel">
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
              @blur="handleBlur('name')"
              @input="clearError('name')"
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
              @blur="handleBlur('email')"
              @input="clearError('email')"
            />

            <BaseInput
              v-model="form.password"
              type="password"
              label="Senha"
              placeholder="••••••••"
              :error="errors.password?.[0]"
              :disabled="submitting"
              required
              toggleable
              :autocomplete="isLogin ? 'current-password' : 'new-password'"
              @blur="handleBlur('password')"
              @input="clearError('password')"
            />

            <div v-if="!isLogin && form.password" class="password-strength">
              <div class="password-strength-bars">
                <span
                  v-for="n in 4"
                  :key="n"
                  :class="n <= passwordStrength ? `filled-${passwordStrength}` : ''"
                ></span>
              </div>
              <span class="password-strength-label">Força da senha: {{ strengthLabel }}</span>
            </div>

            <BaseInput
              v-if="!isLogin"
              v-model="form.confirmPassword"
              type="password"
              label="Confirmar senha"
              placeholder="••••••••"
              :error="errors.confirmPassword?.[0]"
              :disabled="submitting"
              required
              toggleable
              autocomplete="new-password"
              @blur="handleBlur('confirmPassword')"
              @input="clearError('confirmPassword')"
            />

            <div v-if="isLogin" class="auth-row">
              <label class="auth-check">
                <input v-model="remember" type="checkbox" />
                Lembrar de mim
              </label>
              <a class="auth-link" @click.prevent="forgotPassword">Esqueceu a senha?</a>
            </div>

            <label v-if="!isLogin" class="auth-check auth-consent">
              <input v-model="acceptTerms" type="checkbox" :aria-invalid="!!termsError" />
              <span>
                Li e concordo com os
                <RouterLink to="/termos">Termos de Uso</RouterLink>
                e a
                <RouterLink to="/privacidade">Política de Privacidade</RouterLink>.
              </span>
            </label>
            <span v-if="!isLogin && termsError" class="form-error" role="alert">{{ termsError }}</span>

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
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>
