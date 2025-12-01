import { H3Event } from "h3";
import { PrismaClient } from "@prisma/client";
// server/api/v1/garbage-reports/post.ts
import { CreateGarbageReport, GarbageType, SeverityLevel, ReportStatus, PhotoType } from '~/interfaces/garbage-report';

const prisma = new PrismaClient();

// Obtener lista simple de reportes de basura

export const getAllGarbageReport = async () => {
    return await prisma.garbageReport.findMany({
        orderBy: {
            id: "asc"
        }
    });
}
export const getAllGarbageReportPhotos = async () => {
    try {
        const reports = await prisma.garbageReport.findMany({
            include: {
                district: {
                    select: {
                        name: true
                    }
                },
                user: {
                    select: {
                        name: true
                    }
                },
                photos: {
                    select: {
                        id: true,
                        url: true,
                        caption: true,
                        type: true,
                        createdAt: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return reports;
    } catch (error) {
        console.error('Error fetching garbage reports:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error'
        });
    }
};
export const addGarbageReport = async (event: H3Event) => {
    try {
        const body = await readBody(event);
        console.log("📨 Datos recibidos en addGarbageReport:", JSON.stringify(body, null, 2));

        // Validaciones básicas
        const requiredFields = ['title', 'description', 'type', 'districtId', 'userId'];
        const missingFields = requiredFields.filter(field => !body[field]);

        if (missingFields.length > 0) {
            throw createError({
                statusCode: 400,
                statusMessage: `Faltan campos requeridos: ${missingFields.join(', ')}`
            });
        }

        // Validar tipos
        const validGarbageTypes = ['ORGANIC', 'PLASTIC', 'PAPER', 'GLASS', 'METAL', 'ELECTRONIC', 'CONSTRUCTION', 'HAZARDOUS', 'OTHER'];
        if (!validGarbageTypes.includes(body.type)) {
            throw createError({
                statusCode: 400,
                statusMessage: `Tipo de basura inválido. Usa uno de: ${validGarbageTypes.join(', ')}`
            });
        }

        // Validar severidad
        const validSeverityLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        if (body.severity && !validSeverityLevels.includes(body.severity)) {
            throw createError({
                statusCode: 400,
                statusMessage: `Severidad inválida. Usa uno de: ${validSeverityLevels.join(', ')}`
            });
        }

        // Convertir IDs a números
        const districtId = parseInt(body.districtId);
        const userId = parseInt(body.userId);
        const locationId = body.locationId ? parseInt(body.locationId) : null;

        console.log("🔍 Verificando distrito:", districtId);
        // Verificar que el distrito existe
        const district = await prisma.district.findUnique({
            where: { id: districtId }
        });

        if (!district) {
            throw createError({
                statusCode: 404,
                statusMessage: `Distrito con ID ${districtId} no encontrado`
            });
        }

        console.log("🔍 Verificando usuario:", userId);
        // Verificar que el usuario existe
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw createError({
                statusCode: 404,
                statusMessage: `Usuario con ID ${userId} no encontrado`
            });
        }

        // Verificar location si se proporciona
        if (locationId) {
            console.log("🔍 Verificando ubicación:", locationId);
            const location = await prisma.location.findUnique({
                where: { id: locationId }
            });

            if (!location) {
                throw createError({
                    statusCode: 404,
                    statusMessage: `Ubicación con ID ${locationId} no encontrada`
                });
            }
        }

        // Obtener las URLs de las imágenes del campo imageUrls (que viene del frontend)
        const imageUrls = body.imageUrls || [];
        console.log("🖼️ URLs de imágenes recibidas:", imageUrls);

        // Preparar datos para crear el reporte (SIN el campo photos)
        const reportData = {
            title: body.title,
            description: body.description,
            type: body.type,
            severity: body.severity || 'LOW',
            status: body.status || 'PENDING',
            latitude: body.latitude ? parseFloat(body.latitude) : null,
            longitude: body.longitude ? parseFloat(body.longitude) : null,
            address: body.address || null,
            districtId: districtId,
            locationId: locationId, // Puede ser null
            userId: userId,
            // NO incluir photos aquí - se crean después
        };

        console.log("💾 Creando reporte con datos:", reportData);

        // Crear el reporte de basura PRIMERO
        const garbageReport = await prisma.garbageReport.create({
            data: reportData
        });

        console.log("✅ Reporte creado con ID:", garbageReport.id);

        // Crear las fotos DESPUÉS de crear el reporte
        if (imageUrls.length > 0) {
            console.log("📸 Creando registros de fotos en la tabla Photo...");

            const photoPromises = imageUrls.map(async (imageUrl: string, index: number) => {
                return await prisma.photo.create({
                    data: {
                        url: imageUrl,
                        caption: `Foto ${index + 1} del reporte ${garbageReport.id}`,
                        type: 'EVIDENCE', // Usar el enum PhotoType
                        garbageReportId: garbageReport.id, // Relacionar con el reporte creado
                        userId: userId
                    }
                });
            });

            await Promise.all(photoPromises);
            console.log(`✅ ${imageUrls.length} fotos guardadas en la tabla Photo`);
        }

        // Crear el historial de estado
        await prisma.reportStatusHistory.create({
            data: {
                status: body.status || 'PENDING',
                notes: 'Reporte creado',
                userId: userId,
                garbageReportId: garbageReport.id
            }
        });

        // Obtener el reporte completo con las fotos para la respuesta
        const reportWithPhotos = await prisma.garbageReport.findUnique({
            where: { id: garbageReport.id },
            include: {
                photos: true,
                district: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        // Retornar respuesta exitosa
        return {
            success: true,
            message: 'Reporte creado exitosamente',
            data: reportWithPhotos
        };

    } catch (error: any) {
        console.error("❌ Error detallado en addGarbageReport:");
        console.error("Mensaje:", error.message);
        console.error("Stack:", error.stack);

        // Si es error de Prisma, mostrar más detalles
        if (error.code) {
            console.error("Código de error Prisma:", error.code);
            console.error("Meta:", error.meta);
        }

        // Si ya es un error creado con createError, lo relanzamos
        if (error.statusCode) {
            throw error;
        }

        throw createError({
            statusCode: 500,
            statusMessage: `Error al crear el reporte: ${error.message}`
        });
    }
}