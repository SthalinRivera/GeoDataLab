<template>
    <div class="max-w-9xl mx-auto p-4">

        <Breadcrumb :items="[
            { title: 'Usuarios', to: '/dashboard/users' },
        ]" />
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Administración de Usuarios</h1>
                <p class="text-gray-500 dark:text-gray-400 mt-1">Gestión completa de usuarios del sistema</p>
            </div>
            <button @click="openModal()"
                class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <i class="ri-user-add-line"></i>
                <span>Nuevo Usuario</span>
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading">
            cargando
        </div>

        <!-- Users Table -->
        <div v-else-if="users.length > 0"
            class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <!-- Desktop Table (hidden on mobile) -->
            <div class="hidden md:block overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Usuario
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Email
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Rol
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Teléfono
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="user in users" :key="user.id"
                            class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-10 w-10">
                                        <img class="h-10 w-10 rounded-full object-cover" :src="getUserAvatar(user)"
                                            alt="User avatar">
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}
                                        </div>
                                        <div class="text-sm text-gray-500 dark:text-gray-400">ID: {{ user.id }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {{ user.email }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="{
                                    'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200': user.roleId === 1, // Admin
                                    'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200': user.roleId === 2, // Vendedor
                                    'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200': user.roleId === 3, // Cliente
                                    'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200': !user.roleId // Sin rol
                                }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    {{ getRoleName(user.roleId) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {{ user.phoneNumber || 'N/A' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex justify-end gap-2">
                                    <button @click="viewUserDetails(user)"
                                        class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors">
                                        <i class="ri-eye-line"></i>
                                    </button>
                                    <button @click="openModal(user)"
                                        class="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 transition-colors">
                                        <i class="ri-pencil-line"></i>
                                    </button>
                                    <button @click="confirmDelete(user.id)"
                                        class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors">
                                        <i class="ri-delete-bin-line"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Mobile Cards (shown on mobile) -->
            <div class="md:hidden space-y-3 p-4">
                <div v-for="user in users" :key="user.id"
                    class="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div class="flex items-start justify-between">
                        <div class="flex items-center space-x-3">
                            <img class="h-10 w-10 rounded-full object-cover" :src="getUserAvatar(user)"
                                alt="User avatar">
                            <div>
                                <h3 class="font-medium text-gray-900 dark:text-white">{{ user.name }}</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ user.id }}</p>
                            </div>
                        </div>
                        <div class="flex space-x-2">
                            <button @click="viewUserDetails(user)" class="text-blue-600 dark:text-blue-400">
                                <i class="ri-eye-line"></i>
                            </button>
                            <button @click="openModal(user)" class="text-yellow-600 dark:text-yellow-400">
                                <i class="ri-pencil-line"></i>
                            </button>
                            <button @click="confirmDelete(user.id)" class="text-red-600 dark:text-red-400">
                                <i class="ri-delete-bin-line"></i>
                            </button>
                        </div>
                    </div>

                    <div class="mt-3 grid grid-cols-1 gap-2">
                        <div>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Email</p>
                            <p class="text-sm text-gray-900 dark:text-white break-all">{{ user.email }}</p>
                        </div>

                        <div class="flex justify-between">
                            <div>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Rol</p>
                                <span :class="{
                                    'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200': user.roleId === 1,
                                    'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200': user.roleId === 2,
                                    'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200': user.roleId === 3,
                                    'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200': !user.roleId
                                }" class="text-xs font-medium rounded-full px-2 py-1">
                                    {{ getRoleName(user.roleId) }}
                                </span>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Teléfono</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.phoneNumber || 'N/A' }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading && users.length === 0"
            class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div
                class="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <i class="ri-user-line text-3xl text-gray-400 dark:text-gray-500"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-2">No hay usuarios registrados</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-4">Comienza agregando tu primer usuario</p>
            <button @click="openModal()"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Crear Usuario
            </button>
        </div>

        <!-- User Modal (Create/Edit) -->
        <div v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white">
                            {{ editingUser ? "Editar Usuario" : "Crear Nuevo Usuario" }}
                        </h2>
                        <button @click="showModal = false"
                            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                            <i class="ri-close-line text-2xl"></i>
                        </button>
                    </div>

                    <form @submit.prevent="saveUser" class="space-y-4">
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                            <input v-model="formState.name" type="text" required
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input v-model="formState.email" type="email" required
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                        </div>

                        <div v-if="!editingUser">
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
                            <input v-model="formState.password" type="password" :required="!editingUser"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                        </div>

                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
                            <input v-model="formState.phoneNumber" type="tel"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rol</label>
                            <select v-model="formState.roleId" required
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                                <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
                            </select>
                        </div>

                        <div class="flex justify-end gap-3 pt-4">
                            <button type="button" @click="showModal = false"
                                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                Cancelar
                            </button>
                            <button type="submit"
                                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                {{ editingUser ? "Actualizar Usuario" : "Crear Usuario" }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
                <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Confirmar eliminación</h2>
                <p class="text-gray-600 dark:text-gray-400 mb-6">¿Estás seguro que deseas eliminar este usuario? Esta
                    acción no se puede deshacer.</p>
                <div class="flex justify-end gap-3">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        Cancelar
                    </button>
                    <button @click="deleteUser"
                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Eliminar
                    </button>
                </div>
            </div>
        </div>

        <!-- View User Details Modal -->
        <div v-if="showViewModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-bold text-gray-800 dark:text-white">Detalles del Usuario</h2>
                    <button @click="showViewModal = false"
                        class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <i class="ri-close-line text-2xl"></i>
                    </button>
                </div>

                <div v-if="selectedUser" class="space-y-6">
                    <div class="flex flex-col items-center mb-6">
                        <img :src="getUserAvatar(selectedUser)"
                            class="h-24 w-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 mb-3">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ selectedUser.name }}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">ID: {{ selectedUser.id }}</p>
                    </div>

                    <div class="grid grid-cols-1 gap-1 md:gap-4">
                        <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                            <p class="text-sm text-gray-900 dark:text-white">{{ selectedUser.email }}</p>
                        </div>
                        <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Rol</p>
                            <p class="text-sm text-gray-900 dark:text-white">{{ getRoleName(selectedUser.roleId) }}</p>
                        </div>
                        <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Teléfono</p>
                            <p class="text-sm text-gray-900 dark:text-white">{{ selectedUser.phoneNumber ||
                                'Noespecificado' }}</p>
                        </div>
                        <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Fecha de registro</p>
                            <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(selectedUser.createdAt) }}
                            </p>
                        </div>
                    </div>

                    <div class="flex justify-end gap-3 pt-4">

                        <button @click="showViewModal = false"
                            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';

interface User {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    roleId: number;
    createdAt?: string;
    avatar?: string;
}

interface Role {
    id: number;
    name: string;
}

interface FormState {
    id: number | null;
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    roleId: string | number;
}

const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const loading = ref(true);
const showModal = ref(false);
const showDeleteModal = ref(false);
const showViewModal = ref(false);
const editingUser = ref<User | null>(null);
const selectedUser = ref<User | null>(null);
const userToDelete = ref<number | null>(null);
const avatarPreview = ref<string | null>(null);
const uploadProgress = ref(0);

const formState = reactive<FormState>({
    id: null,
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    roleId: '',
});

definePageMeta({
    middleware: ['auth'],
    layout: 'dashboard',
});

// Obtener lista de usuarios
const fetchUsers = async () => {
    try {
        loading.value = true;
        const { data } = await useFetch<User[]>('/api/v1/allUser');
        users.value = data.value || [];
    } catch (error) {
        console.error('Error fetching users:', error);
        useToast().error('Error al cargar los usuarios');
    } finally {
        loading.value = false;
    }
};

// Obtener roles disponibles
const fetchRoles = async () => {
    try {
        const { data } = await useFetch<Role[]>('/api/v1/roles');
        roles.value = data.value || [];
    } catch (error) {
        console.error('Error fetching roles:', error);
        useToast().error('Error al cargar los roles');
    }
};



// Abrir modal (crear o editar)
const openModal = (user: User | null = null) => {
    editingUser.value = user;

    // Reset form state
    Object.assign(formState, {
        id: null,
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        roleId: roles.value[0]?.id || '',
    });

    if (user) {
        // Populate form with user data for editing
        Object.assign(formState, {
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber || '',
            roleId: user.roleId,
        });
    }

    showModal.value = true;
};

// Ver detalles de usuario
const viewUserDetails = (user: User) => {
    selectedUser.value = user;
    showViewModal.value = true;
};

const getRoleName = (roleId: number) => {
    const role = roles.value.find(r => r.id === roleId);
    return role ? role.name : 'Sin rol';
};

// Confirmar eliminación
const confirmDelete = (userId: number) => {
    userToDelete.value = userId;
    showDeleteModal.value = true;
};

// Eliminar usuario
const deleteUser = async () => {
    if (!userToDelete.value) return;

    try {
        await $fetch(`/api/v1/userDelete/${userToDelete.value}`, {
            method: 'DELETE'
        });

        useToast().success('Usuario eliminado correctamente');
        fetchUsers();
    } catch (error) {
        useToast().error('Error al eliminar usuario');
        console.error('Error al eliminar el usuario:', error);
    } finally {
        showDeleteModal.value = false;
        userToDelete.value = null;
    }
};

// Guardar usuario (crear o actualizar)
const saveUser = async () => {
    try {
        if (editingUser.value) {
            // Update existing user
            const userData = { ...formState };
            if (!userData.password) {
                delete userData.password; // Don't send empty password when updating
            }

            await $fetch(`/api/v1/updateUser/${userData.id}`, {
                method: 'PUT',
                body: userData
            });


        } else {
            // Create new user
            await $fetch('/api/v1/addUser', {
                method: 'POST',
                body: formState
            });


        }

        showModal.value = false;
        fetchUsers(); // Refresh user list
    } catch (error) {
        useToast().error('Error al guardar el usuario');
        console.error('Error saving user:', error);
    }
};

// Avatar placeholder
const getUserAvatar = (user: User) => {
    return user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
};

// Formatear fecha
const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

onMounted(async () => {
    await nextTick();
    fetchUsers();
    fetchRoles();
});
</script>

<style scoped>
/* Transiciones para los modales */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

/* Animaciones suaves */
button {
    transition: all 0.2s ease;
}

/* Sombras mejoradas */
.shadow-sm {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.shadow-md {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-xl {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>