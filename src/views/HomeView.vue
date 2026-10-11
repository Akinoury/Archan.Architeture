<script setup lang="ts">
import { ref } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import BlogSection from '@/components/sections/BlogSection.vue'
import StatsSection from '@/components/sections/StatsSection.vue'
import CTASection from '@/components/sections/CTASection.vue'

const heroRef = ref<HTMLElement | null>(null)
const projectsRef = ref<HTMLElement | null>(null)
const blogRef = ref<HTMLElement | null>(null)
const statsRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)

useIntersectionObserver({ target: heroRef, once: true })
useIntersectionObserver({ target: projectsRef, once: true })
useIntersectionObserver({ target: blogRef, once: true })
useIntersectionObserver({ target: statsRef, once: true })
useIntersectionObserver({ target: ctaRef, once: true })
</script>

<template>
  <DefaultLayout>
    <div ref="heroRef"><HeroSection /></div>
    <div ref="statsRef"><StatsSection /></div>
    <div ref="projectsRef"><ProjectsSection /></div>
    <div ref="blogRef"><BlogSection /></div>
    <div ref="ctaRef"><CTASection /></div>
  </DefaultLayout>
</template>