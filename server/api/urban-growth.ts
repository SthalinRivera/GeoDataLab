import { GoogleAuth } from "google-auth-library";
import ee from "@google/earthengine";

export default defineEventHandler(async () => {
    try {
        // 1. AUTH
        const auth = new GoogleAuth({
            keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
            scopes: ["https://www.googleapis.com/auth/earthengine"],
        });

        const client = await auth.getClient();
        const token = await client.getAccessToken();

        // 2. INICIALIZAR EARTH ENGINE
        await ee.data.authenticateViaToken(token.token!);
        await ee.initialize(null, null);

        // ============================================
        // 3. SCRIPT DE CRECIMIENTO URBANO (TU SCRIPT)
        // ============================================

        const canete = ee.Geometry.Rectangle([-76.6, -13.3, -76.0, -12.3]);

        function cleanS2(img: any) {
            return img
                .select(["B2", "B3", "B4", "B8"])
                .multiply(0.0001);
        }

        function cleanL5(img: any) {
            return img
                .select(["B1", "B2", "B3", "B4"], ["B2", "B3", "B4", "B8"])
                .multiply(0.0001);
        }

        const landsat2000 = ee
            .ImageCollection("LANDSAT/LT05/C02/T1_L2")
            .filterBounds(canete)
            .filterDate("2000-01-01", "2000-12-31")
            .map(cleanL5)
            .median();

        const s2_2024 = ee
            .ImageCollection("COPERNICUS/S2_SR")
            .filterBounds(canete)
            .filterDate("2024-01-01", "2024-12-31")
            .map(cleanS2)
            .median();

        function NDBI(img: any) {
            return img.normalizedDifference(["B8", "B4"]).rename("NDBI");
        }

        const urban2000 = NDBI(landsat2000).gt(0.1);
        const urban2024 = NDBI(s2_2024).gt(0.1);

        const area2000 = await urban2000
            .multiply(ee.Image.pixelArea())
            .reduceRegion({
                reducer: ee.Reducer.sum(),
                geometry: canete,
                scale: 30,
                maxPixels: 1e13,
            })
            .get("NDBI")
            .evaluate();

        const area2024 = await urban2024
            .multiply(ee.Image.pixelArea())
            .reduceRegion({
                reducer: ee.Reducer.sum(),
                geometry: canete,
                scale: 10,
                maxPixels: 1e13,
            })
            .get("NDBI")
            .evaluate();

        // =============================================
        // 4. RESPUESTA
        // =============================================
        return {
            ok: true,
            area2000_km2: area2000 / 1e6,
            area2024_km2: area2024 / 1e6,
            crecimiento_km2: (area2024 - area2000) / 1e6,
            crecimiento_porcentaje: ((area2024 - area2000) / area2000) * 100,
        };
    } catch (err: any) {
        return { ok: false, error: err.message };
    }
});
