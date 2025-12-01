<template>
    <section
        class="min-h-screen px-6 py-16 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 relative overflow-hidden transition-colors duration-500"
        :class="{ 'dark': isDarkMode }">
        <!-- Botón de cambio de modo -->
        <button @click="toggleDarkMode"
            class="fixed top-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-110"
            aria-label="Cambiar modo claro/oscuro">
            <i class="ri-sun-line text-yellow-500 dark:text-gray-300 text-xl" v-if="!isDarkMode"></i>
            <i class="ri-moon-line text-blue-400 text-xl" v-else></i>
        </button>

        <!-- Canvas para el mundo 3D -->
        <canvas ref="globeCanvas" class="absolute inset-0 w-full h-full globe-canvas"></canvas>

        <!-- Capa de overlay para el contenido -->
        <div
            class="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white/70 dark:from-gray-900/80 dark:via-gray-900/50 dark:to-gray-900/80 transition-colors duration-500">
        </div>

        <!-- Partículas flotantes -->
        <div class="absolute inset-0">
            <div v-for="(particle, index) in particles" :key="index" class="absolute rounded-full particle"
                :class="particle.color" :style="{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    animationDelay: `${particle.delay}s`
                }"></div>
        </div>

        <!-- Líneas de conexión -->
        <div class="absolute inset-0 connection-lines">
            <div v-for="(line, index) in connectionLines" :key="index" class="absolute connection-line" :style="{
                left: `${line.startX}%`,
                top: `${line.startY}%`,
                width: `${line.length}%`,
                transform: `rotate(${line.angle}deg)`,
                animationDelay: `${line.delay}s`
            }"></div>
        </div>

        <div class="max-w-5xl mx-auto space-y-12 relative z-10">

            <!-- HERO SECTION -->
            <div class="text-center space-y-6 pt-8">
                <!-- Icono satélite animado -->
                <div class="flex justify-center mb-4">
                    <div class="relative">
                        <div class="satellite-orbit">
                            <i class="ri-satellite-line text-6xl satellite-icon text-blue-500 dark:text-blue-400"></i>
                        </div>
                        <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full pulse-dot"></div>
                    </div>
                </div>

                <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white hero-title-glitch">
                    Plataforma Analítica <span class="block text-blue-600 dark:text-blue-400">Geoespacial</span>
                </h1>
                <p class="text-lg md:text-xl opacity-90 max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
                    Sistema inteligente para detectar zonas críticas de inseguridad ciudadana, contaminación ambiental y
                    expansión urbana sobre terrenos agrícolas.
                </p>

                <!-- CTA Buttons -->
                <div class="flex flex-wrap justify-center gap-4 pt-6">
                    <button
                        class="px-6 py-3 md:px-8 md:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300 glow-button group"
                        @click="navigateToDashboard">
                        <i class="ri-dashboard-line mr-2 group-hover:scale-110 transition-transform"></i>
                        Explorar Dashboard
                    </button>
                    <button
                        class="px-6 py-3 md:px-8 md:py-4 bg-green-600/80 hover:bg-green-700 backdrop-blur-sm text-white rounded-xl font-medium transition-all duration-300 border border-green-400/30 group"
                        @click="navigateToMap">
                        <i class="ri-map-pin-line mr-2 group-hover:scale-110 transition-transform"></i>
                        Ver Mapa Interactivo
                    </button>
                </div>
            </div>

            <!-- CONTENIDO EXISTENTE CON NUEVO DISEÑO -->
            <div class="grid lg:grid-cols-2 gap-6 md:gap-8">
                <!-- OBJETIVOS -->
                <div
                    class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700/50 transition-all duration-300 card-hover">
                    <h2 class="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-3">
                        <div class="relative">
                            <i class="ri-bullseye-line text-blue-500 dark:text-blue-400 text-2xl md:text-3xl"></i>
                            <div
                                class="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full pulse-dot">
                            </div>
                        </div>
                        <span class="text-gray-900 dark:text-white">Objetivos del Proyecto</span>
                    </h2>
                    <ul class="space-y-3">
                        <li class="flex items-start gap-3">
                            <i class="ri-checkbox-circle-line text-green-500 dark:text-green-400 mt-1"></i>
                            <span class="text-gray-700 dark:text-gray-300">Analizar datos geoespaciales para identificar
                                patrones territoriales críticos.</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <i class="ri-checkbox-circle-line text-green-500 dark:text-green-400 mt-1"></i>
                            <span class="text-gray-700 dark:text-gray-300">Detectar zonas vulnerables en seguridad
                                ciudadana, contaminación y expansión urbana.</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <i class="ri-checkbox-circle-line text-green-500 dark:text-green-400 mt-1"></i>
                            <span class="text-gray-700 dark:text-gray-300">Proveer herramientas visuales para apoyar la
                                toma de decisiones municipales y comunitarias.</span>
                        </li>
                    </ul>
                </div>

                <!-- INDICADORES RESUMEN -->
                <div
                    class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700/50 transition-all duration-300 card-hover">
                    <h2 class="text-xl md:text-2xl font-semibold mb-6 flex items-center gap-3">
                        <div class="relative">
                            <i
                                class="ri-bar-chart-grouped-line text-green-500 dark:text-green-400 text-2xl md:text-3xl"></i>
                            <div
                                class="absolute -top-1 -right-1 w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full pulse-dot">
                            </div>
                        </div>
                        <span class="text-gray-900 dark:text-white">Indicadores Clave</span>
                    </h2>

                    <div class="space-y-4">
                        <!-- Indicador 1 -->
                        <div
                            class="flex items-center gap-4 p-4 rounded-xl bg-gray-100/70 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600/30">
                            <div class="p-3 rounded-lg bg-red-500/20 border border-red-400/30">
                                <i class="ri-shield-keyhole-line text-2xl text-red-500 dark:text-red-400"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white">Inseguridad Ciudadana</h3>
                                <p class="text-sm opacity-75 text-gray-700 dark:text-gray-300">Detección automática de
                                    patrones delictivos</p>
                            </div>
                        </div>

                        <!-- Indicador 2 -->
                        <div
                            class="flex items-center gap-4 p-4 rounded-xl bg-gray-100/70 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600/30">
                            <div class="p-3 rounded-lg bg-blue-500/20 border border-blue-400/30">
                                <i class="ri-cloud-windy-line text-2xl text-blue-500 dark:text-blue-400"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white">Contaminación Ambiental</h3>
                                <p class="text-sm opacity-75 text-gray-700 dark:text-gray-300">Reportes ciudadanos y
                                    análisis ambiental</p>
                            </div>
                        </div>

                        <!-- Indicador 3 -->
                        <div
                            class="flex items-center gap-4 p-4 rounded-xl bg-gray-100/70 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600/30">
                            <div class="p-3 rounded-lg bg-yellow-500/20 border border-yellow-400/30">
                                <i class="ri-community-line text-2xl text-yellow-500 dark:text-yellow-400"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white">Expansión Urbana</h3>
                                <p class="text-sm opacity-75 text-gray-700 dark:text-gray-300">Análisis satelital de
                                    cambios territoriales</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Referencias
const globeCanvas = ref(null)

// Estado del modo oscuro
const isDarkMode = ref(true)

// Datos para partículas y líneas
const particles = ref([])
const connectionLines = ref([])

// Configuración del mundo 3D
let animationFrame
let rotation = 0

// Función para cambiar entre modo claro y oscuro
const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
}

// Generar partículas aleatorias
const generateParticles = () => {
    const newParticles = []
    const colors = [
        'bg-blue-400/20 dark:bg-blue-400/20',
        'bg-green-400/20 dark:bg-green-400/20',
        'bg-purple-400/20 dark:bg-purple-400/20',
        'bg-yellow-400/20 dark:bg-yellow-400/20'
    ]

    for (let i = 0; i < 15; i++) {
        newParticles.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: Math.random() * 5
        })
    }
    particles.value = newParticles
}

// Generar líneas de conexión
const generateConnectionLines = () => {
    const newLines = []

    for (let i = 0; i < 8; i++) {
        newLines.push({
            startX: Math.random() * 100,
            startY: Math.random() * 100,
            length: Math.random() * 20 + 10,
            angle: Math.random() * 360,
            delay: Math.random() * 3
        })
    }
    connectionLines.value = newLines
}

// Dibujar el mundo 3D
const drawGlobe = () => {
    const canvas = globeCanvas.value
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width = window.innerWidth
    const height = canvas.height = window.innerHeight

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height)

    // Configuración del globo
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.2 // Reducido para móviles

    // Dibujar esfera principal
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
    if (isDarkMode.value) {
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)')
        gradient.addColorStop(0.7, 'rgba(16, 185, 129, 0.6)')
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.4)')
    } else {
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.6)')
        gradient.addColorStop(0.7, 'rgba(16, 185, 129, 0.4)')
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.2)')
    }

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(rotation)

    // Esfera principal
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()

    // Patrón de red
    ctx.strokeStyle = isDarkMode.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    ctx.lineWidth = 1

    // Líneas longitudinales
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2
        ctx.beginPath()
        ctx.arc(0, 0, radius, angle, angle)
        ctx.lineTo(Math.cos(angle) * radius * 1.2, Math.sin(angle) * radius * 1.2)
        ctx.stroke()
    }

    // Líneas latitudinales
    for (let i = -6; i <= 6; i++) {
        const y = (i / 6) * radius
        const r = Math.sqrt(radius * radius - y * y)
        ctx.beginPath()
        ctx.arc(0, y, r, 0, Math.PI * 2)
        ctx.stroke()
    }

    // Puntos de datos brillantes
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + rotation
        const pointRadius = 4 + Math.sin(rotation * 2 + i) * 2
        const x = Math.cos(angle) * radius * 0.8
        const y = Math.sin(angle) * radius * 0.6

        ctx.beginPath()
        ctx.arc(x, y, pointRadius, 0, Math.PI * 2)
        ctx.fillStyle = isDarkMode.value
            ? `rgba(255, 255, 255, ${0.7 + Math.sin(rotation * 3 + i) * 0.3})`
            : `rgba(59, 130, 246, ${0.7 + Math.sin(rotation * 3 + i) * 0.3})`
        ctx.fill()

        // Efecto de brillo
        const glow = ctx.createRadialGradient(x, y, 0, x, y, pointRadius * 3)
        if (isDarkMode.value) {
            glow.addColorStop(0, `rgba(59, 130, 246, ${0.3 + Math.sin(rotation * 4 + i) * 0.2})`)
            glow.addColorStop(1, 'rgba(59, 130, 246, 0)')
        } else {
            glow.addColorStop(0, `rgba(59, 130, 246, ${0.2 + Math.sin(rotation * 4 + i) * 0.1})`)
            glow.addColorStop(1, 'rgba(59, 130, 246, 0)')
        }

        ctx.beginPath()
        ctx.arc(x, y, pointRadius * 3, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()
    }

    ctx.restore()

    // Actualizar rotación
    rotation += 0.002

    // Continuar animación
    animationFrame = requestAnimationFrame(drawGlobe)
}

// Navegación
const navigateToDashboard = () => {
    // Usar navigateTo de Nuxt 3
    navigateTo('/dashboard')
}

const navigateToMap = () => {
    navigateTo('/maps')
}

// Lifecycle hooks
onMounted(() => {
    generateParticles()
    generateConnectionLines()
    drawGlobe()

    // Redibujar en resize
    window.addEventListener('resize', drawGlobe)
})

onUnmounted(() => {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame)
    }
    window.removeEventListener('resize', drawGlobe)
})
</script>

<style scoped>
/* Estilos del canvas */
.globe-canvas {
    filter: blur(0.5px);
}

/* Animación de partículas */
.particle {
    animation: float 8s ease-in-out infinite;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-20px) rotate(180deg);
    }
}

/* Líneas de conexión */
.connection-line {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
    animation: pulseLine 4s ease-in-out infinite;
    transform-origin: left center;
}

@keyframes pulseLine {

    0%,
    100% {
        opacity: 0;
    }

    50% {
        opacity: 1;
    }
}

/* Órbita del satélite */
.satellite-orbit {
    position: relative;
    animation: orbit 20s linear infinite;
}

@keyframes orbit {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.satellite-icon {
    animation: satelliteFloat 3s ease-in-out infinite;
}

@keyframes satelliteFloat {

    0%,
    100% {
        transform: translateX(0) scale(1);
    }

    50% {
        transform: translateX(10px) scale(1.1);
    }
}

/* Efecto glitch en el título */
.hero-title-glitch {
    position: relative;
}

.hero-title-glitch::before,
.hero-title-glitch::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.hero-title-glitch::before {
    animation: glitch-1 5s infinite linear alternate-reverse;
    color: #10b981;
    z-index: -1;
}

.hero-title-glitch::after {
    animation: glitch-2 3s infinite linear alternate-reverse;
    color: #ef4444;
    z-index: -2;
}

@keyframes glitch-1 {
    0% {
        transform: translate(0);
    }

    20% {
        transform: translate(-2px, 2px);
    }

    40% {
        transform: translate(-2px, -2px);
    }

    60% {
        transform: translate(2px, 2px);
    }

    80% {
        transform: translate(2px, -2px);
    }

    100% {
        transform: translate(0);
    }
}

@keyframes glitch-2 {
    0% {
        transform: translate(0);
    }

    20% {
        transform: translate(2px, -2px);
    }

    40% {
        transform: translate(2px, 2px);
    }

    60% {
        transform: translate(-2px, -2px);
    }

    80% {
        transform: translate(-2px, 2px);
    }

    100% {
        transform: translate(0);
    }
}

/* Botones con efecto glow */
.glow-button {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
    position: relative;
    overflow: hidden;
}

.glow-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
}

.glow-button:hover::before {
    left: 100%;
}

/* Efectos de hover para tarjetas */
.card-hover {
    transition: all 0.3s ease;
    transform: translateY(0);
}

.card-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: rgba(59, 130, 246, 0.5);
}

/* Puntos pulsantes */
.pulse-dot {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(0.95);
        opacity: 0.7;
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
    }

    70% {
        transform: scale(1.1);
        opacity: 1;
        box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
    }

    100% {
        transform: scale(0.95);
        opacity: 0.7;
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
    }
}

/* Transiciones suaves */
* {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, transform, box-shadow;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
}

/* Mejoras responsivas para móviles */
@media (max-width: 768px) {

    .hero-title-glitch::before,
    .hero-title-glitch::after {
        display: none;
        /* Desactivar efecto glitch en móviles para mejor rendimiento */
    }

    .globe-canvas {
        filter: blur(1px);
        /* Reducir blur en móviles */
    }
}
</style>