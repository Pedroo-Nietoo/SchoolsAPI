import { PartialType } from '@nestjs/mapped-types';
import { CreateClassDto } from './create-class.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateClassDto extends PartialType(CreateClassDto) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Class name',
    type: String,
    example: 'System Development',
  })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Class number',
    type: Number,
    example: 201,
  })
  number: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Class description',
    type: String,
    example: 'Systems Development technical course class',
  })
  description: string;

  @ApiProperty({
    description: 'User id',
    type: String,
    example: 'ffc345b6-0d22-4b77-b91a-c9fdf46a5acd',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
