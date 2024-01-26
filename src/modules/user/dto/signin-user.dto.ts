import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

/**
 * Data transfer object (DTO) for user sign-in.
 */
export class SignInUserDto {
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
   * The password for user sign-in, complying with strong password requirements.
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
}
