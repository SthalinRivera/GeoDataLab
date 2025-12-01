import { GoogleAuth } from "google-auth-library";

export default defineEventHandler(async () => {
    try {
        const auth = new GoogleAuth({
            keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
        });

        const client = await auth.getClient();

        // Llamar alguna API básica para validar permisos
        const url = `https://cloudresourcemanager.googleapis.com/v1/projects/${process.env.GOOGLE_PROJECT_ID}`;
        const res = await client.request({ url });

        return {
            ok: true,
            projectInfo: res.data,
        };

    } catch (error: any) {
        return {
            ok: false,
            error: error.message,
        };
    }
});
