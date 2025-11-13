<template>
    <!-- Card izquierda con animaciones mejoradas y textos llamativos -->
    <div v-if="showCard" class="pointer-events-auto fixed left-8 top-1/2 -translate-y-1/2 z-50
      bg-white/80 dark:bg-slate-900/80
      backdrop-blur-lg border border-gray-200/50 dark:border-slate-700/50
      shadow-2xl rounded-2xl p-6 w-80
      hover:shadow-3xl hover:scale-105
      transition-all duration-500 ease-out
      group
      animate-float">

        <!-- Botón de cerrar -->
        <button @click="closeCard" class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 
          text-white rounded-full flex items-center justify-center shadow-lg 
          transition-all duration-300 hover:scale-110 z-40">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <!-- Barra de progreso -->
        <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
            <div class="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-linear"
                :style="{ width: progress + '%' }"></div>
        </div>

        <!-- Header con animación mejorada -->
        <div class="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200/60 dark:border-slate-700/60">
            <div class="relative">
                <div
                    class="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                    <span class="text-2xl animate-pulse">🚀</span>
                </div>

            </div>
            <div class="overflow-hidden">
                <h3 class="text-2xl font-bold ">
                    Conéctate
                </h3>
            </div>
        </div>

        <!-- Mensaje destacado con animación tipo marquesina -->
        <div class="mb-6 relative overflow-hidden">
            <div class="animate-slide-up space-y-2">
                <h4 class="text-3xl font-black text-gray-900 dark:text-white leading-tight mb-3 
                   bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent 
                   bg-size-200 animate-gradient">
                    Soluciones en Seguridad
                </h4>
                <h4 class="text-3xl font-black text-gray-900 dark:text-white leading-tight mb-3 
                   bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent 
                   bg-size-200 animate-gradient delay-100">
                    & Análisis de Datos
                </h4>
            </div>
        </div>

        <!-- Llamada a la acción animada -->
        <div
            class="mb-5 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-200/30 dark:border-blue-700/30">
            <p class="text-lg font-bold text-center text-gray-800 dark:text-white animate-pulse-slow">
                ¡Transformemos tus datos en ventajas competitivas!
            </p>
        </div>

        <!-- Enlaces sociales mejorados -->
        <div class="flex flex-col gap-3 mb-5">
            <!-- LinkedIn con efecto mejorado -->
            <a href="https://www.linkedin.com/in/sthalin-rivera/" target="_blank" class="group/link relative overflow-hidden flex items-center gap-3 px-4 py-4
                bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30
                hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/50 dark:hover:to-blue-700/50
                border border-blue-300/50 dark:border-blue-600/30
                rounded-xl transition-all duration-300
                hover:scale-105 hover:shadow-lg
                animate-slide-in-left">

                <!-- Efecto de fondo animado -->
                <div class="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 
                    translate-x-[-100%] group-hover/link:translate-x-[100%] transition-transform duration-1000"></div>

                <div class="relative z-10 w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center 
                    group-hover/link:scale-110 group-hover/link:rotate-6 transition-transform duration-300 shadow-md">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                </div>

                <div class="relative z-10 flex-1">
                    <span
                        class="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover/link:text-blue-700 dark:group-hover/link:text-blue-400 transition-colors">
                        Conectar en LinkedIn
                    </span>
                    <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">+5 años de experiencia</p>
                </div>

                <svg class="w-5 h-5 text-blue-500 ml-auto opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-300"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </a>

            <!-- GitHub con efecto mejorado -->
            <a href="https://github.com/SthalinRivera" target="_blank" class="group/link relative overflow-hidden flex items-center gap-3 px-4 py-4
                bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-700/30
                hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50
                border border-gray-300/50 dark:border-gray-600/30
                rounded-xl transition-all duration-300
                hover:scale-105 hover:shadow-lg
                animate-slide-in-right">

                <div class="absolute inset-0 bg-gradient-to-r from-gray-500/0 via-gray-500/10 to-gray-500/0 
                    translate-x-[-100%] group-hover/link:translate-x-[100%] transition-transform duration-1000"></div>

                <div class="relative z-10 w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center 
                    group-hover/link:scale-110 group-hover/link:rotate-6 transition-transform duration-300 shadow-md">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                </div>

                <div class="relative z-10 flex-1">
                    <span
                        class="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover/link:text-gray-900 dark:group-hover/link:text-gray-100 transition-colors">
                        Ver Proyectos GitHub
                    </span>
                    <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Código abierto & Soluciones</p>
                </div>

                <svg class="w-5 h-5 text-gray-600 dark:text-gray-400 ml-auto opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-300"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showCard: false,
            progress: 100,
            autoCloseTimer: null,
            progressInterval: null,
            reappearTimer: null,
            userClosed: false
        }
    },
    mounted() {
        // Mostrar el card después de 2 segundos
        setTimeout(() => {
            if (!this.userClosed) {
                this.showCard = true;
                this.startAutoClose();
            }
        }, 2000);
    },
    methods: {
        startAutoClose() {
            // Reiniciar progreso
            this.progress = 100;

            // Limpiar timers anteriores si existen
            if (this.autoCloseTimer) clearTimeout(this.autoCloseTimer);
            if (this.progressInterval) clearInterval(this.progressInterval);

            // Configurar el cierre automático después de 10 segundos
            this.autoCloseTimer = setTimeout(() => {
                this.closeCard();
            }, 10000);

            // Actualizar la barra de progreso cada 100ms
            this.progressInterval = setInterval(() => {
                this.progress -= 1;
                if (this.progress <= 0) {
                    clearInterval(this.progressInterval);
                }
            }, 100);
        },
        closeCard() {
            this.showCard = false;
            this.userClosed = true;

            // Limpiar timers
            if (this.autoCloseTimer) clearTimeout(this.autoCloseTimer);
            if (this.progressInterval) clearInterval(this.progressInterval);

            // Programar la reaparición después de 5 segundos
            this.reappearTimer = setTimeout(() => {
                this.userClosed = false;
                this.showCard = true;
                this.startAutoClose();
            }, 5000);
        }
    },
    beforeUnmount() {
        // Limpiar todos los timers al desmontar el componente
        if (this.autoCloseTimer) clearTimeout(this.autoCloseTimer);
        if (this.progressInterval) clearInterval(this.progressInterval);
        if (this.reappearTimer) clearTimeout(this.reappearTimer);
    }
}
</script>

<style scoped>
/* Animación de flotación */
.animate-float {
    animation: float 6s ease-in-out infinite;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(-50%) translateX(0);
    }

    50% {
        transform: translateY(-50%) translateX(-10px);
    }
}

/* Animación de deslizamiento */
.animate-slide-in-left {
    animation: slideInLeft 0.5s ease-out;
}

.animate-slide-in-right {
    animation: slideInRight 0.5s ease-out;
}

@keyframes slideInLeft {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Animación de gradiente */
.animate-gradient {
    background-size: 200% 200%;
    animation: gradient 3s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

/* Animación de pulso lento */
.animate-pulse-slow {
    animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.8;
    }
}
</style>