import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PrismaService } from '@/prisma/PrismaService';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}

  async create(createClassDto: CreateClassDto) {
    const classExists = await this.prisma.class.findFirst({
      where: { name: createClassDto.name },
    });

    if (classExists) {
      throw new ConflictException('Class already registered');
    }

    const classNumberExists = await this.prisma.class.findFirst({
      where: { number: createClassDto.number },
    });

    if (classNumberExists) {
      throw new ConflictException('Class number already registered');
    }

    const userExists = await this.prisma.user.findFirst({
      where: {
        id: createClassDto.userId,
      },
    });

    if (!userExists) {
      throw new NotFoundException('User ID not found');
    }

    return await this.prisma.class.create({
      data: {
        ...createClassDto,
      },
    });
  }

  findAll(page: number) {
    if (page == 0) {
      return this.prisma.class.findMany({
        select: {
          id: true,
          name: true,
          number: true,
          description: true,
          userId: true,
        },
      });
    } else if (page == 1) {
      return this.prisma.class.findMany({
        select: {
          id: true,
          name: true,
          number: true,
          description: true,
          userId: true,
        },
        take: 20,
      });
    } else {
      return this.prisma.class.findMany({
        select: {
          id: true,
          name: true,
          number: true,
          description: true,
          userId: true,
        },
        take: 20,
        skip: (page - 1) * 20,
      });
    }
  }

  async findOne(name: string) {
    const classInfo = await this.prisma.class.findUnique({
      where: {
        name,
      },
      select: {
        id: true,
        name: true,
        number: true,
        description: true,
        userId: true,
      },
    });

    const classExists = await this.prisma.class.findFirst({
      where: {
        name: name,
      },
    });

    if (!classExists) {
      throw new NotFoundException('Class not found');
    }

    return classInfo;
  }

  async update(name: string, updateClassDto: UpdateClassDto) {
    const classExists = await this.prisma.class.findFirst({
      where: {
        name,
      },
    });

    if (!classExists) {
      throw new NotFoundException(`Class not found`);
    }

    const classNumberExists = await this.prisma.class.findFirst({
      where: { number: updateClassDto.number },
    });

    if (classNumberExists) {
      throw new ConflictException('Class number already registered');
    }

    const userExists = await this.prisma.user.findFirst({
      where: {
        id: updateClassDto.userId,
      },
    });

    if (!userExists) {
      throw new NotFoundException('User ID not found');
    }

    const classIsRegistered = await this.prisma.class.findFirst({
      where: {
        name: updateClassDto.name,
      },
    });

    if (classIsRegistered && classIsRegistered.name !== name) {
      throw new ConflictException('Class is already registered');
    }

    return await this.prisma.class.update({
      data: {
        ...updateClassDto,
      },
      where: {
        name,
      },
    });
  }

  async remove(name: string) {
    const classExists = await this.prisma.class.findFirst({
      where: {
        name: name,
      },
    });

    if (!classExists) {
      throw new NotFoundException(`Class not found`);
    }

    return await this.prisma.class.delete({
      where: {
        name,
      },
    });
  }
}
