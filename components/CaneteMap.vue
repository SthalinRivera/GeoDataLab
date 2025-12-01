<template>
    <div class="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <!-- Header -->
        <header class="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 px-4 py-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center">

                    <h1 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                        <Icon name="ri:map-pin-line" class="mr-2 text-red-500" />
                        Mapa de Seguridad - Cañete
                    </h1>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                        Actualizado: {{ lastUpdate }}
                    </div>

                </div>
            </div>
        </header>

        <!-- Contenido Principal -->
        <div class="flex-1 flex overflow-hidden">
            <!-- Panel de Resumen (Izquierda) -->
            <div id="summary-panel" :class="[
                'bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 overflow-y-auto transition-all duration-300 z-40',
                mobileMenuOpen ? 'absolute inset-y-0 left-0 w-80' : 'hidden lg:block w-80'
            ]">
                <div class="p-4 lg:p-6">
                    <!-- Header del Panel -->
                    <div
                        class="flex justify-between items-center mb-4 lg:mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div>
                            <h2 class="text-lg lg:text-xl font-bold text-gray-800 dark:text-white flex items-center">
                                <Icon name="ri:bar-chart-line" class="mr-2 text-blue-500" />
                                Resumen General
                            </h2>
                            <p class="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-1">Provincia de Cañete</p>
                        </div>
                        <button @click="toggleMobileMenu"
                            class="lg:hidden p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <Icon name="ri:close-line" class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Contenido del resumen -->
                    <div class="space-y-4 lg:space-y-6">
                        <!-- Tarjeta de seguridad -->
                        <div
                            class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 lg:p-4 rounded-lg shadow-sm">
                            <div class="flex justify-between items-center">
                                <h3 class="text-base lg:text-lg font-semibold flex items-center">
                                    <Icon name="ri:shield-flash-line" class="mr-2" />
                                    Seguridad Provincial
                                </h3>
                                <span
                                    class="bg-white bg-opacity-20 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium">
                                    {{ (averageInsecurity * 100).toFixed(0) }}%
                                </span>
                            </div>
                            <p class="text-white text-opacity-90 text-xs lg:text-sm mt-2">
                                {{ getRiskDescription(averageInsecurity) }}
                            </p>
                        </div>

                        <!-- Estadísticas generales -->
                        <div class="grid grid-cols-2 gap-3">
                            <div
                                class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                                <div class="flex items-center">
                                    <div
                                        class="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center mr-2">
                                        <Icon name="ri:user-line" class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <div class="text-xs text-blue-600 dark:text-blue-400 font-medium">Población
                                        </div>
                                        <div class="text-sm lg:text-lg font-bold text-gray-800 dark:text-white">{{
                                            formatNumber(totalPopulation) }}</div>
                                    </div>
                                </div>
                            </div>

                            <div
                                class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800">
                                <div class="flex items-center">
                                    <div
                                        class="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center mr-2">
                                        <Icon name="ri:map-pin-line"
                                            class="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <div class="text-xs text-green-600 dark:text-green-400 font-medium">Distritos
                                        </div>
                                        <div class="text-sm lg:text-lg font-bold text-gray-800 dark:text-white">{{
                                            districtCount }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Distritos con mayor riesgo -->
                        <div class="space-y-4">
                            <h4
                                class="text-md font-semibold text-gray-800 dark:text-white border-b pb-2 flex items-center">
                                <Icon name="ri:alert-line" class="mr-2 text-red-500" />
                                Distritos Críticos
                            </h4>

                            <div class="space-y-2">
                                <div v-for="district in highRiskDistricts" :key="district.distrito"
                                    class="flex justify-between items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                    @click="showDistrictDetails(district.distrito)">
                                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ district.distrito
                                        }}</span>
                                    <span class="text-sm font-semibold" :class="getTextColor(district.inseguridad)">
                                        {{ (district.inseguridad * 100).toFixed(0) }}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <!-- Área del Mapa -->
            <div class="flex-1 flex flex-col relative">
                <!-- Estados de carga y error -->
                <div v-if="loading"
                    class="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-20">
                    <div class="text-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p class="text-gray-600 dark:text-gray-400">Cargando mapa...</p>
                    </div>
                </div>

                <div v-else-if="error"
                    class="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-20">
                    <div class="text-center max-w-md p-6">
                        <Icon name="ri:alert-line" class="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Error</h3>
                        <p class="text-gray-600 dark:text-gray-300 mb-4">{{ error }}</p>
                        <button @click="initializeMap"
                            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Reintentar
                        </button>
                    </div>
                </div>

                <!-- Contenedor del Mapa -->
                <div id="map-container" class="flex-1 relative">
                    <div id="map" class="absolute inset-0 z-10"></div>
                </div>

                <!-- Botón para abrir reportes en móvil -->
                <button v-if="selectedDistrict && !showReportsPanel" @click="toggleReportsPanel"
                    class="lg:hidden fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-10">
                    <Icon name="ri:file-text-line" class="w-6 h-6" />
                </button>
            </div>

            <!-- Panel de Reportes (Derecha) -->
            <div :class="[
                'bg-white dark:bg-gray-800 shadow-xl border-l dark:border-gray-700 overflow-y-auto transition-all duration-300',
                'lg:w-96 lg:relative lg:translate-x-0',
                showReportsPanel ? 'fixed inset-y-0 right-0 w-full sm:w-96 z-50' : 'hidden lg:block w-0'
            ]">
                <div class="h-full flex flex-col">
                    <!-- Header del Panel de Reportes -->
                    <div class="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
                        <div class="flex justify-between items-center">
                            <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                                <Icon name="ri:file-text-line" class="mr-2 text-blue-500" />
                                {{ selectedDistrict || 'Reportes' }}
                            </h2>
                            <button @click="toggleReportsPanel"
                                class="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                <Icon name="ri:close-line" class="w-5 h-5" />
                            </button>
                        </div>
                        <p v-if="selectedDistrictInfo" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Estadísticas del distrito
                        </p>
                    </div>

                    <!-- Contenido de Reportes -->
                    <div class="flex-1 overflow-y-auto">
                        <div v-if="selectedDistrict" class="p-4">
                            <!-- Información del distrito -->
                            <div v-if="selectedDistrictInfo" class="mb-6">
                                <div class="bg-gradient-to-r text-white p-4 rounded-lg shadow-sm mb-4"
                                    :class="getRiskGradient(selectedDistrictInfo.inseguridad)">
                                    <div class="flex justify-between items-center">
                                        <h3 class="text-base font-semibold">Nivel de Riesgo</h3>
                                        <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                                            {{ (selectedDistrictInfo.inseguridad * 100).toFixed(0) }}%
                                        </span>
                                    </div>
                                    <p class="text-white text-opacity-90 text-sm mt-1">
                                        {{ getRiskDescription(selectedDistrictInfo.inseguridad) }}
                                    </p>
                                </div>

                                <!-- Estadísticas rápidas -->
                                <div class="grid grid-cols-3 gap-2 text-center mb-4">
                                    <div class="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                                        <div class="text-xs text-blue-600 dark:text-blue-400">Población</div>
                                        <div class="text-sm font-bold text-gray-800 dark:text-white">
                                            {{ formatNumber(selectedDistrictInfo.poblacion) }}
                                        </div>
                                    </div>
                                    <div class="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg">
                                        <div class="text-xs text-orange-600 dark:text-orange-400">Densidad</div>
                                        <div class="text-sm font-bold text-gray-800 dark:text-white">
                                            {{ formatNumber(Math.round(selectedDistrictInfo.poblacion / 500)) }}
                                        </div>
                                    </div>
                                    <div class="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                                        <div class="text-xs text-green-600 dark:text-green-400">Ranking</div>
                                        <div class="text-sm font-bold text-gray-800 dark:text-white">
                                            #{{ getDistrictRank(selectedDistrictInfo.distrito) }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Estadísticas de incidencias -->
                            <div class="space-y-4">
                                <h4 class="font-semibold text-gray-800 dark:text-white flex items-center">
                                    <Icon name="ri:bar-chart-2-line" class="mr-2 text-blue-500" />
                                    Estadísticas de Incidencias
                                </h4>

                                <div v-if="selectedDistrictInfo" class="space-y-4">
                                    <!-- Inseguridad -->
                                    <div
                                        class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                        <div class="flex justify-between items-center mb-2">
                                            <div class="flex items-center">
                                                <Icon name="ri:shield-flash-line" class="mr-2 text-red-500" />
                                                <span
                                                    class="font-medium text-gray-800 dark:text-white">Inseguridad</span>
                                            </div>
                                            <span class="text-lg font-bold"
                                                :class="getTextColor(selectedDistrictInfo.inseguridad)">
                                                {{ (selectedDistrictInfo.inseguridad * 100).toFixed(0) }}%
                                            </span>
                                        </div>
                                        <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                            <div class="h-2 rounded-full"
                                                :class="getRiskGradient(selectedDistrictInfo.inseguridad).replace('from-', 'bg-gradient-to-r ')"
                                                :style="{ width: (selectedDistrictInfo.inseguridad * 100) + '%' }">
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Contaminación -->
                                    <div
                                        class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                        <div class="flex justify-between items-center mb-2">
                                            <div class="flex items-center">
                                                <Icon name="ri:leaf-line" class="mr-2 text-green-500" />
                                                <span
                                                    class="font-medium text-gray-800 dark:text-white">Contaminación</span>
                                            </div>
                                            <span class="text-lg font-bold text-gray-800 dark:text-white">
                                                {{ (selectedDistrictInfo.contaminacion * 100).toFixed(0) }}%
                                            </span>
                                        </div>
                                        <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                            <div class="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600"
                                                :style="{ width: (selectedDistrictInfo.contaminacion * 100) + '%' }">
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Ruido -->
                                    <div
                                        class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                        <div class="flex justify-between items-center mb-2">
                                            <div class="flex items-center">
                                                <Icon name="ri:volume-up-line" class="mr-2 text-purple-500" />
                                                <span class="font-medium text-gray-800 dark:text-white">Ruido</span>
                                            </div>
                                            <span class="text-lg font-bold text-gray-800 dark:text-white">
                                                {{ (selectedDistrictInfo.ruido * 100).toFixed(0) }}%
                                            </span>
                                        </div>
                                        <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                            <div class="h-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
                                                :style="{ width: (selectedDistrictInfo.ruido * 100) + '%' }"></div>
                                        </div>
                                    </div>
                                </div>

                                <div v-else class="text-center py-8">
                                    <Icon name="ri:file-search-line" class="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p class="text-gray-500 dark:text-gray-400 text-sm">No hay datos para este distrito
                                    </p>
                                </div>
                            </div>

                            <!-- Comparación con promedios -->
                            <div class="mt-6 pt-4 border-t dark:border-gray-600">
                                <h4 class="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                                    <Icon name="ri:line-chart-line" class="mr-2 text-blue-500" />
                                    Comparación Provincial
                                </h4>
                                <div class="space-y-3">
                                    <div v-if="selectedDistrictInfo" class="space-y-3">
                                        <div class="flex justify-between items-center">
                                            <span class="text-sm text-gray-700 dark:text-gray-300">Inseguridad</span>
                                            <div class="flex items-center">
                                                <span class="text-sm font-medium mr-2">{{
                                                    (selectedDistrictInfo.inseguridad * 100).toFixed(0) }}%</span>
                                                <Icon
                                                    :name="selectedDistrictInfo.inseguridad > averageInsecurity ? 'ri:arrow-up-line text-red-500' : 'ri:arrow-down-line text-green-500'"
                                                    class="w-4 h-4" />
                                                <span class="text-xs ml-1"
                                                    :class="selectedDistrictInfo.inseguridad > averageInsecurity ? 'text-red-500' : 'text-green-500'">
                                                    {{ Math.abs((selectedDistrictInfo.inseguridad - averageInsecurity) *
                                                        100).toFixed(1) }}%
                                                </span>
                                            </div>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span class="text-sm text-gray-700 dark:text-gray-300">Contaminación</span>
                                            <div class="flex items-center">
                                                <span class="text-sm font-medium mr-2">{{
                                                    (selectedDistrictInfo.contaminacion * 100).toFixed(0) }}%</span>
                                                <Icon
                                                    :name="selectedDistrictInfo.contaminacion > averageContamination ? 'ri:arrow-up-line text-red-500' : 'ri:arrow-down-line text-green-500'"
                                                    class="w-4 h-4" />
                                                <span class="text-xs ml-1"
                                                    :class="selectedDistrictInfo.contaminacion > averageContamination ? 'text-red-500' : 'text-green-500'">
                                                    {{ Math.abs((selectedDistrictInfo.contaminacion -
                                                        averageContamination) * 100).toFixed(1) }}%
                                                </span>
                                            </div>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span class="text-sm text-gray-700 dark:text-gray-300">Ruido</span>
                                            <div class="flex items-center">
                                                <span class="text-sm font-medium mr-2">{{ (selectedDistrictInfo.ruido *
                                                    100).toFixed(0) }}%</span>
                                                <Icon
                                                    :name="selectedDistrictInfo.ruido > averageNoise ? 'ri:arrow-up-line text-red-500' : 'ri:arrow-down-line text-green-500'"
                                                    class="w-4 h-4" />
                                                <span class="text-xs ml-1"
                                                    :class="selectedDistrictInfo.ruido > averageNoise ? 'text-red-500' : 'text-green-500'">
                                                    {{ Math.abs((selectedDistrictInfo.ruido - averageNoise) *
                                                        100).toFixed(1) }}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Sin distrito seleccionado -->
                        <div v-else class="flex-1 flex items-center justify-center p-6">
                            <div class="text-center">
                                <Icon name="ri:map-pin-line" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-2">Selecciona un
                                    distrito</h3>
                                <p class="text-gray-600 dark:text-gray-400 text-sm">
                                    Haz clic en cualquier distrito del mapa para ver sus estadísticas
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Overlay para panel de reportes en móvil -->
            <div v-if="showReportsPanel && selectedDistrict" @click="toggleReportsPanel"
                class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
            </div>
        </div>


    </div>
</template>

<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { onMounted, ref, computed, nextTick } from 'vue'

// Tipos
interface DistrictInfo {
    distrito: string
    poblacion: number
    inseguridad: number
    contaminacion: number
    ruido: number
}

// Estado
const mobileMenuOpen = ref(false)
const showReportsPanel = ref(false)
const selectedDistrict = ref('')
const selectedDistrictInfo = ref<DistrictInfo | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const darkMode = ref(false)
const lastUpdate = ref(new Date().toLocaleDateString('es-ES'))
const indicadoresData = ref<DistrictInfo[]>([])
const districtLabelsLayer = ref<L.LayerGroup | null>(null)
const districtModalOpen = ref(false)

let map: L.Map | null = null
let geoJsonLayer: L.GeoJSON | null = null

// Computed
const totalPopulation = computed(() => {
    return indicadoresData.value.reduce((sum, district) => sum + district.poblacion, 0)
})

const districtCount = computed(() => indicadoresData.value.length)

const averageInsecurity = computed(() => {
    if (indicadoresData.value.length === 0) return 0
    return indicadoresData.value.reduce((sum, district) => sum + district.inseguridad, 0) / indicadoresData.value.length
})

const averageContamination = computed(() => {
    if (indicadoresData.value.length === 0) return 0
    return indicadoresData.value.reduce((sum, district) => sum + district.contaminacion, 0) / indicadoresData.value.length
})

const averageNoise = computed(() => {
    if (indicadoresData.value.length === 0) return 0
    return indicadoresData.value.reduce((sum, district) => sum + district.ruido, 0) / indicadoresData.value.length
})

const highRiskDistricts = computed(() => {
    return [...indicadoresData.value]
        .sort((a, b) => b.inseguridad - a.inseguridad)
        .slice(0, 5)
})

// Funciones de utilidad
const getDistrictInfo = (districtName: string): DistrictInfo | null => {
    return indicadoresData.value.find(
        item => item.distrito.toLowerCase() === districtName.toLowerCase()
    ) || null
}

const getDistrictRank = (districtName: string): number => {
    const sorted = [...indicadoresData.value].sort((a, b) => b.inseguridad - a.inseguridad)
    const index = sorted.findIndex(d => d.distrito === districtName)
    return index + 1
}

const getRiskColor = (inseguridad: number): string => {
    if (inseguridad < 0.3) return '#22c55e'
    if (inseguridad < 0.5) return '#eab308'
    if (inseguridad < 0.7) return '#f97316'
    return '#ef4444'
}

const getTextColor = (inseguridad: number): string => {
    if (inseguridad < 0.3) return 'text-green-600 dark:text-green-400'
    if (inseguridad < 0.5) return 'text-yellow-600 dark:text-yellow-400'
    if (inseguridad < 0.7) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
}

const getRiskGradient = (inseguridad: number): string => {
    if (inseguridad < 0.3) return 'from-green-400 to-green-600'
    if (inseguridad < 0.5) return 'from-yellow-400 to-yellow-600'
    if (inseguridad < 0.7) return 'from-orange-400 to-orange-600'
    return 'from-red-500 to-red-700'
}

const getRiskDescription = (inseguridad: number): string => {
    if (inseguridad < 0.3) return 'Bajo nivel de inseguridad'
    if (inseguridad < 0.5) return 'Nivel moderado de inseguridad'
    if (inseguridad < 0.7) return 'Alto nivel de inseguridad'
    return 'Nivel muy alto de inseguridad'
}

const formatNumber = (num: number): string => num.toLocaleString('es-ES')
const formatDate = (date: string): string => new Date(date).toLocaleDateString('es-ES')

// Funciones de UI
const toggleMobileMenu = () => mobileMenuOpen.value = !mobileMenuOpen.value
const toggleReportsPanel = () => showReportsPanel.value = !showReportsPanel.value

const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
    document.documentElement.classList.toggle('dark', darkMode.value)
}

const showDistrictDetails = (districtName: string) => {
    selectedDistrict.value = districtName
    selectedDistrictInfo.value = getDistrictInfo(districtName)

    // En móvil, cerrar el menú izquierdo y abrir reportes
    if (window.innerWidth < 1024) {
        mobileMenuOpen.value = false
        showReportsPanel.value = true
    } else {
        showReportsPanel.value = true
    }

    // Abrir modal en todas las pantallas
    districtModalOpen.value = true
}

const closeDistrictModal = () => {
    districtModalOpen.value = false
}

// Función para agregar etiquetas a los distritos
const addDistrictLabels = (geojson: any) => {
    if (!map) return

    // Eliminar capa anterior si existe
    if (districtLabelsLayer.value) {
        map.removeLayer(districtLabelsLayer.value)
    }

    districtLabelsLayer.value = L.layerGroup().addTo(map)

    geojson.features.forEach((feature: any) => {
        const districtName = feature.properties?.NOMBDIST
        if (!districtName) return

        // Calcular centroide del polígono
        const coordinates = feature.geometry.coordinates[0]
        const center = coordinates.reduce((acc: [number, number], coord: [number, number]) => {
            return [acc[0] + coord[0], acc[1] + coord[1]]
        }, [0, 0]).map((sum: number) => sum / coordinates.length)

        // Crear etiqueta
        const label = L.marker([center[1], center[0]], {
            icon: L.divIcon({
                html: `
          <div class="px-2 py-1 rounded  text-xs text-gray-800 dark:text-gray-200 ">
            ${districtName}
          </div>
        `,
                className: '',
                iconSize: [120, 24]
            }),
            interactive: false
        })

        districtLabelsLayer.value?.addLayer(label)
    })
}

// Inicialización del mapa
onMounted(() => {
    initializeMap()
})

const initializeMap = async (): Promise<void> => {
    try {
        loading.value = true
        error.value = null

        const mapContainer = document.getElementById('map')
        if (!mapContainer) {
            throw new Error('No se encontró el elemento #map')
        }

        // Crear mapa
        map = L.map(mapContainer, {
            center: [-12.8, -76.5],
            zoom: 10,
            zoomControl: true
        })

        // Capa base
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map)

        // Cargar datos de indicadores
        try {
            const response = await fetch('/data/indicadores.json')
            if (response.ok) {
                indicadoresData.value = await response.json()
            } else {
                // Datos de prueba
                indicadoresData.value = [
                    { distrito: "ASIA", poblacion: 12300, inseguridad: 0.42, contaminacion: 0.31, ruido: 0.21 },
                    { distrito: "CALANGO", poblacion: 3200, inseguridad: 0.18, contaminacion: 0.12, ruido: 0.08 },
                    { distrito: "SAN VICENTE", poblacion: 85000, inseguridad: 0.8, contaminacion: 0.7, ruido: 0.6 },
                    { distrito: "IMPERIAL", poblacion: 72000, inseguridad: 0.6, contaminacion: 0.5, ruido: 0.5 },
                    { distrito: "MALA", poblacion: 35000, inseguridad: 0.5, contaminacion: 0.4, ruido: 0.4 }
                ]
            }
        } catch (e) {
            console.warn('No se pudieron cargar los indicadores:', e)
        }

        // Cargar GeoJSON
        let geojsonData
        try {
            const response = await fetch('/geo/distritos.geojson')
            if (!response.ok) throw new Error('Error cargando GeoJSON')
            geojsonData = await response.json()
        } catch (e) {
            console.error('Error cargando GeoJSON:', e)
            // GeoJSON de prueba simple
            geojsonData = {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        properties: { NOMBDIST: "SAN VICENTE" },
                        geometry: {
                            type: "Polygon",
                            coordinates: [[
                                [-76.7, -12.75], [-76.65, -12.75], [-76.65, -12.7], [-76.7, -12.7], [-76.7, -12.75]
                            ]]
                        }
                    },
                    {
                        type: "Feature",
                        properties: { NOMBDIST: "IMPERIAL" },
                        geometry: {
                            type: "Polygon",
                            coordinates: [[
                                [-76.6, -12.75], [-76.55, -12.75], [-76.55, -12.7], [-76.6, -12.7], [-76.6, -12.75]
                            ]]
                        }
                    },
                    {
                        type: "Feature",
                        properties: { NOMBDIST: "MALA" },
                        geometry: {
                            type: "Polygon",
                            coordinates: [[
                                [-76.65, -12.8], [-76.6, -12.8], [-76.6, -12.75], [-76.65, -12.75], [-76.65, -12.8]
                            ]]
                        }
                    },
                    {
                        type: "Feature",
                        properties: { NOMBDIST: "ASIA" },
                        geometry: {
                            type: "Polygon",
                            coordinates: [[
                                [-76.55, -12.8], [-76.5, -12.8], [-76.5, -12.75], [-76.55, -12.75], [-76.55, -12.8]
                            ]]
                        }
                    },
                    {
                        type: "Feature",
                        properties: { NOMBDIST: "CALANGO" },
                        geometry: {
                            type: "Polygon",
                            coordinates: [[
                                [-76.5, -12.75], [-76.45, -12.75], [-76.45, -12.7], [-76.5, -12.7], [-76.5, -12.75]
                            ]]
                        }
                    }
                ]
            }
        }

        // Añadir GeoJSON al mapa
        if (geojsonData) {
            geoJsonLayer = L.geoJSON(geojsonData, {
                style: (feature) => {
                    const districtName = feature?.properties?.NOMBDIST
                    const districtInfo = indicadoresData.value.find(d =>
                        d.distrito.toLowerCase() === districtName?.toLowerCase()
                    )

                    return {
                        color: '#1f2937',
                        weight: 2,
                        fillColor: districtInfo ? getRiskColor(districtInfo.inseguridad) : '#9ca3af',
                        fillOpacity: 0.7,
                    }
                },
                onEachFeature: (feature, layer) => {
                    const districtName = feature.properties?.NOMBDIST
                    if (districtName) {
                        const districtInfo = getDistrictInfo(districtName)

                        layer.bindTooltip(`
              <div class="font-semibold text-sm">${districtName}</div>
              <div class="text-xs">${districtInfo ? `Riesgo: ${(districtInfo.inseguridad * 100).toFixed(0)}%` : 'Sin datos'}</div>
              <div class="text-xs text-blue-600">Clic para detalles</div>
            `, {
                            permanent: false,
                            direction: 'top',
                            className: 'custom-tooltip'
                        })

                        layer.on('click', () => {
                            showDistrictDetails(districtName)
                        })

                        layer.on('mouseover', function () {
                            this.setStyle({ weight: 3, fillOpacity: 0.8 })
                        })

                        layer.on('mouseout', function () {
                            this.setStyle({ weight: 2, fillOpacity: 0.7 })
                        })
                    }
                }
            }).addTo(map)

            // Añadir etiquetas de nombres
            addDistrictLabels(geojsonData)

            // Ajustar vista
            if (geoJsonLayer.getBounds().isValid()) {
                map.fitBounds(geoJsonLayer.getBounds())
            }
        }

        loading.value = false

    } catch (err) {
        console.error('Error inicializando el mapa:', err)
        error.value = err instanceof Error ? err.message : 'Error desconocido'
        loading.value = false
    }
}
</script>

<style scoped>
#map-container {
    width: 100%;
    height: 100%;
}

#map {
    width: 100%;
    height: 100%;
}

/* Estilos para las etiquetas de distritos */
:deep(.district-label-container) {
    background: transparent !important;
    border: none !important;
}

:deep(.district-label) {
    backdrop-filter: blur(4px);
    transform: translate(-50%, -50%);
    pointer-events: none;
}

/* Responsive */
@media (max-width: 1024px) {
    #summary-panel {
        width: 100%;
        max-width: 320px;
    }
}

/* Dark mode para el mapa */
.dark :deep(.leaflet-container) {
    background-color: #111827;
}

:deep(.leaflet-tooltip) {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    font-family: inherit;
}

.dark :deep(.leaflet-tooltip) {
    background: #1f2937;
    border-color: #374151;
    color: #f9fafb;
}
</style>