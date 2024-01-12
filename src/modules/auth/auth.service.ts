/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/PrismaService';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signIn(email: string, pass: string) {
    const user = await this.userService.findData(email);

    const userExists = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!userExists) {
      throw new NotFoundException('Usuário não existente');
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (isMatch) {
      const payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: pass,
      };
      return await this.jwtService.signAsync(payload);
    } else {
      throw new UnauthorizedException('Incorrect password');
    }
  }
}
