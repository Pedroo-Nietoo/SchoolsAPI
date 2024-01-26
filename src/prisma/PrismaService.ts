/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
/**
 * Prisma Service file
 *
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * Inits Prisma Service connection
   *
   */
  async onModuleInit() {
    await this.$connect();
  }
}
