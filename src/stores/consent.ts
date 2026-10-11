import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'archan:cookie-consent'
const CONSENT_VERSION = 1

export interface StoredConsent {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  decidedAt: string | null
  version: number
}

/**
 * Consent management for cookies and local storage, following the LGPD
 * (Lei nº 13.709/2018) and the ANPD guidance on consent for non-essential
 * cookies: equal prominence for accept/reject, granular choices, and an
 * easy way to review or revoke consent.
 */
export const useConsentStore = defineStore('consent', () => {
  // Necessary resources (authentication, security, preferences) are always on.
  const necessary = ref(true)
  const analytics = ref(false)
  const marketing = ref(false)
  const decidedAt = ref<string | null>(null)
  const bannerOpen = ref(false)
  const initialized = ref(false)

  const hasDecided = computed(() => decidedAt.value !== null)

  function persist() {
    const data: StoredConsent = {
      necessary: necessary.value,
      analytics: analytics.value,
      marketing: marketing.value,
      decidedAt: decidedAt.value,
      version: CONSENT_VERSION
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      /* ignore private-mode storage errors */
    }
  }

  function init() {
    if (initialized.value) return
    initialized.value = true

    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as StoredConsent
        if (saved && saved.version === CONSENT_VERSION) {
          necessary.value = true
          analytics.value = !!saved.analytics
          marketing.value = !!saved.marketing
          decidedAt.value = saved.decidedAt ?? null
        }
      }
    } catch {
      /* ignore malformed storage */
    }

    // Ask for consent until the visitor makes a choice.
    if (!hasDecided.value) bannerOpen.value = true
  }

  function save(next: { analytics: boolean; marketing: boolean }) {
    analytics.value = next.analytics
    marketing.value = next.marketing
    decidedAt.value = new Date().toISOString()
    persist()
    bannerOpen.value = false
  }

  function acceptAll() {
    save({ analytics: true, marketing: true })
  }

  function rejectAll() {
    save({ analytics: false, marketing: false })
  }

  // Persists whatever the visitor toggled in the preferences panel.
  function savePreferences() {
    save({ analytics: analytics.value, marketing: marketing.value })
  }

  /** Reopen the banner (e.g. from the "Preferências de cookies" footer link). */
  function openPreferences() {
    bannerOpen.value = true
  }

  return {
    necessary,
    analytics,
    marketing,
    decidedAt,
    bannerOpen,
    initialized,
    hasDecided,
    init,
    acceptAll,
    rejectAll,
    savePreferences,
    openPreferences
  }
})
