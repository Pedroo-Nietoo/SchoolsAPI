import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/PrismaService';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, role: Role) {
    const userExists = await this.prisma.user.findFirst({
      where: { email: createUserDto.email },
    });

    if (userExists) {
      throw new ConflictException('E-mail already registered');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);

    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hash,
        role,
      },
    });
  }

  findAll(page: number) {
    if (page == 0) {
      return this.prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          password: true,
          classes: {
            select: {
              id: true,
            },
          },
        },
      });
    } else if (page == 1) {
      return this.prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          password: true,
          classes: {
            select: {
              id: true,
            },
          },
        },
        take: 20,
      });
    } else {
      return this.prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          password: true,
          classes: {
            select: {
              id: true,
            },
          },
        },
        take: 20,
        skip: (page - 1) * 20,
      });
    }
  }

  async findOne(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        role: true,
        classes: {
          select: {
            id: true,
          },
        },
      },
    });

    const userExists = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!userExists) {
      throw new NotFoundException(`User not found`);
    }

    const emailIsRegistered = await this.prisma.user.findFirst({
      where: {
        email: updateUserDto.email,
      },
    });

    if (emailIsRegistered && emailIsRegistered.email !== email) {
      throw new ConflictException('E-mail is already registered');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(updateUserDto.password, salt);

    return await this.prisma.user.update({
      data: {
        ...updateUserDto,
        password: hash,
      },
      where: {
        email,
      },
    });
  }

  async remove(email: string) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!userExists) {
      throw new NotFoundException(`User not found`);
    }

    return await this.prisma.user.delete({
      where: {
        email,
      },
    });
  }

  async findData(email: string): Promise<CreateUserDto | undefined> {
    return this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
  }
}
