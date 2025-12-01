<script setup lang="ts">
import CronJob from '~/components/CronJob.vue';

const navigateTo = useRouter()
</script>
<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800 p-4">
        <div class="">
            <!-- Two Column Layout -->
            <div class="grid grid-cols-1  gap-8 ">
                <!-- Automatic Cron Job Card (MÁS GRANDE) -->
                <div class="">
                    <div class="w-full">

                        <div class="text-center space-y-6">
                            <!-- Button -->
                            <div class="pt-4">
                                <CronJob />
                            </div>
                            <!-- Button -->
                            <div class="pt-4">
                                <FLujoAutomatizadoNoticias></FLujoAutomatizadoNoticias>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>