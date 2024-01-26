/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents the structure of a Swagger response for a Bad Request scenario.
 */
export class SwaggerBadRequestResponse {
  /**
   * The error message associated with the Bad Request.
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
   * The HTTP status code indicating the Bad Request.
   * @type {number}
   */
  @ApiProperty()
  statusCode: number;
}
