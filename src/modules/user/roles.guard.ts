import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

/**
 * Guard to check if the user has the required roles for accessing a route.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * Creates an instance of the RolesGuard.
   * @param {Reflector} reflector - The reflector for retrieving metadata.
   */
  constructor(private reflector: Reflector) {}

  /**
   * Determines if a route can be activated based on the user's roles.
   * @param {ExecutionContext} context - The execution context.
   * @returns {boolean} A boolean indicating if the route can be activated.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    return requiredRoles.some((role) => user?.role === role);
  }
}
