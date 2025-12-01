<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
    <!-- Botón modo oscuro/claro -->

    <div
      class="max-w-6xl w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-white/20 dark:border-gray-700/50 transition-all duration-500 hover:shadow-3xl">

      <!-- Sección izquierda (formulario) -->
      <div class="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative">
        <!-- Elementos decorativos flotantes -->
        <div class="absolute -top-4 -left-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
        <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>

        <div class="text-center lg:text-left relative z-10">
          <!-- Logo -->
          <div class="flex justify-center lg:justify-start items-center mb-6">
            <NuxtLink to="/" class="flex items-center gap-3 group" @click="isMobileMenuOpen = false">
              <div
                class="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <span
                class="font-bold text-xl tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">GeoDataLab</span>
            </NuxtLink>
          </div>

          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-3">Bienvenido</h1>
          <p class="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-md">
            Accede a la plataforma de análisis geoespacial más avanzada del Perú
          </p>
        </div>

        <div class="space-y-6 relative z-10">
          <!-- Botón de Google mejorado -->
          <button @click="signInWithGoogle"
            class="w-full flex items-center justify-center gap-4 px-6 py-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl bg-white dark:bg-gray-800 hover:scale-[1.02] group">
            <div
              class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <svg class="w-5 h-5" viewBox="0 0 533.5 544.3">
                <path
                  d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                  fill="#4285f4" />
                <path
                  d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                  fill="#34a853" />
                <path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                  fill="#fbbc04" />
                <path
                  d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                  fill="#ea4335" />
              </svg>
            </div>
            <span class="text-base font-semibold text-gray-700 dark:text-gray-200">Continuar con Google</span>
          </button>

          <!-- Indicador de seguridad -->
          <div class="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-6">
            <i class="ri-shield-check-line text-green-500"></i>
            <span>Autenticación segura con Google</span>
          </div>
        </div>

        <div class="mt-10 text-center text-sm text-gray-500 dark:text-gray-400 relative z-10">
          <p>
            Al continuar, aceptas nuestros
            <a href="#"
              class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">Términos
              de servicio</a> y
            <a href="#"
              class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">Política
              de privacidad</a>
          </p>
        </div>
      </div>

      <!-- Sección derecha (imagen temática) -->
      <div
        class="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <!-- Mapa del Perú decorativo -->
        <div class="absolute inset-0 opacity-20">

        </div>

        <!-- Puntos de datos animados -->
        <div class="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
        <div class="absolute top-1/3 right-1/3 w-2 h-2 bg-red-400 rounded-full animate-pulse"
          style="animation-delay: 0.5s;"></div>
        <div class="absolute bottom-1/3 left-1/3 w-4 h-4 bg-green-400 rounded-full animate-pulse"
          style="animation-delay: 1s;"></div>

        <div class="absolute inset-0 flex items-center justify-center p-12">
          <img src="/undraw_stars_5pgw.svg" alt="Análisis Geoespacial"
            class="w-full h-auto max-h-[70%] object-contain drop-shadow-2xl">
        </div>

        <!-- Texto descriptivo -->
        <div
          class="absolute bottom-0 left-0 right-0 p-8 text-center text-white bg-gradient-to-t from-black/50 to-transparent">
          <h3 class="text-2xl font-bold mb-3">Plataforma de Análisis Geoespacial</h3>
          <p class="text-lg opacity-90 mb-4">Monitorea seguridad, contaminación y expansión urbana en tiempo real</p>
          <div class="flex justify-center gap-6 text-sm">
            <div class="flex items-center gap-2">
              <i class="ri-map-pin-line text-yellow-300"></i>
              <span>Mapas interactivos</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="ri-radar-line text-green-300"></i>
              <span>Datos en tiempo real</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="ri-brain-line text-blue-300"></i>
              <span>IA predictiva</span>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'


const signInWithGoogle = () => {
  window.location.href = '/auth/google'
}

definePageMeta({
  middleware: ['redirect-if-logged']
})
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css');

/* Animaciones personalizadas */
@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

.hover-float:hover {
  animation: float 2s ease-in-out infinite;
}

/* Transiciones suaves */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, transform, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Efectos de profundidad */
.shadow-3xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>