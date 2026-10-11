<script setup lang="ts">
import { useConsentStore } from '@/stores/consent'

const currentYear = new Date().getFullYear()
const consent = useConsentStore()

const footerLinks = {
  company: [
    { label: 'Sobre nós', to: '/sobre' },
    { label: 'Projetos', to: '/projetos' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contato', to: '/contato' }
  ],
  legal: [
    { label: 'Política de Privacidade', to: '/privacidade' },
    { label: 'Termos de Uso', to: '/termos' },
    { label: 'Cookies', to: '/cookies' }
  ],
  social: [
    { label: 'Instagram', href: 'https://instagram.com', external: true },
    { label: 'LinkedIn', href: 'https://linkedin.com', external: true },
    { label: 'Pinterest', href: 'https://pinterest.com', external: true },
    { label: 'Behance', href: 'https://behance.net', external: true }
  ]
}
</script>

<template>
  <footer role="contentinfo">
    <div class="container-custom">
      <div class="footer-grid">
        <div class="footer-brand">
          <span class="footer-brand-name">Archan</span>
          <p>
            Estúdio de arquitetura moderna focado em projetos funcionais, 
            estéticos e orientados ao investimento imobiliário.
          </p>
        </div>

        <nav class="footer-col" aria-label="Links da empresa">
          <h4>Empresa</h4>
          <RouterLink v-for="link in footerLinks.company" :key="link.label" :to="link.to">
            {{ link.label }}
          </RouterLink>
        </nav>

        <nav class="footer-col" aria-label="Links legais">
          <h4>Legal</h4>
          <RouterLink v-for="link in footerLinks.legal" :key="link.label" :to="link.to">
            {{ link.label }}
          </RouterLink>
          <button type="button" class="footer-link-btn" @click="consent.openPreferences()">
            Preferências de cookies
          </button>
        </nav>

        <nav class="footer-col" aria-label="Redes sociais">
          <h4>Redes Sociais</h4>
          <a
            v-for="link in footerLinks.social"
            :key="link.label"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ link.label }}
          </a>
        </nav>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Archan Architecture. Todos os direitos reservados.</p>
        <p>Feito com dedicação para transformar espaços.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Styles are in _footer.scss */
</style>