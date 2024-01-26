/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents the structure of a Swagger response for a Conflict scenario.
 */
export class SwaggerConflictResponse {
  /**
   * The conflict-related message.
   * @type {string}
   */
  @ApiProperty()
  message: string;

  /**
   * The type of error that occurred.
   * @type {string}
   */
  @ApiProperty()
  error: string;

  /**
   * The HTTP status code indicating the Conflict.
   * @type {number}
   */
  @ApiProperty()
  statusCode: number;
}
