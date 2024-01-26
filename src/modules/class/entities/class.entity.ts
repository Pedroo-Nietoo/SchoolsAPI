import { User } from '@/modules/user/entities/user.entity';
import { Activitiy } from '@prisma/client';
import { Activity } from 'src/modules/activity/entities/activity.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Entity representing a class in the system.
 */
@Entity()
export class Class {
  /**
   * The unique identifier for the class.
   * @type {string}
   */
  @PrimaryGeneratedColumn()
  id?: string;

  /**
   * The unique name of the class.
   * @type {string}
   */
  @Column({ unique: true })
  name: string;

  /**
   * The numeric identifier for the class.
   * @type {number}
   */
  @Column()
  number: number;

  /**
   * The description of the class.
   * @type {string}
   */
  @Column()
  description: string;

  /**
   * The user associated with the class, established through a many-to-one relationship with the User entity.
   * @type {User}
   */
  @ManyToOne(() => User, (user) => user.classes)
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * The activities associated with the class, established through a one-to-many relationship with the Activity entity.
   * @type {Activitiy[]}
   */
  @OneToMany(() => Activity, (activityEntity) => activityEntity.class)
  activities: Activitiy[];
}
