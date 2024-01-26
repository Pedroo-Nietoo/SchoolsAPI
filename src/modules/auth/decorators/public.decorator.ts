/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';

/**
 * Key used for metadata to mark a route or endpoint as public.
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator function to set metadata indicating that a route or endpoint is public.
 * @returns {Function} The SetMetadata decorator.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
