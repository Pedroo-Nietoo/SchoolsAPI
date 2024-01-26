import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateActivityDto } from './create-activity.dto';

/**
 * Partial data transfer object (DTO) for updating activity information.
 * Inherits from the CreateActivityDto to reuse validation rules.
 */
export class UpdateActivityDto extends PartialType(CreateActivityDto) {
  /**
   * The updated name of the activity.
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
   * The updated number associated with the activity.
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
   * The updated description of the activity.
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
   * The updated ID of the class associated with the activity.
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
