import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Styles
import './styles/main.scss'

// Bootstrap JS (for dropdowns, modals, tooltips, etc.)
import 'bootstrap'

// Global error handler
const handleError = (err: unknown, instance: any, info: string) => {
  console.error('Vue Error:', err, info)
  const fallback = document.getElementById('loading-fallback')
  if (fallback) {
    fallback.innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: system-ui; color: #c00; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #c00; margin-bottom: 1rem;">Erro ao Carregar</h1>
        <pre style="text-align: left; background: #fff; padding: 1rem; border-radius: 4px; overflow: auto; max-height: 300px; border: 1px solid #eadecd;">
${err instanceof Error ? err.message + '\n\n' + err.stack : String(err)}
        </pre>
        <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #b58c49; color: #fff; border: none; border-radius: 4px; cursor: pointer;">
          Recarregar Página
        </button>
      `
    fallback.style.display = 'flex'
  }
}

const app = createApp(App)

app.config.errorHandler = handleError

app.use(createPinia())
app.use(router)

// Handle router errors
router.onError((err) => {
  console.error('Router Error:', err)
  handleError(err, null, 'router')
})

/**
 * Reveal-on-scroll animations.
 * Elements using the `.reveal` class start hidden (opacity: 0) and are made
 * visible once they enter the viewport. A safety net guarantees content is
 * never left invisible if the observer fails or is unsupported.
 */
function setupRevealAnimations() {
  const revealAll = () => {
    document.querySelectorAll('.reveal:not(.reveal-visible)').forEach((el) => {
      el.classList.add('reveal-visible')
    })
  }

  if (!('IntersectionObserver' in window)) {
    revealAll()
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  )

  const scan = () => {
    document.querySelectorAll('.reveal:not(.reveal-visible)').forEach((el) => {
      observer.observe(el)
    })
  }

  scan()

  // Re-scan for dynamically rendered content (route changes, async data).
  let pending = false
  const mutationObserver = new MutationObserver(() => {
    if (pending) return
    pending = true
    window.requestAnimationFrame(() => {
      pending = false
      scan()
    })
  })
  mutationObserver.observe(document.getElementById('app') || document.body, {
    childList: true,
    subtree: true,
  })

  // Safety net: if nothing revealed shortly after load, show everything.
  window.setTimeout(() => {
    if (!document.querySelector('.reveal.reveal-visible')) {
      revealAll()
    }
  }, 1500)
}

try {
  app.mount('#app')
  // Hide loading fallback on successful mount
  const fallback = document.getElementById('loading-fallback')
  if (fallback) fallback.style.display = 'none'

  setupRevealAnimations()
} catch (err) {
  handleError(err, null, 'mount')
}