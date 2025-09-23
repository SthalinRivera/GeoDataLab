<template>
    <div class="flex items-center justify-center px-2 py-2  transition-colors duration-300">
        <div class=" w-full mx-auto grid md:grid-cols-2 gap-8 md:gap-2 items-center">
            <!-- Columna izquierda - Información personal -->
            <div class="space-y-6">
                <div>
                    <h1 class="text-3xl md:text-4xl font-bold dark:text-white text-gray-900 mb-2">
                        Hola, soy
                    </h1>
                    <h2 class="text-4xl md:text-5xl font-bold gradient-text">
                        Sthalin Rivera
                    </h2>
                </div>

                <p class="text-lg dark:text-gray-300 text-gray-600 leading-relaxed">
                    Desarrollador web con experiencia en <strong class="dark:text-white text-gray-800">Nuxt</strong>,
                    <strong class="dark:text-white text-gray-800">Laravel</strong>,
                    <strong class="dark:text-white text-gray-800">PostgreSQL</strong> y
                    <strong class="dark:text-white text-gray-800">análisis estadístico</strong>.
                </p>

                <div class="flex flex-wrap gap-3">
                    <NuxtLink to="/product"
                        class="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#8000FF] to-[#FF8660] text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 text-sm">
                        Ver proyectos
                    </NuxtLink>
                    <a href="https://wa.me/51910985938?text=Hola,%20quiero%20más%20información%20sobre%20tu%20trabajo"
                        target="_blank" rel="noopener noreferrer"
                        class="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 text-sm">
                        <i class="fab fa-whatsapp text-white"></i>
                        WhatsApp
                    </a>
                </div>
            </div>

            <!-- Columna derecha - Estadísticas -->
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md stat-card text-center">
                    <h3 class="text-2xl font-bold dark:text-white text-gray-800">4+</h3>
                    <p class="dark:text-gray-300 text-gray-600 text-sm mt-1">Años de experiencia</p>
                </div>
                <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md stat-card text-center">
                    <h3 class="text-2xl font-bold dark:text-white text-gray-800">24+</h3>
                    <p class="dark:text-gray-300 text-gray-600 text-sm mt-1">Proyectos completados</p>
                </div>
                <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md stat-card text-center">
                    <h3 class="text-2xl font-bold dark:text-white text-gray-800">23+</h3>
                    <p class="dark:text-gray-300 text-gray-600 text-sm mt-1">Clientes satisfechos</p>
                </div>
                <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md stat-card text-center">
                    <h3 class="text-2xl font-bold dark:text-white text-gray-800">2+</h3>
                    <p class="dark:text-gray-300 text-gray-600 text-sm mt-1">Países con clientes</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// El script se mantiene igual
import { onMounted } from 'vue'

onMounted(() => {
    const words = ["experiencias", "proyectos", "sueños", "ideas", "pasión"];
    let currentWord = 0;
    const element = document.querySelector('.animate-wiggle');

    if (element) {
        setInterval(() => {
            currentWord = (currentWord + 1) % words.length;
            element.style.opacity = '0';

            setTimeout(() => {
                element.textContent = words[currentWord];
                element.style.opacity = '1';
            }, 500);
        }, 3000);
    }
});
</script>

<style scoped>
.gradient-text {
    background: linear-gradient(135deg, #FF8660 0%, #8000FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.stat-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>