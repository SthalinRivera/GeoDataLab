<template>
    <section class="">


        <div class="max-w-5xl mx-auto space-y-12  my-4">


            <!-- INDICADORES -->
            <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg transition-all duration-300 card-hover">
                <h2 class="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <div class="relative">
                        <i class="ri-bar-chart-grouped-line text-green-500 text-3xl"></i>
                        <div class="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full pulse-dot"></div>
                    </div>
                    Indicadores y Definiciones
                </h2>

                <div class="grid md:grid-cols-3 gap-6">
                    <!-- Indicador 1 -->
                    <div
                        class="p-5 rounded-xl bg-gray-100 dark:bg-gray-700 shadow flex flex-col gap-3 transition-all duration-300 card-hover">
                        <div class="flex items-center gap-3">
                            <i class="ri-shield-keyhole-line text-3xl text-red-500"></i>
                            <h3 class="font-semibold text-lg">Inseguridad Ciudadana</h3>
                        </div>
                        <p class="text-sm opacity-75">El sistema integra un <strong>cron job</strong> que recopila
                            automáticamente noticias sobre robos, secuestros, homicidios y otros eventos delictivos
                            desde Google y medios digitales. Una IA generativa clasifica y resume los incidentes,
                            generando un JSON estructurado que se guarda en la base de datos. Luego, modelos de
                            <strong>machine learning</strong> analizan tendencias y puntos críticos, los cuales se
                            visualizan en mapas interactivos dentro del dashboard.
                        </p>
                    </div>

                    <!-- Indicador 2 -->
                    <div
                        class="p-5 rounded-xl bg-gray-100 dark:bg-gray-700 shadow flex flex-col gap-3 transition-all duration-300 card-hover">
                        <div class="flex items-center gap-3">
                            <i class="ri-cloud-windy-line text-3xl text-blue-500"></i>
                            <h3 class="font-semibold text-lg">Contaminación Ambiental</h3>
                        </div>
                        <p class="text-sm opacity-75">La plataforma permite que cualquier ciudadano reporte focos de
                            contaminación —basura, humo, ruidos, vertidos— mediante un botón en la web. El sistema
                            captura automáticamente latitud y longitud, o permite ingresar una dirección manualmente
                            mostrando la ubicación en un mapa. Todos los reportes se almacenan, se procesan y se
                            visualizan en el dashboard para identificar zonas críticas y patrones de impacto ambiental.
                        </p>
                    </div>

                    <!-- Indicador 3 -->
                    <div
                        class="p-5 rounded-xl bg-gray-100 dark:bg-gray-700 shadow flex flex-col gap-3 transition-all duration-300 card-hover">
                        <div class="flex items-center gap-3">
                            <i class="ri-community-line text-3xl text-yellow-500"></i>
                            <h3 class="font-semibold text-lg">Expansión Urbana</h3>
                        </div>
                        <p class="text-sm opacity-75">Se analiza el avance urbano utilizando imágenes satelitales
                            procesadas con Google Earth Engine. El sistema compara cambios históricos en el uso de suelo
                            para detectar construcciones sobre terrenos agrícolas en Cañete. Mediante modelos de IA se
                            estima cómo podría avanzar la expansión urbana en los próximos años, permitiendo evaluar
                            riesgos y planificar el ordenamiento territorial.</p>
                    </div>
                </div>
            </div>

            <!-- PROBLEMÁTICA Y SOLUCIÓN -->
            <div class="grid md:grid-cols-2 gap-6 mb-4">
                <!-- PROBLEMÁTICA -->
                <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg transition-all duration-300 card-hover">
                    <h2 class="text-2xl font-semibold mb-4 flex items-center gap-2">
                        <div class="relative">
                            <i class="ri-alert-line text-red-500 text-3xl"></i>
                            <div class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full pulse-dot"></div>
                        </div>
                        Problemática
                    </h2>
                    <p class="opacity-80">
                        Muchas municipalidades y comunidades carecen de herramientas para visualizar datos territoriales
                        complejos. Esto dificulta la detección temprana de zonas con altos riesgos de inseguridad,
                        contaminación y pérdida acelerada de tierras agrícolas debido al crecimiento urbano.
                    </p>
                </div>

                <!-- SOLUCIÓN -->
                <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg transition-all duration-300 card-hover">
                    <h2 class="text-2xl font-semibold mb-4 flex items-center gap-2">
                        <div class="relative">
                            <i class="ri-lightbulb-flash-line text-yellow-400 text-3xl"></i>
                            <div class="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full pulse-dot"></div>
                        </div>
                        Solución Propuesta
                    </h2>
                    <p class="opacity-80">
                        La plataforma integra datos satelitales, análisis geoespacial y modelos de ciencia de datos para
                        identificar automáticamente zonas críticas. Presenta mapas interactivos, reportes y alertas que
                        permiten una toma de decisiones rápida, precisa y basada en evidencia.
                    </p>
                </div>
            </div>


        </div>
    </section>
</template>

<script setup>
// Composable de navegación de Nuxt 3
const router = useRouter();

// Métodos de navegación
const navigateToDashboard = () => {
    // Navegar al dashboard
    router.push('/dashboard');
};

const navigateToMap = () => {
    // Navegar al mapa interactivo
    router.push('/mapa-interactivo');
};

// Si necesitas hacer alguna carga de datos al montar el componente
onMounted(() => {
    console.log('Componente de inicio montado');
});
</script>

<style scoped>
/* Fondo de mapa mundial */
.world-map-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='100%' height='100%' viewBox='0 0 1200 600' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M1200 300c0 165.69-134.31 300-300 300S600 465.69 600 300 734.31 0 900 0s300 134.31 300 300z' fill='%230077ff' fill-opacity='.05'/%3E%3Cpath d='M1200 300c0 165.69-134.31 300-300 300S600 465.69 600 300 734.31 0 900 0s300 134.31 300 300z' stroke='%230076ff' stroke-width='2' stroke-opacity='.1'/%3E%3C/g%3E%3C/svg%3E");
    background-size: cover;
    background-position: center;
    opacity: 0.15;
    z-index: 0;
}

/* Formas flotantes */
.floating-shape {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 70%);
    filter: blur(40px);
    z-index: 0;
}

.shape-1 {
    width: 400px;
    height: 400px;
    top: -100px;
    right: -100px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%);
}

.shape-2 {
    width: 300px;
    height: 300px;
    bottom: -50px;
    left: -50px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0) 70%);
}

/* Wrapper del contenido */
.content-wrapper {
    position: relative;
    z-index: 1;
}

/* Efectos de hover para tarjetas */
.card-hover {
    transition: all 0.3s ease;
    transform: translateY(0);
}

.card-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Título con gradiente */
.hero-title {
    background: linear-gradient(90deg, #3b82f6, #10b981);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Animación del icono satélite */
.satellite-icon {
    animation: float 6s ease-in-out infinite;
}

@keyframes float {
    0% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-10px);
    }

    100% {
        transform: translateY(0px);
    }
}

/* Puntos pulsantes */
.pulse-dot {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(0.95);
        opacity: 0.7;
    }

    50% {
        transform: scale(1.1);
        opacity: 1;
    }

    100% {
        transform: scale(0.95);
        opacity: 0.7;
    }
}

/* Efecto de brillo */
.glow {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

/* Transiciones suaves para todos los elementos */
* {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
}
</style>