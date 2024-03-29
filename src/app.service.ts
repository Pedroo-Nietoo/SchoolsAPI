import { PrismaService } from '@/prisma/PrismaService';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import {
  DiskHealthIndicator,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

/**
 * Service responsible for performing health checks on various components of the server.
 */
@Injectable()
export class AppService {
  /**
   * Constructs an instance of the AppService.
   * @param {HealthCheckService} health - The health check service.
   * @param {HttpHealthIndicator} http - The HTTP health indicator.
   * @param {TypeOrmHealthIndicator} db - The TypeORM health indicator for database checks.
   * @param {PrismaHealthIndicator} prisma - The Prisma health indicator for Prisma checks.
   * @param {PrismaService} prismaService - The Prisma service instance.
   * @param {DiskHealthIndicator} disk - The disk health indicator for storage checks.
   * @param {MemoryHealthIndicator} memory - The memory health indicator for memory checks.
   */
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private readonly prisma: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  /**
   * Creating a new Logger that will log server health-related messages.
   */
  private readonly logger = new Logger('Server Health');

  /**
   * Performs a scheduled health check, including checks for HTTP, database, Prisma, storage, and memory.
   * @returns {Promise<HealthCheckResult>} The result of the health check.
   * @throws {Error} If an error occurs during the health check.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkHealth() {
    try {
      const serverHealth: HealthCheckResult = await this.health.check([
        () => this.http.pingCheck('nestjs-api', 'http://localhost:3000/docs'),
        () => this.db.pingCheck('database'),
        () => this.prisma.pingCheck('prisma', this.prismaService),
        () =>
          this.disk.checkStorage('storage', {
            // path: `C:/Program Files/PostgreSQL/data`,
            path: `/var/lib/postgresql/data`,
            thresholdPercent: 0.7,
          }),
        () => this.memory.checkHeap('memory_heap', 1024 * 1024 * 1024),
      ]);

      if (serverHealth.status === 'ok') {
        this.logger.log('All services are up and running! 🌱');
      }

      return serverHealth;
    } catch (error) {
      this.logger.error(`Error checking health: ${error.message}`);
      throw error;
    }
  }

  /**
   * Logs a message indicating that the service is up and running.
   */
  @Timeout(1000)
  runApplication() {
    return this.logger.log('Service is now up and running! 🌱');
  }
}
