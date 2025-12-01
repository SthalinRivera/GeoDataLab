<script lang="ts" setup>
import log from '~/server/middleware/log';

// Estado del formulario
const form = reactive({
    title: '',
    description: '',
    type: 'OTHER',
    severity: 'LOW',
    districtId: 0,
    userId: 1,
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    address: '',
    locationId: undefined as number | undefined,
    imageUrls: [] as string[]
});
const { $toast } = useNuxtApp();

// Estados reactivos
const isLoading = ref(false);
const isGettingLocation = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');
const showDebug = ref(false);
const mapLoaded = ref(false);
const imagePreviews = ref<string[]>([]);

const {
    uploadProgress: firebaseProgress,
    isUploading: firebaseIsUploading,
    uploadMultipleImages
} = useFirebaseUpload();

// Computed para el progreso y estado de subida
const isUploading = computed(() => firebaseIsUploading.value);
const uploadProgress = computed(() => firebaseProgress.value);


// Cargar distritos para el select
const { data: districts } = await useFetch('/api/districts/get');

console.log('📥 Distritos cargados:', districts.value)

// Opciones para los selects
const garbageTypes = [
    { value: 'ORGANIC', label: 'Orgánica' },
    { value: 'PLASTIC', label: 'Plástico' },
    { value: 'PAPER', label: 'Papel' },
    { value: 'GLASS', label: 'Vidrio' },
    { value: 'METAL', label: 'Metal' },
    { value: 'ELECTRONIC', label: 'Electrónico' },
    { value: 'CONSTRUCTION', label: 'Construcción' },
    { value: 'HAZARDOUS', label: 'Peligroso' },
    { value: 'OTHER', label: 'Otro' }
];

const severityLevels = [
    { value: 'LOW', label: 'Baja' },
    { value: 'MEDIUM', label: 'Media' },
    { value: 'HIGH', label: 'Alta' },
    { value: 'CRITICAL', label: 'Crítica' }
];

// Referencias para el mapa
let map: any = null;
let marker: any = null;

// Cargar Leaflet (biblioteca de mapas)
const loadMapLibrary = () => {
    return new Promise((resolve, reject) => {
        if (typeof window !== 'undefined') {
            if (window.L) {
                mapLoaded.value = true;
                resolve(true);
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
            link.crossOrigin = '';
            document.head.appendChild(link);

            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
            script.crossOrigin = '';
            script.onload = () => {
                mapLoaded.value = true;
                resolve(true);
            };
            script.onerror = () => reject(new Error('Failed to load Leaflet'));
            document.head.appendChild(script);
        } else {
            resolve(false);
        }
    });
};

// Inicializar mapa
const initMap = () => {
    if (typeof window === 'undefined' || !window.L) return;

    const defaultCoords = form.latitude && form.longitude
        ? [form.latitude, form.longitude]
        : [-12.0464, -77.0428];

    try {
        map = window.L.map('map-container').setView(defaultCoords, 19);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        if (form.latitude && form.longitude) {
            marker = window.L.marker(defaultCoords).addTo(map);
        }

        map.on('click', (e: any) => {
            const { lat, lng } = e.latlng;
            if (marker) {
                marker.setLatLng([lat, lng]);
            } else {
                marker = window.L.marker([lat, lng]).addTo(map);
            }
            form.latitude = parseFloat(lat.toFixed(6));
            form.longitude = parseFloat(lng.toFixed(6));
            getAddressFromCoords(lat, lng);
        });

    } catch (error) {
        console.error('❌ Error inicializando el mapa:', error);
    }
};

// Obtener dirección y distrito a partir de coordenadas
const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
        const data = await response.json();

        if (data && data.address) {
            const addressParts = [];
            if (data.address.road) addressParts.push(data.address.road);
            if (data.address.house_number) addressParts.push(data.address.house_number);
            if (data.address.suburb) addressParts.push(data.address.suburb);
            form.address = addressParts.join(', ') || 'Ubicación seleccionada en el mapa';

            let districtName = '';
            if (data.address.city_district) districtName = data.address.city_district;
            else if (data.address.suburb) districtName = data.address.suburb;
            else if (data.address.city) districtName = data.address.city;

            if (districtName && districts.value) {
                const foundDistrict = districts.value.find((d: any) =>
                    d.name.toLowerCase().includes(districtName.toLowerCase()) ||
                    districtName.toLowerCase().includes(d.name.toLowerCase())
                );
                if (foundDistrict) {
                    form.districtId = foundDistrict.id;
                    message.value = `Ubicación detectada: ${foundDistrict.name}`;
                    messageType.value = 'success';
                    setTimeout(() => message.value = '', 3000);
                }
            }
        }
    } catch (error) {
        console.error('Error obteniendo dirección:', error);
        form.address = 'Ubicación seleccionada en el mapa';
    }
};

// Función para obtener ubicación actual
const getCurrentLocation = () => {
    if (!navigator.geolocation) {
        message.value = 'La geolocalización no es soportada por este navegador';
        messageType.value = 'error';
        return;
    }

    isGettingLocation.value = true;
    message.value = 'Obteniendo ubicación...';

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = parseFloat(position.coords.latitude.toFixed(6));
            const lng = parseFloat(position.coords.longitude.toFixed(6));
            form.latitude = lat;
            form.longitude = lng;

            if (map && marker) {
                map.setView([lat, lng], 15);
                marker.setLatLng([lat, lng]);
            } else if (map) {
                marker = window.L.marker([lat, lng]).addTo(map);
                map.setView([lat, lng], 15);
            }

            await getAddressFromCoords(lat, lng);
            message.value = 'Ubicación obtenida correctamente';
            messageType.value = 'success';
            isGettingLocation.value = false;
            setTimeout(() => message.value = '', 2000);
        },
        (error) => {
            let errorMessage = 'No se pudo obtener la ubicación';
            switch (error.code) {
                case error.PERMISSION_DENIED: errorMessage = 'Permiso de ubicación denegado'; break;
                case error.POSITION_UNAVAILABLE: errorMessage = 'Información de ubicación no disponible'; break;
                case error.TIMEOUT: errorMessage = 'Tiempo de espera agotado'; break;
            }
            message.value = errorMessage;
            messageType.value = 'error';
            isGettingLocation.value = false;
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
};




// Manejo de imágenes
const handleImageUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);

    // Validar cantidad máxima
    if (files.length + form.imageUrls.length > 5) {
        message.value = 'Máximo 5 imágenes permitidas';
        messageType.value = 'error';
        setTimeout(() => message.value = '', 3000);
        input.value = '';
        return;
    }

    try {
        // Crear previews inmediatamente
        const newPreviews: string[] = [];

        // Usar Promise.all para cargar todos los previews
        const previewPromises = files.map(file => {
            return new Promise<string>((resolve) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        resolve(e.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                } else {
                    // Para archivos no imagen, crear un placeholder
                    resolve('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA1MEgxMjVWMTUwSDc1VjUwWiIgZmlsbD0iIzlDQTBBRiIvPgo8cGF0aCBkPSJNODUgMTEwVjEzMEgxMTVWMTEwSDg1Wk0xMDAgOTBDMTA2LjYyNyA5MCAxMTIgODQuNjI3IDExMiA3OEMxMTIgNzEuMzcyOCAxMDYuNjI3IDY2IDEwMCA2NkM5My4zNzI4IDY2IDg4IDcxLjM3MjggODggNzhDODggODQuNjI3IDkzLjM3MjggOTAgMTAwIDkwWiIgZmlsbD0iIzlDQTBBRiIvPgo8L3N2Zz4K');
                }
            });
        });

        const loadedPreviews = await Promise.all(previewPromises);
        newPreviews.push(...loadedPreviews);
        imagePreviews.value.push(...newPreviews);

        // Subir imágenes a Firebase
        message.value = 'Subiendo y procesando imágenes...';
        messageType.value = 'success';

        // Usar el composable de Firebase para subir las imágenes
        const imageUrls = await uploadMultipleImages(files, 'garbage-reports');

        // Agregar las URLs al formulario
        form.imageUrls.push(...imageUrls);

        message.value = `¡Éxito! ${imageUrls.length} imagen(es) subida(s) correctamente`;
        messageType.value = 'success';

        // Mostrar toast de éxito
        if ($toast) {
            $toast.success(`Se subieron ${imageUrls.length} imagen(es)`);
        }

        setTimeout(() => message.value = '', 3000);

    } catch (error: any) {
        console.error('❌ Error subiendo imágenes:', error);

        // Mensaje de error específico
        let errorMessage = 'Error al subir las imágenes';
        if (error.message.includes('storage/unauthorized')) {
            errorMessage = 'No tienes permisos para subir imágenes';
        } else if (error.message.includes('storage/canceled')) {
            errorMessage = 'Subida cancelada';
        } else if (error.message.includes('storage/unknown')) {
            errorMessage = 'Error desconocido al subir imágenes';
        }

        message.value = errorMessage;
        messageType.value = 'error';

        // Limpiar previews si hay error
        imagePreviews.value = imagePreviews.value.slice(0, -files.length);

        setTimeout(() => message.value = '', 5000);
    } finally {
        input.value = '';
    }
};

const removeImage = (index: number) => {
    form.imageUrls.splice(index, 1);
    imagePreviews.value.splice(index, 1);
};

// Inicializar mapa cuando el componente esté montado
onMounted(async () => {
    try {
        await loadMapLibrary();
        await nextTick();
        setTimeout(() => {
            initMap();
            setTimeout(() => getCurrentLocation(), 1000);
        }, 100);
    } catch (error) {
        console.error('Error cargando el mapa:', error);
        message.value = 'Error cargando el mapa. Por favor recarga la página.';
        messageType.value = 'error';
    }
});

// Función para enviar el formulario
const submitReport = async () => {
    isLoading.value = true;
    message.value = '';

    try {
        // Validaciones
        if (!form.title.trim()) {
            message.value = 'Por favor ingresa un título';
            messageType.value = 'error';
            isLoading.value = false;
            return;
        }

        if (!form.description.trim()) {
            message.value = 'Por favor ingresa una descripción';
            messageType.value = 'error';
            isLoading.value = false;
            return;
        }

        if (form.districtId === 0) {
            message.value = 'Por favor selecciona un distrito';
            messageType.value = 'error';
            isLoading.value = false;
            return;
        }

        if (!form.latitude || !form.longitude) {
            message.value = 'Por favor selecciona una ubicación en el mapa';
            messageType.value = 'error';
            isLoading.value = false;
            return;
        }
        // Verificar si hay imágenes en proceso de subida
        if (isUploading.value) {
            message.value = 'Espere a que terminen de subir las imágenes';
            messageType.value = 'error';
            isLoading.value = false;
            return;
        }

        console.log('📤 Enviando reporte con imágenes:', form.imageUrls);
        console.log('📤 Enviando datos:', form);

        // Enviar datos al backend
        const reportData = {
            title: form.title,
            description: form.description,
            type: form.type,
            severity: form.severity,
            districtId: form.districtId,
            userId: form.userId,
            latitude: form.latitude,
            longitude: form.longitude,
            address: form.address,
            imageUrls: form.imageUrls
        };



        const { data: result, error } = await useFetch('/api/v1/addGarbageReport', {
            method: 'POST',
            body: reportData,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (error.value) {
            console.error('❌ Error del servidor:', error.value);
            message.value = error.value.data?.message || 'Error al crear el reporte';
            messageType.value = 'error';
            return;
        }

        if (result.value?.success) {
            message.value = result.value.message || 'Reporte creado exitosamente';
            messageType.value = 'success';
            $toast.success("Reporte creado exitosamente");
            resetForm();
            setTimeout(() => message.value = '', 3000);
        }

    } catch (error: any) {
        console.error('💥 Error inesperado:', error);
        message.value = 'Error inesperado al crear el reporte';
        messageType.value = 'error';
    } finally {
        isLoading.value = false;
    }
};

// Función para resetear el formulario
const resetForm = () => {
    Object.assign(form, {
        title: '',
        description: '',
        type: 'OTHER',
        severity: 'LOW',
        districtId: 0,
        latitude: undefined,
        longitude: undefined,
        address: '',
        locationId: undefined,
        imageUrls: []
    });
    imagePreviews.value = [];


    if (map) {
        map.setView([-12.0464, -77.0428], 15);
        if (marker) {
            map.removeLayer(marker);
            marker = null;
        }
    }
};

// Función para probar con datos de ejemplo
const fillSampleData = () => {
    Object.assign(form, {
        title: 'Basura plástica en el parque',
        description: 'Acumulación de botellas y bolsas plásticas en el área de juegos',
        type: 'PLASTIC',
        severity: 'MEDIUM',
        latitude: -12.0464,
        longitude: -77.0428,
        address: 'Parque Central, Lima',
        districtId: districts.value?.[0]?.id || 1
    });

    if (map) {
        map.setView([-12.0464, -77.0428], 15);
        if (marker) {
            marker.setLatLng([-12.0464, -77.0428]);
        } else {
            marker = window.L.marker([-12.0464, -77.0428]).addTo(map);
        }
    }
};

// Función para alternar debug
const toggleDebug = () => {
    showDebug.value = !showDebug.value;
};
</script>

<template>
    <div class="max-w-7xl mx-auto p-4 sm:p-6">
        <h2 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">Reportar Basura</h2>

        <!-- Mensaje de estado -->
        <div v-if="message" class="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border text-sm" :class="messageType === 'success'
            ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
            : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'">
            {{ message }}
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <!-- Columna Izquierda - Formulario -->
            <div class="space-y-4 sm:space-y-6">
                <!-- Información Básica -->
                <div
                    class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Información del Reporte</h3>

                    <div class="space-y-4">
                        <!-- Título -->
                        <div>
                            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Título
                                *</label>
                            <input v-model="form.title" type="text" required
                                class="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors text-sm"
                                placeholder="Ej: Basura plástica en el parque" />
                        </div>

                        <!-- Descripción -->
                        <div>
                            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Descripción
                                *</label>
                            <textarea v-model="form.description" required rows="3"
                                class="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors text-sm"
                                placeholder="Describe el problema de basura..."></textarea>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Tipo de basura -->
                            <div>
                                <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Tipo
                                    *</label>
                                <select v-model="form.type"
                                    class="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors text-sm">
                                    <option v-for="type in garbageTypes" :key="type.value" :value="type.value">
                                        {{ type.label }}
                                    </option>
                                </select>
                            </div>

                            <!-- Severidad -->
                            <div>
                                <label
                                    class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Severidad</label>
                                <select v-model="form.severity"
                                    class="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors text-sm">
                                    <option v-for="severity in severityLevels" :key="severity.value"
                                        :value="severity.value">
                                        {{ severity.label }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <!-- Distrito -->
                        <div>
                            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Distrito
                                *</label>
                            <select v-model="form.districtId" required
                                class="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors text-sm">
                                <option value="0">Seleccionar distrito</option>
                                <option v-for="district in districts" :key="district.id" :value="district.id">
                                    {{ district.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Subida de Fotos -->
                <div
                    class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Fotos del Problema</h3>

                    <div class="space-y-4">
                        <!-- Área de subida -->
                        <div
                            class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center transition-colors hover:border-blue-400 dark:hover:border-blue-500">
                            <input type="file" multiple accept="image/*" @change="handleImageUpload" class="hidden"
                                id="image-upload" :disabled="isUploading" />
                            <label for="image-upload" class="cursor-pointer block"
                                :class="{ 'opacity-50 cursor-not-allowed': isUploading }">
                                <div class="flex flex-col items-center justify-center gap-2">
                                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                                        </path>
                                    </svg>
                                    <span class="text-sm text-gray-600 dark:text-gray-400">
                                        {{ isUploading ? 'Subiendo imágenes...' : 'Haz clic para subir fotos (máx. 5)'
                                        }}
                                    </span>
                                    <span class="text-xs text-gray-500 dark:text-gray-500">
                                        PNG, JPG, JPEG - Se convertirán a WebP automáticamente
                                    </span>
                                </div>
                            </label>

                            <!-- Barra de progreso -->
                            <div v-if="uploadProgress > 0" class="mt-4">
                                <div class="w-full bg-gray-200 rounded-full h-2.5">
                                    <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                        :style="{ width: `${uploadProgress}%` }"></div>
                                </div>
                                <p class="text-xs text-gray-600 mt-2 text-center">
                                    Progreso: {{ uploadProgress }}%
                                </p>
                            </div>
                        </div>

                        <!-- Previsualización de imágenes -->
                        <div v-if="imagePreviews.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div v-for="(preview, index) in imagePreviews" :key="index"
                                class="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                                <img :src="preview" :alt="`Preview ${index + 1}`"
                                    class="w-full h-24 sm:h-32 object-cover" />
                                <div
                                    class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                                    <button @click="removeImage(index)" :disabled="isUploading"
                                        class="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100 disabled:opacity-50">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                                <!-- Indicador de éxito -->
                                <div v-if="form.imageUrls[index]"
                                    class="absolute top-1 left-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Contador de imágenes -->
                        <div v-if="imagePreviews.length > 0" class="text-xs text-gray-500 text-center">
                            {{ imagePreviews.length }} de 5 imágenes {{ form.imageUrls.length === imagePreviews.length ?
                                'subidas' : 'seleccionadas' }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Columna Derecha - Mapa y Ubicación -->
            <div class="space-y-4 sm:space-y-6">
                <!-- Mapa -->
                <div
                    class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Ubicación en el Mapa</h3>
                        <button type="button" @click="getCurrentLocation" :disabled="isGettingLocation"
                            class="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm">
                            <svg v-if="isGettingLocation" class="animate-spin h-3 w-3 text-white" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            📍 {{ isGettingLocation ? 'Buscando...' : 'Mi ubicación' }}
                        </button>
                    </div>

                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Haz clic en el mapa para marcar la ubicación exacta
                    </p>

                    <!-- Contenedor del Mapa -->
                    <div id="map-container" class="w-full h-30  rounded-lg border border-gray-300 dark:border-gray-600">
                        <div v-if="!mapLoaded"
                            class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <div class="text-center">
                                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2">
                                </div>
                                <p class="text-xs text-gray-600 dark:text-gray-300">Cargando mapa...</p>
                            </div>
                        </div>
                    </div>

                    <!-- Información de la ubicación seleccionada -->
                    <div v-if="form.latitude && form.longitude"
                        class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p class="text-xs text-blue-800 dark:text-blue-300">
                            <strong>Ubicación seleccionada:</strong><br>
                            Lat: {{ form.latitude }}, Lng: {{ form.longitude }}
                        </p>
                    </div>
                </div>

                <!-- Detalles de Ubicación -->
                <div
                    class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Detalles de Ubicación</h3>

                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Latitud</label>
                                <input v-model="form.latitude" type="number" step="any" placeholder="Ej: -12.0464"
                                    class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors text-sm" />
                            </div>
                            <div>
                                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Longitud</label>
                                <input v-model="form.longitude" type="number" step="any" placeholder="Ej: -77.0428"
                                    class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors text-sm" />
                            </div>
                        </div>

                        <div>
                            <label
                                class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Dirección</label>
                            <input v-model="form.address" type="text"
                                class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors text-sm"
                                placeholder="La dirección se completará automáticamente" />
                        </div>
                    </div>
                </div>

                <!-- Botones de acción -->
                <div
                    class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button type="submit" @click="submitReport"
                            :disabled="isLoading || form.districtId === 0 || isUploading"
                            class="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm">
                            <svg v-if="isLoading" class="animate-spin h-4 w-4 text-white" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            {{ isLoading ? 'Creando...' : isUploading ? 'Subiendo...' : 'Crear Reporte' }}
                        </button>

                        <button type="button" @click="fillSampleData" :disabled="isUploading"
                            class="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm disabled:opacity-50">
                            Ejemplo
                        </button>

                        <button type="button" @click="resetForm" :disabled="isUploading"
                            class="px-4 py-3 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm disabled:opacity-50">
                            Limpiar
                        </button>
                    </div>

                    <!-- Botón para debug -->
                    <div class="border-t pt-4 mt-4">
                        <button type="button" @click="toggleDebug"
                            class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                            {{ showDebug ? 'Ocultar' : 'Mostrar' }} Debug
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Información de debug -->
        <div v-if="showDebug" class="mt-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <h3 class="font-semibold mb-2 text-gray-800 dark:text-white">Debug Info:</h3>
            <pre
                class="text-xs text-gray-700 dark:text-gray-300 overflow-auto">{{ JSON.stringify(form, null, 2) }}</pre>
        </div>
    </div>
</template>

<style>
/* Estilos globales para Leaflet */
.leaflet-container {
    height: 200px;
    width: 100%;
    border-radius: 0.5rem;
}

.leaflet-control-zoom {
    border: none !important;
}

.leaflet-control-zoom a {
    background-color: white !important;
    color: #374151 !important;
    border: 1px solid #d1d5db !important;
    font-size: 16px !important;
    line-height: 28px !important;
}

.leaflet-control-zoom a:hover {
    background-color: #f3f4f6 !important;
}

/* Asegurar que el contenedor del mapa tenga dimensiones */
#map-container {
    min-height: 200px;
    position: relative;
}
</style>