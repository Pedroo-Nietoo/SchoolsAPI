import { SwaggerBadRequestResponse } from '@/errors/bad-request-response';
import { SwaggerConflictResponse } from '@/errors/conflict-response';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
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
import { Response } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from './roles.guard';
import { UserService } from './user.service';
// import { Roles } from './decorators/roles.decorator';
@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseGuards(RolesGuard)
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
  create(@Body() createUserDto: CreateUserDto, @Query('role') role: Role) {
    return this.userService.create(createUserDto, role);
  }

  @ApiOperation({
    summary: 'Uploads a user profile picture',
    description: 'Uploads a user profile picture to the platform',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Profile picture uploaded successfully',
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post(':email/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('email') email: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'png',
        })
        .addMaxSizeValidator({
          maxSize: 100000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.uploadProfileImage(email, updateUserDto, file);
  }

  @ApiOperation({
    summary: 'Gets a user profile picture',
    description: 'Gets a user specific profile picture',
  })
  @ApiOkResponse({
    status: 200,
    description: 'User profile picture listed successfully',
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
  @Get('/:email/get')
  async getFileInfo(@Param('email') email: string, @Res() res: Response) {
    try {
      const base64Data = await this.userService.getProfilePicture(email);

      if (!base64Data) {
        return res.status(404).send('File not found');
      }

      res.setHeader('Content-Type', 'image/png');

      res.send(Buffer.from(base64Data, 'base64'));
    } catch (error) {
      console.error('Error retrieving image:', error);
      throw new InternalServerErrorException('Error retrieving image');
    }
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
  @Get(':email')
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

  // @Public()
  // @Roles(Role.ADMIN)
  // @Get('ok')
  // get() {
  //   return 'only admins can see it';
  // }
}
