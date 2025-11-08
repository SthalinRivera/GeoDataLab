<template>
    <div
        class="min-h-screen flex flex-col transition-colors duration-300 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
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
