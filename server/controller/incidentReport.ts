import { H3Event, readBody } from "h3";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* -----------------------------------------------------------
   MAPEOS IA → PRISMA (ENUMS)
------------------------------------------------------------ */
function mapToIncidentType(tipo: string | null) {
    if (!tipo) return "OTHER";

    const t = tipo.toLowerCase();

    if (t.includes("robo") || t.includes("hurto")) return "THEFT";
    if (t.includes("asalto") || t.includes("agresión")) return "ASSAULT";
    if (t.includes("vandal")) return "VANDALISM";
    if (t.includes("protesta") || t.includes("disturb")) return "PUBLIC_DISTURBANCE";
    if (t.includes("infraestructura") || t.includes("pista") || t.includes("poste")) return "INFRASTRUCTURE_ISSUE";
    if (t.includes("contamin") || t.includes("incendio")) return "ENVIRONMENTAL_HAZARD";
    if (t.includes("salud")) return "PUBLIC_HEALTH";

    return "OTHER";
}

function mapToSeverityLevel(gravedad: number | null) {
    if (!gravedad) return "MEDIUM";
    if (gravedad <= 1) return "LOW";
    if (gravedad === 2) return "MEDIUM";
    if (gravedad === 3 || gravedad === 4) return "HIGH";
    if (gravedad === 5) return "CRITICAL";
    return "MEDIUM";
}

/* -----------------------------------------------------------
   OBTENER TODOS LOS INCIDENTES
------------------------------------------------------------ */
export const getAllIncidentReport = async () => {
    return await prisma.incident.findMany({
        orderBy: { id: "asc" }
    });
};

/* -----------------------------------------------------------
   GUARDAR INCIDENTES ANALIZADOS POR IA
------------------------------------------------------------ */
export const addIncidentReport = async (event: H3Event) => {
    const body = await readBody(event);

    const distrito = body.distrito;
    const resultados = body.resultados?.noticias || [];

    // Buscar distrito
    const distritoBD = await prisma.district.findFirst({
        where: { name: { equals: distrito, mode: "insensitive" } }
    });

    if (!distritoBD) {
        return { error: "El distrito no existe en la base de datos" };
    }

    const resultsSaved = [];

    for (const item of resultados) {
        const a = item.analisis;

        if (a.error) continue;

        const incident = await prisma.incident.create({
            data: {
                title: item.noticia.titulo,
                description: a.resumen || "",
                type: mapToIncidentType(a.tipo_robo),
                severity: mapToSeverityLevel(a.gravedad),
                status: "PENDING",
                address: a.lugar || null,
                latitude: a.latitud || null,
                longitude: a.longitud || null,
                link: item.noticia.link || null,

                districtId: distritoBD.id,
                locationId: null,
                userId: 1
            }
        });

        resultsSaved.push(incident);
    }

    return {
        ok: true,
        guardados: resultsSaved.length,
        data: resultsSaved
    };
};
