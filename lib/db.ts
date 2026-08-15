import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required for database access. Add it to the Vercel environment variables.');
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

// Lazy initialization prevents Next.js from opening a database connection while
// it is collecting route configuration during `next build`. The client is
// created only when an API/server function actually accesses `db` at runtime.
let client: PrismaClient | undefined = global.prisma;

export const db = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    client ??= createPrismaClient();
    if (process.env.NODE_ENV !== 'production') global.prisma = client;
    return Reflect.get(client as object, property, receiver);
  },
});
