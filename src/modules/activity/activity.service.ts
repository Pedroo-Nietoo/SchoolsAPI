import { PrismaService } from '@/prisma/PrismaService';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

/**
 * Service responsible for activity-related operations.
 */
@Injectable()
export class ActivityService {
  /**
   * Constructs an instance of the ActivityService.
   * @param {PrismaService} prisma - The Prisma service instance.
   */
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new activity with the provided data.
   * @param {CreateActivityDto} createActivityDto - The data to create a new activity.
   * @returns {Promise<void>} A success message if the activity is created.
   * @throws {ConflictException} If the activity or activity number is already registered.
   * @throws {NotFoundException} If the class ID associated with the activity is not found.
   */
  async create(createActivityDto: CreateActivityDto): Promise<void> {
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

    await this.prisma.activitiy.create({
      data: {
        ...createActivityDto,
      },
    });
  }

  /**
   * Retrieves a list of activities based on the specified page.
   * @param {number} page - The page number.
   * @returns {Promise<void>} A list of activities.
   */
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

  /**
   * Retrieves an activity based on the provided name.
   * @param {string} name - The activity name.
   * @returns {Promise<void>} The activity data.
   * @throws {NotFoundException} If the activity with the provided name is not found.
   */
  async findOne(name: string) {
    const activityInfo = await this.prisma.activitiy.findUnique({
      where: {
        name,
      },
      // Select activity data
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

  /**
   * Updates an activity based on the provided name.
   * @param {string} name - The activity name.
   * @param {UpdateActivityDto} updateActivityDto - The data to update the activity.
   * @returns {Promise<void>} A success message if the activity is updated.
   * @throws {NotFoundException} If the activity with the provided name is not found.
   * @throws {ConflictException} If the updated activity name or number is already registered.
   * @throws {NotFoundException} If the class ID associated with the activity is not found.
   */
  async update(
    name: string,
    updateActivityDto: UpdateActivityDto,
  ): Promise<void> {
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

    const classExists = await this.prisma.class.findFirst({
      where: {
        id: updateActivityDto.classId,
      },
    });

    if (!classExists) {
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

    await this.prisma.activitiy.update({
      data: {
        ...updateActivityDto,
      },
      where: {
        name,
      },
    });
  }

  /**
   * Removes an activity based on the provided name.
   * @param {string} name - The activity name.
   * @returns {Promise<void>} A success message if the activity is removed.
   * @throws {NotFoundException} If the activity with the provided name is not found.
   */
  async remove(name: string) {
    const activityExists = await this.prisma.activitiy.findFirst({
      where: {
        name: name,
      },
    });

    if (!activityExists) {
      throw new NotFoundException(`Activity not found`);
    }

    await this.prisma.activitiy.delete({
      where: {
        name,
      },
    });
  }
}
