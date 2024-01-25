import { PrismaService } from '@/prisma/PrismaService';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async create(createActivityDto: CreateActivityDto) {
    const activityExists = await this.prisma.activitiy.findFirst({
      where: { name: createActivityDto.name },
    });

    if (activityExists) {
      throw new ConflictException('Activity already registered');
    }

    const activityNumberExists = await this.prisma.activitiy.findFirst({
      where: { number: createActivityDto.number },
    });

    if (activityNumberExists) {
      throw new ConflictException('Activity number already registered');
    }

    const classExists = await this.prisma.class.findFirst({
      where: {
        id: createActivityDto.classId,
      },
    });

    if (!classExists) {
      throw new NotFoundException('Class ID not found');
    }

    return await this.prisma.activitiy.create({
      data: {
        ...createActivityDto,
      },
    });
  }

  findAll(page: number) {
    if (page == 0) {
      return this.prisma.activitiy.findMany({
        select: {
          id: true,
          name: true,
          number: true,
          description: true,
          classId: true,
        },
      });
    } else if (page == 1) {
      return this.prisma.activitiy.findMany({
        select: {
          id: true,
          name: true,
          number: true,
          description: true,
          classId: true,
        },
        take: 20,
      });
    } else {
      return this.prisma.activitiy.findMany({
        select: {
          id: true,
          name: true,
          number: true,
          description: true,
          classId: true,
        },
        take: 20,
        skip: (page - 1) * 20,
      });
    }
  }

  async findOne(name: string) {
    const activityInfo = await this.prisma.activitiy.findUnique({
      where: {
        name,
      },
      select: {
        id: true,
        name: true,
        number: true,
        description: true,
        classId: true,
      },
    });

    const activityExists = await this.prisma.activitiy.findFirst({
      where: {
        name: name,
      },
    });

    if (!activityExists) {
      throw new NotFoundException('Activity not found');
    }

    return activityInfo;
  }

  async update(name: string, updateActivityDto: UpdateActivityDto) {
    const activityExists = await this.prisma.activitiy.findFirst({
      where: {
        name,
      },
    });

    if (!activityExists) {
      throw new NotFoundException(`Activity not found`);
    }

    const activityNumberExists = await this.prisma.activitiy.findFirst({
      where: { number: updateActivityDto.number },
    });

    if (activityNumberExists) {
      throw new ConflictException('Activity number already registered');
    }

    const userExists = await this.prisma.class.findFirst({
      where: {
        id: updateActivityDto.classId,
      },
    });

    if (!userExists) {
      throw new NotFoundException('Class ID not found');
    }

    const activityIsRegistered = await this.prisma.activitiy.findFirst({
      where: {
        name: updateActivityDto.name,
      },
    });

    if (activityIsRegistered && activityIsRegistered.name !== name) {
      throw new ConflictException('Activity is already registered');
    }

    return await this.prisma.activitiy.update({
      data: {
        ...updateActivityDto,
      },
      where: {
        name,
      },
    });
  }

  async remove(name: string) {
    const activityExists = await this.prisma.activitiy.findFirst({
      where: {
        name: name,
      },
    });

    if (!activityExists) {
      throw new NotFoundException(`Activity not found`);
    }

    return await this.prisma.activitiy.delete({
      where: {
        name,
      },
    });
  }
}
