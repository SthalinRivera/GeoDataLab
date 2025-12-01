<script setup lang="ts">
import { ref, onMounted } from 'vue'
const { $toast } = useNuxtApp();

// Estados reactivos
const tiempoRestante = ref('')
const ejecutando = ref(false)
const ultimoCron = ref<string | null>(null)
const logs = ref<string[]>([])
const resultados = ref<any>(null)
const incidencias = ref<string[]>([])
const jsonFinal = ref(null)
const modoOscuro = ref(false)

// Alternar modo claro/oscuro
const toggleModo = () => {
    modoOscuro.value = !modoOscuro.value
    if (modoOscuro.value) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}

// Resto del código se mantiene igual...
const calcularTiempoRestante = () => {
    const ahora = new Date()
    const proxima = new Date()

    proxima.setHours(6, 0, 0, 0)

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
        agregarLog("📡 Consultando Google News…")
        await esperar(600)

        agregarLog("🤖 Procesando información con IA…")
        await esperar(1200)

        agregarLog("💾 Guardando resultados en BD…")
        await esperar(900)

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
            "San Vicente"

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
    // Detectar preferencia del sistema
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        modoOscuro.value = true
        document.documentElement.classList.add('dark')
    }
})
</script>

<template>
    <div
        class="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 p-6">

        <!-- HEADER CON TOGGLE MODO -->
        <div class="text-center mb-8 relative">
            <button @click="toggleModo"
                class="absolute right-0 top-0 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-lg">
                <span class="text-2xl">{{ modoOscuro ? '☀️' : '🌙' }}</span>
            </button>

            <h1
                class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent mb-2">
                📰 Sistema Automático de Recolección de Noticias
            </h1>
            <p class="text-slate-600 dark:text-slate-400 text-lg">
                Google News + IA + Guardado en Base de Datos
            </p>
        </div>

        <!-- THREE COLUMN LAYOUT -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">

            <!-- LEFT COLUMN - STATUS & CONTROLS -->
            <div class="space-y-6">
                <!-- COUNTDOWN CARD -->
                <div
                    class="bg-white dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div class="p-4 border-b border-slate-100 dark:border-slate-700/50">
                        <div class="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                            <span class="text-xl">⏳</span>
                            <span>Próxima ejecución automática</span>
                        </div>
                    </div>
                    <div class="p-6 text-center">
                        <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 animate-pulse">
                            {{ tiempoRestante }}
                        </div>
                    </div>
                </div>

                <!-- LAST EXECUTION CARD -->
                <div
                    class="bg-white dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div class="p-4 border-b border-slate-100 dark:border-slate-700/50">
                        <div class="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                            <span class="text-xl">🔄</span>
                            <span>Última ejecución</span>
                        </div>
                    </div>
                    <div class="p-6 text-center">
                        <div class="text-lg font-medium text-green-600 dark:text-green-400">
                            {{ ultimoCron || 'Ninguna ejecución aún' }}
                        </div>
                    </div>
                </div>

                <!-- ACTION BUTTONS -->
                <button @click="ejecutarAhora" :disabled="ejecutando"
                    class="w-full p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-600 dark:disabled:to-slate-700 rounded-2xl font-bold text-white dark:text-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-3">
                    <span class="text-xl">{{ ejecutando ? "⏳" : "🚀" }}</span>
                    <span>{{ ejecutando ? "Procesando…" : "Ejecutar Cron Manualmente" }}</span>
                </button>

                <button @click="guardarResultados"
                    class="w-full p-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-2xl font-bold text-white transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
                    <span class="text-xl">💾</span>
                    <span>Guardar resultados en BD</span>
                </button>
            </div>

            <!-- MIDDLE COLUMN - LOGS -->
            <div
                class="bg-white dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
                <div class="p-4 border-b border-slate-100 dark:border-slate-700/50">
                    <div class="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                        <span class="text-xl">📋</span>
                        <span>Registros del proceso</span>
                    </div>
                </div>
                <div class="flex-1 p-4 overflow-auto max-h-[500px]">
                    <div class="space-y-2">
                        <div v-for="(l, i) in logs" :key="i"
                            class="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600/30 hover:border-slate-300 dark:hover:border-slate-500/50 transition-colors duration-200">
                            <div class="flex items-start gap-3">
                                <span class="text-sm text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0">
                                    {{ new Date().toLocaleTimeString() }}
                                </span>
                                <span class="text-slate-700 dark:text-slate-200 flex-1">{{ l }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT COLUMN - RESULTS -->
            <div class="space-y-6">
                <!-- RESULTS CARD -->
                <div v-if="resultados"
                    class="bg-white dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div class="p-4 border-b border-slate-100 dark:border-slate-700/50">
                        <div class="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                            <span class="text-xl">📰</span>
                            <span>Noticias Analizadas</span>
                        </div>
                    </div>

                    <div v-if="resultados?.error" class="p-6">
                        <div
                            class="bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/30 rounded-xl p-4 text-red-700 dark:text-red-300">
                            {{ resultados.error }}
                        </div>
                    </div>

                    <div v-else class="p-4 space-y-4 max-h-[500px] overflow-auto">
                        <div v-for="(item, i) in resultados.noticias" :key="i"
                            class="bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-600/30 p-4 hover:border-slate-300 dark:hover:border-slate-500/50 transition-all duration-300">
                            <h3 class="font-bold text-lg text-slate-800 dark:text-white mb-2 line-clamp-2">
                                {{ item.noticia.titulo }}
                            </h3>

                            <a :href="item.noticia.link" target="_blank"
                                class="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-3 text-sm">
                                <span>Ver noticia original</span>
                                <span>→</span>
                            </a>

                            <div class="grid grid-cols-2 gap-3 text-sm">
                                <div class="space-y-1">
                                    <div class="flex justify-between">
                                        <span class="text-slate-600 dark:text-slate-400">Tipo:</span>
                                        <span class="text-slate-800 dark:text-white font-medium">{{
                                            item.analisis.tipo_robo }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-slate-600 dark:text-slate-400">Lugar:</span>
                                        <span class="text-slate-800 dark:text-white font-medium">{{ item.analisis.lugar
                                        }}</span>
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <div class="flex justify-between">
                                        <span class="text-slate-600 dark:text-slate-400">Gravedad:</span>
                                        <span class="text-slate-800 dark:text-white font-medium">{{
                                            item.analisis.gravedad }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-slate-600 dark:text-slate-400">Fecha:</span>
                                        <span class="text-slate-800 dark:text-white font-medium">{{
                                            item.analisis.fecha_aprox }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600/30">
                                <div class="text-slate-600 dark:text-slate-400 text-sm mb-1">Resumen:</div>
                                <div class="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
                                    {{ item.analisis.resumen }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- JSON FINAL CARD -->
                <div v-if="jsonFinal"
                    class="bg-white dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div class="p-4 border-b border-slate-100 dark:border-slate-700/50">
                        <div class="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                            <span class="text-xl">📄</span>
                            <span>JSON Final</span>
                        </div>
                    </div>
                    <div class="p-4">
                        <pre
                            class="text-xs bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 overflow-auto text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/30">{{ jsonFinal }}</pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>