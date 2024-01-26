import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';
import { AppService } from './app.service';
import { Public } from './modules/auth/decorators/public.decorator';

/**
 * Controller responsible for handling health checks of the service and its dependencies.
 *
 */
@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Executes the health check for various components such as HTTP, database, Prisma, storage, and memory.
   * @returns {Promise<HealthCheckResult>} The result of the health check.
   */
  @Public()
  @HealthCheck()
  @ApiOperation({
    summary: 'Checks service health',
    description:
      'Checks the health of the service as a whole (Database, Prisma, storage, temporary memory and API)',
  })
  @Get()
  checkHealth() {
    return this.appService.checkHealth();
  }
}
