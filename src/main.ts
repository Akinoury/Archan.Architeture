import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Styles
import './styles/main.scss'

// Bootstrap JS (for dropdowns, modals, tooltips, etc.)
import 'bootstrap'

/**
 * Auto-recovery for stale chunk errors.
 *
 * When a new deploy replaces the hashed asset files, a browser that still has
 * the previous entry script (or navigates right during a deploy) may try to
 * fetch a chunk that no longer exists. The SPA fallback then answers with
 * index.html, producing the "Failed to fetch dynamically imported module" /
 * MIME type error. Reloading once fetches the fresh index.html + entry.
 *
 * A short guard prevents infinite reload loops.
 */
const RELOAD_KEY = 'archan:chunk-reload-at'

function reloadOnceForFreshAssets(): boolean {
  let last = 0
  try {
    last = Number(sessionStorage.getItem(RELOAD_KEY) || '0')
  } catch {
    last = 0
  }
  const now = Date.now()
  // Only auto-reload if we have not done it within the last 10 seconds.
  if (now - last < 10000) return false
  try {
    sessionStorage.setItem(RELOAD_KEY, String(now))
  } catch {
    /* ignore private-mode storage errors */
  }
  window.location.reload()
  return true
}

const isChunkLoadError = (message: string): boolean =>
  /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Expected a JavaScript-or-Wasm module script/i.test(
    message
  )

// Vite emits this when a dynamic import fails.
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  reloadOnceForFreshAssets()
})

// Global error handler
const handleError = (err: unknown, instance: any, info: string) => {
  console.error('Vue Error:', err, info)
  const message = err instanceof Error ? err.message : String(err)
  // Last-resort recovery for stale chunks before showing the error UI.
  if (isChunkLoadError(message) && reloadOnceForFreshAssets()) {
    return
  }
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
  const message = err instanceof Error ? err.message : String(err)
  // Stale chunk (new deploy) -> reload once to fetch the latest assets.
  if (isChunkLoadError(message) && reloadOnceForFreshAssets()) {
    return
  }
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

  // A clean mount means assets matched: allow a future stale-chunk reload.
  try {
    sessionStorage.removeItem(RELOAD_KEY)
  } catch {
    /* ignore */
  }

  setupRevealAnimations()
} catch (err) {
  handleError(err, null, 'mount')
}