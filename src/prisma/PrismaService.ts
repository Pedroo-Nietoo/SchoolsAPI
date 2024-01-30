/* eslint-disable prettier/prettier */
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import PrismaClient from "./prisma"
/**
 * Prisma Service file
 *
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * Inits Prisma Service connection
   *
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Disconnects Prisma Service when not in use
   *
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
