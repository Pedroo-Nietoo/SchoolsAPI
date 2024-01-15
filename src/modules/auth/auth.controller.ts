/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignInUserDto } from '../user/dto/signin-user.dto';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({
    summary: 'Logs a user',
    description: 'Logs a user into the platform',
  })
  @ApiOkResponse({ description: 'User logged successfully', status: 200 })
  @ApiBadRequestResponse({ description: 'Bad request', status: 400 })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access',
    status: 401,
  })
  signIn(@Body() signInDto: SignInUserDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Get('profile')
  @ApiOperation({
    summary: 'Shows the logged in user profile',
    description: 'Shows the logged in user profile by using the JWT Token',
  })
  @ApiOkResponse({
    description: 'Profile ifo listed successfully',
    status: 200,
  })
  @ApiBadRequestResponse({ description: 'Bad request', status: 400 })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access',
    status: 401,
  })
  getProfile(@Request() req) {
    const user = {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      password: req.user.password,
      role: req.user.role,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    };
    return user;
  }
}
