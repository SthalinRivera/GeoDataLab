import { defineConfig } from '@prisma/config';

export default defineConfig({
    client: {
        adapter: 'postgresql',
        url: process.env.DATABASE_URL,
    },
});
