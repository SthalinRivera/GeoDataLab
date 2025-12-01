<template>
    <div class="min-h-screen flex flex-col transition-colors duration-500 relative overflow-hidden ">



        <!-- Navbar sticky con glassmorphism -->
        <Navbar
            class="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 shadow-lg shadow-blue-500/5" />

        <!-- Main content -->
        <main class="flex-1 relative z-10">
            <div class="py-0  w-full mx-auto">
                <slot />
            </div>
        </main>

        <!-- Floating cart button -->
        <FloatingCartButton class="fixed bottom-6 right-6 z-50" />

        <!-- Footer -->
        <Footer />

    </div>
</template>

<script setup lang="ts">
// Opcional: imports si necesitas
</script>

<style scoped></style>