<script setup lang="ts">
import { ref, onMounted } from 'vue'

const tiempoRestante = ref('')
const ejecutando = ref(false)
const ultimoCron = ref<string | null>(null)
const logs = ref<string[]>([])
const resultados = ref<any>(null)


// ------------------------------------------
// FUNCIÓN: Cálculo del próximo cron
// ------------------------------------------
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

// ------------------------------------------
// Ejecutar el cron manualmente
// ------------------------------------------
const ejecutarAhora = async () => {
    ejecutando.value = true
    logs.value = [] // limpiar logs antes de iniciar
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

        // 🔥 Ejecución real
        const r = await $fetch('/api/analizarcron')

        console.log("📥 Respuesta backend:", r)

        // 📌 Si backend devuelve error (por ejemplo: no hay noticias recientes)
        if (r.error) {
            agregarLog("⚠️ " + r.error)
            resultados.value = { error: r.error }
            ejecutando.value = false
            return
        }

        // 📦 Resultado normal
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

// Helpers
const esperar = (ms: number) => new Promise(r => setTimeout(r, ms))
const agregarLog = (msg: string) => logs.value.push(msg)

onMounted(() => {
    calcularTiempoRestante()
})
</script>


<template>
    <div class="max-w-5xl mx-auto p-6 space-y-6">

        <!-- HEADER -->
        <h1 class="text-3xl font-bold text-center">
            📰 Sistema Automático de Recolección de Noticias
        </h1>
        <p class="text-center text-gray-600 dark:text-gray-300">
            Google News + IA + Guardado en Base de Datos
        </p>

        <!-- COUNTDOWN -->
        <div class="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-6 rounded-xl shadow-lg text-center">
            <h2 class="text-xl font-semibold">⏳ Próxima ejecución automática</h2>
            <p class="text-4xl font-black mt-3 animate-pulse">{{ tiempoRestante }}</p>
        </div>

        <!-- LAST EXECUTION -->
        <div class="bg-green-100 dark:bg-green-900 p-4 rounded-lg shadow">
            <p class="text-center text-lg">
                Última ejecución:
                <strong>{{ ultimoCron || 'Ninguna ejecución aún' }}</strong>
            </p>
        </div>

        <!-- BUTTON -->
        <button @click="ejecutarAhora" :disabled="ejecutando" class="w-full py-3 rounded-lg shadow-xl text-white text-lg font-bold
            transition disabled:opacity-50 disabled:cursor-not-allowed
            bg-blue-600 hover:bg-blue-700">
            {{ ejecutando ? "Procesando…" : "Ejecutar Cron Manualmente (TEST)" }}
        </button>

        <!-- LOG CONSOLE -->
        <div class="bg-gray-900 p-4 rounded-lg h-56 overflow-auto shadow-inner">
            <h3 class="text-white font-bold mb-2">📋 Registros del proceso</h3>
            <div class="text-green-400 font-mono text-sm space-y-1">
                <p v-for="(l, i) in logs" :key="i"> {{ l }} </p>
            </div>
        </div>
        <div v-if="resultados?.error" class="mt-4 p-3 bg-red-600 text-white rounded">
            {{ resultados.error }}
        </div>
        <!-- RESULTS -->
        <div v-if="resultados" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 class="text-2xl font-bold mb-4">📰 Noticias Analizadas</h3>

            <div v-for="(item, i) in resultados.noticias" :key="i"
                class="border dark:border-gray-700 p-4 rounded-lg mb-4 hover:shadow-lg transition">
                <h3 class="font-bold text-lg">{{ item.noticia.titulo }}</h3>

                <a :href="item.noticia.link" target="_blank" class="text-blue-600 hover:underline">
                    Ver noticia original →
                </a>

                <div class="mt-3 text-sm space-y-1">
                    <p><strong>Tipo:</strong> {{ item.analisis.tipo_robo }}</p>
                    <p><strong>Lugar:</strong> {{ item.analisis.lugar }}</p>
                    <p><strong>Gravedad:</strong> {{ item.analisis.gravedad }}</p>
                    <p><strong>Fecha aprox:</strong> {{ item.analisis.fecha_aprox }}</p>

                    <p class="mt-2">
                        <strong>Resumen:</strong>
                        <span class="text-gray-700 dark:text-gray-300">
                            {{ item.analisis.resumen }}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
