<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import { useUIStore } from '@/stores/ui'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const uiStore = useUIStore()

const contactRef = ref<HTMLElement | null>(null)
useIntersectionObserver({ target: contactRef, once: true })

const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const errors = reactive({
  name: '',
  email: '',
  message: ''
})

const sending = ref(false)

const contactInfo = [
  { icon: '✉️', label: 'E-mail', value: 'contato@archanarquitetura.com', href: 'mailto:contato@archanarquitetura.com' },
  { icon: '📞', label: 'Telefone', value: '+55 (11) 99999-0000', href: 'tel:+5511999990000' },
  { icon: '📍', label: 'Endereço', value: 'Av. Paulista, 1000 — São Paulo, SP' },
  { icon: '🕘', label: 'Atendimento', value: 'Segunda a sexta, 9h às 18h' }
]

function validate(): boolean {
  errors.name = form.name.trim() ? '' : 'Informe o seu nome.'
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ? ''
    : 'Informe um e-mail válido.'
  errors.message = form.message.trim().length >= 10
    ? ''
    : 'Escreva uma mensagem com pelo menos 10 caracteres.'
  return !errors.name && !errors.email && !errors.message
}

async function handleSubmit() {
  if (!validate()) return

  sending.value = true
  // Demo only: simulate sending the message.
  await new Promise(resolve => setTimeout(resolve, 700))
  sending.value = false

  uiStore.success(
    'Mensagem enviada!',
    'Obrigado pelo contato. Retornaremos em breve.'
  )

  form.name = ''
  form.email = ''
  form.phone = ''
  form.message = ''
  errors.name = ''
  errors.email = ''
  errors.message = ''
}
</script>

<template>
  <DefaultLayout>
    <section class="section reveal" ref="contactRef" aria-labelledby="contact-title">
      <div class="container-custom">
        <header class="section-header">
          <span class="section-label">Fale Conosco</span>
          <h1 id="contact-title">Contato</h1>
          <p>
            Tem um projeto em mente? Preencha o formulário abaixo ou use um dos
            nossos canais de atendimento. Será um prazer conversar.
          </p>
        </header>

        <div class="contact-split">
          <div class="contact-info">
            <h2>Vamos conversar</h2>
            <ul class="contact-list">
              <li v-for="item in contactInfo" :key="item.label">
                <span class="contact-icon" aria-hidden="true">{{ item.icon }}</span>
                <span class="contact-detail">
                  <strong>{{ item.label }}</strong>
                  <a v-if="item.href" :href="item.href">{{ item.value }}</a>
                  <span v-else>{{ item.value }}</span>
                </span>
              </li>
            </ul>
          </div>

          <form class="contact-form" novalidate @submit.prevent="handleSubmit">
            <BaseInput
              v-model="form.name"
              id="contact-name"
              name="name"
              label="Nome"
              placeholder="Seu nome completo"
              :error="errors.name"
              required
              autocomplete="name"
            />
            <BaseInput
              v-model="form.email"
              id="contact-email"
              name="email"
              type="email"
              label="E-mail"
              placeholder="voce@email.com"
              :error="errors.email"
              required
              autocomplete="email"
            />
            <BaseInput
              v-model="form.phone"
              id="contact-phone"
              name="phone"
              type="tel"
              label="Telefone"
              placeholder="(11) 99999-0000"
              autocomplete="tel"
            />

            <div class="form-group">
              <label for="contact-message" class="form-label">
                Mensagem <span class="text-danger" aria-hidden="true">*</span>
              </label>
              <textarea
                id="contact-message"
                v-model="form.message"
                name="message"
                class="form-control"
                rows="5"
                placeholder="Conte-nos sobre o seu projeto..."
                :aria-invalid="!!errors.message"
              ></textarea>
              <span v-if="errors.message" class="form-error" role="alert">
                {{ errors.message }}
              </span>
            </div>

            <BaseButton
              type="submit"
              variant="accent"
              :loading="sending"
              :disabled="sending"
              full-width
            >
              Enviar Mensagem
            </BaseButton>
          </form>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<style scoped>
.contact-split {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: var(--bs-spacing-xl);
  align-items: start;
}

.contact-info h2 {
  margin-bottom: var(--bs-spacing-md);
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--bs-spacing-md);
}

.contact-list li {
  display: flex;
  gap: var(--bs-spacing-sm);
  align-items: flex-start;
}

.contact-icon {
  font-size: 1.4rem;
  line-height: 1.4;
}

.contact-detail {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.contact-detail strong {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--bs-dark-gray);
}

.contact-detail a,
.contact-detail span {
  color: var(--bs-text-color);
  text-decoration: none;
}

.contact-detail a:hover {
  color: var(--bs-accent-color);
  opacity: 1;
}

.contact-form {
  background: var(--bs-light-gray);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  border: 1px solid var(--bs-light-gray);
}

.contact-form .form-group {
  margin-bottom: 1.25rem;
}

.contact-form textarea.form-control {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid var(--bs-light-gray);
  border-bottom: 2px solid #ccc;
  font-family: var(--bs-font-primary);
  font-size: 1rem;
  background: var(--bs-bg-color);
  color: var(--bs-text-color);
  border-radius: 0;
  resize: vertical;
  transition: border-color var(--bs-transition), background var(--bs-transition);
}

.contact-form textarea.form-control:focus {
  outline: none;
  border-color: var(--bs-accent-color);
  background: var(--bs-white);
}

.contact-form .form-label {
  display: block;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.4rem;
  color: var(--bs-dark-gray);
  font-weight: 600;
}

.contact-form .form-label .text-danger {
  color: #c00;
  margin-left: 0.25rem;
}

.contact-form .form-error {
  display: block;
  color: #c00;
  font-size: 0.8rem;
  margin-top: 0.35rem;
}

@media (max-width: 960px) {
  .contact-split {
    grid-template-columns: 1fr;
    gap: var(--bs-spacing-lg);
  }
}
</style>
