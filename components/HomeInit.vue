<template>
    <div class=" flex items-center justify-center px-4 py-8  bg-slate-200 dark:bg-slate-900 rounded-xl  mt-1">
        <div class="w-full max-w-6xl mx-auto">
            <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                <!-- Columna izquierda - Información personal -->
                <div class="space-y-8 order-2 lg:order-1">
                    <div class="space-y-4">
                        <div
                            class="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-medium mb-2">
                            👋 ¡Hola! Bienvenido a mi portafolio
                        </div>

                        <h1
                            class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                            Soy <span class="gradient-text">Sthalin</span> Rivera
                        </h1>

                        <div class="flex items-center space-x-2 text-xl md:text-2xl text-gray-700 dark:text-gray-300">
                            <span>Ingeniero de Sistemas</span>
                            <div class="typing-container h-8 overflow-hidden">
                                <ul class="typing-animation">
                                    <li><span>PowerBI</span></li>
                                    <li><span>Nuxt.js</span></li>
                                    <li><span>Laravel</span></li>
                                    <li><span>PostgreSQL</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        Con más de <strong class="text-purple-600 dark:text-purple-400">4 años de experiencia</strong>
                        creando soluciones digitales innovadoras que combinan funcionalidad robusta con experiencias de
                        usuario excepcionales.
                    </p>

                    <div class="grid grid-cols-2 gap-4 max-w-md">
                        <div
                            class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 dark:border-gray-700 stat-card">
                            <div class="text-2xl font-bold text-gray-900 dark:text-white">24+</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Proyectos</div>
                        </div>
                        <div
                            class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 dark:border-gray-700 stat-card">
                            <div class="text-2xl font-bold text-gray-900 dark:text-white">23+</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Clientes</div>
                        </div>
                        <div
                            class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 dark:border-gray-700 stat-card">
                            <div class="text-2xl font-bold text-gray-900 dark:text-white">4+</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Años Exp.</div>
                        </div>
                        <div
                            class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 dark:border-gray-700 stat-card">
                            <div class="text-2xl font-bold text-gray-900 dark:text-white">2+</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Países</div>
                        </div>
                    </div>


                </div>

                <!-- Columna derecha - Foto -->
                <div class="order-1 lg:order-2  justify-center lg:justify-end">

                    <!-- Columna derecha - Foto con tecnologías flotantes -->
                    <div class=" ">
                        <div class="relative">
                            <!-- Contenedor principal de la galaxia -->
                            <div class="galaxy-container relative w-80 h-80 md:w-96 md:h-96">

                                <!-- Órbitas circulares -->
                                <div class="absolute inset-0">
                                    <!-- Órbita 1 -->
                                    <div
                                        class="orbit orbit-1 absolute inset-8 rounded-full border border-purple-200/20">
                                    </div>
                                    <!-- Órbita 2 -->
                                    <div class="orbit orbit-2 absolute inset-4 rounded-full border border-blue-200/20">
                                    </div>
                                    <!-- Órbita 3 -->
                                    <div class="orbit orbit-3 absolute inset-12 rounded-full border border-pink-200/20">
                                    </div>
                                </div>

                                <!-- Tecnologías flotantes -->
                                <div v-for="(tech, index) in technologies" :key="index"
                                    :class="`tech-icon tech-${index + 1}`"
                                    class="absolute w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center transform-gpu">
                                    <img :src="tech.icon" :alt="tech.name" class="w-8 h-8 object-contain">
                                </div>

                                <!-- Foto central circular -->
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="relative">
                                        <!-- Efecto de brillo exterior -->
                                        <div
                                            class="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200">
                                        </div>

                                        <!-- Contenedor de la foto -->
                                        <div
                                            class="relative photo-container rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl z-10">
                                            <img src="/foto-perfil.png" alt="Sthalin Rivera - Desarrollador Web"
                                                class="w-full h-full object-cover" />
                                        </div>

                                        <!-- Elementos decorativos adicionales -->
                                        <div
                                            class="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-60 z-0">
                                        </div>
                                        <div
                                            class="absolute -top-2 -left-2 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-xl opacity-40 z-0">
                                        </div>
                                    </div>
                                </div>

                                <!-- Punto central -->
                                <div
                                    class="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full -translate-x-1/2 -translate-y-1/2 z-20 shadow-lg shadow-yellow-400/50">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-4 pt-4">
                        <NuxtLink to="/about" class="btn-primary">
                            <span>Más sobre mi</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                        </NuxtLink>

                        <a href="https://wa.me/51910985938?text=Hola,%20quiero%20más%20información%20sobre%20tu%20trabajo"
                            target="_blank" rel="noopener noreferrer" class="btn-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24"
                                fill="currentColor">
                                <path
                                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.262-6.188-3.55-8.439z" />
                            </svg>
                            <span>WhatsApp</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// No se necesita script adicional para las animaciones CSS
// Tecnologías con sus íconos
const technologies = [
    { name: "Nuxt.js", icon: "/tech/nuxt.png" },
    { name: "Laravel", icon: "/tech/laravel.png" },
    { name: "PostgreSQL", icon: "/tech/postgresql.png" },
    { name: "Power By", icon: "/tech/powerby.png" },
    { name: "Tailwind CSS", icon: "/tech/tailwind.png" },
    { name: "Node.js", icon: "/tech/node.png" },
    { name: "PHP", icon: "/tech/php.png" },
    { name: "Git", icon: "/tech/git.png" },

];
</script>

<style scoped>
.gradient-text {
    background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
}

.typing-container {
    height: 2rem;
}

.typing-animation {
    animation: typing 8s infinite;
    list-style: none;
    margin: 0;
    padding: 0;
}

.typing-animation li {
    height: 2rem;
    display: flex;
    align-items: center;
}

.typing-animation span {
    background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 600;
}

@keyframes typing {

    0%,
    20% {
        transform: translateY(0);
    }

    25%,
    45% {
        transform: translateY(-2rem);
    }

    50%,
    70% {
        transform: translateY(-4rem);
    }

    75%,
    95% {
        transform: translateY(-6rem);
    }

    100% {
        transform: translateY(0);
    }
}

.btn-primary {
    @apply flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105;
}

.btn-secondary {
    @apply flex items-center gap-2 px-6 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105;
}

.stat-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.photo-container {
    transition: transform 0.5s ease;
    width: 320px;
    height: 320px;
}

.photo-container:hover {
    transform: scale(1.03) rotate(1deg);
}

/* Efectos de partículas sutiles en el fondo */
.bg-gradient-to-br::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
        radial-gradient(circle at 15% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 20%),
        radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.1) 0%, transparent 20%),
        radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 20%);
    z-index: 0;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
    .photo-container {
        width: 280px;
        height: 280px;
    }
}

@media (max-width: 768px) {
    .photo-container {
        width: 240px;
        height: 240px;
    }
}


.galaxy-container {
    perspective: 1000px;
}

.orbit {
    animation: rotate 120s linear infinite;
}

.orbit-1 {
    animation-duration: 100s;
    animation-direction: reverse;
}

.orbit-2 {
    animation-duration: 80s;
}

.orbit-3 {
    animation-duration: 60s;
    animation-direction: reverse;
}

/* Posicionamiento de las tecnologías en órbitas */
.tech-1 {
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
}

.tech-2 {
    top: 20%;
    right: 15%;
}

.tech-3 {
    top: 50%;
    right: 5%;
}

.tech-4 {
    bottom: 20%;
    right: 15%;
}

.tech-5 {
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
}

.tech-6 {
    bottom: 20%;
    left: 15%;
}

.tech-7 {
    top: 50%;
    left: 5%;
}

.tech-8 {
    top: 20%;
    left: 15%;
}

.tech-9 {
    top: 35%;
    right: 25%;
}

.tech-10 {
    top: 35%;
    left: 25%;
}

/* Animaciones individuales para cada tecnología */
.tech-1 {
    animation: float-1 8s ease-in-out infinite, rotate-1 15s linear infinite;
}

.tech-2 {
    animation: float-2 7s ease-in-out infinite, rotate-2 12s linear infinite;
}

.tech-3 {
    animation: float-3 9s ease-in-out infinite, rotate-3 18s linear infinite;
}

.tech-4 {
    animation: float-4 6s ease-in-out infinite, rotate-1 14s linear infinite;
}

.tech-5 {
    animation: float-5 8.5s ease-in-out infinite, rotate-2 16s linear infinite;
}

.tech-6 {
    animation: float-6 7.5s ease-in-out infinite, rotate-3 13s linear infinite;
}

.tech-7 {
    animation: float-1 9.5s ease-in-out infinite, rotate-1 17s linear infinite;
}

.tech-8 {
    animation: float-2 6.5s ease-in-out infinite, rotate-2 11s linear infinite;
}

.tech-9 {
    animation: float-3 8s ease-in-out infinite, rotate-3 15s linear infinite;
}

.tech-10 {
    animation: float-4 7s ease-in-out infinite, rotate-1 10s linear infinite;
}

.tech-icon {
    transition: all 0.3s ease;
    z-index: 5;
}

.tech-icon:hover {
    transform: scale(1.2) !important;
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
    z-index: 10;
}

.photo-container {
    width: 200px;
    height: 200px;
    transition: transform 0.5s ease;
}

.photo-container:hover {
    transform: scale(1.05);
}

/* Animaciones de rotación orbital */
@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Animaciones de flotación individuales */
@keyframes float-1 {

    0%,
    100% {
        transform: translateY(0px) translateX(-50%) rotate(0deg);
    }

    50% {
        transform: translateY(-10px) translateX(-50%) rotate(5deg);
    }
}

@keyframes float-2 {

    0%,
    100% {
        transform: translateY(0px) translateX(0px) rotate(0deg);
    }

    50% {
        transform: translateY(-8px) translateX(5px) rotate(-3deg);
    }
}

@keyframes float-3 {

    0%,
    100% {
        transform: translateY(0px) translateX(0px) rotate(0deg);
    }

    50% {
        transform: translateY(-12px) translateX(-3px) rotate(4deg);
    }
}

@keyframes float-4 {

    0%,
    100% {
        transform: translateY(0px) translateX(0px) rotate(0deg);
    }

    50% {
        transform: translateY(-7px) translateX(4px) rotate(-2deg);
    }
}

@keyframes float-5 {

    0%,
    100% {
        transform: translateY(0px) translateX(-50%) rotate(0deg);
    }

    50% {
        transform: translateY(-9px) translateX(-50%) rotate(3deg);
    }
}

@keyframes float-6 {

    0%,
    100% {
        transform: translateY(0px) translateX(0px) rotate(0deg);
    }

    50% {
        transform: translateY(-11px) translateX(-2px) rotate(-4deg);
    }
}

/* Animaciones de rotación individuales */
@keyframes rotate-1 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@keyframes rotate-2 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(-360deg);
    }
}

@keyframes rotate-3 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(180deg);
    }
}

/* Ajustes responsivos */
@media (max-width: 768px) {
    .galaxy-container {
        width: 280px;
        height: 280px;
    }

    .photo-container {
        width: 160px;
        height: 160px;
    }

    .tech-icon {
        width: 10px;
        height: 10px;
    }

    .tech-icon img {
        width: 6px;
        height: 6px;
    }
}

/* Efectos de brillo en hover del contenedor */
.galaxy-container:hover .orbit {
    border-color: rgba(139, 92, 246, 0.4);
}

.galaxy-container:hover .tech-icon {
    filter: brightness(1.1);
}
</style>