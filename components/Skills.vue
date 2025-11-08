<template>
    <div class=" bg-slate-200 dark:bg-slate-900 rounded-xl  mt-1">
        <div class="flex items-center justify-center mb-1">
            <div class="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            <h3
                class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mx-4 text-center">
                {{ $t("tech_stack") }}
            </h3>
            <div class="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        </div>

        <div class="relative overflow-hidden">


            <div class="relative h-28 flex items-center overflow-hidden">
                <!-- Carrusel infinito fluido -->
                <div class="absolute flex items-center nowrap" :style="{
                    transform: `translateX(${offset}px)`,
                    transition: 'transform 0.5s linear'
                }">
                    <!-- Duplicamos los elementos para el efecto de bucle continuo -->
                    <div v-for="(skill, index) in [...skills, ...skills]" :key="`${skill.alt}-${index}`"
                        class="flex-shrink-0 mx-3">
                        <a :href="skill.href" target="_blank" rel="noreferrer"
                            class="flex flex-col items-center p-3 rounded-xl dark:bg-white/5 bg-gray-100/70 backdrop-blur-sm border dark:border-gray-700 border-gray-300 hover:border-purple-400 transition-all duration-300">
                            <img :src="skill.src" :alt="skill.alt" width="40" height="40"
                                class="transition-transform duration-300 hover:scale-125 dark:brightness-100 brightness-90" />
                            <span class="text-xs mt-1 dark:text-gray-300 text-gray-600">{{ skill.alt }}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const skills = ref([
    { href: 'https://aws.amazon.com', src: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', alt: 'AWS' },
    { href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', src: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg', alt: 'JavaScript' },
    { href: 'https://www.typescriptlang.org/', src: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg', alt: 'TypeScript' },
    { href: 'https://vuejs.org/', src: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original-wordmark.svg', alt: 'Vue.js' },
    { href: 'https://reactjs.org/', src: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg', alt: 'React' },
    { href: 'https://nodejs.org', src: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg', alt: 'Node.js' },
    { href: 'https://expressjs.com', src: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg', alt: 'Express' },
    { href: 'https://www.mongodb.com/', src: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg', alt: 'MongoDB' },
    { href: 'https://www.postgresql.org', src: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg', alt: 'PostgreSQL' },
    { href: 'https://www.docker.com/', src: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg', alt: 'Docker' },
]);

const offset = ref(0);
const containerWidth = ref(0);
const itemWidth = 100; // Ancho aproximado de cada elemento (ajustar según necesidad)

onMounted(() => {
    // Iniciar animación
    requestAnimationFrame(animate);

    // Configurar el efecto de bucle infinito
    const resetThreshold = skills.value.length * itemWidth;

    function animate() {
        offset.value -= 0.5; // Velocidad del desplazamiento

        // Reiniciar posición para crear bucle infinito
        if (-offset.value >= resetThreshold) {
            offset.value = 0;
        }

        animationId.value = requestAnimationFrame(animate);
    }

    // Pausar al hacer hover
    const container = document.querySelector('.relative.h-28');
    if (container) {
        container.addEventListener('mouseenter', () => {
            cancelAnimationFrame(animationId.value);
        });
        container.addEventListener('mouseleave', () => {
            animationId.value = requestAnimationFrame(animate);
        });
    }
});

const animationId = ref(0);
onUnmounted(() => {
    cancelAnimationFrame(animationId.value);
});
</script>

<style>
@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}

.nowrap {
    white-space: nowrap;
}
</style>