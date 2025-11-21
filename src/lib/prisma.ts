import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const globalForPrisma = global as unknown as { prisma?: PrismaClient }

const dbUrl = process.env.DATABASE_URL || undefined
let adapter: any | undefined
// Only initialize the LibSQL adapter when the DATABASE_URL indicates a libsql/sqlite
// connection. The Prisma schema may specify a different provider (e.g. postgresql),
// so avoid creating an incompatible adapter for those cases.
if (dbUrl) {
  const normalized = dbUrl.toLowerCase();
  const looksLikeLibSql = normalized.startsWith('file:') || normalized.startsWith('libsql:') || normalized.includes('sqlite');
  if (looksLikeLibSql) {
    try {
      adapter = new PrismaLibSql({ url: dbUrl })
    } catch (e) {
      console.error('Failed to create PrismaLibSql adapter:', e)
    }
  }
}

// If no engine type is specified, prefer the binary engine in Node environments so
// Prisma doesn't require an adapter for the "client" engine type.
if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
}

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    ...(adapter ? { adapter } : {}),
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
