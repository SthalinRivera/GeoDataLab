<template>
    <NuxtLink :to="{ name: 'product-id', params: { id: product.id.toString() } }"
        class="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col relative border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:scale-[1.02]">
        <div class="flex-grow flex flex-col h-full">
            <!-- Imagen del proyecto con efecto hover -->
            <div
                class="relative w-full aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <img :src="product.image_url" :alt="product.title"
                    class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                <div
                    class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                </div>
            </div>

            <!-- Contenido -->
            <div class="p-4 flex flex-col flex-grow">
                <!-- Categoría/Tecnologías -->
                <div class="mb-2">
                    <span
                        class="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                        {{ product.Category?.name || 'Web Development' }}
                    </span>
                </div>

                <!-- Título y descripción -->
                <h3 class=" text-sm md:text-md font-bold text-gray-900 dark:text-white line-clamp-3 mb-1">
                    {{ product.title }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3  mb-3 flex-grow">
                    {{ product.description }}
                </p>

                <!-- Tecnologías usadas (puedes personalizar esto) -->
                <div class="mt-auto flex flex-wrap gap-1.5">
                    <ul class="flex flex-wrap gap-2">
                        <li v-for="tech in product.technologies" :key="tech"
                            class="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 px-3 py-1 rounded-full text-[9px]">
                            {{ tech }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
    product: {
        id: number;
        title: string;
        description: string;
        project_url: string;
        code_url?: string;
        image_url: string
        tags: string[];
        technologies: string[];
        Category?: {
            name: string;
        };
    }
}>();
</script>