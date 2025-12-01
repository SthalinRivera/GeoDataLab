<!-- pages/incidents/index.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const reports = ref([])
const loading = ref(false)
const errorMsg = ref("")

// Configuración de la página
definePageMeta({
    middleware: ['auth'],
    layout: 'dashboard',
});

const cargarReportes = async () => {
    loading.value = true
    errorMsg.value = ""

    try {
        const data = await $fetch('/api/v1/getAllIncidentReport')
        reports.value = data
    } catch (e) {
        errorMsg.value = "❌ Error al cargar reportes de incidentes"
        console.error(e)
    }

    loading.value = false
}

onMounted(() => {
    cargarReportes()
})
</script>

<template>
    <div class="p-6 max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <div>
                <h1 class="text-3xl font-bold dark:text-white">
                    🚨 Reportes de Incidentes
                </h1>
                <p class="text-gray-600 dark:text-gray-400 mt-2">
                    Gestión y seguimiento de incidentes reportados
                </p>
            </div>

            <UButton color="primary" icon="i-heroicons-plus" to="/incidents/create">
                Nuevo Reporte
            </UButton>
        </div>



        <!-- Controles -->
        <div class="flex flex-wrap gap-4 mb-6">
            <UButton icon="i-heroicons-arrow-path" :loading="loading" @click="cargarReportes">
                Recargar
            </UButton>

            <USelect placeholder="Filtrar por estado" :options="[
                { value: '', label: 'Todos los estados' },
                { value: 'PENDING', label: 'Pendiente' },
                { value: 'IN_PROGRESS', label: 'En Progreso' },
                { value: 'RESOLVED', label: 'Resuelto' }
            ]" />

            <USelect placeholder="Filtrar por gravedad" :options="[
                { value: '', label: 'Todas las gravedades' },
                { value: 'LOW', label: 'Baja' },
                { value: 'MEDIUM', label: 'Media' },
                { value: 'HIGH', label: 'Alta' },
                { value: 'CRITICAL', label: 'Crítica' }
            ]" />
        </div>

        <!-- Alertas -->
        <UAlert v-if="errorMsg" color="red" icon="i-heroicons-exclamation-triangle" class="mb-4">
            {{ errorMsg }}
        </UAlert>

        <!-- Tabla de Incidentes -->
        <IncidentTable :items="reports" :loading="loading" />

        <!-- Estado vacío -->
        <div v-if="!loading && reports.length === 0" class="text-center py-12">
            <UIcon name="i-heroicons-document-magnifying-glass" class="text-6xl text-gray-300 mb-4" />
            <h3 class="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No hay reportes de incidentes
            </h3>
            <p class="text-gray-500 mb-4">
                No se han encontrado reportes de incidentes en el sistema.
            </p>
            <UButton color="primary" icon="i-heroicons-plus" to="/incidents/create">
                Crear Primer Reporte
            </UButton>
        </div>
    </div>
</template>