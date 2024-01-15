import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User first name',
    type: String,
    example: 'John',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User last name',
    type: String,
    example: 'Williams',
  })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User e-mail',
    type: String,
    example: 'johnwilliams@gmail.com',
  })
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User password',
    type: String,
    example: 'P@ssword!',
  })
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role: Role;

  profilePicture?: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
