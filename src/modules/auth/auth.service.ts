/* eslint-disable prettier/prettier */
import { UserService } from '@/modules/user/user.service';
import { PrismaService } from '@/prisma/PrismaService';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

/**
 * Service responsible for authentication-related operations.
 */
@Injectable()
export class AuthService {
  /**
   * Constructs an instance of the AuthService.
   * @param {UserService} userService - The user service instance.
   * @param {JwtService} jwtService - The JWT service instance.
   * @param {PrismaService} prisma - The Prisma service instance.
   */
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  /**
   * Signs in a user by verifying the provided email and password.
   * @param {string} email - The user's email.
   * @param {string} pass - The user's password.
   * @returns {Promise<string>} The JWT token if authentication is successful.
   * @throws {NotFoundException} If the user with the provided email is not found.
   * @throws {UnauthorizedException} If the provided password is incorrect.
   */
  async signIn(email: string, pass: string): Promise<string> {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(pass, userExists.password);

    if (isMatch) {
      const payload = {
        id: userExists.id,
        firstName: userExists.firstName,
        lastName: userExists.lastName,
        email: userExists.email,
        password: pass,
        role: userExists.role,
        createdAt: userExists.createdAt,
        updatedAt: userExists.updatedAt,
      };

      return await this.jwtService.signAsync(payload);
    } else {
      throw new UnauthorizedException('Incorrect password');
    }
  }

  /**
   * Refreshes the user's authentication token.
   *
   * @param {string} token - The user's current authentication token.
   * @returns {Promise<string>} A promise that resolves to the new authentication token.
   * @throws {UnauthorizedException} If the provided token is invalid.
   *
   */
  async refreshToken(oldToken: string): Promise<string> {
    try {
      this.jwtService.verify(oldToken);
      return oldToken;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const oldPayload = this.jwtService.decode(oldToken) as any;
        delete oldPayload.exp;

        const signOptions: JwtSignOptions = { expiresIn: '1h' };
        const newToken = this.jwtService.sign(oldPayload, signOptions);

        return newToken;
      } else {
        throw new UnauthorizedException('Invalid old token');
      }
    }
  }
}
