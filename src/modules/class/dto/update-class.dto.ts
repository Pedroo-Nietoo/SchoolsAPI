import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateClassDto } from './create-class.dto';

/**
 * Partial data transfer object (DTO) for updating class information.
 * Inherits from the CreateClassDto to reuse validation rules.
 */
export class UpdateClassDto extends PartialType(CreateClassDto) {
  /**
   * The updated name of the class.
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
   * The updated number associated with the class.
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
   * The updated description of the class.
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
   * The updated ID of the user associated with the class.
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
