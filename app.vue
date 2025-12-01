<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: 'GeoData Lab | Análisis Geoespacial, IA y Ciencia de Datos',
  meta: [
    {
      name: 'description',
      content:
        'GeoData Lab es una plataforma dedicada al análisis geoespacial, ciencia de datos e inteligencia artificial aplicada a problemas reales como territorio, medio ambiente y urbanización.'
    },
    {
      name: 'keywords',
      content:
        'GeoData Lab, análisis geoespacial, IA, inteligencia artificial, ciencia de datos, data science, Earth Engine, SIG, mapas, análisis territorial'
    }
  ],
  bodyAttrs: {
    class: 'bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'
  },
  script: [
    {
      innerHTML:
        "console.log('👋 Bienvenido a GeoData Lab — Si llegaste hasta la consola es porque eres curioso 😄');"
    }
  ]
})
</script>
