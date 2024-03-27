/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { SignInUserDto } from '../user/dto/signin-user.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

/**
 * Controller responsible for handling authentication-related operations, including user login and profile retrieval.
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Logs a user into the platform.
   * @param {SignInUserDto} signInDto - The DTO containing user login information.
   * @param {Response} response - The HTTP response object to set the JWT token as a cookie.
   * @returns {Promise<string>} A promise containing the JWT token.
   */
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({
    summary: 'Logs a user',
    description:
      'Logs a user into the platform and sets the JWT token as a cookie.',
  })
  @ApiOkResponse({ description: 'User logged in successfully', status: 200 })
  @ApiBadRequestResponse({ description: 'Invalid request', status: 400 })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access or invalid credentials',
    status: 401,
  })
  async signIn(
    @Body() signInDto: SignInUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    response.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return token;
  }

  /**
   * Shows the logged in user profile by using the JWT Token.
   * @param {Request} req - The HTTP request object containing the user information from the JWT Token.
   * @returns {object} The user profile information.
   */
  @Get('profile')
  @ApiOperation({
    summary: 'Shows the logged in user profile',
    description:
      'Retrieves the profile information of the logged-in user using the provided JWT token.',
  })
  @ApiOkResponse({
    description: 'Profile information retrieved successfully',
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

  /**
   * Revokes the user's login by removing the JWT token cookie.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @returns {object} A message indicating the successful revocation.
   */
  @ApiOperation({
    summary: 'Logout',
    description: "Revokes the user's login by removing the JWT token cookie.",
  })
  @ApiOkResponse({
    description: 'Token revoked successfully',
    status: 200,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access',
    status: 401,
  })
  @Get('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return res.status(200).json('Token revoked successfully');
  }

  /**
   * Refreshes the user's token by validating if it's expired and setting it back into the cookies.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @returns {object} A message indicating the successful revocation.
   */
  @ApiOperation({
    summary: 'Refresh token',
    description:
      "Refreshes the user's token by verifying if it's expired and setting it into the cookies.",
  })
  @ApiOkResponse({
    description: 'Token refreshed successfully',
    status: 200,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access',
    status: 401,
  })
  @Public()
  @Get('refresh')
  async refresh(@Request() req, @Res() res: Response) {
    const oldToken: string = req.cookies.token;

    const refreshedToken = await this.authService.refreshToken(oldToken);

    res.cookie('token', refreshedToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return res.send(refreshedToken);
  }
}
