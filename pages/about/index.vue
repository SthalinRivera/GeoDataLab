<script lang="ts" setup>
const route = useRoute()
const router = useRouter()

// Tus datos personales y profesionales
const personalInfo = {
    name: 'ADLER STALIN RIVERA CENTENO',
    title: 'SYSTEMS ENGINEER - JUNIOR CYBERSECURITY ANALYST - DATA ANALYTICS',
    description: 'Ingeniero de Sistemas colegiado y habilitado, con experiencia en soporte de tecnologías, análisis de bases de datos y desarrollo web. Especializado en Data Analytics, Ciberseguridad y Gestión de Proyectos.',
    email: 'sthalin.11@gmail.com',
    phone: '+51 910985938',
    location: 'San Vicente de Cañete, Lima 17500, Perú',
    website: 'sthalin.vercel.app',
    avatar: '/foto-perfil.png'
}

// URL del CV desde la carpeta public
const cvUrl = '/cv.pdf'

// Estados reactivos
const showLoginModal = ref(false)
const showCvModal = ref(false)
const { loggedIn, user, clear } = useUserSession()

// Función para ver/descargar CV
const handleCvAccess = () => {
    if (!loggedIn.value) {
        showLoginModal.value = true
    } else {
        showCvModal.value = true
    }
}

// Función para descargar CV
const downloadCv = () => {
    const link = document.createElement('a')
    link.href = cvUrl
    link.setAttribute('download', 'CV-AdlerStalinRiveraCenteno.pdf')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

// Función para abrir CV en nueva pestaña
const openCvInNewTab = () => {
    window.open(cvUrl, '_blank')
}

// Función para regresar
const goBack = () => {
    router.push('/')
}
</script>

<template>
    <div class="container mx-auto p-4 max-w-4xl">
        <!-- Botón de regreso -->
        <button @click="goBack"
            class="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mb-8">
            <UIcon name="i-heroicons-arrow-left" class="w-5 h-5 mr-2" />
            <span class="font-medium">Volver al Inicio</span>
        </button>

        <!-- Header con información personal -->
        <div
            class="mb-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl backdrop-blur-sm bg-opacity-90 border border-white/10">
            <div class="flex flex-col md:flex-row items-center gap-6">
                <!-- Avatar -->
                <div class="relative">
                    <div
                        class="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center overflow-hidden">
                        <img v-if="personalInfo.avatar" :src="personalInfo.avatar" :alt="personalInfo.name"
                            class="w-full h-full object-cover" />
                        <i v-else class="ri-user-3-line text-3xl text-white"></i>
                    </div>
                </div>

                <!-- Información personal -->
                <div class="flex-1 text-center md:text-left">
                    <h1 class="text-2xl md:text-3xl font-bold text-white">{{ personalInfo.name }}</h1>
                    <p class="text-indigo-100 text-sm md:text-lg mt-1">{{ personalInfo.title }}</p>
                    <p class="text-indigo-100 opacity-90 mt-3 max-w-2xl text-sm md:text-base">{{
                        personalInfo.description }}</p>

                    <!-- Información de contacto -->
                    <div class="flex flex-col sm:flex-row flex-wrap gap-3 mt-4 justify-center md:justify-start">
                        <div class="flex items-center text-indigo-100">
                            <i class="ri-mail-line mr-2"></i>
                            <span class="text-sm">{{ personalInfo.email }}</span>
                        </div>
                        <div class="flex items-center text-indigo-100">
                            <i class="ri-phone-line mr-2"></i>
                            <span class="text-sm">{{ personalInfo.phone }}</span>
                        </div>
                        <div class="flex items-center text-indigo-100">
                            <i class="ri-map-pin-line mr-2"></i>
                            <span class="text-sm">{{ personalInfo.location }}</span>
                        </div>
                        <div class="flex items-center text-indigo-100">
                            <i class="ri-global-line mr-2"></i>
                            <span class="text-sm">{{ personalInfo.website }}</span>
                        </div>
                    </div>
                </div>

                <!-- Botón de CV -->
                <div class="flex flex-col items-center">
                    <UButton @click="handleCvAccess" size="lg"
                        class="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                        :icon="loggedIn ? 'i-heroicons-document-arrow-down' : 'i-heroicons-lock-closed'"
                        :label="loggedIn ? 'Ver CV' : 'Desbloquear CV'" />
                </div>
            </div>
        </div>

        <!-- Sección de resumen profesional -->
        <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div class="flex items-center gap-3 mb-6">
                <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <i class="ri-profile-line text-blue-600 dark:text-blue-400 text-xl"></i>
                </div>
                <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">Resumen Profesional</h2>
            </div>

            <div class="text-gray-600 dark:text-gray-300 space-y-4">
                <p>
                    Ingeniero de Sistemas colegiado y habilitado, con experiencia en soporte de tecnologías, análisis de
                    bases de datos y
                    desarrollo web. He sido <strong>Jefe de Prácticas de Ingeniería de Sistemas</strong> y participé en
                    el diseño e implementación de sistemas
                    web, gestores de contenidos y facturación electrónica.
                </p>
                <p>
                    Cuento con <strong>Diplomado en Data Analytics con Power BI</strong>, especialización en
                    <strong>Gestión de Proyectos y Data Analytics de Google</strong>,
                    además de formación como <strong>analista Junior de Ciberseguridad</strong>, lo que me permite
                    integrar la innovación tecnológica con un enfoque
                    estratégico y seguro.
                </p>
            </div>

            <!-- Especialidades destacadas -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div
                    class="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                    <i class="ri-database-2-line text-2xl text-blue-600 dark:text-blue-400 mb-2"></i>
                    <div class="font-semibold text-blue-700 dark:text-blue-300">Data Analytics</div>
                    <div class="text-xs text-blue-600 dark:text-blue-400 mt-1">Power BI · Google Analytics</div>
                </div>
                <div
                    class="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800/30">
                    <i class="ri-shield-check-line text-2xl text-green-600 dark:text-green-400 mb-2"></i>
                    <div class="font-semibold text-green-700 dark:text-green-300">Ciberseguridad</div>
                    <div class="text-xs text-green-600 dark:text-green-400 mt-1">Junior Analyst</div>
                </div>
                <div
                    class="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30">
                    <i class="ri-projector-line text-2xl text-purple-600 dark:text-purple-400 mb-2"></i>
                    <div class="font-semibold text-purple-700 dark:text-purple-300">Gestión de Proyectos</div>
                    <div class="text-xs text-purple-600 dark:text-purple-400 mt-1">Google Certified</div>
                </div>
            </div>
        </div>

        <!-- Modal de acceso al CV -->
        <UModal v-model="showLoginModal">
            <div
                class="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-2xl">

                <!-- Contenido principal -->
                <div class="relative z-10 p-8 text-center">
                    <!-- Icono premium -->
                    <div
                        class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
                        <i class="ri-vip-crown-line text-3xl text-white"></i>
                    </div>

                    <!-- Título -->
                    <h3
                        class="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3">
                        Acceso Exclusivo al CV
                    </h3>

                    <!-- Subtítulo -->
                    <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">
                        Inicia sesión para acceder a mi CV completo con toda mi experiencia detallada
                    </p>

                    <!-- Botones de acción -->
                    <div class="space-y-3">
                        <UButton :to="`/login?redirect=${encodeURIComponent(route.fullPath)}`" color="white" size="lg"
                            class="justify-center w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:-translate-y-0.5"
                            icon="i-heroicons-lock-open" label="Iniciar sesión para ver CV"
                            @click="showLoginModal = false" />

                        <UButton :to="`/login?redirect=${encodeURIComponent(route.fullPath)}`" color="gray"
                            variant="outline" size="lg"
                            class="justify-center w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            icon="i-heroicons-user-plus" label="Registrarse gratis" @click="showLoginModal = false" />
                    </div>
                </div>
            </div>
        </UModal>

        <!-- Modal del CV -->
        <UModal v-model="showCvModal" :ui="{ width: 'w-full max-w-8xl', height: 'h-[90vh]' }">
            <div class="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full">
                <!-- Header del modal -->
                <div
                    class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div>
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Curriculum Vitae</h3>

                    </div>
                    <div class="flex items-center gap-2">
                        <UButton @click="openCvInNewTab" color="primary" size="sm"
                            class="bg-indigo-600 hover:bg-indigo-700 text-white"
                            icon="i-heroicons-arrow-top-right-on-square" label="Abrir en nueva pestaña" />

                        <UButton @click="showCvModal = false" color="gray" variant="ghost" size="sm"
                            icon="i-heroicons-x-mark" />
                    </div>
                </div>

                <!-- Contenido del CV - PDF Viewer -->
                <div class="flex-1 p-6 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div class="w-full h-full rounded-lg bg-white dark:bg-gray-700 shadow-inner overflow-hidden">
                        <!-- Visor de PDF con iframe -->
                        <iframe :src="`${cvUrl}#view=FitH`" class="w-full h-full border-0" frameborder="0"
                            title="Curriculum Vitae de Adler Stalin Rivera Centeno" type="application/pdf">
                            <div class="flex items-center justify-center h-full">
                                <div class="text-center p-8">
                                    <i class="ri-file-pdf-line text-6xl text-red-500 mb-4"></i>
                                    <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No se puede
                                        mostrar el PDF</h4>
                                    <p class="text-gray-600 dark:text-gray-300 mb-4">Tu navegador no soporta la
                                        visualización de PDFs</p>
                                    <div class="flex flex-col sm:flex-row gap-3 justify-center">
                                        <UButton @click="openCvInNewTab" color="primary" size="sm"
                                            icon="i-heroicons-arrow-top-right-on-square"
                                            label="Abrir en nueva pestaña" />
                                        <UButton @click="downloadCv" color="green" size="sm"
                                            icon="i-heroicons-arrow-down-tray" label="Descargar CV" />
                                    </div>
                                </div>
                            </div>
                        </iframe>
                    </div>
                </div>
            </div>
        </UModal>
    </div>
</template>

<style scoped>
/* Estilos para mejorar la visualización del PDF */
</style>