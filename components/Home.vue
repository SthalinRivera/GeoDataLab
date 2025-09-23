<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- Fondo animado -->
    <div class="absolute inset-0 -z-10 animated-gradient"></div>

    <!-- Contenido principal -->
    <HomeInit />
    <Skills />
    <Services />
    <Categories />
    <ProductCardProductsHome />
    <WhatsApp />
  </div>
</template>

<script setup lang="ts">
import Services from './Servicios/Services.vue';

</script>

<style scoped>
/* 🎨 Fondo degradado animado */
.animated-gradient {
  background: linear-gradient(270deg,
      rgba(99, 102, 241, 0.6),
      rgba(236, 72, 153, 0.6),
      rgba(34, 211, 238, 0.6),
      rgba(16, 185, 129, 0.6));
  background-size: 800% 800%;
  animation: gradientMove 20s ease infinite;
  filter: blur(80px);
  opacity: 0.6;
}

/* 🌊 Animación de movimiento */
@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

/* Soporte modo oscuro */
.dark .animated-gradient {
  background: linear-gradient(270deg,
      rgba(139, 92, 246, 0.4),
      rgba(244, 63, 94, 0.4),
      rgba(6, 182, 212, 0.4),
      rgba(34, 197, 94, 0.4));
}
</style>
