/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client instance for interacting with the database.
 * @type {PrismaClient}
 * @global
 */
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default PrismaClient;
