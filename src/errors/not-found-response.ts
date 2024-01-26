/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents the structure of a Swagger response for a Not Found scenario.
 */
export class SwaggerNotFoundResponse {
  /**
   * The message indicating that the requested resource was not found.
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
   * The HTTP status code indicating the Not Found scenario.
   * @type {number}
   */
  @ApiProperty()
  statusCode: number;
}
