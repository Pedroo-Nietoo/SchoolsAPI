/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './constants';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';

/**
 * Guard to protect routes requiring authentication using JWT tokens.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * Creates an instance of the AuthGuard.
   * @param {JwtService} jwtService - The JWT service for token verification.
   * @param {Reflector} reflector - The reflector for retrieving metadata.
   */
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  /**
   * Determines if a route can be activated based on authentication requirements.
   * @param {ExecutionContext} context - The execution context.
   * @returns {Promise<boolean>} A boolean indicating if the route can be activated.
   * @throws {UnauthorizedException} If authentication fails.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException(
        'Token not found in cookie. Please log in',
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  /**
   * Extracts the JWT token from the request.
   * @param {Request} request - The HTTP request.
   * @returns {string | undefined} The extracted JWT token or undefined if not found.
   */
  private extractToken(request: Request): string | undefined {
    const cookies = request.cookies;
    return cookies['token'];
  }
}
