<template>
    <div class="min-h-screen">
        <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <!-- Sección para usuarios no autenticados -->
            <div v-if="!loggedIn" class="text-center py-12">
                <div
                    class="mx-auto w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                    <UIcon name="i-heroicons-user" class="text-4xl text-gray-500 dark:text-gray-400" />
                </div>
                <h2 class="text-xl font-medium text-gray-900 dark:text-white mb-2">No has iniciado sesión</h2>
                <p class="text-gray-600 dark:text-gray-400 mb-6">
                    Inicia sesión para acceder a tu perfil
                </p>

                <UButton to="/login" color="primary" variant="solid" label="Iniciar Sesión" icon="i-heroicons-user"
                    trailing-icon="i-heroicons-arrow-right-20-solid"
                    class="px-6 py-3 font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 transform bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white sm:[&>span]:block  sm:inline-flex">
                </UButton>

            </div>

            <!-- Sección para usuarios autenticados -->
            <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Columna izquierda - Información del perfil -->
                <div class="lg:col-span-1">
                    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <div class="flex flex-col items-center">
                            <div class="relative mb-4">
                                <img :src="currentUser.urlFoto || `https://ui-avatars.com/api/?name=${currentUser.name}&background=random`"
                                    class="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow"
                                    alt="Avatar" />
                                <UButton icon="i-heroicons-camera" color="gray" variant="solid" size="sm"
                                    class="absolute bottom-0 right-0" @click="isAvatarModalOpen = true" />


                            </div>
                            <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ currentUser.name }}</h2>
                            <p class="text-gray-600 dark:text-gray-400">{{ currentUser.email }}</p>

                            <!-- Badge de rol -->
                            <UBadge :label="currentUser.permiso"
                                :color="currentUser.permiso === 'ADMINISTRADOR' ? 'red' : 'primary'" class="mt-2" />

                            <div class="mt-4 flex space-x-3">
                                <UButton icon="i-heroicons-pencil" label="Editar perfil" color="primary" variant="solid"
                                    @click="isEditModalOpen = true" />
                                <UButton icon="i-heroicons-arrow-right-on-rectangle" label="Cerrar sesión" color="red"
                                    variant="outline" @click="logout" />
                            </div>
                        </div>

                        <div class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Información personal</h3>
                            <ul class="space-y-3">
                                <li class="flex items-center">
                                    <UIcon name="i-heroicons-envelope" class="text-gray-500 dark:text-gray-400 mr-3" />
                                    <span class="text-gray-600 dark:text-gray-300">{{ currentUser.email }}</span>
                                </li>
                                <li class="flex items-center">
                                    <UIcon name="i-heroicons-phone" class="text-gray-500 dark:text-gray-400 mr-3" />
                                    <span class="text-gray-600 dark:text-gray-300">
                                        {{ currentUser.phoneNumber || 'No especificado' }}</span>
                                </li>
                                <li class="flex items-center">
                                    <UIcon name="i-heroicons-shield-check"
                                        class="text-gray-500 dark:text-gray-400 mr-3" />
                                    <span class="text-gray-600 dark:text-gray-300">Rol: {{ currentUser.permiso }}</span>
                                </li>
                                <li class="flex items-center">
                                    <UIcon name="i-heroicons-calendar" class="text-gray-500 dark:text-gray-400 mr-3" />
                                    <span class="text-gray-600 dark:text-gray-300">Miembro desde {{
                                        formatDate(currentUser.createdAt) }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Columna derecha - Contenido adicional -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Dashboard rápido para admin -->
                    <div v-if="currentUser.permiso === 'ADMINISTRADOR'"
                        class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Panel de control</h3>
                            <UIcon name="i-heroicons-shield-exclamation"
                                class="text-blue-500 dark:text-blue-400 text-xl" />
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <UCard class="hover:shadow-md transition-all cursor-pointer group" :ui="{
                                body: { padding: 'p-3 sm:p-4' },
                                ring: 'ring-1 ring-gray-200 dark:ring-gray-700'
                            }" @click="navigateTo('/dashboard/users')">
                                <div class="flex items-center gap-3">
                                    <div class="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
                                        <UIcon name="i-heroicons-users"
                                            class="text-blue-600 dark:text-blue-400 text-xl" />
                                    </div>
                                    <div>
                                        <h4 class="font-medium text-gray-800 dark:text-gray-200">Usuarios</h4>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Gestionar usuarios</p>
                                    </div>
                                </div>
                            </UCard>

                            <UCard class="hover:shadow-md transition-all cursor-pointer group" :ui="{
                                body: { padding: 'p-3 sm:p-4' },
                                ring: 'ring-1 ring-gray-200 dark:ring-gray-700'
                            }" @click="navigateTo('/dashboard/')">
                                <div class="flex items-center gap-3">
                                    <div class="bg-green-50 dark:bg-green-900/30 p-2 rounded-lg">
                                        <UIcon name="i-heroicons-chart-bar"
                                            class="text-green-600 dark:text-green-400 text-xl" />
                                    </div>
                                    <div>
                                        <h4 class="font-medium text-gray-800 dark:text-gray-200">Estadísticas</h4>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Ver métricas</p>
                                    </div>
                                </div>
                            </UCard>

                            <UCard class="hover:shadow-md transition-all cursor-pointer group" :ui="{
                                body: { padding: 'p-3 sm:p-4' },
                                ring: 'ring-1 ring-gray-200 dark:ring-gray-700'
                            }" @click="navigateTo('/dashboard/')">
                                <div class="flex items-center gap-3">
                                    <div class="bg-purple-50 dark:bg-purple-900/30 p-2 rounded-lg">
                                        <UIcon name="i-heroicons-cog"
                                            class="text-purple-600 dark:text-purple-400 text-xl" />
                                    </div>
                                    <div>
                                        <h4 class="font-medium text-gray-800 dark:text-gray-200">Configuración</h4>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Ajustes del sistema</p>
                                    </div>
                                </div>
                            </UCard>
                        </div>
                    </div>


                    <!-- Sección de órdenes recientes -->
                    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Tus órdenes recientes</h3>

                        <!-- Mensaje de redirección -->
                        <div v-if="redirectPath"
                            class="mb-6 p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div class="flex items-center gap-2">
                                <UIcon name="i-heroicons-arrow-uturn-left" class="w-5 h-5" />
                                <span>Estabas viendo una página antes de iniciar sesión.</span>
                            </div>
                            <UButton color="primary" size="sm" class="bg-blue-600 hover:bg-blue-700 text-white"
                                icon="i-heroicons-arrow-right" :label="`Continuar con ${redirectPath}`"
                                @click="goToPreviousPage" />
                        </div>

                        <!-- Sección de recursos de tesis -->
                        <div
                            class="p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mb-6 transition-all duration-300 hover:shadow-xl">
                            <!-- Encabezado compacto -->
                            <div class="flex items-center justify-between mb-4">
                                <div class="flex items-center gap-3">
                                    <div class="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md">
                                        <UIcon name="i-heroicons-academic-cap" class="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">Recursos de Tesis
                                            Premium</h3>
                                        <p
                                            class="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                                            <UIcon name="i-heroicons-lock-open" class="w-3 h-3" />
                                            Todo desbloqueado por iniciar sesión. ¡Aprovecha al máximo!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Descripción compacta -->
                            <p class="text-sm text-gray-600 dark:text-gray-300 mb-5 px-1">
                                Herramientas profesionales para redactar, planificar y generar todos los elementos de tu
                                tesis.
                            </p>

                            <!-- Botones compactos con efecto moderno -->
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <!-- Botón 1 -->
                                <UButton to="/tools/redaccion/recursos-de-tesis"
                                    class="justify-center w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden"
                                    icon="i-heroicons-book-open">
                                    <span class="relative z-10">Recursos de Tesis</span>
                                    <div
                                        class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    </div>
                                </UButton>

                                <!-- Botón 2 -->
                                <UButton to="/tools/matriz/matriz-de-consistencia"
                                    class="justify-center w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden"
                                    icon="i-heroicons-table-cells">
                                    <span class="relative z-10">Matriz de Consistencia</span>
                                    <div
                                        class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    </div>
                                </UButton>

                                <!-- Botón 3 -->
                                <UButton to="/tools/operacionalizacion/operalizacion-de-variables"
                                    class="justify-center w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden"
                                    icon="i-heroicons-variable">
                                    <span class="relative z-10">Operacionalización</span>
                                    <div
                                        class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    </div>
                                </UButton>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <!-- <div v-for="order in orders" :key="order.id"
                                class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <div class="flex justify-between items-start mb-2">
                                    <p class="font-medium">Orden #{{ order.id }}</p>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">
                                        {{ new Date(order.createdAt).toLocaleDateString() }}
                                    </p>
                                </div>

                                <div class="space-y-2 mt-2">
                                    <div v-for="item in order.orderItems" :key="item.id"
                                        class="flex items-center gap-3">
                                        <div
                                            class="flex-shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-md overflow-hidden">
                                            <img v-if="item.product.image" :src="item.product.image"
                                                :alt="item.product.name" class="w-full h-full object-cover">
                                        </div>
                                        <div class="flex-1">
                                            <p class="text-sm">{{ item.product.name }}</p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                                {{ item.quantity }} x S/. {{ item.product.price }}
                                            </p>
                                        </div>
                                        <p class="text-sm font-medium">S/. {{ (item.quantity *
                                            item.product.price) }}</p>
                                    </div>
                                </div>



                                <div
                                    class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <p class="text-sm">Estado:
                                        <span :class="{
                                            'text-green-600 dark:text-green-400': order.status === 'COMPLETED',
                                            'text-yellow-600 dark:text-yellow-400': order.status === 'PENDING',
                                            'text-red-600 dark:text-red-400': order.status === 'CANCELLED'
                                        }">
                                            {{ order.status }}
                                        </span>
                                    </p>
                                    <p class="font-medium">Total: S/.{{ order.total }}</p>
                                </div>
                            </div> -->
                            <!-- 
                            <div v-if="orders.length === 0" class="text-center py-8">
                                <div
                                    class="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                    <UIcon name="i-heroicons-shopping-bag"
                                        class="text-gray-400 dark:text-gray-500 text-2xl" />
                                </div>
                                <h4 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No tienes órdenes
                                    recientes</h4>
                                <p class="text-gray-500 dark:text-gray-400 mb-4">Proximamennte mas novedades</p>
                                <UButton icon="i-heroicons-arrow-right" trailing color="primary" variant="solid"
                                    label="Explorar proyectos" to="/product" />
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Modal para editar perfil -->
        <UModal v-model="isEditModalOpen">
            <UCard>
                <template #header>
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Editar perfil</h2>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                            @click="isEditModalOpen = false" />
                    </div>
                </template>

                <UForm :state="formData" class="space-y-4" @submit="updateProfile">
                    <UFormGroup label="Nombre completo" name="name">
                        <UInput v-model="formData.name" />
                    </UFormGroup>

                    <UFormGroup label="Correo electrónico" name="email">
                        <UInput v-model="formData.email" type="email" disabled />
                    </UFormGroup>

                    <UFormGroup label="Teléfono" name="phoneNumber">
                        <UInput v-model="formData.phoneNumber" type="tel" placeholder="+1234567890" />
                    </UFormGroup>

                    <UFormGroup label="Calle" name="street">
                        <UInput v-model="formData.address.street" placeholder="Calle 123" />
                    </UFormGroup>

                    <UFormGroup label="Ciudad" name="city">
                        <UInput v-model="formData.address.city" placeholder="Ciudad" />
                    </UFormGroup>

                    <UFormGroup label="País" name="country">
                        <UInput v-model="formData.address.country" placeholder="País" />
                    </UFormGroup>

                    <UFormGroup label="Código Postal" name="postalCode">
                        <UInput v-model="formData.address.postalCode" placeholder="Código Postal" />
                    </UFormGroup>
                    <div class="flex justify-end space-x-3 pt-4">
                        <UButton label="Cancelar" color="gray" variant="ghost" @click="isEditModalOpen = false" />
                        <UButton type="submit" label="Guardar cambios" color="primary" :loading="isUpdating" />
                    </div>
                </UForm>
            </UCard>
        </UModal>

        <!-- Modal para cambiar avatar -->
        <!-- <UModal v-model="isAvatarModalOpen">
            <UCard>
                <template #header>
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Cambiar foto de perfil</h2>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                            @click="isAvatarModalOpen = false" />
                    </div>
                </template>

                <div class="space-y-4">
                    <div class="flex justify-center">
                        <div class="relative">
                            <img :src="avatarPreview || currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}&background=random`"
                                class="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow"
                                alt="Avatar preview">
                        </div>
                    </div>
                    <div class="mt-1 flex items-center gap-4">
                        <label class="cursor-pointer">
                            <span
                                class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                <i class="ri-upload-line mr-2"></i>
                                Cambiar Imagen
                            </span>
                            <input type="file" @change="handleEditFileUpload" accept="image/*" class="hidden">
                        </label>
                        <div v-if="uploadProgress > 0 && uploadProgress < 100" class="flex-1">
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div class="bg-blue-600 h-2 rounded-full" :style="{ width: uploadProgress + '%' }">
                                </div>
                            </div>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Subiendo: {{
                                uploadProgress }}%</p>
                        </div>
                    </div>
                    <UFormGroup label="Subir nueva imagen">
                        <UInput type="file" accept="image/*" @change="handleAvatarUpload" />
                    </UFormGroup>

                    <div class="flex justify-end space-x-3 pt-4">
                        <UButton label="Cancelar" color="gray" variant="ghost" @click="isAvatarModalOpen = false" />
                        <UButton label="Guardar foto" color="primary" :loading="isUploading" @click="saveAvatar" />
                    </div>
                </div>
            </UCard>
        </UModal> -->

        <UModal v-model="isAvatarModalOpen">
            <UCard>
                <template #header>
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Cambiar foto de perfil</h2>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                            @click="isAvatarModalOpen = false" />
                    </div>
                </template>

                <div class="space-y-4">
                    <div class="flex justify-center">
                        <div class="relative">
                            <img :src="avatarPreview || currentUser.urlFoto || `https://ui-avatars.com/api/?name=${currentUser.name}&background=random`"
                                class="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow"
                                alt="Avatar preview">
                        </div>
                    </div>

                    <div class="mt-1 flex items-center gap-4">
                        <label class="cursor-pointer">
                            <span
                                class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                <UIcon name="i-heroicons-arrow-up-tray" class="mr-2" />
                                Seleccionar Imagen
                            </span>
                            <input type="file" @change="handleAvatarUpload" accept="image/*" class="hidden">
                        </label>

                        <div v-if="uploadProgress > 0 && uploadProgress < 100" class="flex-1">
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div class="bg-blue-600 h-2 rounded-full" :style="{ width: uploadProgress + '%' }">
                                </div>
                            </div>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Subiendo: {{ uploadProgress }}%</p>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 pt-4">
                        <UButton label="Cancelar" color="gray" variant="ghost" @click="isAvatarModalOpen = false" />
                        <UButton label="Guardar foto" color="primary" :loading="isUploading" @click="saveAvatar"
                            :disabled="!avatarFile" />
                    </div>
                </div>
            </UCard>
        </UModal>
    </div>
</template>

<!-- <script setup lang="ts">
const { loggedIn, user, clear } = useUserSession()
const router = useRouter()
const { $toast } = useNuxtApp();

// Modales
const isEditModalOpen = ref(false)
const isAvatarModalOpen = ref(false)

// Interfaz para la dirección
interface Address {
    street: string;
    city: string;
    country: string;
    postalCode: string;
}

// Interfaz para el usuario
interface User {
    id?: string;
    name: string;
    email: string;
    phoneNumber: string;
    role?: string;
    avatar?: string;
    createdAt?: string;
    address: Address;
}

// Usamos computed para manejar el usuario de forma segura
const currentUser = computed<User>(() => {
    return user.value || {
        name: '',
        email: '',
        phoneNumber: '',
        address: {
            street: '',
            city: '',
            country: '',
            postalCode: ''
        }
    };
});
console.log("Este usuario es para  user ", currentUser);

// Datos de formulario para edición (clonar para evitar mutaciones directas)
const formData = ref<User>({
    name: '',
    email: '',
    phoneNumber: '',
    address: {
        street: '',
        city: '',
        country: '',
        postalCode: ''
    }
});

// Vigilar cambios en currentUser para actualizar formData
watch(currentUser, (newUser) => {
    formData.value = {
        ...newUser,
        address: {
            ...newUser.address
        }
    };
}, { immediate: true });

// Avatar
const avatarPreview = ref<string | null>(null)
const avatarFile = ref<File | null>(null)
const isUploading = ref(false)
const isUpdating = ref(false)

const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const logout = async () => {
    await clear()
    router.push('/')
    $toast.error("Sesión cerrada correctamente");
}

const handleAvatarUpload = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
        avatarFile.value = input.files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
            avatarPreview.value = e.target?.result as string
        }
        reader.readAsDataURL(input.files[0])
    }
}

const saveAvatar = async () => {
    isUploading.value = true
    try {
        // Simular subida de imagen
        await new Promise(resolve => setTimeout(resolve, 1000))

        // En un entorno real, aquí llamarías a tu API
        if (avatarPreview.value && user.value) {
            user.value.avatar = avatarPreview.value
        }

        $toast.success("Foto de perfil actualizada");
        isAvatarModalOpen.value = false
    } catch (error) {
        $toast.error("Error al actualizar la foto");
    } finally {
        isUploading.value = false
    }
}

const updateProfile = async () => {
    isUpdating.value = true;

    if (!user.value?.id) {
        $toast.error("ID de usuario no disponible.");
        isUpdating.value = false;
        return;
    }

    try {
        const userData = {
            name: formData.value.name,
            phoneNumber: formData.value.phoneNumber,
            address: {
                street: formData.value.address?.street || '',
                city: formData.value.address?.city || '',
                country: formData.value.address?.country || '',
                postalCode: formData.value.address?.postalCode || '',
            }
        };
        console.log("esos  datos estamos enviando", userData);

        const response = await $fetch(`/api/v1/updateUserPhone/${user.value.id}`, {
            method: 'PUT',
            body: userData
        });

        // Actualizar los datos del usuario (si user.value existe)
        if (user.value) {
            user.value.name = response.name || user.value.name;
            user.value.phoneNumber = response.phoneNumber;

            // Inicializar address si no existe
            if (!user.value.address) {
                user.value.address = {
                    street: '',
                    city: '',
                    country: '',
                    postalCode: ''
                };
            }

            // Actualizar address con los valores de respuesta
            if (response.address) {
                user.value.address = response.address;
            }
        }

        $toast.success("Perfil actualizado correctamente");
        isEditModalOpen.value = false;
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        $toast.error("Error al actualizar el perfil");
    } finally {
        isUpdating.value = false;
    }
};

// Obtener las órdenes del usuario
const fetchOrders = async () => {
    if (!user.value?.id) return [];

    try {
        const { data: ordersData } = await useFetch(`/api/v1/ordersByUser/${user.value.id}`, {
            method: 'GET'
        });

        return ordersData.value?.orders || [];
    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        $toast.error("Error al cargar órdenes");
        return [];
    }
};

const orders = ref([]);

// Cargar órdenes cuando el componente se monta y el usuario está autenticado
onMounted(async () => {
    if (loggedIn.value && user.value?.id) {
        orders.value = await fetchOrders();
    }
});
</script> -->
<script setup lang="ts">
const { loggedIn, user, clear } = useUserSession()
const router = useRouter()
const { $toast } = useNuxtApp();
import { useFirebaseUpload } from '~/composables/useFirebaseUpload';
// Modales
const isEditModalOpen = ref(false)
const isAvatarModalOpen = ref(false)

// Interfaz para la dirección
interface Address {
    street: string;
    city: string;
    country: string;
    postalCode: string;
    state?: string;
    isDefault?: boolean;
}

// Interfaz para el usuario
interface User {
    id?: number;
    name: string;
    email: string;
    phoneNumber: string;
    role?: string;
    permiso?: string;
    urlFoto?: string;
    createdAt?: string;
    addresses?: Address[];
}

// Estado reactivo para el usuario
const currentUser = ref<User>({
    name: '',
    email: '',
    phoneNumber: '',
    urlFoto: '',
    addresses: []
});


// Datos de formulario para edición
const formData = ref({
    name: '',
    email: '',
    phoneNumber: '',
    address: {
        street: '',
        city: '',
        country: '',
        postalCode: ''
    }
});

// Avatar

const isUpdating = ref(false)

// Formatear fecha
const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

// Cerrar sesión
const logout = async () => {
    await clear()
    router.push('/')
    $toast.error("Sesión cerrada correctamente");
}
// Estados para imágenes

const avatarPreview = ref<string | null>(null);
const avatarFile = ref<File | null>(null);
const isUploading = ref(false);
const { uploadProgress, uploadImage } = useFirebaseUpload();
// Manejar subida de avatar

const handleAvatarUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.match('image.*')) {
        $toast.error('Por favor, sube solo imágenes (JPEG, PNG)');
        return;
    }

    // Mostrar preview
    const reader = new FileReader();
    reader.onload = (e) => {
        avatarPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    // Subir imagen a Firebase
    try {
        const imageUrl = await uploadImage(file);
        avatarFile.value = imageUrl; // Asignamos imageUrl correctamente aquí
    } catch (error) {
        console.error("Error al subir imagen:", error);
        $toast.error("Error al subir la imagen");
        avatarPreview.value = null;
    }
};

// Guardar avatar en Firebase y actualizar en Prisma
const saveAvatar = async () => {
    if (!avatarFile.value || !currentUser.value?.id) {
        $toast.error('No se ha seleccionado una imagen válida');
        return;
    }
    isUploading.value = true;
    try {
        // 1. Verificar si avatarFile ya tiene la URL después de la subida
        const imageUrl = avatarFile.value;
        // 2. Actualizar avatar en la base de datos usando la API
        const response = await $fetch(`/api/v1/updateUserAvatar/${currentUser.value.id}`, {
            method: 'PUT',
            body: { avatarUrl: imageUrl }  // Aquí pasamos la URL de la imagen subida
        });
        currentUser.value.urlFoto = imageUrl;// O cualquier otro campo que uses para la foto


        $toast.success('Foto de perfil actualizada correctamente');
        isAvatarModalOpen.value = false; // Cerrar modal si es necesario
    } catch (error) {
        console.error('Error al actualizar avatar:', error);
        $toast.error('Error al actualizar la foto de perfil');
    } finally {
        isUploading.value = false;
        avatarFile.value = null;  // Limpiar el archivo cargado
    }
};
// Actualizar perfil
const updateProfile = async () => {
    isUpdating.value = true;

    if (!currentUser.value?.id) {
        $toast.error("ID de usuario no disponible.");
        isUpdating.value = false;
        return;
    }

    try {
        const userData = {
            name: formData.value.name,
            phoneNumber: formData.value.phoneNumber,
            address: {
                street: formData.value.address.street || '',
                city: formData.value.address.city || '',
                country: formData.value.address.country || '',
                postalCode: formData.value.address.postalCode || '',
            }
        };

        const response = await $fetch(`/api/v1/updateUserPhone/${currentUser.value.id}`, {
            method: 'PUT',
            body: userData
        });

        // Actualizar los datos del usuario
        currentUser.value.name = response.name || currentUser.value.name;
        currentUser.value.phoneNumber = response.phoneNumber;

        // Actualizar dirección
        if (response.address) {
            if (!currentUser.value.addresses) {
                currentUser.value.addresses = [response.address];
            } else {
                currentUser.value.addresses[0] = response.address;
            }

            // Actualizar también el formData.address para futuras ediciones
            formData.value.address = {
                street: response.address.street || '',
                city: response.address.city || '',
                country: response.address.country || '',
                postalCode: response.address.postalCode || ''
            };
        }

        $toast.success("Perfil actualizado correctamente");
        isEditModalOpen.value = false;
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        $toast.error("Error al actualizar el perfil");
    } finally {
        isUpdating.value = false;
    }
};

// Obtener las órdenes del usuario
const fetchOrders = async () => {
    if (!currentUser.value?.id) return [];

    try {
        const { data: ordersData } = await useFetch(`/api/v1/ordersByUser/${currentUser.value.id}`, {
            method: 'GET'
        });

        return ordersData.value?.orders || [];
    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        $toast.error("Error al cargar órdenes");
        return [];
    }
};

const orders = ref([]);

// Obtener datos del usuario
const fetchUserData = async () => {
    if (!loggedIn.value || !user.value?.id) return;

    try {
        const response = await $fetch(`/api/v1/userById/${user.value.id}`);
        console.log("mis datos por usuario", response);

        // Asignar los datos del usuario
        currentUser.value = {
            ...response,
            permiso: response.role?.name || 'USUARIO', // Asumiendo que el rol tiene un campo 'name'
            urlFoto: response.avatarUrl // O cualquier otro campo que uses para la foto
        };

        // Inicializar formData con los datos del usuario
        formData.value = {
            name: currentUser.value.name,
            email: currentUser.value.email,
            phoneNumber: currentUser.value.phoneNumber,
            address: {
                street: currentUser.value.addresses?.[0]?.street || '',
                city: currentUser.value.addresses?.[0]?.city || '',
                country: currentUser.value.addresses?.[0]?.country || '',
                postalCode: currentUser.value.addresses?.[0]?.postalCode || ''
            }
        };

        // Obtener órdenes del usuario
        orders.value = await fetchOrders();
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        $toast.error("Error al cargar datos del perfil");
    }
};

// Cargar datos cuando el componente se monta y el usuario está autenticado
onMounted(async () => {
    if (loggedIn.value) {
        await fetchUserData();
    }
});

// Vigilar cambios en el estado de autenticación
watch(loggedIn, async (newVal) => {
    if (newVal) {
        await fetchUserData();
    } else {
        // Resetear datos si el usuario cierra sesión
        currentUser.value = {
            name: '',
            email: '',
            phoneNumber: '',
            addresses: []
        };
        orders.value = [];
    }
});




const redirectPath = ref<string | null>(null)

onMounted(() => {
    const savedPath = localStorage.getItem('redirectAfterLogin')
    if (savedPath) {
        redirectPath.value = savedPath
        // Limpia el storage para no mostrarlo siempre
        localStorage.removeItem('redirectAfterLogin')
    }
})

const goToPreviousPage = () => {
    if (redirectPath.value) {
        router.push(redirectPath.value)
    }
}
</script>
<style scoped>
/* Transiciones suaves para los modales */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

/* Efecto hover para items de actividad */
.hover-item {
    transition: all 0.2s ease;
}

.hover-item:hover {
    transform: translateY(-2px);
}
</style>