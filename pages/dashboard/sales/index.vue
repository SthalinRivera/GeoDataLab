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
        const data = await $fetch('/api/v1/getAllGarbageReport')
        reports.value = data
    } catch (e) {
        errorMsg.value = "❌ Error al cargar reportes"
        console.error(e)
    }

    loading.value = false
}

onMounted(() => {
    cargarReportes()
})
</script>

<template>
    <div class="p-6 max-w-6xl mx-auto">

        <h1 class="text-3xl font-bold mb-6 dark:text-white">
            ♻️ Reportes de Basura
        </h1>

        <UButton class="mb-4" icon="i-heroicons-arrow-path" :loading="loading" @click="cargarReportes">
            Recargar
        </UButton>

        <UAlert v-if="errorMsg" color="red" class="mb-4">{{ errorMsg }}</UAlert>

        <!-- Tabla + Paginación -->
        <GarbageTable :items="reports" />

    </div>
</template>
