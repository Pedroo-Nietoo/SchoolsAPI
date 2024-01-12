import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { SwaggerBadRequestResponse } from 'src/errors/bad-request-response';
import { SwaggerConflictResponse } from 'src/errors/conflict-response';
import { Public } from '../auth/decorators/public.decorator';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiQuery({ name: 'role', enum: Role })
  @ApiOperation({
    summary: 'Creates a user',
    description: 'Creates a user on the platform',
  })
  @ApiCreatedResponse({ status: 201, description: 'User created successfully' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerBadRequestResponse,
  })
  @ApiConflictResponse({
    status: 409,
    description: 'E-mail already registered',
    type: SwaggerConflictResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Public()
  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Query('role') role: Role = Role.USER,
  ) {
    return this.userService.create(createUserDto, role);
  }

  @ApiOperation({
    summary: 'Lists all users',
    description: 'Lists all users on the platform',
  })
  @ApiParam({
    name: 'page',
    description: 'Users list page',
    schema: { default: 1 },
  })
  @ApiOkResponse({
    status: 200,
    description: 'Users information listed successfully',
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
    return this.userService.findAll(page);
  }

  @ApiOperation({
    summary: 'Lists a specific user',
    description: 'Lists a specific user on the platform',
  })
  @ApiOkResponse({
    status: 200,
    description: 'User information listed successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerBadRequestResponse,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
    type: SwaggerConflictResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get('unique/:email')
  findOne(@Param('email') email: string) {
    return this.userService.findOne(email);
  }

  @ApiOperation({
    summary: 'Updates a user information',
    description: 'Updates a user information on the platform',
  })
  @ApiOkResponse({
    status: 200,
    description: 'User information updated successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerBadRequestResponse,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
    type: SwaggerConflictResponse,
  })
  @ApiConflictResponse({
    status: 409,
    description: 'E-mail already registered',
    type: SwaggerConflictResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Patch(':email')
  update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(email, updateUserDto);
  }

  @ApiOperation({
    summary: 'Removes a user',
    description: 'Removes a user from the platform',
  })
  @ApiOkResponse({
    status: 200,
    description: 'User removed successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
    type: SwaggerBadRequestResponse,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
    type: SwaggerConflictResponse,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Delete(':email')
  remove(@Param('email') email: string) {
    return this.userService.remove(email);
  }
}
