import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

/**
 * Partial data transfer object (DTO) for updating user information.
 * Inherits from the CreateUserDto to reuse validation rules.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  /**
   * The updated first name of the user.
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User first name',
    type: String,
    example: 'John',
  })
  firstName: string;

  /**
   * The updated last name of the user.
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User last name',
    type: String,
    example: 'Williams',
  })
  lastName: string;

  /**
   * The updated email address of the user.
   * @type {string}
   */
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User e-mail',
    type: String,
    example: 'johnwilliams@gmail.com',
  })
  email: string;

  /**
   * The updated password for the user, complying with strong password requirements.
   * @type {string}
   */
  @IsStrongPassword()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User password',
    type: String,
    example: 'P@ssword!',
  })
  password: string;

  /**
   * The updated profile picture for the user.
   * @type {any | undefined}
   */
  profilePicture?: any;

  /**
   * The timestamp indicating when the user was created.
   * @type {Date}
   */
  @IsDate()
  createdAt: Date;

  /**
   * The timestamp indicating when the user was last updated.
   * @type {Date}
   */
  @IsDate()
  updatedAt: Date;
}
