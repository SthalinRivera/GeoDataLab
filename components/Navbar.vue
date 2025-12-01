<template>
    <div class="">
        <!-- Barra de navegación principal - Diseño compacto y moderno -->
        <nav
            class="w-full top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-700/60 shadow-sm">
            <div class="max-w-6xl flex items-center justify-between mx-auto px-4 py-2">
                <!-- Logo mejorado -->
                <NuxtLink to="/" class="flex items-center gap-3 group" @click="isMobileMenuOpen = false">
                    <div
                        class="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                    </div>
                    <span
                        class="font-bold text-xl tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">GeoDataLab</span>
                </NuxtLink>

                <!-- Botón para menú móvil mejorado -->
                <button
                    class="lg:hidden rounded-xl p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-all duration-200 shadow-sm"
                    @click.stop="toggleMobileMenu" aria-label="Toggle menu" aria-expanded="isMobileMenuOpen">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5">
                        <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round"
                            d="M12 6.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zM12 12.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zM12 18.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Menú desplegable rediseñado -->
                <div v-click-outside="closeMobileMenu" :class="[
                    'lg:flex',
                    'absolute lg:relative',
                    'left-0 right-0',
                    'flex-col lg:flex-row items-center',
                    'bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl lg:bg-transparent lg:dark:bg-transparent',
                    'w-full lg:w-auto',
                    'py-3 lg:py-0',
                    'shadow-2xl lg:shadow-none',
                    'border-b border-gray-200 dark:border-gray-700 lg:border-none',
                    'z-50',
                    'transition-all duration-300 ease-out',
                    'transform origin-top',
                    isMobileMenuOpen
                        ? 'translate-y-0 opacity-100 visible scale-y-100'
                        : '-translate-y-4 opacity-0 invisible scale-y-95 lg:opacity-100 lg:visible lg:translate-y-0 lg:scale-y-100'
                ]" style="top: 100%">

                    <!-- Enlaces de navegación compactos -->
                    <div
                        class="flex flex-col lg:flex-row items-center lg:items-stretch w-full lg:w-auto space-y-2 lg:space-y-0 lg:space-x-1 px-4 lg:px-0">
                        <div v-for="ruta in rutasSistemas()" :key="ruta.name" class="w-full lg:w-auto">
                            <template v-if="ruta && (!ruta.permiso || ruta.permiso === user?.permiso)">
                                <NuxtLink :to="ruta.path" :class="[
                                    'flex items-center py-2.5 px-4 w-full lg:w-auto rounded-xl transition-all duration-200 font-medium text-sm border',
                                    isActiveRoute(ruta.path)
                                        ? 'text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm border-transparent'
                                        : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                                ]" @click="isMobileMenuOpen = false">
                                    {{ ruta.name }}
                                </NuxtLink>
                            </template>
                        </div>
                    </div>

                    <!-- Elementos de acción compactos -->
                    <div
                        class="flex items-center justify-center lg:justify-normal mt-4 lg:mt-0 lg:ml-4 space-x-2 px-4 lg:px-0">
                        <!-- Botón modo oscuro/claro mejorado -->
                        <ClientOnly>
                            <button @click="isDark = !isDark"
                                class="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none shadow-sm"
                                aria-label="Toggle Dark Mode">
                                <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            </button>
                            <template #fallback>
                                <div class="w-9 h-9"></div>
                            </template>
                        </ClientOnly>

                        <!-- Selector de idioma mejorado -->
                        <div class="relative">
                            <select v-model="locale"
                                class="appearance-none pl-3 pr-8 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer transition-all duration-200 shadow-sm">
                                <option value="es">ES</option>
                                <option value="en">EN</option>
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        <!-- Botón Reportar -->
                        <NuxtLink to="/report-garbage"
                            class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-medium hover:shadow-md transition-all duration-200 focus:outline-none shadow-sm"
                            @click="openReportModal">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span class="hidden sm:inline">Reportar</span>

                        </NuxtLink>
                        <!-- Menú de usuario -->
                        <ClientOnly v-if="loggedIn">
                            <LayoutUsuario />
                        </ClientOnly>
                        <ClientOnly v-if="!loggedIn">
                            <LayoutUsuario />
                        </ClientOnly>

                        <!-- Favoritos rediseñado -->
                        <!-- <NuxtLink to="/report-garbage"
                            class="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
                            @click="isMobileMenuOpen = false">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span v-if="totalItemsFavorite > 0"
                                class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-medium shadow-sm">
                                {{ totalItemsFavorite }}
                            </span>
                        </NuxtLink> -->

                    </div>
                </div>
            </div>
        </nav>

        <!-- Modal del carrito -->
        <ShoppingCart :isOpen="isCartOpen" @update:isOpen="isCartOpen = $event" />

        <!-- Modal de Reportar -->
        <ReportModal :isOpen="isReportModalOpen" @update:isOpen="isReportModalOpen = $event" />
    </div>
</template>

<script setup lang="ts">
import rutasSistemas from '~/utils/rutasSistemas';
const route = useRoute();
const { locale } = useI18n();
const isCartOpen = ref(false);
const isMobileMenuOpen = ref(false);
const isReportModalOpen = ref(false);
const { loggedIn, user } = useUserSession();

// Alternar menú móvil
const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Cerrar menú móvil
const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
};

// Abrir modal de reportar
const openReportModal = () => {
    isReportModalOpen.value = true;
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
    transition: all 0.3s ease;
}

/* Asegurar que el menú móvil tenga el z-index correcto */
.absolute {
    z-index: 50;
}

/* Efecto de despliegue mejorado para el menú móvil */
.transform {
    transition-property: transform, opacity, visibility;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mejora visual para enlaces activos */
.router-link-active {
    position: relative;
    font-weight: 600;
}

/* Efecto hover mejorado */
.hover-lift:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Gradiente sutil para el fondo del navbar */
nav {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%);
}

.dark nav {
    background: linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.98) 100%);
}
</style>