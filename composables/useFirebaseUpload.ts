// composables/useFirebaseUpload.ts
import { ref } from 'vue';
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
import { useNuxtApp } from '#app';

// Tamaño estándar para todas las imágenes
const STANDARD_WIDTH = 1200;
const STANDARD_HEIGHT = 800;
const WEBP_QUALITY = 0.85;

export function useFirebaseUpload() {
  const uploadProgress = ref(0);
  const isUploading = ref(false);
  const { $storage } = useNuxtApp();

  /**
   * Convierte una imagen a formato WebP y la redimensiona
   */
  const convertToWebP = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          // Calcular las nuevas dimensiones manteniendo el aspect ratio
          let width = STANDARD_WIDTH;
          let height = STANDARD_HEIGHT;

          const aspectRatio = img.width / img.height;

          if (aspectRatio > width / height) {
            // La imagen es más ancha que alta
            height = width / aspectRatio;
          } else {
            // La imagen es más alta que ancha
            width = height * aspectRatio;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('No se pudo crear el contexto del canvas'));
            return;
          }

          // Configurar calidad de renderizado
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('No se pudo convertir la imagen a WebP'));
              }
            },
            'image/webp',
            WEBP_QUALITY
          );
        };

        img.onerror = () => {
          reject(new Error('Error al cargar la imagen'));
        };

        if (event.target?.result) {
          img.src = event.target.result as string;
        } else {
          reject(new Error('Error al leer el archivo'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };

      reader.readAsDataURL(file);
    });
  };

  /**
   * Sube una imagen a Firebase Storage
   */
  const uploadImage = async (file: File, folder: string = 'garbage-reports'): Promise<string> => {
    try {
      isUploading.value = true;
      uploadProgress.value = 0;

      // Generar nombre único para el archivo
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const originalName = file.name.split('.').slice(0, -1).join('.');
      const newFileName = `${originalName}_${timestamp}_${randomString}.webp`;

      // Convertir a WebP y redimensionar
      const webpBlob = await convertToWebP(file);

      // Crear referencia en Firebase Storage
      const fileRef = storageRef($storage, `${folder}/${newFileName}`);

      // Metadata para optimización
      const metadata = {
        contentType: 'image/webp',
        customMetadata: {
          originalName: file.name,
          convertedAt: new Date().toISOString(),
          quality: WEBP_QUALITY.toString(),
          dimensions: `${STANDARD_WIDTH}x${STANDARD_HEIGHT}`
        }
      };

      // Iniciar la subida
      const uploadTask = uploadBytesResumable(fileRef, webpBlob, metadata);

      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploadProgress.value = Math.round(progress);
          },
          (error) => {
            isUploading.value = false;
            console.error('❌ Error subiendo imagen:', error);
            reject(new Error(`Error al subir imagen: ${error.message}`));
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              isUploading.value = false;
              console.log('✅ Imagen subida exitosamente:', downloadURL);
              resolve(downloadURL);
            } catch (error) {
              isUploading.value = false;
              console.error('❌ Error obteniendo URL:', error);
              reject(new Error('Error al obtener URL de descarga'));
            }
          }
        );
      });
    } catch (error) {
      isUploading.value = false;
      console.error('❌ Error en uploadImage:', error);
      throw error;
    }
  };

  /**
   * Sube múltiples imágenes a la vez con progreso global
   */
  const uploadMultipleImages = async (files: File[], folder: string = 'garbage-reports') => {
    isUploading.value = true;
    uploadProgress.value = 0;

    try {
      const totalFiles = files.length;
      let completedFiles = 0;
      const results: string[] = [];

      for (const file of files) {
        try {
          const url = await uploadImage(file, folder);
          results.push(url);
          completedFiles++;
          // Actualizar progreso global
          uploadProgress.value = Math.round((completedFiles / totalFiles) * 100);
        } catch (error) {
          console.error(`❌ Error subiendo archivo ${file.name}:`, error);
          // Continuar con los demás archivos
          continue;
        }
      }

      isUploading.value = false;
      return results;
    } catch (error) {
      isUploading.value = false;
      throw error;
    }
  };

  return {
    uploadProgress,
    isUploading,
    uploadImage,
    uploadMultipleImages
  };
}