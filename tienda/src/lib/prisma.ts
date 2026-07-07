// Prisma client singleton
// Only import when DATABASE_URL is configured and `npx prisma generate` has been run

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let prisma: any = null

if (process.env.DATABASE_URL) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require('@prisma/client')
    const globalForPrisma = globalThis as unknown as {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prisma: any | undefined
    }
    prisma = globalForPrisma.prisma ?? new PrismaClient()
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
  } catch {
    console.warn('Prisma Client not available. Run `npx prisma generate` first.')
  }
}

export { prisma }
