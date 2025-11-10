<template>
    <div class="max-w-7xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-center mb-8 text-slate-900 dark:text-white relative">
            {{ $t("title_favorites") }}
            <span
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-pink-500 rounded-full"></span>
        </h1>


        <div class="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 z-10">
            <div v-for="product in favorites" :key="product.id"
                class=" rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 dark:border-slate-700 transition-all duration-300 flex flex-col">

                <!-- Imagen con botón de favoritos -->
                <div class="relative group">
                    <img class="w-full h-40 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        :src="`${product.image_url}`" :alt="product.title" />
                    <button @click="removeFavorite(product.id)"
                        class="absolute top-2 right-2 p-2 bg-white/80 dark:bg-slate-900/80 rounded-full shadow-md hover:bg-red-500 transition-all">
                        <UIcon name="i-heroicons-heart-solid"
                            class="w-4 h-4 sm:w-5 sm:h-5 text-red-500 hover:text-white" />
                    </button>
                </div>

                <!-- Contenido -->
                <div class="p-3 sm:p-4 flex-grow">
                    <div class="flex justify-between items-start mb-1 sm:mb-2">
                        <h3 class="text-sm sm:text-base font-bold text-gray-900 dark:text-white line-clamp-1">{{
                            product.title }}</h3>
                        <span
                            class="text-xs sm:text-sm bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300 py-0.5 sm:py-1 px-2 sm:px-3 rounded-full">
                            {{ product.Category?.name || 'Sin categoría' }}
                        </span>
                    </div>

                    <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 sm:mt-2 line-clamp-2">{{
                        product.description }}</p>

                    <div class="mt-3 sm:mt-4 flex justify-between items-center">

                        <div class="flex gap-2">
                            <NuxtLink :to="`/product/${product.id}`">
                                <button
                                    class="p-1.5 sm:p-2 bg-pink-500 text-white rounded-lg shadow-sm hover:bg-pink-600 transition-colors">
                                    <UIcon name="i-heroicons-eye" class="w-4 h-4" />
                                </button>
                            </NuxtLink>
                            <button @click="removeFavorite(product.id)"
                                class="p-1.5 sm:p-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition-colors">
                                <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="favorites.length === 0"
            class="mt-10 py-16 flex flex-col items-center justify-center text-center  rounded-xl shadow-md border border-gray-100 dark:border-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            <p class="text-xl font-medium text-gray-600 dark:text-gray-300">No tienes proyectos en favoritos.</p>
            <p class="text-gray-500 dark:text-gray-400 mt-2">Explora nuestros proyectos y agrega a favoritos
                aquí.</p>
            <NuxtLink to="/product"
                class="mt-6 bg-pink-500 dark:bg-pink-600 hover:bg-pink-600 dark:hover:bg-pink-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-md transition-all duration-200">
                Explorar proyectos
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
const { $toast } = useNuxtApp();
const productStore = useProductStore();
const { favorites } = storeToRefs(productStore);

const removeFavorite = (id: number) => {
    productStore.deleteFavorites(id);
    $toast.error('Producto eliminado de favoritos!');
};
</script>