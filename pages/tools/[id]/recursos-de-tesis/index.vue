<script lang="ts" setup>
const route = useRoute()
const router = useRouter()

// Datos de recursos con URLs de descarga
const resources = [
  { icon: 'ri-file-word-2-line', color: 'text-blue-500', type: 'word', name: 'Baremo - Confiabilidad', free: true, size: '120KB', url: 'https://docs.google.com/document/d/1Q7H_dVGRwOEY6-T5GBu-K0AfLcjItyvL/edit?usp=sharing&ouid=107891967595002175771&rtpof=true&sd=true' },
  { icon: 'ri-file-word-2-line', color: 'text-blue-500', type: 'word', name: 'Plantilla - Acta de Implementación', free: true, size: '150KB', url: 'https://docs.google.com/document/d/1r8vh7ZL3acStYAe7AUOE1bpIEjlMknaa/edit?usp=sharing&ouid=107891967595002175771&rtpof=true&sd=true' },
  { icon: 'ri-file-excel-2-line', color: 'text-green-500', type: 'excel', name: 'Plantilla - Base de Datos', free: true, size: '95KB', url: 'https://docs.google.com/spreadsheets/d/1IDtqemrT2NxDGth5eH9mbnLz_G9QZTtU/edit?usp=sharing&ouid=107891967595002175771&rtpof=true&sd=true' },
  { icon: 'ri-file-excel-2-line', color: 'text-green-500', type: 'excel', name: 'Plantilla - Base de Datos Prueba Piloto', free: false, size: '110KB', url: 'https://docs.google.com/spreadsheets/d/1zd_Kfn5P8meXZqfS5EALTsJSGDNylzDk/edit?usp=sharing&ouid=107891967595002175771&rtpof=true&sd=true' },
  { icon: 'ri-file-word-2-line', color: 'text-blue-500', type: 'word', name: 'Plantilla - Carta de Autorización', free: false, size: '85KB', url: 'https://docs.google.com/document/d/1KHkvGYS41OqMCXBOeRnR7IxWS8vLRLig/edit?usp=sharing&ouid=107891967595002175771&rtpof=true&sd=true' },
  { icon: 'ri-file-word-2-line', color: 'text-blue-500', type: 'word', name: 'Plantilla - Consentimiento Informado', free: false, size: '90KB', url: 'https://docs.google.com/document/d/1ax-hs28TKlPpLyNXzlPeZbQjB6fxOc46/edit?usp=sharing&ouid=107891967595002175771&rtpof=true&sd=true' },
  { icon: 'ri-file-word-2-line', color: 'text-blue-500', type: 'word', name: 'Plantilla - Declaratoria de Autenticidad', free: false, size: '75KB', url: 'https://docs.google.com/document/d/1M2xl-C0M6Ar8EwW-j3Pi9DcdKRijRUbA/edit?usp=sharing&ouid=107891967595002175771&rtpof=true&sd=true' },
  { icon: 'ri-presentation-line', color: 'text-red-500', type: 'ppt', name: 'Plantilla - Diapositivas Proyecto de Tesis', free: false, size: '2.4MB', url: 'https://drive.google.com/file/d/15hY5W6X781uQu-4fXARuPrkbUZ19T8Hr/view?usp=sharing' },
  { icon: 'ri-presentation-line', color: 'text-red-500', type: 'ppt', name: 'Plantilla - Diapositivas Tesis', free: false, size: '3.1MB', url: 'https://drive.google.com/file/d/1fnNhgbRfKUcqciKbQpww_ygYxeK-BAxb/view?usp=sharing' },
  { icon: 'ri-file-word-2-line', color: 'text-blue-500', type: 'word', name: 'Plantilla - Instrumento de Recolección', free: false, size: '105KB', url: 'https://docs.google.com/document/d/14kaBt_6AioBEEjlxpB8kGGvVwwGGXfGf/edit?usp=sharing&ouid=107891967595002175771&rtpof=true&sd=true' },
  { icon: 'ri-file-excel-2-line', color: 'text-green-500', type: 'excel', name: 'Plantilla - KR-20, KR-21 y Alfa de Cronbach', free: false, size: '180KB', url: 'https://docs.google.com/spreadsheets/d/1khNbI8AgA8n3KONC9e63akqsQX3L5Prv/edit?usp=sharing&ouid=107891967595002175771&rtpof=true&sd=true' },
  { icon: 'ri-file-word-2-line', color: 'text-blue-500', type: 'word', name: 'Plantilla - Matriz de Consistencia', free: false, size: '125KB', url: 'https://docs.google.com/document/d/1ymrjP9-2SbU1q6nD2cNQOjxOnPoMCio-/edit?usp=sharing&ouid=107891967595002175771&rtpof=true&sd=true' },
  { icon: 'ri-file-word-2-line', color: 'text-blue-500', type: 'word', name: 'Plantilla - Matriz de Operacionalización', free: false, size: '115KB', url: 'https://docs.google.com/document/d/18IYT1Kv98kYD6JgZ691kytXOoUmyxSUp/edit?usp=sharing&ouid=107891967595002175771&rtpof=true&sd=true' },
  { icon: 'ri-file-word-2-line', color: 'text-blue-500', type: 'word', name: 'Plantilla - Validez de Expertos', free: false, size: '95KB', url: 'https://docs.google.com/document/d/1hrMKhuuTfWqcEBm3JVQA6f2QplL_bisS/edit?usp=sharing&ouid=107891967595002175771&rtpof=true&sd=true' },
  { icon: 'ri-file-excel-2-line', color: 'text-green-500', type: 'excel', name: 'Plantilla - V de Aiken', free: false, size: '145KB', url: 'https://docs.google.com/spreadsheets/d/19zOYfkMajAjgdoA2h9-oppZexwVWnnvW/edit?usp=sharing&ouid=107891967595002175771&rtpof=true&sd=true' },
  { icon: 'ri-question-line', color: 'text-yellow-500', type: 'faq', name: 'Preguntas Frecuentes - Sustentación', free: false, size: '65KB', url: 'https://drive.google.com/file/d/10pmAIInfvQewYypVcASr1EVYePGFCAjM/view?usp=sharing' },
  { icon: 'ri-survey-line', color: 'text-pink-500', type: 'instrument', name: 'Preparación - Cuestionario para Análisis', free: false, size: '135KB', url: 'https://docs.google.com/spreadsheets/d/1boLQy3gfoO9hlijMcddzVRlBCUoLlR-T/edit?usp=sharing&ouid=107891967595002175771&rtpof=true&sd=true' },
  { icon: 'ri-check-double-line', color: 'text-pink-500', type: 'instrument', name: 'Preparación - Lista de Cotejo para Análisis', free: false, size: '120KB', url: 'https://docs.google.com/spreadsheets/d/1349MRoKKGspO__8tAoJ___4SZjKHEOM1/edit?usp=sharing&ouid=107891967595002175771&rtpof=true&sd=true' }
]

const categories = [
  { name: 'Todos', icon: 'ri-apps-line', color: 'text-gray-500', filter: () => true },
  { name: 'Gratis', icon: 'ri-price-tag-3-line', color: 'text-green-500', filter: (r: any) => r.free },
  { name: 'Premium', icon: 'ri-vip-crown-line', color: 'text-amber-500', filter: (r: any) => !r.free },
  { name: 'Plantillas', icon: 'ri-file-copy-line', color: 'text-indigo-500', filter: (r: any) => r.name.includes('Plantilla') },
  { name: 'Instrumentos', icon: 'ri-survey-line', color: 'text-teal-500', filter: (r: any) => r.type === 'instrument' }
]

const selectedCategory = ref('Todos')
const showLoginModal = ref(false)
const downloading = ref(false)
const { loggedIn, user, clear } = useUserSession()

const filteredResources = computed(() => {
  const category = categories.find(c => c.name === selectedCategory.value)
  return resources.filter(category ? category.filter : () => true)
})

const fileTypeIcon = (type: string) => {
  switch (type) {
    case 'word': return 'ri-file-word-2-line'
    case 'excel': return 'ri-file-excel-2-line'
    case 'ppt': return 'ri-presentation-line'
    default: return 'ri-file-line'
  }
}

const handleDownload = async (resource: any) => {
  if (!resource.free && !loggedIn) {
    showLoginModal.value = true
    return
  }

  downloading.value = true
  try {
    // Simular tiempo de descarga
    await new Promise(resolve => setTimeout(resolve, 800))

    // Crear enlace temporal para descarga
    const link = document.createElement('a')
    link.href = resource.url
    link.setAttribute('download', '')
    link.setAttribute('target', '_blank')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Aquí podrías agregar tracking de descargas
    console.log(`Descargado: ${resource.name}`)
  } catch (error) {
    console.error('Error al descargar:', error)
    // Aquí podrías mostrar una notificación de error
  } finally {
    downloading.value = false
  }
}

const goBack = () => {
  router.push('/tools')
}
</script>

<template>
  <div class="container mx-auto p-4 max-w-5xl">
    <!-- Botón de regreso -->
    <button @click="goBack"
      class="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mb-8">
      <UIcon name="i-heroicons-arrow-left" class="w-5 h-5 mr-2" />
      <span class="font-medium">Volver a Herramientas</span>
    </button>

    <!-- Header -->
    <div
      class="mb-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl backdrop-blur-sm bg-opacity-90 border border-white/10">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
          <i class="ri-book-3-line text-3xl text-white"></i>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-white">Recursos de Tesis</h1>
          <p class="text-indigo-100 opacity-90 mt-1">Herramientas esenciales para tu investigación académica</p>
        </div>
      </div>
    </div>

    <!-- Filtros por categoría -->
    <div class="mb-8 flex flex-wrap gap-2 justify-center">
      <button v-for="category in categories" :key="category.name" @click="selectedCategory = category.name"
        class="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 shadow-sm" :class="{
          'bg-indigo-600 text-white shadow-indigo-500/20': selectedCategory === category.name,
          'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200': selectedCategory !== category.name,
          'border border-gray-200 dark:border-gray-600': selectedCategory !== category.name
        }">
        <i :class="[category.icon, selectedCategory === category.name ? 'text-white' : category.color, 'text-lg']"></i>
        <span class="text-sm font-medium">{{ category.name }}</span>
      </button>
    </div>

    <!-- Lista de recursos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="(resource, index) in filteredResources" :key="index"
        @click="() => { if (!resource.free && !loggedIn) { showLoginModal = true } else { handleDownload(resource) } }"
        class="group relative p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" :class="{
          'cursor-pointer': resource.free || loggedIn,
          'cursor-not-allowed': !resource.free && !loggedIn,
          'bg-white dark:bg-gray-800 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700': resource.free || loggedIn,
          'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 border border-gray-100 dark:border-gray-800/50': !resource.free && !loggedIn,
          'hover:shadow-lg': resource.free || loggedIn
        }">
        <!-- Badge gratis -->
        <div v-if="resource.free" class="absolute top-1 right-4">
          <span
            class="px-2.5 py-1 text-xs font-bold rounded-full bg-green-100 dark:bg-green-900/80 text-green-800 dark:text-green-200 flex items-center gap-1">
            <i class="ri-checkbox-circle-line text-sm"></i>
          </span>
        </div>

        <!-- Indicador premium -->
        <div v-if="!resource.free" class="absolute top-1 right-3 flex items-center gap-1">
          <span
            class="px-2.5 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/80 dark:to-amber-800/80 text-amber-800 dark:text-amber-200 flex items-center">
            <i class="ri-vip-crown-line text-sm mr-1"></i>
          </span>
        </div>

        <div class="flex items-start gap-3">
          <div class="p-3 rounded-xl mt-1" :class="{
            'bg-gray-100 dark:bg-gray-700/50': resource.free || loggedIn,
            'bg-gray-50 dark:bg-gray-800/30': !resource.free && !loggedIn
          }">
            <i :class="[
              resource.icon,
              'text-xl',
              resource.free || loggedIn ? resource.color : 'text-gray-400 dark:text-gray-600'
            ]"></i>
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="text-base font-semibold " :class="{
              'text-gray-800 dark:text-gray-100': resource.free || loggedIn,
              'text-gray-600 dark:text-gray-400': !resource.free && !loggedIn
            }">
              {{ resource.name }}
            </h3>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs px-2 py-1 rounded-full" :class="{
                'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200': resource.type === 'word',
                'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200': resource.type === 'excel',
                'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200': resource.type === 'ppt',
                'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-200': !['word', 'excel', 'ppt'].includes(resource.type),
                'opacity-70': !resource.free && !loggedIn
              }">
                {{ resource.size }}
              </span>
              <i
                :class="[fileTypeIcon(resource.type), 'text-xs', resource.free || loggedIn ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600']"></i>
            </div>
          </div>

          <button @click.stop="handleDownload(resource)" class="p-2 rounded-lg transition-colors duration-200 mt-2"
            :disabled="!resource.free && !loggedIn" :class="{
              'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400': resource.free || loggedIn,
              'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400': !resource.free && !loggedIn
            }">
            <i v-if="downloading" class="ri-loader-4-line animate-spin text-lg"></i>
            <i v-else-if="resource.free || loggedIn" class="ri-download-line text-lg"></i>
            <i v-else class="ri-lock-line text-lg"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de acceso premium -->
    <UModal v-model="showLoginModal">
      <div
        class="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        <!-- Efecto de partículas -->
        <div class="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
          <template v-for="i in 12" :key="i">
            <div class="absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse" :style="{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
              'animation-delay': `${Math.random() * 2}s`,
              'animation-duration': `${Math.random() * 3 + 2}s`
            }"></div>
          </template>
        </div>

        <!-- Contenido principal -->
        <div class="relative z-10 p-8 text-center">
          <!-- Icono premium -->
          <div
            class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
            <i class="ri-vip-crown-line text-3xl text-white"></i>
          </div>

          <!-- Título -->
          <h3 class="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Desbloquea Contenido Exclusivo
          </h3>

          <!-- Subtítulo -->
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Tu acceso premium incluye:
          </p>

          <!-- Beneficios -->
          <div
            class="mb-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700/80 border border-gray-200/50 dark:border-gray-700 rounded-xl p-4 text-left">
            <div class="flex items-start mb-3" v-for="(benefit, index) in [
              'Plantillas profesionales listas para usar',
              'Instrumentos de investigación validados',
              'Herramientas de análisis estadístico',
              'Soporte prioritario'
            ]" :key="index">
              <i class="ri-checkbox-circle-fill text-cyan-500 mt-1 mr-3"></i>
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ benefit }}</span>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="space-y-3">
            <UButton :to="`/login?redirect=${encodeURIComponent(route.fullPath)}`" color="white" size="lg"
              class="justify-center w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:-translate-y-0.5"
              icon="i-heroicons-lock-open" label="Iniciar sesión para desbloquear" @click="showLoginModal = false" />

            <UButton :to="`/login?redirect=${encodeURIComponent(route.fullPath)}`" color="gray" variant="outline"
              size="lg"
              class="justify-center w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              icon="i-heroicons-user-plus" label="Registrarse gratis" @click="showLoginModal = false" />
          </div>

          <!-- Garantía -->
          <div class="mt-6 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
            <i class="ri-shield-check-line mr-2 text-cyan-500"></i>
            <span>Acceso seguro • Sin tarjeta requerida</span>
          </div>
        </div>

        <!-- Efecto de gradiente inferior -->
        <div
          class="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 animate-gradient-x">
        </div>
      </div>
    </UModal>
  </div>
</template>

<style scoped></style>