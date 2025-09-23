<script setup lang="ts">
definePageMeta({
    middleware: ['auth'],
    layout: 'dashboard',
});

const { data: report, pending, error } = await useAsyncData('dashboardReport', () =>
    $fetch('/api/v1/dashboardReport')
);
const { data: visitStats } = await useFetch('/api/v1/getVisitStats')

const fallbackData = {
    daily: {
        "2025-04-24": 15,
        "2025-04-25": 52,
        "2025-04-26": 71,
        "2025-04-27": 27
    },
    weekly: {},
    monthly: {},
    yearly: {}
}

const selectedType = ref<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily')

const filteredData = computed(() => {
    return visitStats?.value?.[selectedType.value] || fallbackData[selectedType.value]
})
// Funciones para formatear datos
const formatoNumero = (num: number) => new Intl.NumberFormat('es-ES').format(num);
const formatoMoneda = (monto: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'PEN' }).format(monto);
const formatoFecha = (fechaString: string) => new Date(fechaString).toLocaleDateString('es-ES');
</script>

<template>
    <div class="p-6 dark:bg-gray-900 min-h-screen">


        <Breadcrumb :items="[
            { title: 'Inicio', to: '/dashboard/' },

        ]" class="mb-6" />
        <!-- Encabezado -->
        <div class="mb-8">
            <div class="flex justify-between items-start">
                <div>
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Resumen del Panel</h1>
                    <p class="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                        ¡Bienvenido! Aquí tienes un resumen de tu tienda.
                    </p>
                </div>
                <div class="flex items-center space-x-2">
                    <button
                        class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <i class="ri-refresh-line"></i>
                    </button>
                    <button
                        class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <i class="ri-more-2-line"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Carga / Error -->
        <!-- <div v-if="pending" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-4 rounded-lg">
            <div class="flex items-center">
                <i class="ri-error-warning-line mr-2"></i>
                <span>Error al cargar los datos. Por favor, inténtalo de nuevo.</span>
            </div> -->
        <!-- </div> -->
        <div>
            <!-- Tarjetas de Estadísticas -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <!-- Tarjeta de Usuarios -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex justify-between">
                        <div>
                            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Usuarios Totales</p>
                            <div class="flex items-end mt-1">
                                <h3 class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                    {{ formatoNumero(report?.stats?.totalUsers ?? 0) }}
                                </h3>
                                <span :class="[
                                    'text-xs font-medium ml-2 flex items-center pb-1',
                                    report?.stats?.growth?.users >= 0 ? 'text-green-500' : 'text-red-500'
                                ]">
                                    <i :class="[
                                        'mr-0.5',
                                        report?.stats?.growth?.users >= 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line'
                                    ]"></i>
                                    {{ Math.abs(report?.stats?.growth?.users ?? 0) }}%
                                </span>
                            </div>
                        </div>
                        <div
                            class="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                            <i class="ri-user-3-line text-lg"></i>
                        </div>
                    </div>
                    <div class="mt-4 flex justify-between items-center">
                        <a href="/dashboard/users"
                            class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors">
                            Ver todos
                        </a>
                        <span class="text-xs text-gray-400">Último: {{ report?.recentActivity?.users[0]?.name }}</span>
                    </div>
                </div>

                <!-- Tarjeta de Productos -->


                <!-- Tarjeta de Ventas -->

            </div>

            <!-- Sección de Actividad Reciente -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Columna izquierda - Actividades recientes -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                        <i class="ri-pulse-line mr-2 text-indigo-500"></i>
                        Actividad Reciente
                    </h3>

                    <div class="space-y-5">
                        <!-- Actividad de Usuario -->
                        <div
                            class="flex items-start p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                            <div
                                class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-300 mr-3">
                                <i class="ri-user-add-line text-lg"></i>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-800 dark:text-gray-100">
                                    Nuevo usuario registrado
                                </p>
                                <p class="text-sm text-gray-600 dark:text-gray-300 font-semibold mt-1">
                                    {{ report?.recentActivity?.users[0]?.name }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <i class="ri-time-line align-middle mr-1"></i>
                                    {{ formatoFecha(report?.recentActivity?.users[0]?.createdAt) }}
                                </p>
                            </div>
                        </div>

                        <!-- Actividad de Pedido -->
                        <div
                            class="flex items-start p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                            <div
                                class="flex-shrink-0 h-10 w-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-300 mr-3">
                                <i class="ri-shopping-cart-2-line text-lg"></i>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-800 dark:text-gray-100">
                                    Nuevo pedido realizado
                                </p>
                                <p class="text-sm text-gray-600 dark:text-gray-300 font-semibold mt-1">
                                    {{ formatoMoneda(report?.recentActivity?.orders[0]?.total ?? 0) }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <i class="ri-time-line align-middle mr-1"></i>
                                    {{ formatoFecha(report?.recentActivity?.orders[0]?.createdAt) }}
                                </p>
                            </div>
                        </div>

                        <!-- Actividad de Reseña -->
                        <div
                            class="flex items-start p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                            <!-- Icono de reseña -->
                            <div
                                class="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 dark:text-yellow-300 mr-3">
                                <i class="ri-star-smile-line text-lg"></i>
                            </div>

                            <!-- Contenido -->
                            <div>
                                <p class="text-sm font-medium text-gray-800 dark:text-gray-100">
                                    Nueva reseña recibida
                                </p>

                                <div class="flex items-center mt-1">
                                    <div class="flex text-amber-400 mr-2">
                                        <i v-for="star in report?.recentActivity?.reviews[0]?.rating || 0" :key="star"
                                            class="ri-star-fill"></i>
                                    </div>
                                    <span class="text-sm text-gray-600 dark:text-gray-300">
                                        en "{{ report?.recentActivity?.reviews[0]?.product?.name }}"
                                    </span>
                                </div>

                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <i class="ri-time-line align-middle mr-1"></i>
                                    {{ formatoFecha(report?.recentActivity?.reviews[0]?.createdAt) }}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Columna derecha - Gráfico -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                        <i class="ri-line-chart-line mr-2 text-blue-500"></i>
                        Estadísticas de Visitas
                    </h3>
                    <div class="h-auto p-0">
                        <!-- Selector -->
                        <div class="">
                            <select v-model="selectedType"
                                class="border rounded px-3 py-1 dark:bg-gray-700 dark:text-white">
                                <option value="daily">Diario</option>
                                <option value="weekly">Semanal</option>
                                <option value="monthly">Mensual</option>
                                <option value="yearly">Anual</option>
                            </select>
                        </div>
                        <ChartVisitByDayMonYear :daily-data="filteredData" />
                    </div>

                </div>
            </div>


        </div>
    </div>
</template>

<style scoped></style>