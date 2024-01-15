import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthCheck } from '@nestjs/terminus';
import { Public } from './modules/auth/decorators/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
