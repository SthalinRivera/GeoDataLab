<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- Fondo animado -->
    <div class="absolute inset-0 -z-10 animated-gradient"></div>

    <!-- Cards flotantes (solo visibles en escritorio) -->
    <div class="hidden lg:flex justify-between absolute inset-y-0 w-full pointer-events-none">
      <!-- Card izquierda -->

      <!-- Card izquierda con animaciones y efectos mejorados -->
      <!-- <Publicidad /> -->



      <!-- Card derecha -->
      <!-- Card derecha profesional y compacta -->
      <div>


      </div>

    </div>

    <!-- Contenido principal -->
    <HomeInit />
    <HomeInit2 />
    <WhatsApp />
  </div>
</template>

<script setup lang="ts">
import Services from './Servicios/Services.vue'
</script>

<style scoped></style>
