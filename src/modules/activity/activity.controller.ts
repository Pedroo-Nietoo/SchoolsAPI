import { SwaggerBadRequestResponse } from '@/errors/bad-request-response';
import { SwaggerConflictResponse } from '@/errors/conflict-response';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

/**
 * Controller responsible for managing activity-related operations, including creation, retrieval, update, and deletion.
 */
@ApiTags('Activities')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  /**
   * Creates a new activity on the platform.
   * @param {CreateActivityDto} createActivityDto - The DTO containing activity creation information.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
  @ApiOperation({
    summary: 'Creates an activity',
    description: 'Creates an activity on the platform',
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
  @SkipThrottle({ default: false })
  @Post()
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.create(createActivityDto);
  }

  /**
   * Lists all activities on the platform.
   * @param {number} page - The page number for paginated results.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
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

  /**
   * Lists information about a specific activity on the platform.
   * @param {string} name - The name of the activity.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
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

  /**
   * Updates information about a specific activity on the platform.
   * @param {string} name - The name of the activity.
   * @param {UpdateActivityDto} updateActivityDto - The DTO containing activity update information.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
  @ApiOperation({
    summary: 'Updates an activity information',
    description: 'Updates an activity information on the platform',
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

  /**
   * Removes an activity from the platform.
   * @param {string} name - The name of the activity.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
  @ApiOperation({
    summary: 'Removes an activity',
    description: 'Removes an activity from the platform',
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
