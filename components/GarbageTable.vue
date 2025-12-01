<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
    items: { type: Array, required: true }
})

/* --- CONFIGURACIÓN DE PAGINACIÓN --- */
const page = ref(1)
const perPage = ref(10)

const totalItems = computed(() => props.items.length)
const totalPages = computed(() =>
    Math.ceil(totalItems.value / perPage.value)
)

/* --- DATOS DE LA PÁGINA ACTUAL --- */
const paginatedData = computed(() => {
    const start = (page.value - 1) * perPage.value
    const end = start + perPage.value
    return props.items.slice(start, end)
})

/* --- CONTROLES DE PAGINACIÓN --- */
const siguiente = () => {
    if (page.value < totalPages.value) page.value++
}
const anterior = () => {
    if (page.value > 1) page.value--
}
const primero = () => (page.value = 1)
const ultimo = () => (page.value = totalPages.value)

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Título' },
    { key: 'type', label: 'Tipo' },
    { key: 'severity', label: 'Severidad' },
    { key: 'status', label: 'Estado' },
    { key: 'address', label: 'Dirección' },
    { key: 'createdAt', label: 'Fecha' }
]

const formatDate = (d) => new Date(d).toLocaleString()
</script>

<template>
    <div>

        <!-- Tabla -->
        <UTable :rows="paginatedData" :columns="columns" class="rounded-xl dark:bg-gray-900">

            <template #cell(severity)="{ row }">
                <UBadge :color="row.severity === 'HIGH' ? 'red' :
                    row.severity === 'MEDIUM' ? 'yellow' : 'green'">
                    {{ row.severity }}
                </UBadge>
            </template>

            <template #cell(status)="{ row }">
                <UBadge :color="row.status === 'PENDING' ? 'gray' :
                    row.status === 'IN_PROGRESS' ? 'blue' : 'green'">
                    {{ row.status }}
                </UBadge>
            </template>

            <template #cell(createdAt)="{ row }">
                {{ formatDate(row.createdAt) }}
            </template>

        </UTable>

        <!-- Si no hay datos -->
        <div v-if="props.items.length === 0" class="text-center py-10 text-gray-500 dark:text-gray-400">
            No hay reportes para mostrar.
        </div>

        <!-- CONTROLES DE PAGINACIÓN -->
        <div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">

            <!-- selector por página -->
            <div class="flex items-center gap-2">
                <span class="text-sm dark:text-gray-300">Mostrar:</span>

                <USelect v-model="perPage" :options="[5, 10, 20, 50]" class="w-20" />
                <span class="text-sm dark:text-gray-300">por página</span>
            </div>

            <!-- botones -->
            <div class="flex items-center gap-2">

                <UButton @click="primero" :disabled="page === 1">« Primero</UButton>
                <UButton @click="anterior" :disabled="page === 1">‹ Anterior</UButton>

                <span class="px-4 text-sm dark:text-gray-200">
                    Página {{ page }} de {{ totalPages }}
                </span>

                <UButton @click="siguiente" :disabled="page === totalPages">Siguiente ›</UButton>
                <UButton @click="ultimo" :disabled="page === totalPages">Último »</UButton>

            </div>

        </div>

    </div>
</template>
