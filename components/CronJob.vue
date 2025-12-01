<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { $toast } = useNuxtApp()

// Estados reactivos
const tiempoRestante = ref('')
const ejecutando = ref(false)
const ultimoCron = ref<string | null>(null)
const logs = ref<string[]>([])
const resultados = ref<any>(null)
const jsonFinal = ref(null)
const autoRunByHora = 2;
// Resto del código se mantiene igual...
const calcularTiempoRestante = () => {
    const ahora = new Date()
    const proxima = new Date()

    proxima.setHours(autoRunByHora, 0, 0, 0)

    if (ahora > proxima) proxima.setDate(proxima.getDate() + 1)

    const diff = proxima.getTime() - ahora.getTime()

    const h = Math.floor(diff / (1000 * 60 * 60))
    const m = Math.floor((diff / (1000 * 60)) % 60)
    const s = Math.floor((diff / 1000) % 60)

    tiempoRestante.value = `${h}h ${m}m ${s}s`
}

setInterval(calcularTiempoRestante, 1000)

const ejecutarAhora = async () => {
    ejecutando.value = true
    logs.value = []
    resultados.value = null

    agregarLog("🚀 Iniciando ejecución automática…")
    await esperar(800)

    try {

        const r = await $fetch('/api/analizarcron')

        if (r.error) {
            agregarLog("⚠️ " + r.error)
            resultados.value = { error: r.error }
            ejecutando.value = false
            return
        }

        resultados.value = r
        ultimoCron.value = new Date().toLocaleString()
        agregarLog("✅ Proceso completado correctamente")

    } catch (error) {
        agregarLog("❌ Error durante el proceso")
        console.error(error)
        resultados.value = { error: "Error inesperado en el cliente" }
    }

    ejecutando.value = false
}

const guardarResultados = async () => {
    try {
        if (!resultados.value) {
            $toast.error("⚠ No hay resultados para guardar")
            return
        }

        if (resultados.value.error) {
            $toast.error("⚠ " + resultados.value.error)
            return
        }

        const distritoDetectado =
            resultados.value.noticias[0]?.analisis?.distrito ||
            "IMPERIAL"

        jsonFinal.value = {
            distrito: distritoDetectado,
            incidencias: [],
            resultados: resultados.value
        }

        const res = await $fetch('/api/v1/addIncidentReport', {
            method: 'POST',
            body: jsonFinal.value
        })

        if (res.error) {
            $toast.error("❌ Error: " + res.error)
            return
        }

        $toast.success(`✅ Noticias guardadas correctamente (${res.guardados})`)
        jsonFinal.value = null
        resultados.value = null
        logs.value.push("📦 Datos guardados en base de datos")

    } catch (err) {
        console.error(err)
        $toast.error("❌ Error inesperado al guardar")
    }
}

const esperar = (ms: number) => new Promise(r => setTimeout(r, ms))
const agregarLog = (msg: string) => logs.value.push(msg)

onMounted(() => {
    calcularTiempoRestante()
})
</script>

<template>
    <UContainer class="py-8 space-y-8">
        <!-- HEADER -->
        <div class="text-center space-y-4">
            <UCard>
                <template #header>
                    <div class="text-center">
                        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                            Automatic Cron Job
                        </h1>
                        <p class="text-gray-600 dark:text-gray-300 mt-2">
                            Ejecución automática programada cada {{ autoRunByHora }} horas que recolecta y analiza
                            noticias usando IA.
                        </p>
                    </div>
                </template>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                        <UIcon name="i-heroicons-clock" class="text-primary-500" />
                        <span class="text-sm">Auto-run cada {{ autoRunByHora }} horas</span>
                    </div>
                    <div class="flex items-center justify-center gap-2">
                        <UIcon name="i-heroicons-cpu-chip" class="text-primary-500" />
                        <span class="text-sm">Análisis con IA</span>
                    </div>
                    <div class="flex items-center justify-center gap-2">
                        <UIcon name="i-heroicons-database" class="text-primary-500" />
                        <span class="text-sm">Guardado automático en BD</span>
                    </div>
                </div>
            </UCard>
        </div>

        <!-- THREE COLUMN LAYOUT -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <!-- LEFT COLUMN - STATUS & CONTROLS -->
            <div class="space-y-6">
                <!-- COUNTDOWN CARD -->
                <UCard>
                    <template #header>
                        <div class="flex items-center gap-2">
                            <UIcon name="i-heroicons-clock" />
                            <span>Próxima ejecución automática</span>
                        </div>
                    </template>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-primary-600 animate-pulse">
                            {{ tiempoRestante }}
                        </div>
                    </div>
                </UCard>

                <!-- LAST EXECUTION CARD -->
                <UCard>
                    <template #header>
                        <div class="flex items-center gap-2">
                            <UIcon name="i-heroicons-arrow-path" />
                            <span>Última ejecución</span>
                        </div>
                    </template>
                    <div class="text-center">
                        <div class="text-lg font-medium text-green-600">
                            {{ ultimoCron || 'Ninguna ejecución aún' }}
                        </div>
                    </div>
                </UCard>

                <!-- ACTION BUTTONS -->
                <UButton @click="ejecutarAhora" :disabled="ejecutando" :loading="ejecutando" icon="i-heroicons-play"
                    size="xl" color="primary" class="w-full">
                    {{ ejecutando ? "Procesando…" : "Ejecutar Cron Manualmente" }}
                </UButton>

                <UButton @click="guardarResultados" icon="i-heroicons-document-arrow-down" size="xl" color="emerald"
                    class="w-full">
                    Guardar resultados en BD
                </UButton>
            </div>

            <!-- MIDDLE COLUMN - LOGS -->
            <UCard class="flex flex-col">
                <template #header>
                    <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-clipboard-document-list" />
                        <span>Registros del proceso</span>
                    </div>
                </template>

                <div class="flex-1 overflow-auto max-h-[500px] space-y-2">
                    <div v-for="(l, i) in logs" :key="i" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div class="flex items-start gap-3">
                            <span class="text-sm text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0">
                                {{ new Date().toLocaleTimeString() }}
                            </span>
                            <span class="text-gray-700 dark:text-gray-200 flex-1">{{ l }}</span>
                        </div>
                    </div>
                </div>
            </UCard>

            <!-- RIGHT COLUMN - RESULTS -->
            <div class="space-y-6">
                <!-- RESULTS CARD -->
                <UCard v-if="resultados">
                    <template #header>
                        <div class="flex items-center gap-2">
                            <UIcon name="i-heroicons-newspaper" />
                            <span>Noticias Analizadas</span>
                        </div>
                    </template>

                    <UAlert v-if="resultados?.error" icon="i-heroicons-exclamation-triangle" color="red"
                        variant="outline" :title="resultados.error" />

                    <div v-else class="space-y-4 max-h-[500px] overflow-auto">
                        <UCard v-for="(item, i) in resultados.noticias" :key="i" class="hover:shadow-md transition-all">
                            <template #header>
                                <h3 class="font-bold text-lg line-clamp-2">
                                    {{ item.noticia.titulo }}
                                </h3>
                                <ULink :href="item.noticia.link" target="_blank" class="text-sm" color="primary">
                                    Ver noticia original
                                </ULink>
                            </template>

                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div class="space-y-2">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Tipo:</span>
                                        <span class="font-medium">{{ item.analisis.tipo_robo }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Lugar:</span>
                                        <span class="font-medium">{{ item.analisis.lugar }}</span>
                                    </div>
                                </div>
                                <div class="space-y-2">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Gravedad:</span>
                                        <span class="font-medium">{{ item.analisis.gravedad }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Fecha:</span>
                                        <span class="font-medium">{{ item.analisis.fecha_aprox }}</span>
                                    </div>
                                </div>
                            </div>

                            <template #footer>
                                <div>
                                    <p class="text-gray-600 dark:text-gray-400 text-sm mb-1">Resumen:</p>
                                    <p class="text-sm leading-relaxed">
                                        {{ item.analisis.resumen }}
                                    </p>
                                </div>
                            </template>
                        </UCard>
                    </div>
                </UCard>

                <!-- JSON FINAL CARD -->
                <UCard v-if="jsonFinal">
                    <template #header>
                        <div class="flex items-center gap-2">
                            <UIcon name="i-heroicons-code-bracket" />
                            <span>JSON Final</span>
                        </div>
                    </template>

                    <UCodeBlock :code="JSON.stringify(jsonFinal, null, 2)" language="json"
                        icon="i-heroicons-clipboard-document" :copy-button="{
                            icon: 'i-heroicons-clipboard-document',
                            color: 'gray' as const,
                            variant: 'outline' as const
                        }" />
                </UCard>
            </div>
        </div>
    </UContainer>
</template>