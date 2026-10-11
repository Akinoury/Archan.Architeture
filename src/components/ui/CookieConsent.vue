<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useConsentStore } from '@/stores/consent'

const consent = useConsentStore()
const showDetails = ref(false)

onMounted(() => consent.init())

function toggleDetails() {
  showDetails.value = !showDetails.value
}
</script>

<template>
  <Transition name="cookie-fade">
    <div
      v-if="consent.bannerOpen"
      class="cookie-banner"
      role="dialog"
      aria-live="polite"
      aria-label="Consentimento de cookies"
    >
      <div class="cookie-inner">
        <div class="cookie-body">
          <p class="cookie-title">Sua privacidade</p>
          <p class="cookie-text">
            Este site utiliza cookies e armazenamento local. Os recursos
            <strong>necessários</strong> mantêm o site e a sua sessão funcionando.
            Com o seu consentimento, também podemos usar recursos de
            <strong>análise</strong> e <strong>marketing</strong>. Saiba mais na
            <RouterLink to="/cookies">Política de Cookies</RouterLink> e na
            <RouterLink to="/privacidade">Política de Privacidade</RouterLink>.
          </p>
        </div>

        <div v-if="showDetails" class="cookie-details">
          <label class="cookie-option">
            <span class="cookie-option-text">
              <strong>Necessários</strong>
              <small>Essenciais para o funcionamento e a segurança do site.</small>
            </span>
            <input type="checkbox" checked disabled aria-label="Cookies necessários (sempre ativos)" />
          </label>

          <label class="cookie-option">
            <span class="cookie-option-text">
              <strong>Análise e desempenho</strong>
              <small>Ajudam a entender como o site é utilizado.</small>
            </span>
            <input
              v-model="consent.analytics"
              type="checkbox"
              aria-label="Cookies de análise e desempenho"
            />
          </label>

          <label class="cookie-option">
            <span class="cookie-option-text">
              <strong>Marketing</strong>
              <small>Permitem apresentar conteúdo e campanhas relevantes.</small>
            </span>
            <input
              v-model="consent.marketing"
              type="checkbox"
              aria-label="Cookies de marketing"
            />
          </label>
        </div>

        <div class="cookie-actions">
          <button type="button" class="btn btn-ghost btn-sm" @click="toggleDetails">
            {{ showDetails ? 'Ocultar opções' : 'Preferências' }}
          </button>
          <button type="button" class="btn btn-ghost btn-sm" @click="consent.rejectAll()">
            Rejeitar não essenciais
          </button>
          <button
            v-if="showDetails"
            type="button"
            class="btn btn-accent btn-sm"
            @click="consent.savePreferences()"
          >
            Salvar preferências
          </button>
          <button
            v-else
            type="button"
            class="btn btn-accent btn-sm"
            @click="consent.acceptAll()"
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.cookie-banner {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1030;
  padding: var(--bs-spacing-md) var(--bs-section-px)
    calc(var(--bs-spacing-md) + env(safe-area-inset-bottom));
  background: rgba(40, 28, 18, 0.97);
  color: var(--bs-bg-color);
  box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.cookie-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--bs-spacing-sm) var(--bs-spacing-lg);
}

.cookie-body {
  min-width: 0;
}

.cookie-title {
  margin: 0 0 0.2rem;
  font-family: var(--bs-font-serif);
  font-size: 1.05rem;
  color: var(--bs-bg-color);
}

.cookie-text {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.6;
  color: rgba(252, 249, 242, 0.78);
}

.cookie-text strong {
  color: var(--bs-bg-color);
}

.cookie-text a {
  color: var(--bs-accent-color);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.cookie-details {
  grid-column: 1 / -1;
  display: grid;
  gap: 0.5rem;
  margin-top: var(--bs-spacing-sm);
  padding-top: var(--bs-spacing-sm);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.cookie-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bs-spacing-md);
  cursor: pointer;
}

.cookie-option-text {
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
}

.cookie-option-text strong {
  color: var(--bs-bg-color);
  font-weight: 600;
}

.cookie-option-text small {
  color: rgba(252, 249, 242, 0.6);
  font-size: 0.75rem;
}

.cookie-option input[type="checkbox"] {
  width: 1.15rem;
  height: 1.15rem;
  accent-color: var(--bs-accent-color);
  cursor: pointer;
  flex-shrink: 0;
}

.cookie-option input[disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}

.cookie-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bs-spacing-xs);
  justify-content: flex-end;
}

.cookie-fade-enter-active,
.cookie-fade-leave-active {
  transition: transform 0.35s var(--bs-transition-smooth), opacity 0.35s var(--bs-transition-smooth);
}

.cookie-fade-enter-from,
.cookie-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (max-width: 860px) {
  .cookie-inner {
    grid-template-columns: 1fr;
  }

  .cookie-actions {
    justify-content: stretch;
  }

  .cookie-actions .btn {
    flex: 1 1 auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cookie-fade-enter-active,
  .cookie-fade-leave-active {
    transition: none;
  }
}
</style>
