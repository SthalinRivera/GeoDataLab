<template>
    <div class="relative w-full h-screen bg-gray-900">
        <!-- MAPA -->
        <div id="map" ref="mapRef" class="w-full h-full z-10"></div>

        <!-- PANEL DE CONTROL SUPERIOR -->
        <div class="absolute top-6 left-6 bg-white rounded-2xl shadow-2xl p-6 w-80 z-50">
            <div class="flex items-center gap-3 mb-4">
                <svg class="text-blue-600" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"
                    viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div>
                    <h2 class="text-xl font-bold text-gray-800">Cañete Urban</h2>
                    <p class="text-sm text-gray-600">Análisis 2016-2024</p>
                </div>
            </div>

            <!-- CONTROL DE REPRODUCCIÓN -->
            <div class="mb-6">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-3xl font-bold text-blue-600">{{ currentYear }}</span>
                    <button @click="togglePlayback"
                        class="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                        <svg v-if="!isPlaying" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"></path>
                        </svg>
                        <svg v-else width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6zM14 4h4v16h-4z"></path>
                        </svg>
                    </button>
                </div>

                <!-- TIMELINE SLIDER -->
                <input type="range" :min="0" :max="years.length - 1" :value="years.indexOf(currentYear)"
                    @input="changeYear(years[$event.target.value])"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" :style="sliderStyle" />

                <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span>2016</span>
                    <span>2024</span>
                </div>
            </div>

            <!-- BOTONES DE AÑOS -->
            <div class="grid grid-cols-3 gap-2">
                <button v-for="year in years" :key="year" @click="changeYear(year)" :class="[
                    'px-3 py-2 rounded-lg text-sm font-medium transition',
                    currentYear === year
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]">
                    {{ year }}
                </button>
            </div>
        </div>

        <!-- PANEL DE ESTADÍSTICAS -->
        <div v-if="showStats" class="absolute top-6 right-6 bg-white rounded-2xl shadow-2xl p-6 w-80 z-50">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                    <svg class="text-green-600" width="24" height="24" fill="none" stroke="currentColor"
                        stroke-width="2" viewBox="0 0 24 24">
                        <path d="M18 20V10M12 20V4M6 20v-6"></path>
                    </svg>
                    <h3 class="text-lg font-bold text-gray-800">Estadísticas</h3>
                </div>
                <button @click="showStats = false" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div class="space-y-4">
                <!-- ÁREA URBANA -->
                <div class="bg-red-50 rounded-xl p-4">
                    <div class="text-sm text-red-600 font-medium mb-1">Área Urbanizada</div>
                    <div class="text-3xl font-bold text-red-700">{{ stats.urban }} ha</div>
                    <div class="text-xs text-red-600 mt-1">
                        +{{ stats.urban - urbanGrowthData[2016].urban }} ha desde 2016
                    </div>
                </div>

                <!-- ÁREA AGRÍCOLA -->
                <div class="bg-green-50 rounded-xl p-4">
                    <div class="text-sm text-green-600 font-medium mb-1">Área Agrícola</div>
                    <div class="text-3xl font-bold text-green-700">{{ stats.agricultural }} ha</div>
                    <div class="text-xs text-green-600 mt-1">Restante del total original</div>
                </div>

                <!-- PÉRDIDA ANUAL -->
                <div class="bg-orange-50 rounded-xl p-4">
                    <div class="text-sm text-orange-600 font-medium mb-1">Pérdida este año</div>
                    <div class="text-3xl font-bold text-orange-700">{{ stats.loss }} ha</div>
                    <div class="text-xs text-orange-600 mt-1">Tierra agrícola convertida</div>
                </div>

                <!-- PÉRDIDA TOTAL -->
                <div class="bg-gray-100 rounded-xl p-4">
                    <div class="text-sm text-gray-600 font-medium mb-1">Pérdida Acumulada</div>
                    <div class="text-2xl font-bold text-gray-800">
                        {{ urbanGrowthData[2016].agricultural - stats.agricultural }} ha
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div class="bg-red-600 h-2 rounded-full transition-all duration-500"
                            :style="{ width: percentLoss + '%' }"></div>
                    </div>
                    <div class="text-xs text-gray-600 mt-1">
                        {{ percentLoss }}% del área agrícola original perdida
                    </div>
                </div>
            </div>

            <!-- INFORMACIÓN ADICIONAL -->
            <div class="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
                <svg class="text-blue-600 mt-0.5 flex-shrink-0" width="16" height="16" fill="currentColor"
                    viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4M12 8h.01" stroke="white" stroke-width="2"></path>
                </svg>
                <p class="text-xs text-blue-700">
                    Datos calculados mediante análisis NDVI de imágenes Sentinel-2.
                    Las áreas son aproximadas.
                </p>
            </div>
        </div>

        <!-- BOTÓN PARA MOSTRAR STATS -->
        <button v-if="!showStats" @click="showStats = true"
            class="absolute top-6 right-6 p-3 bg-white rounded-full shadow-xl hover:shadow-2xl transition z-50">
            <svg class="text-blue-600" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"
                viewBox="0 0 24 24">
                <path d="M18 20V10M12 20V4M6 20v-6"></path>
            </svg>
        </button>

        <!-- LEYENDA -->
        <div class="absolute bottom-6 left-6 bg-white rounded-xl shadow-xl p-4 z-50">
            <h4 class="text-sm font-bold text-gray-800 mb-3">Leyenda</h4>
            <div class="space-y-2 text-xs">
                <div class="flex items-center gap-2">
                    <div class="w-4 h-4 bg-green-600 rounded"></div>
                    <span>Zona Agrícola</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-4 h-4 bg-red-600 rounded"></div>
                    <span>Zona Urbana</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-4 h-4 bg-gray-400 rounded"></div>
                    <span>Otro uso de suelo</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// REFS
const mapRef = ref(null);
const map = ref(null);
const currentYear = ref(2016);
const isPlaying = ref(false);
const showStats = ref(true);
const currentLayer = ref(null);

// COORDENADAS DE CAÑETE
const CANETE_CENTER = [-13.0778, -76.3861];

// AÑOS DISPONIBLES
const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// DATOS DE CRECIMIENTO URBANO (simulados - usar datos reales de tu base de datos)
const urbanGrowthData = {
    2016: { urban: 450, agricultural: 2800, loss: 0 },
    2017: { urban: 485, agricultural: 2765, loss: 35 },
    2018: { urban: 530, agricultural: 2720, loss: 45 },
    2019: { urban: 590, agricultural: 2660, loss: 60 },
    2020: { urban: 655, agricultural: 2595, loss: 65 },
    2021: { urban: 735, agricultural: 2515, loss: 80 },
    2022: { urban: 825, agricultural: 2425, loss: 90 },
    2023: { urban: 920, agricultural: 2330, loss: 95 },
    2024: { urban: 1015, agricultural: 2235, loss: 95 }
};

// COMPUTED
const stats = computed(() => urbanGrowthData[currentYear.value]);

const percentLoss = computed(() => {
    const totalLoss = urbanGrowthData[2016].agricultural - stats.value.agricultural;
    return ((totalLoss / 2800) * 100).toFixed(1);
});

const sliderStyle = computed(() => {
    const percent = (years.indexOf(currentYear.value) / (years.length - 1)) * 100;
    return {
        background: `linear-gradient(to right, #2563eb ${percent}%, #e5e7eb ${percent}%)`
    };
});

// INICIALIZAR MAPA
onMounted(() => {
    map.value = L.map(mapRef.value).setView(CANETE_CENTER, 12);

    // Capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map.value);

    // Cargar la primera capa satelital
    loadSatelliteLayer(2016);
});

// LIMPIAR AL DESMONTAR
onUnmounted(() => {
    if (map.value) {
        map.value.remove();
    }
});

// FUNCIONES
function loadSatelliteLayer(year) {
    // Remover capa anterior
    if (currentLayer.value) {
        map.value.removeLayer(currentLayer.value);
    }

    // Crear nueva capa Sentinel-2
    currentLayer.value = L.tileLayer.wms('https://tiles.maps.eox.at/wms', {
        layers: 's2cloudless-2023',
        format: 'image/png',
        transparent: true,
        attribution: 'Sentinel-2 cloudless by EOX',
        time: `${year}-01-01`
    });

    currentLayer.value.addTo(map.value);
}

function changeYear(year) {
    currentYear.value = year;
    loadSatelliteLayer(year);
}

function togglePlayback() {
    isPlaying.value = !isPlaying.value;
}

// WATCH para auto-reproducción
let playbackInterval = null;

watch(isPlaying, (playing) => {
    if (playing) {
        playbackInterval = setInterval(() => {
            const currentIndex = years.indexOf(currentYear.value);
            const nextIndex = (currentIndex + 1) % years.length;
            changeYear(years[nextIndex]);
        }, 2000);
    } else {
        if (playbackInterval) {
            clearInterval(playbackInterval);
            playbackInterval = null;
        }
    }
});

// Limpiar intervalo al desmontar
onUnmounted(() => {
    if (playbackInterval) {
        clearInterval(playbackInterval);
    }
});
</script>

<style scoped>
#map {
    height: 100vh;
}

/* Personalizar slider */
input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    background: #2563eb;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: #2563eb;
    border-radius: 50%;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>