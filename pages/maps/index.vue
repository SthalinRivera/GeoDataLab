<script lang="ts" setup>
// Interfaces para los reportes y fotos
interface Photo {
    id: number;
    url: string;
    caption?: string;
    type: string;
    createdAt: string;
}

interface GarbageReport {
    id: number;
    title: string;
    description: string;
    type: string;
    severity: string;
    status: string;
    address?: string;
    latitude: number;
    longitude: number;
    createdAt: string;
    district: {
        name: string;
    };
    user: {
        name: string;
    };
    photos: Photo[]; // Agregar esta línea
}

// Cargar datos
const { data: garbageReports, pending, error } = await useFetch<GarbageReport[]>("/api/v1/getAllGarbageReportPhotos");
console.log("vemos si llega la data ", garbageReports);

// Referencia para el mapa
const mapContainer = ref<HTMLElement>();
let map: L.Map | null = null;

// Estado para el panel lateral
const showSidePanel = ref(false);
const selectedReport = ref<GarbageReport | null>(null);

// Estado para modo oscuro
const isDarkMode = ref(false);

// Estado para controlar la foto seleccionada en el carrusel
const selectedPhotoIndex = ref(0);

// Estado para controlar la visibilidad del panel de estadísticas en móvil
const showStatsPanel = ref(false);

// Definiciones de tipos con iconos (mantener igual)
const garbageTypes = [
    { value: 'ORGANIC', label: 'Orgánica', icon: 'ri:leaf-line', color: 'text-green-600', bgColor: 'bg-green-500' },
    { value: 'PLASTIC', label: 'Plástico', icon: 'ri:water-flash-line', color: 'text-blue-600', bgColor: 'bg-blue-500' },
    { value: 'PAPER', label: 'Papel', icon: 'ri:file-paper-line', color: 'text-yellow-600', bgColor: 'bg-yellow-500' },
    { value: 'GLASS', label: 'Vidrio', icon: 'ri:cup-line', color: 'text-cyan-600', bgColor: 'bg-cyan-500' },
    { value: 'METAL', label: 'Metal', icon: 'ri:tools-line', color: 'text-gray-600', bgColor: 'bg-gray-500' },
    { value: 'ELECTRONIC', label: 'Electrónico', icon: 'ri:computer-line', color: 'text-purple-600', bgColor: 'bg-purple-500' },
    { value: 'CONSTRUCTION', label: 'Construcción', icon: 'ri:building-line', color: 'text-orange-600', bgColor: 'bg-orange-500' },
    { value: 'HAZARDOUS', label: 'Peligroso', icon: 'ri:alert-line', color: 'text-red-600', bgColor: 'bg-red-500' },
    { value: 'OTHER', label: 'Otro', icon: 'ri:question-line', color: 'text-indigo-600', bgColor: 'bg-indigo-500' }
];

const severityLevels = [
    { value: 'LOW', label: 'Baja', level: 25, color: 'text-green-600', bgColor: 'bg-green-500', icon: 'ri:signal-wifi-1-line' },
    { value: 'MEDIUM', label: 'Media', level: 50, color: 'text-yellow-600', bgColor: 'bg-yellow-500', icon: 'ri:signal-wifi-2-line' },
    { value: 'HIGH', label: 'Alta', level: 75, color: 'text-orange-600', bgColor: 'bg-orange-500', icon: 'ri:signal-wifi-3-line' },
    { value: 'CRITICAL', label: 'Crítica', level: 100, color: 'text-red-600', bgColor: 'bg-red-500', icon: 'ri:signal-wifi-error-line' }
];

const statusTypes = [
    { value: 'PENDING', label: 'Pendiente', color: 'text-yellow-600', bgColor: 'bg-yellow-500', icon: 'ri:time-line' },
    { value: 'IN_PROGRESS', label: 'En Progreso', color: 'text-blue-600', bgColor: 'bg-blue-500', icon: 'ri:loader-4-line' },
    { value: 'RESOLVED', label: 'Resuelto', color: 'text-green-600', bgColor: 'bg-green-500', icon: 'ri:check-line' }
];
// COMPUTED PARA LOS REPORTES GENERALES
const stats = computed(() => {
    if (!garbageReports.value) return null;

    const reports = garbageReports.value;

    // Reporte por Tipo de Basura
    const byType = reports.reduce((acc, report) => {
        acc[report.type] = (acc[report.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Reporte por Nivel de Severidad
    const bySeverity = reports.reduce((acc, report) => {
        acc[report.severity] = (acc[report.severity] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Reporte por Distrito
    const byDistrict = reports.reduce((acc, report) => {
        acc[report.district.name] = (acc[report.district.name] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Reporte Geográfico
    const latitudes = reports.map(r => r.latitude);
    const longitudes = reports.map(r => r.longitude);

    const geographicReport = {
        norte: Math.max(...latitudes),
        sur: Math.min(...latitudes),
        este: Math.max(...longitudes),
        oeste: Math.min(...longitudes),
        totalZonas: new Set(reports.map(r => `${r.latitude.toFixed(2)},${r.longitude.toFixed(2)}`)).size
    };

    // Estadísticas generales
    const total = reports.length;
    const pending = reports.filter(r => r.status === 'PENDING').length;
    const resolved = reports.filter(r => r.status === 'RESOLVED').length;
    const highSeverity = reports.filter(r => r.severity === 'HIGH' || r.severity === 'CRITICAL').length;

    return {
        // Reportes generales
        total,
        pending,
        resolved,
        highSeverity,

        // Porcentajes
        pendingPercentage: total > 0 ? Math.round((pending / total) * 100) : 0,
        resolvedPercentage: total > 0 ? Math.round((resolved / total) * 100) : 0,
        severityPercentage: total > 0 ? Math.round((highSeverity / total) * 100) : 0,

        // Reportes específicos
        byType,
        bySeverity,
        byDistrict,
        geographicReport
    };
});
// Computed para obtener información del tipo seleccionado (mantener igual)
const currentGarbageType = computed(() => {
    if (!selectedReport.value) return garbageTypes[garbageTypes.length - 1];
    return garbageTypes.find(type => type.value === selectedReport.value?.type) || garbageTypes[garbageTypes.length - 1];
});

const currentSeverity = computed(() => {
    if (!selectedReport.value) return severityLevels[0];
    return severityLevels.find(severity => severity.value === selectedReport.value?.severity) || severityLevels[0];
});

const currentStatus = computed(() => {
    if (!selectedReport.value) return statusTypes[0];
    return statusTypes.find(status => status.value === selectedReport.value?.status) || statusTypes[0];
});

// Computed para las fotos del reporte seleccionado
const selectedReportPhotos = computed(() => {
    return selectedReport.value?.photos || [];
});

// Computed para la foto actual en el carrusel
const currentPhoto = computed(() => {
    if (selectedReportPhotos.value.length === 0) return null;
    return selectedReportPhotos.value[selectedPhotoIndex.value];
});

// Función para navegar en el carrusel de fotos
const nextPhoto = () => {
    if (selectedReportPhotos.value.length > 0) {
        selectedPhotoIndex.value = (selectedPhotoIndex.value + 1) % selectedReportPhotos.value.length;
    }
};

const prevPhoto = () => {
    if (selectedReportPhotos.value.length > 0) {
        selectedPhotoIndex.value = (selectedPhotoIndex.value - 1 + selectedReportPhotos.value.length) % selectedReportPhotos.value.length;
    }
};

const selectPhoto = (index: number) => {
    selectedPhotoIndex.value = index;
};

// Colores según severidad (mantener igual)
const getSeverityColor = (severity: string) => {
    const colors: { [key: string]: string } = {
        LOW: '#10B981',      // green-500
        MEDIUM: '#F59E0B',   // yellow-500
        HIGH: '#EF4444',     // red-500
        CRITICAL: '#8B5CF6'  // purple-500
    };
    return colors[severity] || '#3B82F6';
};

// Función para abrir el panel lateral
const openSidePanel = (report: GarbageReport) => {
    selectedReport.value = report;
    selectedPhotoIndex.value = 0; // Resetear el índice de foto al abrir un nuevo reporte
    showSidePanel.value = true;
};

// Función para cerrar el panel lateral
const closeSidePanel = () => {
    showSidePanel.value = false;
    selectedReport.value = null;
    selectedPhotoIndex.value = 0;
};

// Función para alternar el panel de estadísticas en móvil
const toggleStatsPanel = () => {
    showStatsPanel.value = !showStatsPanel.value;
};

// Inicializar mapa cuando el componente esté montado
onMounted(async () => {
    if (!mapContainer.value) return;

    // Cargar Leaflet
    const L = await import('leaflet');
    await import('leaflet/dist/leaflet.css');

    // Configurar íconos con rutas públicas
    const iconDefault = L.icon({
        iconRetinaUrl: '/marker-icon-2x.png',
        iconUrl: '/marker-icon.png',
        shadowUrl: '/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    L.Marker.prototype.options.icon = iconDefault;

    // Crear mapa - coordenadas corregidas para Perú
    map = L.map(mapContainer.value).setView([-12.0464, -77.0428], 12); // Coordenadas de Lima centradas

    // Capa de tiles para modo claro
    const lightLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
    });

    // Capa de tiles para modo oscuro
    const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
    });

    // Agregar capa inicial
    lightLayer.addTo(map);

    // Agregar marcadores cuando los datos estén disponibles
    if (garbageReports.value) {
        addMarkersToMap(garbageReports.value, L);
    }

    // Watch para modo oscuro
    watch(isDarkMode, (dark) => {
        if (!map) return;

        if (dark) {
            map.removeLayer(lightLayer);
            darkLayer.addTo(map);
        } else {
            map.removeLayer(darkLayer);
            lightLayer.addTo(map);
        }
    });
});

// Función para agregar marcadores al mapa
const addMarkersToMap = (reports: GarbageReport[], L: typeof import('leaflet')) => {
    if (!map) return;

    // Grupo para los marcadores
    const markerGroup = L.layerGroup().addTo(map);

    reports.forEach(report => {
        // Validar coordenadas
        if (!report.latitude || !report.longitude ||
            isNaN(report.latitude) || isNaN(report.longitude) ||
            report.latitude === 0 || report.longitude === 0) {
            console.warn('Coordenadas inválidas para el reporte:', report.id);
            return;
        }

        const color = getSeverityColor(report.severity);

        // Crear marcador circular
        const marker = L.circleMarker([report.latitude, report.longitude], {
            radius: 12,
            color: color,
            fillColor: color,
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        });

        // Efecto hover
        marker.on('mouseover', function (e: L.LeafletEvent) {
            const layer = e.target as L.CircleMarker;
            layer.setStyle({ fillOpacity: 1, weight: 3, radius: 14 });
        });

        marker.on('mouseout', function (e: L.LeafletEvent) {
            const layer = e.target as L.CircleMarker;
            layer.setStyle({ fillOpacity: 0.8, weight: 2, radius: 12 });
        });

        // Al hacer clic, abrir el panel lateral
        marker.on('click', function (e: L.LeafletEvent) {
            openSidePanel(report);

            // Centrar el mapa en el marcador - CORREGIDO: zoom level válido
            map?.setView([report.latitude, report.longitude], 15);
        });

        marker.addTo(markerGroup);

        // Tooltip simple
        marker.bindTooltip(report.title, {
            permanent: false,
            direction: 'top',
            offset: [0, -10]
        });
    });

    // Ajustar bounds para mostrar todos los marcadores
    if (markerGroup.getLayers().length > 0) {
        const group = new L.FeatureGroup(markerGroup.getLayers());
        map.fitBounds(group.getBounds().pad(0.1));
    }
};

// Watch para cuando los datos cambien
watch(garbageReports, (newReports) => {
    if (newReports && map) {
        // Limpiar marcadores existentes
        map.eachLayer((layer: any) => {
            if (layer instanceof L.LayerGroup) {
                map?.removeLayer(layer);
            }
        });

        // Agregar nuevos marcadores
        import('leaflet').then(L => {
            addMarkersToMap(newReports, L.default);
        });
    }
});

const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement;
    img.src = '/placeholder-image.jpg'; // Imagen de respaldo
    img.alt = 'Imagen no disponible';
};

// Limpiar mapa al desmontar
onUnmounted(() => {
    if (map) {
        map.remove();
        map = null;
    }
});
</script>

<template>
    <div class="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <!-- Panel Lateral de Estadísticas para Desktop -->
        <div
            class="hidden md:block w-80 bg-white dark:bg-gray-800 shadow-xl z-10 overflow-y-auto transition-colors duration-300">
            <div class="p-6">
                <!-- Resumen General con Barras de Progreso -->
                <div class="mb-8">
                    <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                        <Icon name="ri:dashboard-line" class="mr-2 text-blue-500" />
                        Resumen General
                    </h3>
                    <div class="space-y-4">
                        <!-- Total Reportes -->
                        <div
                            class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center">
                                    <Icon name="ri:file-list-line" class="mr-2" />
                                    Total Reportes
                                </span>
                                <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ stats?.total || 0
                                }}</span>
                            </div>
                            <div class="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                                <div class="h-2 rounded-full bg-blue-500 transition-all duration-500"
                                    :style="{ width: '100%' }"></div>
                            </div>
                        </div>

                        <!-- Alta Severidad -->
                        <div
                            class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-sm font-medium text-red-700 dark:text-red-300 flex items-center">
                                    <Icon name="ri:alert-line" class="mr-2" />
                                    Alta Severidad
                                </span>
                                <span class="text-lg font-bold text-red-600 dark:text-red-400">{{ stats?.highSeverity ||
                                    0 }}</span>
                            </div>
                            <div class="w-full bg-red-200 dark:bg-red-800 rounded-full h-2">
                                <div class="h-2 rounded-full bg-red-500 transition-all duration-500"
                                    :style="{ width: `${stats?.severityPercentage || 0}%` }"></div>
                            </div>
                            <p class="text-xs text-red-600 dark:text-red-400 mt-1">
                                {{ stats?.severityPercentage || 0 }}% del total
                            </p>
                        </div>


                    </div>
                </div>

                <!-- Distribución por Tipo -->
                <div class="mb-8">
                    <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                        <Icon name="ri:recycle-line" class="mr-2 text-green-500" />
                        Por Tipo
                    </h3>
                    <div class="space-y-3">
                        <div v-for="(count, type) in stats?.byType" :key="type"
                            class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                            <span class="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                                <Icon :name="garbageTypes.find(t => t.value === type)?.icon || 'ri:question-line'"
                                    class="mr-2"
                                    :class="garbageTypes.find(t => t.value === type)?.color || 'text-gray-500'" />
                                {{garbageTypes.find(t => t.value === type)?.label || type}}
                            </span>
                            <span class="font-semibold text-gray-900 dark:text-white">{{ count }}</span>
                        </div>
                    </div>
                </div>

                <!-- Reporte Geográfico -->
                <div class="mb-8">
                    <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                        <Icon name="ri:earth-line" class="mr-2 text-cyan-500" />
                        Reporte Geográfico
                    </h3>
                    <div class="space-y-3">
                        <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-sm text-gray-700 dark:text-gray-300">Zonas cubiertas</span>
                                <span class="font-semibold text-gray-900 dark:text-white">{{
                                    stats?.geographicReport?.totalZonas || 0 }}</span>
                            </div>
                            <div class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                <div>Norte: {{ stats?.geographicReport?.norte?.toFixed(4) }}</div>
                                <div>Sur: {{ stats?.geographicReport?.sur?.toFixed(4) }}</div>
                                <div>Este: {{ stats?.geographicReport?.este?.toFixed(4) }}</div>
                                <div>Oeste: {{ stats?.geographicReport?.oeste?.toFixed(4) }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Distribución por Distrito -->
                <div class="mb-8">
                    <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                        <Icon name="ri:map-pin-line" class="mr-2 text-purple-500" />
                        Por Distrito
                    </h3>
                    <div class="space-y-3">
                        <div v-for="(count, district) in stats?.byDistrict" :key="district"
                            class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                            <span class="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                                <Icon name="ri:building-line" class="mr-2 text-gray-500" />
                                {{ district }}
                            </span>
                            <span class="font-semibold text-gray-900 dark:text-white">{{ count }}</span>
                        </div>
                    </div>
                </div>

                <!-- Leyenda -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                        <Icon name="ri:palette-line" class="mr-2 text-blue-500" />
                        Leyenda
                    </h3>
                    <div class="space-y-3">
                        <div v-for="severity in severityLevels" :key="severity.value"
                            class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <div class="w-3 h-3 rounded-full" :class="severity.bgColor"></div>
                                <span class="text-sm text-gray-600 dark:text-gray-400">{{ severity.label }}</span>
                            </div>
                            <Icon :name="severity.icon" class="text-sm" :class="severity.color" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Área Principal del Mapa -->
        <div class="flex-1 flex flex-col">
            <!-- Header -->
            <div
                class="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 px-4 md:px-6 py-4 transition-colors">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                            <Icon name="ri:map-pin-line" class="mr-2 text-red-500" />
                            Mapa de Reportes de Basura
                        </h1>
                        <p class="text-sm md:text-base text-gray-600 dark:text-gray-400 flex items-center">
                            <Icon name="ri:information-line" class="mr-1" />
                            Haz clic en cualquier punto para ver los detalles
                        </p>
                    </div>

                    <!-- Botón para mostrar/ocultar estadísticas en móvil -->
                    <button @click="toggleStatsPanel"
                        class="md:hidden bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors flex items-center">
                        <Icon name="ri:bar-chart-line" class="mr-1" />
                        <span>Estadísticas</span>
                    </button>
                </div>
            </div>



            <!-- Estados de carga y error -->
            <div v-if="pending"
                class="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 transition-colors">
                <div class="text-center">
                    <div
                        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mx-auto">
                    </div>
                    <p class="mt-3 text-gray-600 dark:text-gray-400 flex items-center justify-center">
                        <Icon name="ri:loader-4-line" class="animate-spin mr-2" />
                        Cargando mapa...
                    </p>
                </div>
            </div>

            <div v-else-if="error"
                class="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 transition-colors">
                <div
                    class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
                    <div class="flex items-center mb-3">
                        <Icon name="ri:error-warning-line" class="text-red-400 mr-2 text-xl" />
                        <p class="text-red-700 dark:text-red-400 font-semibold">Error al cargar los reportes</p>
                    </div>
                    <p class="text-red-600 dark:text-red-300 text-sm">{{ error.message }}</p>
                </div>
            </div>

            <!-- Contenedor del Mapa -->
            <div v-else ref="mapContainer" class="flex-1 z-30"></div>
        </div>

        <!-- Modal de Detalles para Desktop -->
        <div v-if="showSidePanel && selectedReport"
            class="hidden md:block fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out top-14     "
            :class="showSidePanel ? 'translate-x-0' : 'translate-x-full'">

            <!-- Header del Modal -->
            <div class="p-6 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-colors">
                <div class="flex justify-between items-start">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                        <Icon name="ri:file-text-line" class="mr-2 text-blue-500" />
                        Detalles del Reporte
                    </h2>
                    <button @click="closeSidePanel"
                        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <Icon name="ri:close-line" class="w-6 h-6" />
                    </button>
                </div>
            </div>

            <!-- Contenido del Modal -->
            <div class="p-6 overflow-y-auto h-full">
                <!-- Header con título e ícono -->
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedReport.title }}</h3>
                    <Icon :name="currentGarbageType.icon" class="text-2xl" :class="currentGarbageType.color" />
                </div>

                <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{{ selectedReport.description }}</p>

                <!-- SECCIÓN DE FOTOS -->
                <div v-if="selectedReportPhotos.length > 0" class="mb-6">
                    <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                        <Icon name="ri:image-line" class="mr-2 text-purple-500" />
                        Fotos del Reporte
                        <span class="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                            ({{ selectedReportPhotos.length }})
                        </span>
                    </h4>

                    <!-- Carrusel de Fotos -->
                    <div class="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-3">
                        <!-- Foto Principal -->
                        <div class="aspect-video flex items-center justify-center">
                            <img :src="currentPhoto?.url" :alt="currentPhoto?.caption || 'Foto del reporte'"
                                class="w-full h-full object-cover" @error="handleImageError" />
                        </div>

                        <!-- Controles del Carrusel -->
                        <div v-if="selectedReportPhotos.length > 1"
                            class="absolute inset-0 flex items-center justify-between p-2">
                            <button @click="prevPhoto"
                                class="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
                                <Icon name="ri:arrow-left-s-line" class="w-5 h-5" />
                            </button>
                            <button @click="nextPhoto"
                                class="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
                                <Icon name="ri:arrow-right-s-line" class="w-5 h-5" />
                            </button>
                        </div>

                        <!-- Indicador de Posición -->
                        <div v-if="selectedReportPhotos.length > 1"
                            class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                            <div v-for="(photo, index) in selectedReportPhotos" :key="photo.id"
                                @click="selectPhoto(index)" class="w-2 h-2 rounded-full cursor-pointer transition-all"
                                :class="index === selectedPhotoIndex ?
                                    'bg-white scale-125' :
                                    'bg-white/50 hover:bg-white/70'">
                            </div>
                        </div>
                    </div>

                    <!-- Miniaturas -->
                    <div v-if="selectedReportPhotos.length > 1" class="grid grid-cols-4 gap-2">
                        <div v-for="(photo, index) in selectedReportPhotos" :key="photo.id" @click="selectPhoto(index)"
                            class="aspect-square cursor-pointer border-2 rounded-lg overflow-hidden transition-all"
                            :class="index === selectedPhotoIndex ?
                                'border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800' :
                                'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'">
                            <img :src="photo.url" :alt="photo.caption || `Foto ${index + 1}`"
                                class="w-full h-full object-cover" @error="handleImageError" />
                        </div>
                    </div>

                    <!-- Pie de foto -->
                    <div v-if="currentPhoto?.caption" class="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                        {{ currentPhoto.caption }}
                    </div>
                </div>

                <!-- Mensaje cuando no hay fotos -->
                <div v-else class="mb-6 text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Icon name="ri:image-line" class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                    <p class="text-gray-500 dark:text-gray-400 text-sm">No hay fotos disponibles para este reporte</p>
                </div>

                <!-- Información adicional del reporte -->
                <div class="space-y-4 mt-6">
                    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span class="text-sm text-gray-700 dark:text-gray-300">Severidad</span>
                        <span class="font-semibold" :class="currentSeverity.color">{{ currentSeverity.label }}</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span class="text-sm text-gray-700 dark:text-gray-300">Estado</span>
                        <span class="font-semibold" :class="currentStatus.color">{{ currentStatus.label }}</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span class="text-sm text-gray-700 dark:text-gray-300">Distrito</span>
                        <span class="font-semibold text-gray-900 dark:text-white">{{ selectedReport.district.name
                        }}</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span class="text-sm text-gray-700 dark:text-gray-300">Reportado por</span>
                        <span class="font-semibold text-gray-900 dark:text-white">{{ selectedReport.user.name }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de Detalles para Móvil -->
        <div v-if="showSidePanel && selectedReport"
            class="md:hidden fixed inset-0 bg-white dark:bg-gray-800 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto top-1/2 md:top-10"
            :class="showSidePanel ? 'translate-y-0' : 'translate-y-full'">

            <!-- Header del Modal Móvil -->
            <div class="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 z-10">
                <div class="flex justify-between items-center">
                    <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                        <Icon name="ri:file-text-line" class="mr-2 text-blue-500" />
                        Detalles
                    </h2>
                    <button @click="closeSidePanel"
                        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2">
                        <Icon name="ri:close-line" class="w-6 h-6" />
                    </button>
                </div>
            </div>

            <!-- Contenido del Modal Móvil -->
            <div class="p-4">
                <!-- Header compacto -->
                <div class="flex justify-between items-start mb-3">
                    <h3 class="text-base font-semibold text-gray-900 dark:text-white flex-1 mr-2">{{
                        selectedReport.title }}</h3>
                    <Icon :name="currentGarbageType.icon" class="text-xl flex-shrink-0"
                        :class="currentGarbageType.color" />
                </div>

                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{{ selectedReport.description
                }}</p>

                <!-- SECCIÓN DE FOTOS MÓVIL -->
                <div v-if="selectedReportPhotos.length > 0" class="mb-4">
                    <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center text-sm">
                        <Icon name="ri:image-line" class="mr-2 text-purple-500" />
                        Fotos ({{ selectedReportPhotos.length }})
                    </h4>

                    <!-- Carrusel de Fotos Móvil -->
                    <div class="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-2">
                        <!-- Foto Principal -->
                        <div class="aspect-video flex items-center justify-center">
                            <img :src="currentPhoto?.url" :alt="currentPhoto?.caption || 'Foto del reporte'"
                                class="w-full h-full object-cover" @error="handleImageError" />
                        </div>

                        <!-- Controles del Carrusel -->
                        <div v-if="selectedReportPhotos.length > 1"
                            class="absolute inset-0 flex items-center justify-between p-1">
                            <button @click="prevPhoto"
                                class="bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors">
                                <Icon name="ri:arrow-left-s-line" class="w-4 h-4" />
                            </button>
                            <button @click="nextPhoto"
                                class="bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors">
                                <Icon name="ri:arrow-right-s-line" class="w-4 h-4" />
                            </button>
                        </div>

                        <!-- Indicador de Posición -->
                        <div v-if="selectedReportPhotos.length > 1"
                            class="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                            <div v-for="(photo, index) in selectedReportPhotos" :key="photo.id"
                                @click="selectPhoto(index)"
                                class="w-1.5 h-1.5 rounded-full cursor-pointer transition-all" :class="index === selectedPhotoIndex ?
                                    'bg-white scale-125' :
                                    'bg-white/50 hover:bg-white/70'">
                            </div>
                        </div>
                    </div>

                    <!-- Miniaturas Móviles -->
                    <div v-if="selectedReportPhotos.length > 1" class="grid grid-cols-3 gap-1">
                        <div v-for="(photo, index) in selectedReportPhotos" :key="photo.id" @click="selectPhoto(index)"
                            class="aspect-square cursor-pointer border rounded overflow-hidden transition-all" :class="index === selectedPhotoIndex ?
                                'border-blue-500 dark:border-blue-400' :
                                'border-gray-300 dark:border-gray-600'">
                            <img :src="photo.url" :alt="photo.caption || `Foto ${index + 1}`"
                                class="w-full h-full object-cover" @error="handleImageError" />
                        </div>
                    </div>

                    <!-- Pie de foto móvil -->
                    <div v-if="currentPhoto?.caption" class="mt-1 text-xs text-gray-600 dark:text-gray-400 text-center">
                        {{ currentPhoto.caption }}
                    </div>
                </div>

                <!-- Mensaje cuando no hay fotos (móvil) -->
                <div v-else class="mb-4 text-center py-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Icon name="ri:image-line" class="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-1" />
                    <p class="text-xs text-gray-500 dark:text-gray-400">No hay fotos disponibles</p>
                </div>

                <!-- Información adicional del reporte (móvil) -->
                <div class="space-y-2 mt-4">
                    <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                        <span class="text-gray-700 dark:text-gray-300">Severidad</span>
                        <span class="font-semibold" :class="currentSeverity.color">{{ currentSeverity.label }}</span>
                    </div>
                    <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                        <span class="text-gray-700 dark:text-gray-300">Estado</span>
                        <span class="font-semibold" :class="currentStatus.color">{{ currentStatus.label }}</span>
                    </div>
                    <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                        <span class="text-gray-700 dark:text-gray-300">Distrito</span>
                        <span class="font-semibold text-gray-900 dark:text-white">{{ selectedReport.district.name
                        }}</span>
                    </div>
                    <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                        <span class="text-gray-700 dark:text-gray-300">Reportado por</span>
                        <span class="font-semibold text-gray-900 dark:text-white">{{ selectedReport.user.name }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Estilos para el mapa */
:deep(.leaflet-container) {
    height: 100%;
    width: 100%;
    background-color: theme('colors.gray.100');
}

.dark :deep(.leaflet-container) {
    background-color: theme('colors.gray.900');
}

/* Transiciones suaves */
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}

/* Mejoras para las barras de progreso */
.progress-bar {
    transition: width 0.5s ease-in-out;
}

/* Mejoras para móvil */
@media (max-width: 768px) {
    .mobile-stats-panel {
        max-height: 60vh;
    }

    .mobile-modal {
        height: 85vh;
        border-radius: 1rem 1rem 0 0;
    }
}
</style>