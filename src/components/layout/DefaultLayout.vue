<script setup lang="ts">
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import Modal from '@/components/ui/Modal.vue'
import CookieConsent from '@/components/ui/CookieConsent.vue'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
</script>

<template>
  <div class="app-layout">
    <Navbar />

    <main id="main-content" role="main">
      <slot />
    </main>

    <Footer />

    <ToastContainer />

    <CookieConsent />

    <Teleport to="body">
      <Modal
        v-for="modal in uiStore.modals"
        :key="modal.id"
        :modal="modal"
        @close="uiStore.closeModal"
        @confirm="uiStore.closeModal"
      />
    </Teleport>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>