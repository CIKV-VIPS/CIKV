import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const globalForPrisma = global as unknown as { prisma?: PrismaClient }

const dbUrl = process.env.DATABASE_URL || undefined
let adapter: any | undefined
if (dbUrl) {
  try {
    adapter = new PrismaLibSql({ url: dbUrl })
  } catch (e) {
    console.error('Failed to create PrismaLibSql adapter:', e)
  }
}

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    ...(adapter ? { adapter } : {}),
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
