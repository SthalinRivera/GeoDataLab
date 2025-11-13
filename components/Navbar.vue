<template>
    <div class="">
        <!-- Barra de navegación principal -->
        <nav
            class=" w-full top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
            <div class=" max-w-5xl flex items-center justify-between mx-auto px-4 py-3">
                <!-- Logo -->
                <NuxtLink to="/" class=" pl-4 md:pl-0 flex items-center gap-2" @click="isMobileMenuOpen = false">
                    <span class="font-semibold text-xl tracking-tight mr2 text-slate-900 dark:text-slate-200">STALIN
                        RIVERA</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6 text-blue-400 dark:text-blue-300">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                    </svg>
                </NuxtLink>

                <!-- Botón para menú móvil -->
                <button
                    class="lg:hidden rounded-md p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors"
                    @click.stop="toggleMobileMenu" aria-label="Toggle menu" aria-expanded="isMobileMenuOpen">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <!-- 3 puntos verticales (mobile) -->
                        <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round"
                            d="M12 6.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zM12 12.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zM12 18.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z" />
                        <!-- Icono cerrar (X) -->
                        <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Menú desplegable (se muestra en móvil y desktop) -->
                <div v-click-outside="closeMobileMenu" :class="[
                    'lg:flex',
                    'absolute lg:relative',
                    'left-0 right-0',
                    'flex-col lg:flex-row',
                    'bg-white dark:bg-gray-900 lg:bg-transparent lg:dark:bg-transparent',
                    'w-full lg:w-auto',
                    'py-4 lg:py-0',
                    'shadow-lg lg:shadow-none',
                    'z-50',
                    'transition-all duration-300 ease-in-out',
                    'transform origin-top',
                    isMobileMenuOpen
                        ? 'translate-y-0 opacity-100 visible scale-y-100'
                        : '-translate-y-4 opacity-0 invisible scale-y-95 lg:opacity-100 lg:visible lg:translate-y-0 lg:scale-y-100'
                ]" style="top: 100%">

                    <!-- Enlaces de navegación -->
                    <div
                        class="flex flex-col lg:flex-row items-center lg:items-stretch w-full lg:w-auto space-y-3 lg:space-y-0 lg:space-x-6 px-2 lg:px-0">
                        <div v-for="ruta in rutasSistemas()" :key="ruta.name" class="w-full lg:w-auto">
                            <template v-if="ruta && (!ruta.permiso || ruta.permiso === user?.permiso)">
                                <NuxtLink :to="ruta.path" :class="[
                                    'block py-2 px-2 w-full text-center lg:text-left rounded-md transition-colors lg:hover:bg-transparent',
                                    isActiveRoute(ruta.path)
                                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-medium'
                                        : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                                ]" @click="isMobileMenuOpen = false">
                                    {{ ruta.name }}
                                </NuxtLink>
                            </template>
                        </div>
                    </div>

                    <!-- Elementos de acción (modo oscuro, idioma, etc.) -->
                    <div
                        class="flex items-center justify-center lg:justify-normal mt-4 lg:mt-0 lg:ml-6 space-x-4 px-4 lg:px-0">
                        <!-- Botón modo oscuro/claro -->
                        <ClientOnly>
                            <button @click="isDark = !isDark"
                                class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
                                aria-label="Toggle Dark Mode">
                                <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            </button>
                            <template #fallback>
                                <div class="w-9 h-9"></div>
                            </template>
                        </ClientOnly>

                        <!-- Selector de idioma -->
                        <select v-model="locale"
                            class="px-3 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer transition-colors">
                            <option value="es">ES</option>
                            <option value="en">EN</option>
                        </select>

                        <!-- Menú de usuario (si está logueado) -->
                        <ClientOnly v-if="loggedIn">
                            <LayoutUsuario />
                        </ClientOnly>
                        <!-- Menú de usuario (si está logueado) -->
                        <ClientOnly v-if="!loggedIn">
                            <LayoutUsuario />
                        </ClientOnly>

                        <!-- Favoritos -->
                        <NuxtLink to="/product/favorites"
                            class="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            @click="isMobileMenuOpen = false">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span v-if="totalItemsFavorite > 0"
                                class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-medium">
                                {{ totalItemsFavorite }}
                            </span>
                        </NuxtLink>

                    </div>


                </div>
            </div>
        </nav>

        <!-- Modal del carrito -->
        <ShoppingCart :isOpen="isCartOpen" @update:isOpen="isCartOpen = $event" />
    </div>
</template>

<script setup lang="ts">
import rutasSistemas from '~/utils/rutasSistemas';
const route = useRoute();
const { locale } = useI18n();
const isCartOpen = ref(false);
const isMobileMenuOpen = ref(false);
const { loggedIn, user } = useUserSession();

// Alternar menú móvil
const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Cerrar menú móvil
const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
};

// Abrir carrito y cerrar menú móvil
const openCart = () => {
    isCartOpen.value = true;
    isMobileMenuOpen.value = false;
};

// Store del carrito
const productStore = useProductShoppingCartStore();
const { totalItems } = storeToRefs(productStore);

// Store de favoritos
const favoriteProductStore = useProductStore();
const { totalItemsFavorite } = storeToRefs(favoriteProductStore);

// Modo oscuro/claro
const colorMode = useColorMode();
const isDark = computed({
    get() {
        return colorMode.value === 'dark';
    },
    set() {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
    }
});

// Directiva para cerrar al hacer clic fuera del menú
const vClickOutside = {
    mounted(el: HTMLElement, binding: any) {
        el.clickOutsideEvent = function (event: Event) {
            if (!(el === event.target || el.contains(event.target as Node))) {
                binding.value();
            }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
    },
    unmounted(el: HTMLElement) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
    }
};

// Función para verificar si la ruta está activa
const isActiveRoute = (path: string) => {
    // Para rutas exactas
    if (route.path === path) {
        return true;
    }

    // Para rutas que empiecen con el path (para sub-rutas)
    if (path !== '/' && route.path.startsWith(path)) {
        return true;
    }

    return false;
};
</script>

<style scoped>
/* Transición suave para el navbar */
nav {
    transition: background-color 0.3s ease, border-color 0.3s ease;
}

/* Asegurar que el menú móvil tenga el z-index correcto */
.absolute {
    z-index: 50;
}

/* Efecto de despliegue para el menú móvil */
.transform {
    transition-property: transform, opacity, visibility;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>