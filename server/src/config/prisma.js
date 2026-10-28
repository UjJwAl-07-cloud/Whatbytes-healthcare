import { PrismaClient } from '@prisma/client';

/**
 * Shared PrismaClient singleton instance.
 * Reusing a single client across controllers and middleware prevents
 * connection pool exhaustion and ensures optimal database connection pooling.
 */
const prisma = new PrismaClient();

export default prisma;
