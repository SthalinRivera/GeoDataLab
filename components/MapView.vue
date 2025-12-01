<script setup lang="ts">
import L from "leaflet"
import { onMounted, ref } from "vue"

interface Incident {
    id: number
    title: string
    description: string
    type: string
    severity: string
    status: string
    latitude: number
    longitude: number
    address: string
}

const props = defineProps<{
    items: Incident[]
}>()

const map = ref<any>(null)

onMounted(() => {
    map.value = L.map("map").setView([-13.08, -76.35], 11) // centro Cañete

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map.value)

    // Agregar marcadores
    props.items.forEach(item => {
        const marker = L.marker([item.latitude, item.longitude]).addTo(map.value)

        marker.bindPopup(`
      <b>${item.title}</b><br>
      ${item.description}<br>
      <small>${item.address}</small>
    `)
    })
})
</script>

<template>
    <div id="map" class="w-full h-[500px] rounded-md shadow"></div>
</template>

<style scoped>
#map {
    height: 500px;
}
</style>
