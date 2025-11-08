<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- Fondo animado -->
    <div class="absolute inset-0 -z-10 animated-gradient"></div>

    <!-- Cards flotantes (solo visibles en escritorio) -->
    <div class="hidden lg:flex justify-between absolute inset-y-0 w-full pointer-events-none">
      <!-- Card izquierda -->

      <!-- Card izquierda con animaciones y efectos mejorados -->
      <div class="pointer-events-auto fixed left-8 top-1/3 -translate-y-1/2 
  bg-white/95 dark:bg-slate-900/95
  backdrop-blur-sm border border-gray-200 dark:border-slate-700
  shadow-xl rounded-2xl p-6 w-72
  hover:shadow-2xl hover:scale-105
  transition-all duration-300 ease-out
  group">

        <!-- Header -->
        <div class="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200 dark:border-slate-700">
          <div
            class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform duration-300">
            <span class="text-xl">🚀</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            Conéctate
          </h3>
        </div>
        <!-- Mensaje destacado grande -->
        <div class="mb-6">
          <h4
            class="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
            Soluciones en Seguridad y Análisis de Datos
          </h4>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Somos especialistas en proteger tu información y transformar datos en decisiones estratégicas
          </p>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-5">
          Construyamos algo increíble juntos
        </p>

        <!-- Enlaces sociales -->
        <div class="flex flex-col gap-3 mb-5">
          <!-- LinkedIn -->
          <a href="https://www.linkedin.com/in/sthalin-rivera/" target="_blank" class="group/link flex items-center gap-3 px-4 py-3
      bg-blue-50 dark:bg-blue-900/20
      hover:bg-blue-100 dark:hover:bg-blue-900/40
      border border-blue-200 dark:border-blue-800
      rounded-lg transition-all duration-200
      hover:scale-102 hover:shadow-md">
            <div
              class="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center group-hover/link:rotate-3 transition-transform duration-200">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <span
              class="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors">
              LinkedIn
            </span>
            <svg
              class="w-4 h-4 ml-auto text-gray-400 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-200"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>

          <!-- GitHub -->
          <a href="https://github.com/SthalinRivera" target="_blank" class="group/link flex items-center gap-3 px-4 py-3
      bg-gray-50 dark:bg-slate-800/50
      hover:bg-gray-100 dark:hover:bg-slate-800
      border border-gray-200 dark:border-slate-700
      rounded-lg transition-all duration-200
      hover:scale-102 hover:shadow-md">
            <div
              class="w-9 h-9 bg-gray-800 dark:bg-gray-900 rounded-lg flex items-center justify-center group-hover/link:rotate-3 transition-transform duration-200">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <span
              class="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover/link:text-gray-900 dark:group-hover/link:text-gray-100 transition-colors">
              GitHub
            </span>
            <svg
              class="w-4 h-4 ml-auto text-gray-400 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-200"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <!-- Footer -->
        <div class="pt-4 border-t border-gray-200 dark:border-slate-700">
          <div class="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Disponible para colaborar</span>
          </div>
        </div>
      </div>



      <!-- Card derecha -->
      <!-- Card derecha profesional y compacta -->
      <div>


      </div>

    </div>

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
import Services from './Servicios/Services.vue'
</script>

<style scoped>
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

.dark .animated-gradient {
  background: linear-gradient(270deg,
      rgba(139, 92, 246, 0.4),
      rgba(244, 63, 94, 0.4),
      rgba(6, 182, 212, 0.4),
      rgba(34, 197, 94, 0.4));
}
</style>
