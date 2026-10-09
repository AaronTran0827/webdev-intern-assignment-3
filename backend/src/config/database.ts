import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton Instance
 */
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});
