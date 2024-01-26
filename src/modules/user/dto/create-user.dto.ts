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

/**
 * Data transfer object (DTO) for creating a new user.
 */
export class CreateUserDto {
  /**
   * The optional UUID for the user.
   * @type {string}
   */
  @IsUUID()
  @IsOptional()
  id?: string;

  /**
   * The first name of the user.
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
   * The last name of the user.
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
   * The email address of the user.
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
   * The password for the user, complying with strong password requirements.
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
   * The role of the user, represented as an enum from the @prisma/client module.
   * @type {Role}
   */
  @IsEnum(Role)
  @IsOptional()
  role: Role;

  /**
   * The URL path to the user's profile picture.
   * @type {string | undefined}
   */
  profilePicture?: string;

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
