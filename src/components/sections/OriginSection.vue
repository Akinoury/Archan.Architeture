<script setup lang="ts">
// Origin story: why the company came to exist.
</script>

<template>
  <section class="section origin reveal" aria-labelledby="origin-title">
    <div class="container-custom">
      <div class="origin-inner">
        <span class="section-label">Nossa História</span>
        <h2 id="origin-title">Como tudo começou</h2>
        <p>
          A Archan Architecture nasceu de uma inquietação simples: por que tantos
          espaços são projetados sem levar em conta quem realmente os vive?
          Fundamos o estúdio para mudar isso, colocando as pessoas, a luz e o
          cotidiano no centro de cada decisão.
        </p>
        <p>
          Desde o início, nossa missão é unir estética, técnica e valor de
          investimento em um só projeto. Acreditamos que boa arquitetura não é
          luxo: é a forma mais inteligente de melhorar a vida de quem habita o
          espaço e de valorizar o patrimônio de quem confia no nosso trabalho.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.origin-inner {
  max-width: 820px;
  margin: 0 auto;
  text-align: center;
}

.origin-inner h2 {
  margin-bottom: var(--bs-spacing-md);
}

.origin-inner p {
  color: var(--bs-dark-gray);
}

.origin-inner p:last-child {
  margin-bottom: 0;
}
</style>
