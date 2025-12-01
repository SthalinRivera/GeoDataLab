<template>
    <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ title }}</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ value }}</p>
                <div class="flex items-center mt-2" v-if="change !== undefined">
                    <Icon :name="change >= 0 ? 'ri:arrow-up-line' : 'ri:arrow-down-line'" class="h-4 w-4 mr-1"
                        :class="change >= 0 ? 'text-green-500' : 'text-red-500'" />
                    <span class="text-sm" :class="change >= 0 ? 'text-green-600' : 'text-red-600'">
                        {{ Math.abs(change) }}%
                    </span>
                    <span class="text-sm text-gray-500 dark:text-gray-400 ml-1">desde el último mes</span>
                </div>
            </div>
            <div class="p-3 rounded-lg" :class="colorClasses">
                <Icon :name="icon" class="h-6 w-6" :class="iconColor" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    title: string
    value: string
    icon: string
    color: 'blue' | 'red' | 'green' | 'orange' | 'purple'
    change?: number
}

const props = defineProps<Props>()

const colorClasses = computed(() => {
    const classes = {
        blue: 'bg-blue-100 dark:bg-blue-900/20',
        red: 'bg-red-100 dark:bg-red-900/20',
        green: 'bg-green-100 dark:bg-green-900/20',
        orange: 'bg-orange-100 dark:bg-orange-900/20',
        purple: 'bg-purple-100 dark:bg-purple-900/20'
    }
    return classes[props.color]
})

const iconColor = computed(() => {
    const classes = {
        blue: 'text-blue-600 dark:text-blue-400',
        red: 'text-red-600 dark:text-red-400',
        green: 'text-green-600 dark:text-green-400',
        orange: 'text-orange-600 dark:text-orange-400',
        purple: 'text-purple-600 dark:text-purple-400'
    }
    return classes[props.color]
})
</script>