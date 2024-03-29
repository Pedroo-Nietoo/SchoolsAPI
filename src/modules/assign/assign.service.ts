import { PrismaService } from '@/prisma/PrismaService';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class AssignService {
  /**
   * Constructs an instance of the AssignService.
   * @param {PrismaService} prisma - The Prisma service instance.
   */
  constructor(private prisma: PrismaService) {}

  async assignUserToClass(userId: string, classId: string) {
    const alreadyAssigned = await this.prisma.userClass.findFirst({
      where: {
        userId: userId,
        classId: classId,
      },
    });

    if (alreadyAssigned) {
      throw new ConflictException('User already assigned to class');
    }

    return await this.prisma.userClass.create({
      data: {
        userId: userId,
        classId: classId,
      },
    });
  }

  async unassignUserToClass(userId: string, classId: string) {
    const alreadyAssigned = await this.prisma.userClass.findUnique({
      where: {
        userId_classId: {
          userId,
          classId,
        },
      },
    });

    if (!alreadyAssigned) {
      throw new NotFoundException('User and class are already unassigned');
    }

    return await this.prisma.userClass.delete({
      where: {
        userId_classId: {
          userId,
          classId,
        },
      },
    });
  }
}
