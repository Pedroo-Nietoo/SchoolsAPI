import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
  IsDate,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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

  profilePicture?: any;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
