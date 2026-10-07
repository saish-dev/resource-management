import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

// Host runs read the repo-root .env; containers get env from docker-compose.
config({ path: '../../.env', quiet: true });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations', seed: 'tsx prisma/seed.ts' },
  datasource: { url: process.env.DATABASE_URL },
});
