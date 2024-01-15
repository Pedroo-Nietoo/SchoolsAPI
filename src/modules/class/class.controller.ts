import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { SwaggerBadRequestResponse } from 'src/errors/bad-request-response';
import { SwaggerConflictResponse } from 'src/errors/conflict-response';

@ApiBearerAuth()
@ApiTags('Classes')
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

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
