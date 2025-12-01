<template>
    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <div class="flex items-center mb-4">
                        <div
                            class="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                        </div>
                        <span class="text-xl font-bold"> GeoDataLab</span>
                    </div>
                    <p class="text-gray-400">
                        Plataforma analítica para la detección de zonas críticas urbanas mediante ciencia de datos
                        geoespacial e IA.
                    </p>
                </div>

                <div>
                    <h4 class="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
                    <ul class="space-y-2">
                        <li v-for="item in navItems" :key="item.href">
                            <button @click="scrollToSection(item.href)"
                                class="text-gray-400 hover:text-white transition-colors">
                                {{ item.label }}
                            </button>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-lg font-semibold mb-4">Contacto</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li class="flex items-center">
                            <i class="fas fa-envelope mr-2"></i>
                            <span>info@geodatalab.org</span>
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-map-marker-alt mr-2"></i>
                            <span>Universidad Tecnológica, LATAM</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2023 GeoDataLab. Proyecto Académico de Investigación. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
// Puedes añadir lógica aquí si es necesario
</script>

<style scoped>
/* Transiciones suaves para los elementos interactivos */
a,
button {
    transition: all 0.3s ease;
}

/* Efecto hover más pronunciado */
a:hover {
    transform: translateY(-2px);
}
</style>