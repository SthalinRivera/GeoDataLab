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
    <div class="p-4 max-w-4xl mx-auto">

        <!-- SELECTS -->
        <select v-model="distrito" class="w-full p-3 mb-3 border rounded-lg bg-white dark:bg-gray-800">
            <option value="">Seleccione un distrito</option>
            <option v-for="d in distritosCañete" :key="d" :value="d">{{ d }}</option>
        </select>

        <select v-model="incidencias" multiple class="w-full p-3 mb-3 border rounded-lg bg-white dark:bg-gray-800 h-32">
            <option v-for="op in tiposIncidencia" :key="op" :value="op">{{ op }}</option>
        </select>

        <!-- BUSCADOR -->
        <input v-model="searchQuery" @keyup.enter="buscarNoticias" class="w-full p-3 border rounded-lg dark:bg-gray-800"
            placeholder="Buscar noticias...">

        <button @click="buscarNoticias" class="mt-3 w-full bg-blue-600 text-white p-3 rounded-lg">
            {{ cargando ? 'Buscando...' : 'Buscar Noticias' }}
        </button>

        <!-- LOADING -->
        <div v-if="cargando" class="text-center p-6">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2">Analizando noticias...</p>
        </div>

        <!-- RESULTADOS -->
        <div v-if="data && !cargando" class="space-y-4 mt-4">

            <div class="p-3 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4">
                Se encontraron <strong>{{ data.total }}</strong> noticias
            </div>

            <div v-for="(item, index) in data.noticias" :key="index" class="border p-4 rounded-lg dark:border-gray-700">

                <h2 class="text-lg font-bold">{{ item.noticia.titulo }}</h2>

                <a :href="item.noticia.link" target="_blank" class="text-blue-600 dark:text-blue-300">
                    📰 Ver noticia completa
                </a>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">

                    <div class="bg-blue-100 dark:bg-blue-900 p-3 rounded">
                        <strong>Tipo:</strong> {{ item.analisis.tipo_robo }}
                    </div>

                    <div class="bg-green-100 dark:bg-green-900 p-3 rounded">
                        <strong>Lugar:</strong> {{ item.analisis.lugar }}
                    </div>

                    <div class="bg-yellow-100 dark:bg-yellow-900 p-3 rounded">
                        <strong>Fecha:</strong> {{ item.analisis.fecha_aprox }}
                    </div>

                    <div class="bg-red-100 dark:bg-red-900 p-3 rounded">
                        <strong>Gravedad:</strong> {{ item.analisis.gravedad }}/5
                    </div>

                    <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded md:col-span-2">
                        <strong>Resumen:</strong> {{ item.analisis.resumen }}
                    </div>
                </div>
            </div>

            <!-- BOTÓN GUARDAR -->
            <button @click="guardarResultados" class="mt-6 w-full bg-green-600 text-white p-3 rounded-lg">
                Guardar en Base de Datos & Mostrar JSON
            </button>

        </div>

        <!-- JSON FINAL -->
        <div v-if="jsonFinal" class="mt-6 p-4 bg-gray-100 dark:bg-gray-900 rounded">
            <pre class="text-xs">{{ jsonFinal }}</pre>
        </div>

        <div v-if="guardado" class="mt-3 p-3 bg-green-200 text-green-900 rounded">
            Datos guardados correctamente ✔
        </div>

    </div>
</template>
