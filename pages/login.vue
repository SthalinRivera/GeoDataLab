<template>
  <div class="min-h-screen  flex items-center justify-center p-4">
    <div class="max-w-6xl w-full bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
      <!-- Sección izquierda (formulario) -->
      <div class="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
        <div class="text-center lg:text-left">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Bienvenido de vuelta</h1>
          <p class="text-gray-600 mb-8">Inicia sesión para acceder a tu cuenta</p>
        </div>

        <div class="space-y-6">
          <!-- Botón de Google mejorado -->
          <button @click="signInWithGoogle"
            class="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md">
            <div class="bg-white p-1.5 rounded-full">
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
            <span class="text-sm font-medium text-gray-700">Continuar con Google</span>
          </button>
        </div>

        <div class="mt-8 text-center text-sm text-gray-500">
          <p>
            Al continuar, aceptas nuestros
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Términos de servicio</a> y
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Política de privacidad</a>
          </p>

        </div>
      </div>

      <!-- Sección derecha (imagen) -->
      <div class="hidden lg:block lg:w-1/2 bg-gradient-to-br from-indigo-500 to-indigo-700 relative">
        <div class="absolute inset-0 flex items-center justify-center p-12">
          <img src="https://illustrations.popsy.co/amber/digital-nomad.svg" alt="Ilustración login"
            class="w-full h-auto max-h-[80%] object-contain">
        </div>
        <div
          class="absolute bottom-0 left-0 right-0 p-8 text-center text-white bg-gradient-to-t from-black/30 to-transparent">
          <h3 class="text-xl font-bold">Descubre un mundo de posibilidades</h3>
          <p class="mt-2 opacity-90">Únete a nuestra comunidad hoy mismo</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const signInWithGoogle = () => {
  window.location.href = '/auth/google'
}

definePageMeta({
  middleware: ['redirect-if-logged']
})
</script>

<style scoped></style>