<template>
    <div class="space-y-2">
        <div class="flex justify-between text-sm">
            <span class="text-gray-700 dark:text-gray-300 font-medium">{{ label }}</span>
            <span class="font-semibold" :style="{ color: color }">
                {{ (value * 100).toFixed(0) }}%
            </span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div class="h-2 rounded-full transition-all duration-500" :style="{
                width: `${value * 100}%`,
                backgroundColor: color
            }"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    label: string
    value: number
    color: string
}

defineProps<Props>()
</script>