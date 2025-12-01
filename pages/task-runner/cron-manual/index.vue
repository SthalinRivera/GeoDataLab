<script setup lang="ts">
import { ref, onMounted } from 'vue'

const searchQuery = ref('robos en cañete perú')
const distrito = ref('')
const incidencias = ref<string[]>([])
const data = ref<any>(null)
const cargando = ref(false)
const jsonFinal = ref(null)
const guardado = ref(false)

const distritosCañete = [
    "San Vicente",
    "Imperial",
    "Nuevo Imperial",
    "Quilmaná",
    "Mala",
    "Asia",
    "Cerro Azul",
    "San Luis"
]

const tiposIncidencia = [
    "Robos",
    "Asaltos",
    "Hurtos",
    "Vandalismo",
    "Accidentes",
    "Otros"
]

const buscarNoticias = async () => {
    if (!searchQuery.value.trim()) return

    cargando.value = true
    try {
        data.value = await $fetch(`/api/analizar?q=${encodeURIComponent(searchQuery.value)}`)
    } catch (error) {
        console.error(error)
    } finally {
        cargando.value = false
    }
}

const guardarResultados = async () => {
    jsonFinal.value = {
        distrito: distrito.value,
        incidencias: incidencias.value,
        busqueda: searchQuery.value,
        resultados: data.value
    }

    const res = await $fetch('/api/v1/addIncidentReport', {
        method: 'POST',
        body: jsonFinal.value
    })

    guardado.value = true
    setTimeout(() => guardado.value = false, 3000)
}

onMounted(() => buscarNoticias())
</script>

<template>
    <div
        class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 p-6">
        <div class="max-w-6xl mx-auto">

            <!-- HEADER -->
            <div class="text-center mb-8">
                <h1
                    class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
                    🔍 Analizador de Noticias
                </h1>
                <p class="text-lg text-gray-600 dark:text-gray-300">
                    Sistema de búsqueda y análisis automatizado de incidentes
                </p>
            </div>

            <!-- MAIN GRID LAYOUT -->
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">

                <!-- LEFT COLUMN - FILTROS Y CONTROLES -->
                <div class="space-y-6">
                    <!-- DISTRITO CARD -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div class="p-6">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                    <span class="text-white text-lg">📍</span>
                                </div>
                                <div>
                                    <h3 class="font-bold text-gray-800 dark:text-white">Distrito</h3>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Seleccione ubicación</p>
                                </div>
                            </div>
                            <select v-model="distrito"
                                class="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                                <option value="">Seleccione un distrito</option>
                                <option v-for="d in distritosCañete" :key="d" :value="d">{{ d }}</option>
                            </select>
                        </div>
                    </div>

                    <!-- INCIDENCIAS CARD -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div class="p-6">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                                    <span class="text-white text-lg">⚠️</span>
                                </div>
                                <div>
                                    <h3 class="font-bold text-gray-800 dark:text-white">Tipos de Incidencia</h3>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Seleccione múltiples</p>
                                </div>
                            </div>
                            <select v-model="incidencias" multiple
                                class="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white h-48 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all">
                                <option v-for="op in tiposIncidencia" :key="op" :value="op">{{ op }}</option>
                            </select>
                        </div>
                    </div>

                    <!-- BÚSQUEDA CARD -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div class="p-6">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                                    <span class="text-white text-lg">🔎</span>
                                </div>
                                <div>
                                    <h3 class="font-bold text-gray-800 dark:text-white">Término de Búsqueda</h3>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Palabras clave</p>
                                </div>
                            </div>
                            <input v-model="searchQuery" @keyup.enter="buscarNoticias"
                                class="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="Ej: robos en cañete perú">

                            <button @click="buscarNoticias" :disabled="cargando"
                                class="w-full mt-4 p-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-3">
                                <span class="text-xl">{{ cargando ? '⏳' : '🚀' }}</span>
                                <span>{{ cargando ? 'Buscando...' : 'Ejecutar Búsqueda' }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- CENTER COLUMN - RESULTADOS -->
                <div class="xl:col-span-2 space-y-6">

                    <!-- LOADING STATE -->
                    <div v-if="cargando"
                        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8">
                        <div class="text-center space-y-4">
                            <div
                                class="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center animate-pulse">
                                <span class="text-2xl text-white">🤖</span>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Analizando Noticias
                                </h3>
                                <p class="text-gray-600 dark:text-gray-400">Procesando información con IA...</p>
                            </div>
                            <div class="w-24 h-2 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    <!-- RESULTS -->
                    <div v-if="data && !cargando" class="space-y-6">

                        <!-- SUMMARY CARD -->
                        <div class="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-xl p-6 text-white">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-2xl font-bold">Resultados Encontrados</h3>
                                    <p class="text-blue-100">{{ data.total }} noticias analizadas</p>
                                </div>
                                <div class="text-3xl">📊</div>
                            </div>
                        </div>

                        <!-- NEWS CARDS -->
                        <div v-for="(item, index) in data.noticias" :key="index"
                            class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">

                            <!-- News Header -->
                            <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                                <div class="flex items-start justify-between">
                                    <h2 class="text-xl font-bold text-gray-800 dark:text-white leading-tight pr-4">
                                        {{ item.noticia.titulo }}
                                    </h2>
                                    <a :href="item.noticia.link" target="_blank"
                                        class="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-200">
                                        <span>📰</span>
                                        <span class="text-sm">Ver Noticia</span>
                                    </a>
                                </div>
                            </div>

                            <!-- Analysis Grid -->
                            <div class="p-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                    <div
                                        class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                                        <div class="text-blue-600 dark:text-blue-400 text-sm font-semibold mb-1">Tipo
                                        </div>
                                        <div class="text-gray-800 dark:text-white font-bold">{{ item.analisis.tipo_robo
                                        }}</div>
                                    </div>
                                    <div
                                        class="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                                        <div class="text-green-600 dark:text-green-400 text-sm font-semibold mb-1">Lugar
                                        </div>
                                        <div class="text-gray-800 dark:text-white font-bold">{{ item.analisis.lugar }}
                                        </div>
                                    </div>
                                    <div
                                        class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800">
                                        <div class="text-yellow-600 dark:text-yellow-400 text-sm font-semibold mb-1">
                                            Fecha</div>
                                        <div class="text-gray-800 dark:text-white font-bold">{{
                                            item.analisis.fecha_aprox }}</div>
                                    </div>
                                    <div
                                        class="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
                                        <div class="text-red-600 dark:text-red-400 text-sm font-semibold mb-1">Gravedad
                                        </div>
                                        <div class="text-gray-800 dark:text-white font-bold">
                                            <span class="text-lg">{{ item.analisis.gravedad }}/5</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Summary -->
                                <div
                                    class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                                    <div class="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Resumen del
                                        Análisis</div>
                                    <div class="text-gray-800 dark:text-gray-200 leading-relaxed">
                                        {{ item.analisis.resumen }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- SAVE BUTTON -->
                        <button @click="guardarResultados"
                            class="w-full p-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3">
                            <span class="text-xl">💾</span>
                            <span>Guardar en Base de Datos</span>
                        </button>

                        <!-- SUCCESS MESSAGE -->
                        <div v-if="guardado"
                            class="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg p-6 text-white">
                            <div class="flex items-center gap-3">
                                <span class="text-2xl">✅</span>
                                <div>
                                    <h3 class="font-bold text-lg">Datos Guardados Correctamente</h3>
                                    <p class="text-green-100">La información ha sido almacenada en la base de datos</p>
                                </div>
                            </div>
                        </div>

                        <!-- JSON PREVIEW -->
                        <div v-if="jsonFinal" class="bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
                            <div class="bg-gray-800 px-6 py-4 border-b border-gray-700">
                                <div class="flex items-center gap-3 text-white">
                                    <span class="text-xl">📄</span>
                                    <span class="font-bold">JSON Final Generado</span>
                                </div>
                            </div>
                            <div class="p-6">
                                <pre
                                    class="text-green-400 text-sm overflow-auto max-h-96 bg-gray-800 rounded-lg p-4 border border-gray-700">{{ jsonFinal }}</pre>
                            </div>
                        </div>
                    </div>

                    <!-- EMPTY STATE -->
                    <div v-if="!data && !cargando"
                        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-12 text-center">
                        <div
                            class="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-6">
                            <span class="text-3xl">🔍</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Listo para Buscar</h3>
                        <p class="text-gray-600 dark:text-gray-400">Configure los filtros y ejecute la búsqueda para
                            analizar noticias</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Custom scrollbar */
select[multiple]::-webkit-scrollbar {
    width: 6px;
}

select[multiple]::-webkit-scrollbar-track {
    background: rgba(241, 245, 249, 0.5);
    border-radius: 3px;
}

select[multiple]::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.5);
    border-radius: 3px;
}

select[multiple]::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.7);
}

.dark select[multiple]::-webkit-scrollbar-track {
    background: rgba(30, 41, 59, 0.3);
}

.dark select[multiple]::-webkit-scrollbar-thumb {
    background: rgba(100, 116, 139, 0.5);
}

.dark select[multiple]::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 116, 139, 0.7);
}

/* Smooth transitions */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
}
</style>