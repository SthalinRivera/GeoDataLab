import { GoogleAuth } from "google-auth-library";
import ee from "@google/earthengine";

export default defineEventHandler(async (event) => {
    try {
        const { year } = event.context.params as any;

        // ---------------------------
        // 1. Autenticación Earth Engine
        // ---------------------------
        const auth = new GoogleAuth({
            keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
        });

        const client = await auth.getClient();

        await ee.data.authenticateViaClient(client);
        await ee.initialize();

        // ---------------------------
        // 2. Área de estudio Cañete
        // ---------------------------
        const canete = ee.Geometry.Rectangle([-76.6, -13.3, -76.0, -12.3]);

        // ---------------------------
        // 3. Elegir colección por año
        // ---------------------------
        let collection: ee.ImageCollection;

        if (Number(year) < 2013) {
            // Landsat 5
            collection = ee
                .ImageCollection("LANDSAT/LT05/C02/T1_L2")
                .filterBounds(canete)
                .filterDate(`${year}-01-01`, `${year}-12-31`)
                .select(["B1", "B2", "B3", "B4"], ["B2", "B3", "B4", "B8"]);
        } else {
            // Sentinel-2
            collection = ee
                .ImageCollection("COPERNICUS/S2_SR")
                .filterBounds(canete)
                .filterDate(`${year}-01-01`, `${year}-12-31`)
                .select(["B4", "B8", "B11"]);
        }

        const image = collection.median();

        // ---------------------------
        // 4. NDBI (urbano)
        // ---------------------------
        const ndbi = image.normalizedDifference(["B11", "B8"]).rename("NDBI");
        const urban = ndbi.gt(0.2);

        // ---------------------------
        // 5. Área urbana (km²)
        // ---------------------------
        const area = await urban
            .multiply(ee.Image.pixelArea())
            .reduceRegion({
                reducer: ee.Reducer.sum(),
                geometry: canete,
                scale: 30,
                maxPixels: 1e13,
            })
            .get("NDBI")
            .then((v: any) => (v ? Number(v) / 1e6 : 0)); // a km²

        return {
            ok: true,
            year,
            area_km2: area,
        };
    } catch (error: any) {
        return {
            ok: false,
            error: error.message,
        };
    }
});
