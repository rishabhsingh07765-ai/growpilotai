import { defineConfig } from 'prisma/config';

// Prisma 7 reads this config during `prisma generate` as well as migrations.
// Keep DATABASE_URL optional for the build step so Vercel can generate the
// client even when the database secret has not been configured yet. Runtime
// database operations still require a real DATABASE_URL.
const databaseUrl = process.env.DATABASE_URL || 'postgresql://localhost:5432/growpilot_build';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
});
