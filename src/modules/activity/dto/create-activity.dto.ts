import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

/**
 * Data transfer object (DTO) for creating a new activity.
 */
export class CreateActivityDto {
  /**
   * The optional UUID for the activity.
   * @type {string}
   */
  @IsUUID()
  @IsOptional()
  id?: string;

  /**
   * The name of the activity.
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Activity name',
    type: String,
    example: 'Create Regex validation',
  })
  name: string;

  /**
   * The number associated with the activity.
   * @type {number}
   */
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Activity number',
    type: Number,
    example: 201,
  })
  number: number;

  /**
   * The description of the activity.
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Activity description',
    type: String,
    example: 'Create the Regex validation for a signup code',
  })
  description: string;

  /**
   * The ID of the class associated with the activity.
   * @type {string}
   */
  @ApiProperty({
    description: 'Class id',
    type: String,
    example: 'ffc345b6-0d22-4b77-b91a-c9fdf46a5acd',
  })
  @IsString()
  @IsNotEmpty()
  classId: string;
}
