<template>
    <div class="max-w-9xl mx-auto p-4">
        <Breadcrumb :items="[
            { title: 'Proyectos', to: '/dashboard/products' },


        ]" />

        <!-- Header Section -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
                <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Gestión de Proyectos</h1>
                <p class="text-gray-500 dark:text-gray-400 mt-1">Gestiona tu inventario de Proyectos y detalles</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-4">
                <!-- Buscador -->
                <UInput v-model="searchQuery" placeholder="Buscar productos..." icon="i-heroicons-magnifying-glass"
                    class="w-full sm:w-64" />

                <!-- Botones de acción -->
                <div class="flex gap-2">
                    <UButton @click="exportToExcel" color="emerald" icon="i-heroicons-document-arrow-down"
                        label="Exportar" />
                    <UButton @click="openModal()" color="primary" icon="i-heroicons-plus" label="Agregar" />
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading">

        </div>

        <!-- Error State -->
        <UAlert v-else-if="error" title="Error" :description="error" icon="i-heroicons-exclamation-triangle" color="red"
            variant="outline" />

        <!-- Empty State -->
        <UCard v-else-if="products.length === 0" class="text-center">
            <template #header>
                <div
                    class="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <UIcon name="i-heroicons-archive-box" class="text-3xl text-gray-400 dark:text-gray-500" />
                </div>
                <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-2">No se encontraron productos.</h3>
                <p class="text-gray-500 dark:text-gray-400 mb-4">Comienza agregando tu primer producto.</p>
            </template>

            <UButton @click="openModal()" color="primary" label="Agregar Producto" />
        </UCard>

        <UCard v-else>
            <UTable :rows="paginatedProducts" :columns="columns" :loading="loading">
                <!-- Custom cell for product name and image -->
                <template #product-data="{ row }">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 cursor-pointer"
                            @click="openImageModal(row.image_url || 'https://via.placeholder.com/40')">
                            <img class="h-10 w-10 rounded-md object-cover hover:opacity-80 transition-opacity"
                                :src="row.image_url || 'https://via.placeholder.com/40'" alt="Product image">
                        </div>
                        <div class="ml-4">
                            <div class="font-medium text-gray-900 dark:text-white">{{ row.title }}</div>
                            <div class="text-gray-500 dark:text-gray-400 line-clamp-1">{{ truncateText(row.description,
                                50) }}</div>
                        </div>
                    </div>
                </template>

                <!-- Custom cell for category -->
                <template #categoryId-data="{ row }">
                    <UBadge color="blue">{{ getCategoryName(row.categoryId) }}</UBadge>
                </template>

                <!-- Custom cell for project URL -->
                <template #project_url-data="{ row }">
                    <UButton :to="row.project_url" target="_blank" color="blue" variant="ghost"
                        icon="i-heroicons-arrow-top-right-on-square" :ui="{ rounded: 'rounded-full' }" />
                </template>

                <!-- Custom cell for code URL -->
                <template #code_url-data="{ row }">
                    <UButton :to="row.code_url" target="_blank" color="gray" variant="ghost"
                        icon="i-heroicons-code-bracket" :ui="{ rounded: 'rounded-full' }" />
                </template>

                <!-- Custom cell for actions -->
                <template #actions-data="{ row }">
                    <div class="flex justify-end gap-2">
                        <UButton @click="openModal(row)" color="blue" variant="ghost" icon="i-heroicons-pencil" />
                        <UButton @click="deleteProduct(row.id)" color="red" variant="ghost" icon="i-heroicons-trash" />
                    </div>
                </template>
            </UTable>

            <!-- Pagination -->
            <div class="flex items-center justify-between px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                <UPagination v-model="currentPage" :page-count="itemsPerPage" :total="filteredProducts.length" :ui="{
                    wrapper: 'flex items-center gap-1',
                    rounded: '!rounded-full min-w-8 w-8 h-8',
                    default: {
                        activeButton: {
                            variant: 'outline'
                        }
                    }
                }">
                    <template #prev="{ onClick }">
                        <UTooltip text="Previous page">
                            <UButton icon="i-heroicons-arrow-small-left-20-solid" color="gray"
                                :ui="{ rounded: 'rounded-full' }" class="rtl:[&_span:first-child]:rotate-180"
                                :disabled="currentPage === 1" @click="onClick" />
                        </UTooltip>
                    </template>

                    <template #next="{ onClick }">
                        <UTooltip text="Next page">
                            <UButton icon="i-heroicons-arrow-small-right-20-solid" color="gray"
                                :ui="{ rounded: 'rounded-full' }" class="rtl:[&_span:first-child]:rotate-180"
                                :disabled="currentPage === totalPages" @click="onClick" />
                        </UTooltip>
                    </template>
                </UPagination>
            </div>
        </UCard>

        <!-- Modal for Add/Edit Product -->
        <UModal v-model="showModal">
            <UCard>
                <template #header>
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white">
                            {{ editingProduct ? "Editar Producto" : "Agregar Producto" }}
                        </h2>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                            @click="showModal = false" />
                    </div>
                </template>

                <UForm @submit="saveProduct" class="space-y-4">
                    <UFormGroup label="Título" name="title" required>
                        <UInput v-model="formState.title" placeholder="Nombre del proyecto" />
                    </UFormGroup>

                    <UFormGroup label="Descripción" name="description" required>
                        <UTextarea v-model="formState.description" placeholder="Descripción breve" />
                    </UFormGroup>

                    <div class="grid grid-cols-2 gap-4">
                        <UFormGroup label="Project URL" name="project_url" required>
                            <UInput v-model="formState.project_url" placeholder="https://example.com" />
                        </UFormGroup>

                        <UFormGroup label="Code URL" name="code_url">
                            <UInput v-model="formState.code_url" placeholder="https://example.com" />
                        </UFormGroup>
                    </div>

                    <UFormGroup label="Tags" name="tags">
                        <div class="space-y-2">
                            <UInput v-model="tagInput" @keydown.enter.prevent="addTag"
                                placeholder="Escribe y presiona Enter" />
                            <div class="flex flex-wrap gap-2">
                                <UBadge v-for="(tag, index) in formState.tags" :key="index" color="blue"
                                    class="flex items-center">
                                    {{ tag }}
                                    <UIcon name="i-heroicons-x-mark" class="ml-1 w-3 h-3 cursor-pointer"
                                        @click="removeTag(index)" />
                                </UBadge>
                            </div>
                        </div>
                    </UFormGroup>
                    <UFormGroup label="Technologies" name="Technologies">
                        <div class="space-y-2">
                            <UInput v-model="technologiesInput" @keydown.enter.prevent="addTechnologies"
                                placeholder="Escribe y presiona Enter" />
                            <div class="flex flex-wrap gap-2">
                                <UBadge v-for="(technologie, index) in formState.technologies" :key="index" color="blue"
                                    class="flex items-center">
                                    {{ technologie }}
                                    <UIcon name="i-heroicons-x-mark" class="ml-1 w-3 h-3 cursor-pointer"
                                        @click="removeTechnologies(index)" />
                                </UBadge>
                            </div>
                        </div>
                    </UFormGroup>

                    <UFormGroup label="Categoría" name="categoryId" required>
                        <USelect v-model="formState.categoryId"
                            :options="categories.map(c => ({ value: c.id, label: c.name }))"
                            placeholder="Selecciona una categoría" />
                    </UFormGroup>


                    <UFormGroup label="Imagen del producto" name="image">
                        <div>

                            <div class="mt-1 flex items-center gap-4">
                                <!-- Contenedor principal de carga -->
                                <div class="mx-auto">
                                    <!-- Estado inicial (antes de subir) -->
                                    <label v-if="!imageUrl" class="flex flex-col items-center justify-center w-64 h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 
                        border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400
                        bg-gray-50/50 dark:bg-gray-800/50 hover:bg-blue-50/30 dark:hover:bg-blue-900/20
                        group relative overflow-hidden">

                                        <!-- Efecto de fondo sutil -->
                                        <div
                                            class="absolute inset-0 bg-[radial-gradient(circle_at_center,#e0f2fe_0%,transparent_70%)] opacity-0 group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_center,#1e3a8a_0%,transparent_70%)] transition-opacity duration-500">
                                        </div>

                                        <div
                                            class="flex flex-col items-center justify-center pt-5 pb-6 text-center relative z-10">
                                            <!-- Icono animado -->
                                            <svg class="w-12 h-12 mb-4 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform"
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12">
                                                </path>
                                            </svg>
                                            <p class="text-sm text-gray-600 dark:text-gray-300">Haz clic o arrastra
                                                una imagen</p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Formatos: JPG,
                                                PNG, WEBP</p>
                                        </div>

                                        <input type="file" class="hidden" @change="handleFileUpload" accept="image/*">
                                    </label>

                                    <!-- Estado cuando la imagen está cargada -->
                                    <div v-else class="relative group">
                                        <img :src="imageUrl"
                                            class="w-64 h-40 rounded-xl object-cover border border-gray-200 dark:border-gray-700">
                                        <!-- Botón para cambiar imagen -->
                                        <button @click="resetImage"
                                            class="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all">
                                            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                                </path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <!-- Barra de progreso -->
                                <div v-if="uploadProgress > 0 && uploadProgress < 100" class="flex-1">
                                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                        <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                                            :style="{ width: uploadProgress + '%' }"></div>
                                    </div>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Subiendo: {{
                                        uploadProgress.toFixed(2) }}%</p>

                                </div>
                            </div>
                        </div>
                    </UFormGroup>


                    <div class="flex justify-end gap-3">
                        <UButton type="button" color="gray" label="Cancelar" @click="showModal = false" />
                        <UButton type="submit" color="primary"
                            :label="editingProduct ? 'Actualizar Producto' : 'Agregar Producto'"
                            :disabled="!isFormValid" />
                    </div>
                </UForm>
            </UCard>
        </UModal>

        <!-- Modal for full image -->
        <UModal v-model="showImageModal">
            <UCard class="relative">
                <UButton @click="closeImageModal" color="gray" variant="solid" icon="i-heroicons-x-mark"
                    class="absolute top-2 right-2 z-10" />
                <img :src="selectedImage" class="max-w-full max-h-[80vh] object-contain rounded-lg"
                    alt="Imagen completa" v-if="selectedImage">
            </UCard>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import * as XLSX from 'xlsx'
import type { Project } from '~/interfaces/project'

const { $toast } = useNuxtApp()
const { uploadImage, uploadProgress } = useFirebaseUpload()

// Table columns
const columns = [
    {
        key: 'product',
        label: 'Producto'
    },
    {
        key: 'categoryId',
        label: 'Categoría'
    },
    {
        key: 'project_url',
        label: 'Project URL'
    },
    {
        key: 'code_url',
        label: 'Code URL'
    },
    {
        key: 'tags',
        label: 'Tags'
    },
    {
        key: 'technologies',
        label: 'Technologies'
    },
    {
        key: 'status',
        label: 'Status'
    },
    {
        key: 'actions',
        label: 'Acción'
    }
]

// State
const products = ref<Project[]>([])
const filteredProducts = ref<Project[]>([])
const categories = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const showModal = ref(false)
const editingProduct = ref<Project | null>(null)
const imageUrl = ref<string | null>(null)
const file = ref<File[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showImageModal = ref(false)
const selectedImage = ref<string | undefined>(undefined)
const tagInput = ref('')
const technologiesInput = ref('')
// Form state
const formState = reactive({
    title: '',
    description: '',
    project_url: '',
    code_url: '',
    tags: [] as string[],
    technologies: [] as string[],
    status: 'COMPLETED',
    image_url: '',
    categoryId: null as number | null,
    userId: 1
})
// Configuración de la página
definePageMeta({
    middleware: ['auth'],
    layout: 'dashboard',
});
// Computed
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value))
const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredProducts.value.slice(start, end)
})

const isFormValid = computed(() => {
    return formState.title.trim() !== '' &&
        formState.description.trim() !== '' &&
        formState.categoryId !== null &&
        (imageUrl.value || formState.image_url !== '')
})

// Methods
const fetchProducts = async () => {
    loading.value = true
    try {
        const { data } = await useFetch('/api/v1/product')
        products.value = data.value || []
        filteredProducts.value = [...products.value]
    } catch (err) {
        error.value = 'Failed to load products.'
    } finally {
        loading.value = false
    }
}

const fetchCategories = async () => {
    try {
        const { data } = await useFetch('/api/v1/category')
        categories.value = data.value || []
    } catch (err) {
        error.value = 'Failed to load categories.'
    }
}

const filterProducts = () => {
    if (!searchQuery.value) {
        filteredProducts.value = [...products.value]
    } else {
        const query = searchQuery.value.toLowerCase()
        filteredProducts.value = products.value.filter(product =>
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            getCategoryName(product.categoryId).toLowerCase().includes(query)
        )
    }
    currentPage.value = 1
}

const exportToExcel = () => {
    const dataToExport = filteredProducts.value.map(product => ({
        'Nombre': product.title,
        'Descripción': product.description,
        'Categoría': getCategoryName(product.categoryId),
        'Project URL': product.project_url,
        'Code URL': product.code_url,
        'Tags': product.tags.join(', '),
        'Technologies': product.technologies,
        'Status': product.status
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos')
    XLSX.writeFile(workbook, 'productos.xlsx')
}

const handleFileUpload = async (event: Event) => {
    const files = (event.target as HTMLInputElement).files
    if (files && files.length > 0) {
        imageUrl.value = await uploadImage(files[0])
    }
}

const resetImage = () => {
    imageUrl.value = null
    formState.image_url = ''
}

const getCategoryName = (categoryId: number) => {
    const category = categories.value.find(cat => cat.id === categoryId)
    return category ? category.name : 'Uncategorized'
}

const truncateText = (text: string, maxLength: number): string => {
    if (!text) return ''
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

const addTag = () => {
    if (tagInput.value.trim() && !formState.tags.includes(tagInput.value.trim())) {
        formState.tags.push(tagInput.value.trim())
        tagInput.value = ''
    }
}

const removeTag = (index: number) => {
    formState.tags.splice(index, 1)
}
const addTechnologies = () => {
    if (technologiesInput.value.trim() && !formState.technologies.includes(technologiesInput.value.trim())) {
        formState.technologies.push(technologiesInput.value.trim())
        technologiesInput.value = ''
    }
}

const removeTechnologies = (index: number) => {
    formState.technologies.splice(index, 1)
}

const openModal = (product: Project | null = null) => {
    editingProduct.value = product

    if (product) {
        Object.assign(formState, {
            title: product.title,
            description: product.description,
            project_url: product.project_url,
            code_url: product.code_url || '',
            tags: product.tags || [],
            technologies: product.technologies || [],
            status: product.status || 'COMPLETED',
            categoryId: product.categoryId,
            image_url: product.image_url || ''
        })
        imageUrl.value = product.image_url || null
    } else {
        Object.assign(formState, {
            title: '',
            description: '',
            project_url: '',
            code_url: '',
            tags: [],
            technologies: [],
            status: 'COMPLETED',
            categoryId: null,
            image_url: '',
            userId: 1
        })
        imageUrl.value = null
    }

    showModal.value = true
}

const saveProduct = async () => {
    try {
        const productData = {
            ...formState,
            image_url: imageUrl.value || formState.image_url,
            tags: formState.tags,
            technologies: formState.technologies,
            categoryId: Number(formState.categoryId)
        }

        if (editingProduct.value) {
            const { error } = await useFetch(`/api/v1/updateProduct/${editingProduct.value.id}`, {
                method: 'PUT',
                body: productData
            })

            if (error.value) {
                throw error.value
            }

            $toast.success('Producto actualizado correctamente')
        } else {
            const { error } = await useFetch('/api/v1/addProduct', {
                method: 'POST',
                body: productData
            })

            if (error.value) {
                throw error.value
            }

            $toast.success('Producto agregado correctamente')
        }

        showModal.value = false
        await fetchProducts()
    } catch (err: any) {
        $toast.error(err.data?.message || 'Error al guardar el producto')
        console.error('Error saving product:', err)
    }
}

const deleteProduct = async (productId: number) => {
    try {
        await useFetch(`/api/v1/deleteProduct/${productId}`, { method: 'DELETE' })
        products.value = products.value.filter(p => p.id !== productId)
        $toast.success('Producto eliminado correctamente')
    } catch (err) {
        $toast.error('Error al eliminar el producto')
    }
}

const openImageModal = (imgUrl: string | undefined) => {
    selectedImage.value = imgUrl
    showImageModal.value = true
}

const closeImageModal = () => {
    showImageModal.value = false
    selectedImage.value = undefined
}

// Watchers
watch(searchQuery, filterProducts)
watch(products, filterProducts, { deep: true })

// Lifecycle
onMounted(async () => {
    await Promise.all([fetchProducts(), fetchCategories()])
})
</script>