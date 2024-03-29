import { PrismaService } from '@/prisma/PrismaService';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

/**
 * Service responsible for class-related operations.
 */
@Injectable()
export class ClassService {
  /**
   * Constructs an instance of the ClassService.
   * @param {PrismaService} prisma - The Prisma service instance.
   */
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new class with the provided data.
   * @param {CreateClassDto} createClassDto - The data to create a new class.
   * @returns {Promise<void>} A success message if the class is created.
   * @throws {ConflictException} If the class or class number is already registered.
   * @throws {NotFoundException} If the user ID associated with the class is not found.
   */
  async create(createClassDto: CreateClassDto): Promise<void> {
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

    await this.prisma.class.create({
      data: {
        ...createClassDto,
      },
    });
  }

  /**
   * Retrieves a list of classes based on the specified page.
   * @param {number} page - The page number.
   * @returns {Promise<void>} A list of classes.
   */
  findAll(page: number) {
    if (page == 0) {
      return this.prisma.class.findMany({
        select: {
          id: true,
          name: true,
          number: true,
          description: true,
          userClasses: {
            select: {
              userId: true,
              classId: false,
            },
          },
        },
      });
    } else if (page == 1) {
      return this.prisma.class.findMany({
        select: {
          id: true,
          name: true,
          number: true,
          description: true,
          userClasses: {
            select: {
              userId: true,
              classId: false,
            },
          },
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
          userClasses: {
            select: {
              userId: true,
              classId: false,
            },
          },
        },
        take: 20,
        skip: (page - 1) * 20,
      });
    }
  }

  /**
   * Retrieves a class based on the provided name.
   * @param {string} name - The class name.
   * @returns {Promise<void>} The class data.
   * @throws {NotFoundException} If the class with the provided name is not found.
   */
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
        userClasses: {
          select: {
            userId: true,
            classId: false,
          },
        },
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

  /**
   * Updates a class based on the provided name.
   * @param {string} name - The class name.
   * @param {UpdateClassDto} updateClassDto - The data to update the class.
   * @returns {Promise<void>} A success message if the class is updated.
   * @throws {NotFoundException} If the class with the provided name is not found.
   * @throws {ConflictException} If the updated class name or number is already registered.
   * @throws {NotFoundException} If the user ID associated with the class is not found.
   */
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

    await this.prisma.class.update({
      data: {
        ...updateClassDto,
      },
      where: {
        name,
      },
    });
  }

  /**
   * Removes a class based on the provided name.
   * @param {string} name - The class name.
   * @returns {Promise<void>} A success message if the class is removed.
   * @throws {NotFoundException} If the class with the provided name is not found.
   */
  async remove(name: string) {
    const classExists = await this.prisma.class.findFirst({
      where: {
        name: name,
      },
    });

    if (!classExists) {
      throw new NotFoundException(`Class not found`);
    }

    await this.prisma.class.delete({
      where: {
        name,
      },
    });
  }
}
