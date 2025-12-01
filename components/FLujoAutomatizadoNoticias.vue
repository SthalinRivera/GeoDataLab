<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UContainer class="py-4">
            <!-- Header Super Compacto -->
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h1
                        class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Procesamiento de Noticias
                    </h1>
                </div>
                <UButton :icon="darkMode ? 'i-heroicons-sun' : 'i-heroicons-moon'" color="gray" variant="ghost"
                    @click="toggleDarkMode" />
            </div>

            <!-- Diagrama Ultra Compacto -->
            <div class="space-y-4">
                <!-- ENTRADA -->
                <UCard class="border-l-4 border-l-blue-500">
                    <template #header>
                        <div class="flex items-center gap-2">
                            <UIcon name="i-heroicons-arrow-down-tray" class="text-blue-500" />
                            <h2 class="font-bold text-gray-900 dark:text-white">ENTRADA</h2>
                        </div>
                    </template>
                    <div class="grid grid-cols-4 gap-2">
                        <div v-for="(item, index) in entradaItems" :key="index"
                            class="text-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors">
                            <UIcon :name="item.icon" class="text-blue-500 mx-auto mb-1" />
                            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ item.text }}</p>
                        </div>
                    </div>
                </UCard>

                <!-- Flecha -->
                <div class="flex justify-center">
                    <div class="h-4 w-1 bg-gradient-to-b from-blue-500 to-green-500 rounded-full"></div>
                </div>

                <!-- ADQUISICIÓN -->
                <UCard class="border-l-4 border-l-green-500">
                    <template #header>
                        <div class="flex items-center gap-2">
                            <UIcon name="i-heroicons-cloud-arrow-down" class="text-green-500" />
                            <h2 class="font-bold text-gray-900 dark:text-white">ADQUISICIÓN</h2>
                        </div>
                    </template>
                    <div class="flex flex-col items-center space-y-3">
                        <div
                            class="flex items-center justify-center w-full p-3 bg-green-50 dark:bg-green-900/20 rounded">
                            <UIcon name="i-heroicons-cloud-arrow-down" class="text-green-500 mr-2" />
                            <span class="font-semibold text-gray-900 dark:text-white">Módulo de Fetch</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div class="h-1 w-16 bg-green-300"></div>
                            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <div
                            class="flex items-center justify-center w-full p-3 bg-green-50 dark:bg-green-900/20 rounded">
                            <UIcon name="i-heroicons-document-text" class="text-green-500 mr-2" />
                            <span class="font-semibold text-gray-900 dark:text-white">Noticias crudas</span>
                        </div>
                    </div>
                </UCard>

                <!-- Flecha -->
                <div class="flex justify-center">
                    <div class="h-4 w-1 bg-gradient-to-b from-green-500 to-purple-500 rounded-full"></div>
                </div>

                <!-- PROCESAMIENTO -->
                <UCard class="border-l-4 border-l-purple-500">
                    <template #header>
                        <div class="flex items-center gap-2">
                            <UIcon name="i-heroicons-cpu-chip" class="text-purple-500" />
                            <h2 class="font-bold text-gray-900 dark:text-white">PROCESAMIENTO</h2>
                        </div>
                    </template>
                    <div class="flex justify-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                        <UIcon name="i-heroicons-cpu-chip" class="text-purple-500 mr-2" />
                        <span class="font-bold text-gray-900 dark:text-white">IA Processor</span>
                    </div>
                </UCard>

                <!-- Flecha -->
                <div class="flex justify-center">
                    <div class="h-4 w-1 bg-gradient-to-b from-purple-500 to-yellow-500 rounded-full"></div>
                </div>

                <!-- JSON -->
                <div class="flex justify-center">
                    <div
                        class="flex items-center justify-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-l-yellow-500 w-full max-w-xs">
                        <UIcon name="i-heroicons-code-bracket" class="text-yellow-500 mr-2" />
                        <span class="font-semibold text-gray-900 dark:text-white">JSON limpio</span>
                    </div>
                </div>

                <!-- Flecha -->
                <div class="flex justify-center">
                    <div class="h-4 w-1 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full"></div>
                </div>

                <!-- SALIDAS -->
                <div class="grid grid-cols-3 gap-3">
                    <UCard class="text-center border-l-4 border-l-orange-500 p-3">
                        <UIcon name="i-heroicons-server-stack" class="text-orange-500 mx-auto mb-1" />
                        <h3 class="font-bold text-gray-900 dark:text-white text-sm">ALMACENAMIENTO</h3>
                        <p class="text-xs text-gray-600 dark:text-gray-400">Base de Datos</p>
                    </UCard>

                    <UCard class="text-center border-l-4 border-l-red-500 p-3">
                        <UIcon name="i-heroicons-brain" class="text-red-500 mx-auto mb-1" />
                        <h3 class="font-bold text-gray-900 dark:text-white text-sm">ANÁLISIS</h3>
                        <p class="text-xs text-gray-600 dark:text-gray-400">Machine Learning</p>
                    </UCard>

                    <UCard class="text-center border-l-4 border-l-teal-500 p-3">
                        <UIcon name="i-heroicons-chart-bar" class="text-teal-500 mx-auto mb-1" />
                        <h3 class="font-bold text-gray-900 dark:text-white text-sm">VISUALIZACIÓN</h3>
                        <p class="text-xs text-gray-600 dark:text-gray-400">Dashboards</p>
                    </UCard>
                </div>
            </div>

            <!-- Estado Compacto -->
            <UCard class="mt-6 p-3">
                <div class="flex justify-between items-center mb-2">
                    <h3 class="font-bold text-gray-900 dark:text-white">Estado del Sistema</h3>
                    <UBadge color="green" variant="solid" size="sm">Operativo</UBadge>
                </div>
                <div class="grid grid-cols-4 gap-2 text-center">
                    <div>
                        <p class="font-bold text-gray-900 dark:text-white">1.2K</p>
                        <p class="text-xs text-gray-600 dark:text-gray-400">Noticias</p>
                    </div>
                    <div>
                        <p class="font-bold text-gray-900 dark:text-white">98%</p>
                        <p class="text-xs text-gray-600 dark:text-gray-400">Precisión</p>
                    </div>
                    <div>
                        <p class="font-bold text-gray-900 dark:text-white">45s</p>
                        <p class="text-xs text-gray-600 dark:text-gray-400">Tiempo</p>
                    </div>
                    <div>
                        <p class="font-bold text-gray-900 dark:text-white">24/7</p>
                        <p class="text-xs text-gray-600 dark:text-gray-400">Disponible</p>
                    </div>
                </div>
            </UCard>
        </UContainer>
    </div>
</template>

<script setup>
const darkMode = ref(false)
const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
    if (process.client) {
        localStorage.setItem('darkMode', darkMode.value)
        if (darkMode.value) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }
}

onMounted(() => {
    if (process.client) {
        const savedMode = localStorage.getItem('darkMode')
        if (savedMode !== null) {
            darkMode.value = JSON.parse(savedMode)
            if (darkMode.value) document.documentElement.classList.add('dark')
        }
    }
})

const entradaItems = [
    { icon: 'i-heroicons-user', text: 'Usuario' },
    { icon: 'i-heroicons-clock', text: 'Cron' },
    { icon: 'i-heroicons-magnifying-glass', text: 'Manual' },
    { icon: 'i-heroicons-play-circle', text: 'Auto' }
]
</script>

<style scoped>
/* CERO ESPACIOS EXTRA - MÁXIMA COMPACTACIÓN */
</style>