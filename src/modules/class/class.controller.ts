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
import { SwaggerBadRequestResponse } from 'src/errors/bad-request-response';
import { SwaggerConflictResponse } from 'src/errors/conflict-response';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

/**
 * Controller responsible for managing class-related operations, including creation, retrieval, update, and deletion.
 */
@ApiTags('Classes')
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  /**
   * Creates a new class on the platform.
   * @param {CreateClassDto} createClassDto - The DTO containing class creation information.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
  @ApiOperation({
    summary: 'Creates a class',
    description: 'Creates a class on the platform',
  })
  @ApiCreatedResponse({
    status: 201,
    description: 'Class created successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerBadRequestResponse,
  })
  @ApiNotFoundResponse({ status: 404, description: 'User ID not found' })
  @ApiConflictResponse({
    status: 409,
    description: 'Class already registered',
    type: SwaggerConflictResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }

  /**
   * Lists all classes on the platform.
   * @param {number} page - The page number for paginated results.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
  @ApiOperation({
    summary: 'Lists all classes',
    description: 'Lists all classes on the platform',
  })
  @ApiParam({
    name: 'page',
    description: 'Classes list page',
    schema: { default: 1 },
  })
  @ApiOkResponse({
    status: 200,
    description: 'Classes information listed successfully',
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
    return this.classService.findAll(+page);
  }

  /**
   * Lists information about a specific class on the platform.
   * @param {string} name - The name of the class.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
  @ApiOperation({
    summary: 'Lists a specific class',
    description: 'Lists a specific class on the platform',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Class information listed successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerBadRequestResponse,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Class not found',
    type: SwaggerConflictResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.classService.findOne(name);
  }

  /**
   * Updates information about a specific class on the platform.
   * @param {string} name - The name of the class.
   * @param {UpdateClassDto} updateClassDto - The DTO containing class update information.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
  @ApiOperation({
    summary: 'Updates a class information',
    description: 'Updates a class information on the platform',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Class information updated successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerBadRequestResponse,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Class not found',
    type: SwaggerConflictResponse,
  })
  @ApiConflictResponse({
    status: 409,
    description: 'Class already registered',
    type: SwaggerConflictResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Patch(':name')
  update(@Param('name') name: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classService.update(name, updateClassDto);
  }

  /**
   * Removes a class from the platform.
   * @param {string} name - The name of the class.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
  @ApiOperation({
    summary: 'Removes a class',
    description: 'Removes a class from the platform',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Class removed successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerBadRequestResponse,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Class not found',
    type: SwaggerConflictResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.classService.remove(name);
  }
}
