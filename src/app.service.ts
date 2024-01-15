import { Injectable, Logger } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
  PrismaHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';
import { PrismaService } from './database/PrismaService';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';

@Injectable()
export class AppService {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private readonly prisma: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  private readonly logger = new Logger('Server Health');

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
            thresholdPercent: 1.0,
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

  @Timeout(1000)
  runApplication() {
    return this.logger.log('Service is now up and running! 🌱');
  }
}
