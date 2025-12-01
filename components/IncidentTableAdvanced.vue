<!-- components/IncidentTableAdvanced.vue -->
<template>
    <div>
        <!-- Controles de paginación superiores -->
        <div v-if="items.length > 0" class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-4">
                <div class="text-sm text-gray-500">
                    Total: <strong>{{ items.length }}</strong> registros
                </div>

                <USelect v-model="pageSize" :options="pageSizeOptions" size="sm" />
            </div>

            <UPagination v-model="page" :page-count="pageSize" :total="items.length" size="sm" />
        </div>

        <!-- Tabla -->
        <UTable :rows="paginatedItems" :columns="columns" :loading="loading">
            <!-- Tus templates aquí (igual que en la versión anterior) -->
            <template #severity-data="{ row }">
                <UBadge :color="getSeverityColor(row.severity)" variant="soft">
                    {{ getSeverityText(row.severity) }}
                </UBadge>
            </template>

            <template #status-data="{ row }">
                <UBadge :color="getStatusColor(row.status)" variant="subtle">
                    {{ getStatusText(row.status) }}
                </UBadge>
            </template>

            <template #type-data="{ row }">
                <span class="capitalize">
                    {{ getTypeText(row.type) }}
                </span>
            </template>

            <template #actions-data="{ row }">
                <UButton color="gray" variant="ghost" icon="i-heroicons-eye" @click="viewDetails(row)">
                    Ver
                </UButton>
            </template>

            <template #link-data="{ row }">
                <UButton v-if="row.link" :to="row.link" target="_blank" color="primary" variant="ghost"
                    icon="i-heroicons-link">
                    Enlace
                </UButton>
                <span v-else class="text-gray-400">-</span>
            </template>

            <template #createdAt-data="{ row }">
                {{ formatDate(row.createdAt) }}
            </template>
        </UTable>

        <!-- Paginación inferior -->
        <div v-if="items.length > pageSize"
            class="flex justify-between items-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
            <div class="text-sm text-gray-500">
                Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ items.length }} registros
            </div>

            <div class="flex items-center gap-4">
                <span class="text-sm text-gray-500">
                    Página {{ page }} de {{ totalPages }}
                </span>
                <UPagination v-model="page" :page-count="pageSize" :total="items.length" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface IncidentReport {
    id: number;
    title: string;
    description: string;
    type: string;
    severity: string;
    status: string;
    latitude: number;
    longitude: number;
    address: string;
    districtId: number;
    locationId: number | null;
    userId: number;
    link: string | null;
    createdAt: string;
    updatedAt: string;
}

const props = defineProps<{
    items: IncidentReport[];
    loading?: boolean;
}>();

const page = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [5, 10, 20, 50].map(size => ({ value: size, label: `${size} por página` }));

// Calcular total de páginas
const totalPages = computed(() => Math.ceil(props.items.length / pageSize.value));

// Calcular elementos paginados
const paginatedItems = computed(() => {
    const start = (page.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return props.items.slice(start, end);
});

// Calcular índices para el texto
const startIndex = computed(() => (page.value - 1) * pageSize.value);
const endIndex = computed(() => {
    const end = startIndex.value + pageSize.value;
    return end > props.items.length ? props.items.length : end;
});

// Resetear a página 1 cuando cambien los items o el pageSize
watch([() => props.items, pageSize], () => {
    page.value = 1;
});

// Columnas y funciones de utilidad (igual que en la versión anterior)
const columns = [
    // ... mismas columnas que antes
];

const getSeverityText = (severity: string) => {
    const severityMap: { [key: string]: string } = {
        'LOW': 'Baja',
        'MEDIUM': 'Media',
        'HIGH': 'Alta',
        'CRITICAL': 'Crítica'
    };
    return severityMap[severity] || severity;
};

const getSeverityColor = (severity: string) => {
    const colorMap: { [key: string]: string } = {
        'LOW': 'green',
        'MEDIUM': 'yellow',
        'HIGH': 'orange',
        'CRITICAL': 'red'
    };
    return colorMap[severity] || 'gray';
};

const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
        'PENDING': 'Pendiente',
        'IN_PROGRESS': 'En Progreso',
        'RESOLVED': 'Resuelto',
        'CANCELLED': 'Cancelado'
    };
    return statusMap[status] || status;
};

const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
        'PENDING': 'yellow',
        'IN_PROGRESS': 'blue',
        'RESOLVED': 'green',
        'CANCELLED': 'red'
    };
    return colorMap[status] || 'gray';
};

const getTypeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
        'VANDALISM': 'Vandalismo',
        'THEFT': 'Robo',
        'ASSAULT': 'Asalto',
        'OTHER': 'Otro'
    };
    return typeMap[type] || type.toLowerCase();
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const viewDetails = (report: IncidentReport) => {
    console.log('Ver detalles:', report);
};
</script>