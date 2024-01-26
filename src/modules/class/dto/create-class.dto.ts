import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

/**
 * Data transfer object (DTO) for creating a new class.
 */
export class CreateClassDto {
  /**
   * The optional UUID for the class.
   * @type {string}
   */
  @IsUUID()
  @IsOptional()
  id?: string;

  /**
   * The name of the class.
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Class name',
    type: String,
    example: 'System Development',
  })
  name: string;

  /**
   * The number associated with the class.
   * @type {number}
   */
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Class number',
    type: Number,
    example: 201,
  })
  number: number;

  /**
   * The description of the class.
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Class description',
    type: String,
    example: 'Systems Development technical course class',
  })
  description: string;

  /**
   * The ID of the user associated with the class.
   * @type {string}
   */
  @ApiProperty({
    description: 'User id',
    type: String,
    example: 'ffc345b6-0d22-4b77-b91a-c9fdf46a5acd',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
