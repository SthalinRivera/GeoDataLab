<template>
    <div class="max-w-9xl mx-auto p-4">

        <Breadcrumb :items="[
            { title: 'Productos', to: '/dashboard/products' },
            { title: 'Categorias', to: '/dashboard/categories' }

        ]" />
        <!-- Encabezado con buscador y botones -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
                <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Gestión de Categorías</h1>
                <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">Organiza tus productos con
                    categorías</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <!-- Buscador -->
                <div class="relative w-full sm:w-64">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="ri-search-line text-gray-400"></i>
                    </div>
                    <input v-model="searchQuery" type="text" placeholder="Buscar categorías..."
                        class="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                </div>

                <!-- Botones de acción -->
                <div class="flex gap-2">
                    <button @click="exportToExcel"
                        class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg">
                        <i class="ri-file-excel-line"></i>
                        <span>Exportar</span>
                    </button>
                    <button @click="openCreateModal"
                        class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg">
                        <i class="ri-add-line"></i>
                        <span>Nueva</span>
                    </button>
                </div>
            </div>
        </div>
        <!-- Loading State -->
        <div v-if="loading">
            cargando
        </div>
        <!-- Estado de Error -->
        <div v-else-if="error"
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
            <div class="flex items-center gap-3">
                <i class="ri-error-warning-line text-red-500 dark:text-red-400 text-xl"></i>
                <div>
                    <h3 class="font-medium text-red-800 dark:text-red-200">Error al cargar categorías</h3>
                    <p class="text-sm text-red-600 dark:text-red-300">{{ error.message || 'Ocurrió un error desconocido'
                    }}</p>
                </div>
            </div>
        </div>



        <!-- Empty State -->
        <div v-else-if="categories.length === 0"
            class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div
                class="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <i class="ri-folder-line text-3xl text-gray-400 dark:text-gray-500"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-2">No se encontraron categorías</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-4">Comienza creando tu primera categoría</p>
            <button @click="openCreateModal"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Crear Categoría
            </button>
        </div>

        <!-- Categories Table -->
        <div v-else
            class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Imagen
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Slug
                            </th>

                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Descripción
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="category in paginatedCategories" :key="category.id"
                            class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <img class="h-12 w-12 rounded-md object-cover"
                                    :src="category.imageUrl || '/default-image.png'"
                                    :alt="category.name || 'Imagen de categoría'" loading="lazy">
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900 dark:text-white">
                                    {{ category.name }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-500 dark:text-gray-400">
                                    {{ category.slug }}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                    {{ category.description }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex justify-end gap-2">
                                    <button @click="editCategory(category)"
                                        class="text-blue-600 hover:text-blue-900 dark:hover:text-blue-300">
                                        <i class="ri-pencil-line"></i>
                                    </button>
                                    <button @click="deleteCategory(category.id)"
                                        class=" text-red-600 hover:text-red-900 dark:hover:text-red-300">
                                        <i class="ri-delete-bin-line"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!-- Paginación -->
                <div v-if="filteredCategories.length > 0"
                    class="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                    <div class="text-sm text-gray-700 dark:text-gray-300 mb-4 sm:mb-0">
                        Mostrando {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredCategories.length) }}
                        a {{ Math.min(currentPage * itemsPerPage, filteredCategories.length) }}
                        de {{ filteredCategories.length }} resultados
                    </div>

                    <div class="flex items-center gap-2">
                        <select v-model="itemsPerPage"
                            class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white">
                            <option value="5">5 por página</option>
                            <option value="10">10 por página</option>
                            <option value="20">20 por página</option>
                            <option value="50">50 por página</option>
                        </select>

                        <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
                            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 dark:bg-gray-700 dark:text-white">
                            Anterior
                        </button>

                        <div class="flex gap-1">
                            <button v-for="page in totalPages" :key="page" @click="currentPage = page"
                                :class="{ 'bg-blue-600 text-white': currentPage === page, 'hover:bg-gray-100 dark:hover:bg-gray-600': currentPage !== page }"
                                class="w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors">
                                {{ page }}
                            </button>
                        </div>

                        <button @click="currentPage = Math.min(totalPages, currentPage + 1)"
                            :disabled="currentPage === totalPages"
                            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 dark:bg-gray-700 dark:text-white">
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Category Modal -->
        <div v-if="showCreateModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-30 backdrop-blur-sm">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md animate-fade-in">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white">Agregar Nueva Categoría</h2>
                        <button @click="closeCreateModal"
                            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                            <i class="ri-close-line text-2xl"></i>
                        </button>
                    </div>
                    <form @submit.prevent="createCategory" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de
                                Categoría</label>
                            <input v-model="newCategory.name" type="text" placeholder="e.g. Collar, Aretes ..." required
                                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                        </div>
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                            <textarea v-model="newCategory.description" placeholder="Descripción de la categoría..."
                                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imagen de
                                producto</label>
                            <div class="mt-1 flex items-center gap-4">
                                <label class="cursor-pointer">
                                    <span
                                        class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                        <i class="ri-upload-line mr-2"></i>
                                        Subir Imagen
                                    </span>
                                    <input type="file" @change="handleFileUpload" accept="image/*" class="hidden">
                                </label>
                                <div v-if="uploadProgress > 0 && uploadProgress < 100" class="flex-1">
                                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div class="bg-blue-600 h-2 rounded-full"
                                            :style="{ width: uploadProgress + '%' }">
                                        </div>
                                    </div>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Subiendo: {{
                                        uploadProgress }}%</p>
                                </div>
                            </div>
                            <div v-if="imagePreview" class="mt-2 relative">
                                <img :src="imagePreview"
                                    class="h-20 rounded-md object-cover border border-gray-200 dark:border-gray-700">
                                <button @click="removeImage"
                                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
                                    <i class="ri-close-line text-xs"></i>
                                </button>
                            </div>
                            <p v-if="!imagePreview" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Sube una imagen para la categoría (JPEG, PNG)
                            </p>
                        </div>
                        <div class="flex justify-end gap-3 pt-4">
                            <button type="button" @click="closeCreateModal"
                                class="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" :disabled="isCreating"
                                class="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                <span v-if="!isCreating">Crear Categoría</span>
                                <span v-else>Creando...</span>
                                <i v-if="isCreating" class="ri-loader-4-line animate-spin"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Edit Modal -->
        <div v-if="editingCategory"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-30 backdrop-blur-sm">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md animate-fade-in">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white">Editar Categoría</h2>
                        <button @click="closeEditModal"
                            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                            <i class="ri-close-line text-2xl"></i>
                        </button>
                    </div>
                    <form @submit.prevent="updateCategory" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de
                                Categoría</label>
                            <input v-model="editingCategory.name" type="text" required
                                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                        </div>
                        <!-- <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</label>
                            <input v-model="editingCategory.slug" type="text"
                                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                        </div> -->

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imagen de
                                categoría</label>
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
                                        <div class="bg-blue-600 h-2 rounded-full"
                                            :style="{ width: uploadProgress + '%' }">
                                        </div>
                                    </div>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Subiendo: {{
                                        uploadProgress }}%</p>
                                </div>
                            </div>
                            <div v-if="editingCategory.imageUrl" class="mt-2 relative">
                                <img :src="editingCategory.imageUrl"
                                    class="h-20 rounded-md object-cover border border-gray-200 dark:border-gray-700">
                                <button @click="removeEditImage"
                                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                            </div>
                        </div>

                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                            <textarea v-model="editingCategory.description"
                                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"></textarea>
                        </div>
                        <div class="flex justify-end gap-3 pt-4">
                            <button type="button" @click="closeEditModal"
                                class="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" :disabled="isUpdating"
                                class="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                <span v-if="!isUpdating">Actualizar Categoría</span>
                                <span v-else>Actualizando...</span>
                                <i v-if="isUpdating" class="ri-loader-4-line animate-spin"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>


    </div>
</template>

<script setup lang="ts">

import { ref, reactive, watch, computed, onMounted, nextTick } from 'vue';
import { useRoute } from "vue-router";
import * as XLSX from 'xlsx';

import { useFirebaseUpload } from '~/composables/useFirebaseUpload';

const { $toast } = useNuxtApp();
const route = useRoute();
const { user } = useUserSession();

// Estados para imágenes
const imagePreview = ref<string | null>(null);
const editImageFile = ref<File | null>(null);

// Estados de carga
const isCreating = ref(false);
const isUpdating = ref(false);

// Estados para paginación y búsqueda
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const { uploadProgress, uploadImage } = useFirebaseUpload();

const handleFileUpload = async (event: Event) => {
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
        imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Subir imagen a Firebase
    try {
        const imageUrl = await uploadImage(file);
        newCategory.value.imageUrl = imageUrl;
    } catch (error) {
        console.error("Error al subir imagen:", error);
        $toast.error("Error al subir la imagen");
        imagePreview.value = null;
    }
};
// Computed properties
const filteredCategories = computed(() => {
    if (!searchQuery.value) {
        return [...categories.value];
    }
    const query = searchQuery.value.toLowerCase();
    return categories.value.filter(category =>
        category.name.toLowerCase().includes(query) ||
        category.description?.toLowerCase().includes(query) ||
        category.slug.toLowerCase().includes(query)
    );
});

const totalPages = computed(() => Math.ceil(filteredCategories.value.length / itemsPerPage.value));
const paginatedCategories = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredCategories.value.slice(start, end);
});

// Función para exportar a Excel
const exportToExcel = () => {
    const dataToExport = filteredCategories.value.map(category => ({
        'Nombre': category.name,
        'Slug': category.slug,
        'Descripción': category.description || 'N/A',
        'Imagen': category.imageUrl ? 'Sí' : 'No'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categorías");
    XLSX.writeFile(workbook, "categorias.xlsx");
};

const handleEditFileUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !editingCategory.value) return;

    // Validar tipo de archivo
    if (!file.type.match('image.*')) {
        $toast.error('Por favor, sube solo imágenes (JPEG, PNG)');
        return;
    }

    editImageFile.value = file;

    // Subir imagen a Firebase
    try {
        const imageUrl = await uploadImage(file);
        editingCategory.value.imageUrl = imageUrl;
    } catch (error) {
        console.error("Error al subir imagen:", error);
        $toast.error("Error al subir la imagen");
    }
};

const removeImage = () => {
    imagePreview.value = null;
    newCategory.value.imageUrl = "";
};

const removeEditImage = () => {
    if (editingCategory.value) {
        editingCategory.value.imageUrl = "";
    }
};

// Estados reactivos
const categories = ref<any[]>([]);
const loading = ref(true);
const error = ref<any>(null);
const newCategory = ref({
    name: "",
    slug: "",
    imageUrl: "",
    bannerUrl: "",
    description: ""
});
const editingCategory = ref<any>(null);
const showCreateModal = ref(false);

// Configuración de la página
definePageMeta({
    middleware: ['auth'],
    layout: 'dashboard',
});

// Función para cargar categorías con reintentos
const fetchCategories = async () => {
    loading.value = true;
    error.value = null;

    try {
        const { data } = await useFetch('/api/v1/category');
        categories.value = data.value || [];
        console.log("Categorías cargadas:", categories.value);

    } catch (err) {
        console.error("Error al cargar categorías:", err);
        error.value = err;
        $toast.error("Error al cargar categorías");
        categories.value = [];
    } finally {
        loading.value = false;
    }
};

// Funciones CRUD
const createCategory = async () => {
    if (!newCategory.value.name.trim()) {
        $toast.warning("El nombre de la categoría es requerido");
        return;
    }

    if (!newCategory.value.imageUrl) {
        $toast.warning("Por favor, sube una imagen para la categoría");
        return;
    }

    try {
        isCreating.value = true;

        // Crear slug automático si no está definido
        if (!newCategory.value.slug) {
            newCategory.value.slug = newCategory.value.name
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '');
        }

        const { error: createError } = await useFetch('/api/v1/addCategory', {
            method: "POST",
            body: newCategory.value
        });

        if (createError.value) {
            throw createError.value;
        }

        showCreateModal.value = false;
        await fetchCategories();
        $toast.success("¡Categoría creada exitosamente!");
        resetCreateForm();
    } catch (err) {
        console.error("Error al crear categoría:", err);
        $toast.error("Error al crear categoría");
    } finally {
        isCreating.value = false;
    }
};

const deleteCategory = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.")) return;

    try {
        loading.value = true;
        const { error: deleteError } = await useFetch(`/api/v1/deleteCategory/${id}`, {
            method: "DELETE",
        });

        if (deleteError.value) {
            throw deleteError.value;
        }

        await fetchCategories();
        $toast.success("¡Categoría eliminada exitosamente!");
    } catch (err) {
        console.error("Error al eliminar categoría:", err);
        $toast.error("Error al eliminar categoría");
    } finally {
        loading.value = false;
    }
};

const updateCategory = async () => {
    if (!editingCategory.value?.name?.trim()) {
        $toast.warning("El nombre de la categoría es requerido");
        return;
    }

    try {
        isUpdating.value = true;

        // Actualizar slug automáticamente si el nombre cambió
        editingCategory.value.slug = editingCategory.value.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');

        const { error: updateError } = await useFetch(`/api/v1/updateCategory/${editingCategory.value.id}`, {
            method: "PUT",
            body: editingCategory.value,
        });

        if (updateError.value) {
            throw updateError.value;
        }

        closeEditModal();
        await fetchCategories();
        $toast.success("¡Categoría actualizada exitosamente!");
    } catch (err) {
        console.error("Error al actualizar categoría:", err);
        $toast.error("Error al actualizar categoría");
    } finally {
        isUpdating.value = false;
    }
};

// Funciones auxiliares
const openCreateModal = () => {
    showCreateModal.value = true;
};

const closeCreateModal = () => {
    showCreateModal.value = false;
    resetCreateForm();
};

const closeEditModal = () => {
    editingCategory.value = null;
    editImageFile.value = null;
};

const resetCreateForm = () => {
    newCategory.value = {
        name: "",
        slug: "",
        imageUrl: "",
        bannerUrl: "",
        description: ""
    };
    imagePreview.value = null;
};

const editCategory = (category: any) => {
    editingCategory.value = { ...category };
};

watchEffect(async () => {
    await nextTick();

    fetchCategories();
});


</script>

<style scoped></style>