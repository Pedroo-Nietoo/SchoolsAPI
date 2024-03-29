import { PrismaService } from '@/prisma/PrismaService';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Service responsible for user-related operations.
 */
@Injectable()
export class UserService {
  /**
   * Constructs an instance of the UserService.
   * @param {PrismaService} prisma - The Prisma service instance.
   */
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new user with the provided data and role.
   * @param {CreateUserDto} createUserDto - The data to create a new user.
   * @param {Role} role - The user's role.
   * @returns {Promise<CreateUserDto>} The created user data.
   * @throws {ConflictException} If the provided email is already registered.
   */
  async create(
    createUserDto: CreateUserDto,
    role: Role,
  ): Promise<CreateUserDto> {
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
        role: role,
        profilePicture: '',
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      },
    });
  }

  /**
   * Uploads a profile image for the user with the provided email.
   * @param {string} email - The user's email.
   * @param {UpdateUserDto} updateUserDto - The data to update the user.
   * @param {Express.Multer.File} file - The uploaded file.
   * @returns {Promise<string>} A success message if the image is uploaded.
   * @throws {NotFoundException} If the user with the provided email is not found.
   * @throws {Error} If the file is missing or does not have a buffer.
   */
  async uploadProfileImage(
    email: string,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ): Promise<string> {
    const userExists = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!userExists) {
      throw new NotFoundException(`User not found`);
    }

    if (file && file.buffer) {
      const fileString = file.buffer.toString('base64');

      await this.prisma.user.update({
        data: {
          ...updateUserDto,
          profilePicture: fileString,
          updatedAt: new Date(Date.now()),
        },
        where: { email },
      });

      return 'Image uploaded successfully';
    } else {
      throw new Error('File is missing or does not have a buffer');
    }
  }

  /**
   * Retrieves the profile picture for the user with the provided email.
   * @param {string} email - The user's email.
   * @returns {Promise<string>} The profile picture as a base64-encoded string.
   * @throws {NotFoundException} If the user with the provided email is not found.
   * @throws {Error} If there is an internal server error.
   */
  async getProfilePicture(email: string): Promise<string> {
    try {
      const userExists = await this.prisma.user.findFirst({
        where: { email: email },
      });

      if (!userExists) {
        throw new NotFoundException('File not found');
      }

      return userExists.profilePicture;
    } catch (error) {
      console.error('Error retrieving image:', error);
      throw new Error('Internal Server Error');
    }
  }

  /**
   * Retrieves a list of users based on the specified page.
   * @param {number} page - The page number.
   * @returns {Promise<CreateUserDto[]>} The list of users.
   */
  findAll(page: number): Promise<CreateUserDto[]> {
    if (page == 0) {
      return this.prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          password: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          userClasses: {
            select: {
              userId: false,
              classId: true,
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
          role: true,
          createdAt: true,
          updatedAt: true,
          userClasses: {
            select: {
              userId: false,
              classId: true,
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
          role: true,
          createdAt: true,
          updatedAt: true,
          userClasses: {
            select: {
              userId: false,
              classId: true,
            },
          },
        },
        take: 20,
        skip: (page - 1) * 20,
      });
    }
  }

  /**
   * Retrieves a user based on the provided email.
   * @param {string} email - The user's email.
   * @returns {Promise<CreateUserDto>} The user data.
   * @throws {NotFoundException} If the user with the provided email is not found.
   */
  async findOne(email: string): Promise<CreateUserDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        userClasses: {
          select: {
            userId: false,
            classId: true,
          },
        },
      },
    });

    const userExists = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Updates a user's data based on the provided email.
   * @param {string} email - The user's email.
   * @param {UpdateUserDto} updateUserDto - The data to update the user.
   * @returns {Promise<CreateUserDto>} The updated user data.
   * @throws {NotFoundException} If the user with the provided email is not found.
   * @throws {ConflictException} If the new email is already registered.
   */
  async update(
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<CreateUserDto> {
    const userExists = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!userExists) {
      throw new NotFoundException(`User not found`);
    }

    const emailIsRegistered = await this.prisma.user.findFirst({
      where: { email: updateUserDto.email },
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
        updatedAt: new Date(Date.now()),
      },
      where: { email },
    });
  }

  /**
   * Removes a user based on the provided email.
   * @param {string} email - The user's email.
   * @returns {Promise<void>} A success message if the user is removed.
   * @throws {NotFoundException} If the user with the provided email is not found.
   */
  async remove(email: string) {
    // Check if the user exists
    const userExists = await this.prisma.user.findFirst({
      where: { email: email },
    });

    if (!userExists) {
      throw new NotFoundException(`User not found`);
    }

    return await this.prisma.user.delete({
      where: { email },
    });
  }

  /**
   * Retrieves user data based on the provided email.
   * @param {string} email - The user's email.
   * @returns {Promise<CreateUserDto | undefined>} The user data.
   */
  async findData(email: string): Promise<CreateUserDto | undefined> {
    return this.prisma.user.findFirst({
      where: { email: email },
    });
  }
}
