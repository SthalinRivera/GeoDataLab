    // server/api/v1/districts/get.ts
    import { PrismaClient } from "@prisma/client";

    const prisma = new PrismaClient();

    export default defineEventHandler(async (event) => {
        try {
            const districts = await prisma.district.findMany({
                select: {
                    id: true,
                    name: true,
                    code: true
                },
                orderBy: {
                    name: 'asc'
                }
            });

            return districts;
        } catch (error) {
            console.error("Error al obtener distritos:", error);
            throw createError({
                statusCode: 500,
                message: "Error al cargar los distritos"
            });
        }
    });