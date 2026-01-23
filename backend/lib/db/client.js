/**
 * Prisma Client Singleton
 * Ensures only one instance of Prisma Client is created across the application
 * This prevents connection pool exhaustion in development
 */

import { PrismaClient } from '@prisma/client'

// Global variable to store Prisma Client instance
const globalForPrisma = global

// Create or reuse existing Prisma Client
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

// Ensure singleton pattern in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
