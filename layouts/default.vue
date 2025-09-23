<template>
    <div
        class="min-h-screen flex flex-col transition-colors duration-300 relative overflow-hidden bg-white dark:bg-slate-900">
        <!-- Fondo animado -->
        <div class="absolute inset-0 -z-10">
            <div class="animated-bg"></div>
        </div>

        <!-- Navbar sticky -->
        <Navbar class="sticky top-0 z-50 shadow-sm" />

        <!-- Main content -->
        <main class="flex-1">
            <div class="relative py-0 max-w-5xl mx-auto">
                <slot />
            </div>
        </main>

        <!-- Floating cart button -->
        <FloatingCartButton class="fixed bottom-6 right-6 z-40" />

        <!-- Footer -->
        <Footer class="bg-transparent backdrop-blur-md border-t border-gray-200 dark:border-slate-700" />
    </div>
</template>

<script setup lang="ts">
// Opcional: imports si necesitas
</script>

<style scoped>
/* Animación de gradiente moderno */
.animated-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20% 20%,
            rgba(99, 102, 241, 0.35),
            transparent 40%),
        radial-gradient(circle at 80% 30%,
            rgba(236, 72, 153, 0.35),
            transparent 40%),
        radial-gradient(circle at 40% 80%,
            rgba(34, 211, 238, 0.35),
            transparent 40%);
    animation: move-bg 20s ease-in-out infinite alternate;
    filter: blur(60px);
    opacity: 0.6;
}

@keyframes move-bg {
    0% {
        transform: translate(0, 0) scale(1);
    }

    50% {
        transform: translate(-10%, -10%) scale(1.2);
    }

    100% {
        transform: translate(10%, 10%) scale(1);
    }
}

/* Scrollbar moderno */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
}

::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
}

.dark ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
}

/* iOS viewport fix */
@supports (-webkit-touch-callout: none) {
    .min-h-screen {
        min-height: -webkit-fill-available;
    }
}
</style>
