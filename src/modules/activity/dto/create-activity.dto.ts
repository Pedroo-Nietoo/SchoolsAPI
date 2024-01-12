import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateActivityDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Activity name',
    type: String,
    example: 'Create Regex validation',
  })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Activity number',
    type: Number,
    example: 201,
  })
  number: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Activity description',
    type: String,
    example: 'Create the Regex validation for a signup code',
  })
  description: string;

  @ApiProperty({
    description: 'Class id',
    type: String,
    example: 'ffc345b6-0d22-4b77-b91a-c9fdf46a5acd',
  })
  @IsString()
  @IsNotEmpty()
  classId: string;
}
