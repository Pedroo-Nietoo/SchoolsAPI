import { SwaggerBadRequestResponse } from '@/errors/bad-request-response';
import { SwaggerConflictResponse } from '@/errors/conflict-response';
import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  InternalServerErrorException,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
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
import { SkipThrottle } from '@nestjs/throttler';
import { Role } from '@prisma/client';
import { Response } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from './roles.guard';
import { UserService } from './user.service';

/**
 * Controller responsible for managing user-related operations, including creation, retrieval, update, and deletion.
 */
@ApiTags('Users')
@Controller('users')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Creates a new user on the platform.
   * @param {CreateUserDto} createUserDto - The DTO containing user creation information.
   * @param {Role} role - The role of the user.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
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
  @SkipThrottle({ default: false })
  @Post()
  create(@Body() createUserDto: CreateUserDto, @Query('role') role: Role) {
    return this.userService.create(createUserDto, role);
  }

  /**
   * Uploads a user profile picture to the platform.
   * @param {string} email - The email of the user.
   * @param {UpdateUserDto} updateUserDto - The DTO containing user update information.
   * @param {Express.Multer.File} file - The uploaded file.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
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
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.uploadProfileImage(email, updateUserDto, file);
  }

  /**
   * Gets a user profile picture.
   * @param {string} email - The email of the user.
   * @param {Response} res - The HTTP response object.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
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

  /**
   * Lists all users on the platform.
   * @param {number} page - The page number for paginated results.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
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

  /**
   * Lists information about a specific user on the platform.
   * @param {string} email - The email of the user.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
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

  /**
   * Updates information about a specific user on the platform.
   * @param {string} email - The email of the user.
   * @param {UpdateUserDto} updateUserDto - The DTO containing user update information.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
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

  /**
   * Removes a user from the platform.
   * @param {string} email - The email of the user.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
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
