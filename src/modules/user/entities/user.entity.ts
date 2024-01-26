import { Class } from '@/modules/class/entities/class.entity';
import { Role } from '@prisma/client';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Entity representing a user in the system.
 */
@Entity()
export class User {
  /**
   * The unique identifier for the user.
   * @type {string}
   */
  @PrimaryGeneratedColumn()
  id?: string;

  /**
   * The first name of the user.
   * @type {string}
   */
  @Column({ length: 15 })
  firstName: string;

  /**
   * The last name of the user.
   * @type {string}
   */
  @Column({ length: 20 })
  lastName: string;

  /**
   * The unique email address of the user.
   * @type {string}
   */
  @Column({ unique: true })
  email: string;

  /**
   * The password associated with the user.
   * @type {string}
   */
  @Column()
  password: string;

  /**
   * The role of the user, represented as an enum from the @prisma/client module.
   * @type {Role}
   */
  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  /**
   * The URL path to the user's profile picture.
   * @type {string | undefined}
   */
  @Column()
  profilePicture?: string;

  /**
   * The timestamp indicating when the user was created.
   * @type {Date}
   */
  @Column()
  createdAt: Date;

  /**
   * The timestamp indicating when the user was last updated.
   * @type {Date}
   */
  @Column()
  updatedAt: Date;

  /**
   * The classes associated with the user, established through a one-to-many relationship with the Class entity.
   * @type {Class[]}
   */
  @OneToMany(() => Class, (classEntity) => classEntity.user)
  classes: Class[];
}
