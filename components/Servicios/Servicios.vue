<template>
    <div class=" bg-slate-100/50 dark:bg-gray-900/50 rounded-xl shadow-lg mt-1 p-2">
        <div class="">
            <!-- Encabezado minimalista con más impacto -->
            <!-- Opción 1: Línea decorativa a ambos lados -->
            <div class="flex items-center justify-center mb-2">
                <div class="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                <h3
                    class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mx-4 text-center">
                    {{ $t("our_services") }}
                </h3>
                <div class="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            </div>
            <!-- Grid de servicios más compacto y visual -->
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                <!-- Tarjeta de servicio ultra moderna -->
                <NuxtLink v-for="service in services" :key="service.id" :to="`/services/${service.id}`"
                    class="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">

                    <!-- Efecto de gradiente sutil al fondo -->
                    <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                        :class="service.gradient"></div>

                    <!-- Cabecera compacta con icono destacado -->
                    <div class="p-5 pb-0">
                        <div class="flex items-start gap-4">
                            <div
                                class="flex-shrink-0 p-3 rounded-xl shadow-lg bg-gradient-to-tr from-blue-600 to-purple-600 text-white transition-transform duration-300 group-hover:scale-105">
                                <span class="text-2xl">{{ service.icon }}</span>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ service.name }}</h3>
                                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ service.subtitle }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Lista de características más compacta -->
                    <div class="p-5 pt-3">
                        <ul class="space-y-2 mb-4">
                            <li v-for="feature in service.features" :key="feature"
                                class="flex items-start text-sm text-gray-700 dark:text-gray-300">
                                <UIcon name="i-heroicons-check-circle" class="mt-0.5 mr-2 flex-shrink-0 text-sm"
                                    :class="`text-${service.color}-500 dark:text-${service.color}-400`" />
                                <span class="leading-snug">{{ feature }}</span>
                            </li>
                        </ul>

                        <!-- Pie de tarjeta con precio mejorado -->
                        <div
                            class="flex items-center justify-end pt-4 mt-3 border-t border-gray-100 dark:border-gray-800">
                            <span class="text-xl font-bold tracking-tight"
                                :class="`text-slate-900 dark:text-slate-100`">
                                {{ service.price }}
                            </span>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    services: {
        type: Array,
        required: true,
        default: () => []
    }
})
</script>
