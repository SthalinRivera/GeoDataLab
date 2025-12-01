<!-- components/IncidentTable.vue -->
<template>
    <div>
        <UTable :rows="paginatedItems" :columns="columns" :loading="loading">
            <!-- Columna de Severidad con badge -->
            <template #severity-data="{ row }">
                <UBadge :color="getSeverityColor(row.severity)" variant="soft">
                    {{ getSeverityText(row.severity) }}
                </UBadge>
            </template>

            <!-- Columna de Estado -->
            <template #status-data="{ row }">
                <UBadge :color="getStatusColor(row.status)" variant="subtle">
                    {{ getStatusText(row.status) }}
                </UBadge>
            </template>

            <!-- Columna de Tipo -->
            <template #type-data="{ row }">
                <span class="capitalize">
                    {{ getTypeText(row.type) }}
                </span>
            </template>

            <!-- Columna de Acciones -->
            <template #actions-data="{ row }">
                <UButton color="gray" variant="ghost" icon="i-heroicons-eye" @click="viewDetails(row)">
                    Ver
                </UButton>
            </template>

            <!-- Columna de Enlace -->
            <template #link-data="{ row }">
                <UButton v-if="row.link" :to="row.link" target="_blank" color="primary" variant="ghost"
                    icon="i-heroicons-link">
                    Enlace
                </UButton>
                <span v-else class="text-gray-400">-</span>
            </template>

            <!-- Columna de Fecha -->
            <template #createdAt-data="{ row }">
                {{ formatDate(row.createdAt) }}
            </template>
        </UTable>

        <!-- Paginación -->
        <div v-if="items.length > pageCount"
            class="flex justify-between items-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
            <div class="text-sm text-gray-500">
                Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ items.length }} registros
            </div>
            <UPagination v-model="page" :page-count="pageCount" :total="items.length" />
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
const pageCount = 10; // Número de elementos por página

// Calcular los elementos paginados
const paginatedItems = computed(() => {
    const start = (page.value - 1) * pageCount;
    const end = start + pageCount;
    return props.items.slice(start, end);
});

// Calcular índices para el texto de "Mostrando X-Y de Z"
const startIndex = computed(() => (page.value - 1) * pageCount);
const endIndex = computed(() => {
    const end = startIndex.value + pageCount;
    return end > props.items.length ? props.items.length : end;
});

// Configuración de columnas
const columns = [
    {
        key: 'id',
        label: 'ID',
        sortable: true
    },
    {
        key: 'title',
        label: 'Título',
        sortable: true
    },
    {
        key: 'type',
        label: 'Tipo',
        sortable: true
    },
    {
        key: 'severity',
        label: 'Gravedad',
        sortable: true
    },
    {
        key: 'status',
        label: 'Estado',
        sortable: true
    },
    {
        key: 'address',
        label: 'Dirección',
        sortable: true
    },
    {
        key: 'link',
        label: 'Enlace'
    },
    {
        key: 'createdAt',
        label: 'Fecha',
        sortable: true
    },
    {
        key: 'actions',
        label: 'Acciones'
    }
];

// Funciones de utilidad para mostrar textos legibles
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
    // Navegar a la página de detalles o mostrar modal
    console.log('Ver detalles:', report);
    // Ejemplo: navigateTo(`/incidents/${report.id}`)
};
</script>