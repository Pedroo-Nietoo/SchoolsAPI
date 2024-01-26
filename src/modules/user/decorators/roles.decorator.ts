import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

/**
 * Key used for metadata to define roles associated with a route or endpoint.
 */
export const ROLES_KEY = 'roles';

/**
 * Decorator function to set metadata indicating the roles required for accessing a route or endpoint.
 * @param {...Role[]} roles - The roles required for access.
 * @returns {Function} The SetMetadata decorator.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
