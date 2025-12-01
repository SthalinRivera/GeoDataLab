import { ref } from 'vue';
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
import { useNuxtApp } from '#app';

// Tamaño estándar para todas las imágenes
const STANDARD_WIDTH = 1200;
const STANDARD_HEIGHT = 800;
const WEBP_QUALITY = 0.85; // 85% calidad (balance entre tamaño y calidad)

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

          // Crear un canvas para redimensionar
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          // Dibujar la imagen redimensionada
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('No se pudo crear el contexto del canvas'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Convertir a WebP
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
   * La imagen será convertida a WebP y redimensionada
   */
  const uploadImage = async (file: File) => {
    try {
      isUploading.value = true;
      uploadProgress.value = 0;

      // Obtener la extensión del archivo original
      const originalName = file.name.split('.').slice(0, -1).join('.');
      const newFileName = `${originalName}_${Date.now()}.webp`;

      // Convertir a WebP y redimensionar
      const webpBlob = await convertToWebP(file);

      // Crear referencia en Firebase Storage
      const fileRef = storageRef($storage, `test/${newFileName}`);

      // Iniciar la subida
      const uploadTask = uploadBytesResumable(fileRef, webpBlob);

      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Actualizar el progreso y redondearlo a entero
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploadProgress.value = Math.round(progress);
          },
          (error) => {
            isUploading.value = false;
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            isUploading.value = false;
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      isUploading.value = false;
      throw error;
    }
  };

  /**
   * Sube múltiples imágenes a la vez
   */
  const uploadMultipleImages = async (files: File[]) => {
    const uploadPromises = files.map(file => uploadImage(file));
    return Promise.all(uploadPromises);
  };

  return {
    uploadProgress,
    isUploading,
    uploadImage,
    uploadMultipleImages
  };
}