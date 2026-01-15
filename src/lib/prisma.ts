import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = global as unknown as { prisma?: PrismaClient }

const dbUrl = process.env.DATABASE_URL
let adapter

if (dbUrl && dbUrl.startsWith('postgres')) {
  const pool = new Pool({ connectionString: dbUrl })
  adapter = new PrismaPg(pool)
}

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    ...(adapter ? { adapter } : {}),
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
