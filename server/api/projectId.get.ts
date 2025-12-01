import { GoogleAuth } from "google-auth-library";

export default defineEventHandler(async () => {
    const auth = new GoogleAuth({
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const client = await auth.getClient();
    const projectId = await auth.getProjectId();

    return {
        ok: true,
        projectId,
    };
});
