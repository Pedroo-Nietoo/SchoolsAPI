import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerBadRequestResponse } from 'src/errors/bad-request-response';
import { SwaggerConflictResponse } from 'src/errors/conflict-response';

@ApiBearerAuth()
@ApiTags('Activities')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @ApiOperation({
    summary: 'Creates a activity',
    description: 'Creates a activity on the platform',
  })
  @ApiCreatedResponse({
    status: 201,
    description: 'Activity created successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerBadRequestResponse,
  })
  @ApiConflictResponse({
    status: 409,
    description: 'Activity already registered',
    type: SwaggerConflictResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Post()
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.create(createActivityDto);
  }

  @ApiOperation({
    summary: 'Lists all activities',
    description: 'Lists all activities on the platform',
  })
  @ApiParam({
    name: 'page',
    description: 'Activities list page',
    schema: { default: 1 },
  })
  @ApiOkResponse({
    status: 200,
    description: 'Activities information listed successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerBadRequestResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get('/all/:page')
  findAll(@Param('page') page: number) {
    return this.activityService.findAll(+page);
  }

  @ApiOperation({
    summary: 'Lists a specific activity',
    description: 'Lists a specific activity on the platform',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Activity information listed successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerBadRequestResponse,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Activity not found',
    type: SwaggerConflictResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.activityService.findOne(name);
  }

  @ApiOperation({
    summary: 'Updates a activity information',
    description: 'Updates a activity information on the platform',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Activity information updated successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerBadRequestResponse,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Activity not found',
    type: SwaggerConflictResponse,
  })
  @ApiConflictResponse({
    status: 409,
    description: 'Activity already registered',
    type: SwaggerConflictResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Patch(':name')
  update(
    @Param('name') name: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activityService.update(name, updateActivityDto);
  }

  @ApiOperation({
    summary: 'Removes a activity',
    description: 'Removes a activity from the platform',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Activity removed successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerBadRequestResponse,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Activity not found',
    type: SwaggerConflictResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.activityService.remove(name);
  }
}
