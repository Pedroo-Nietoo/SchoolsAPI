import { Class } from 'src/modules/class/entities/class.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Entity representing an activity in the system.
 */
@Entity()
export class Activity {
  /**
   * The unique identifier for the activity.
   * @type {string}
   */
  @PrimaryGeneratedColumn()
  id?: string;

  /**
   * The unique name of the activity.
   * @type {string}
   */
  @Column({ unique: true })
  name: string;

  /**
   * The numeric identifier for the activity.
   * @type {number}
   */
  @Column()
  number: number;

  /**
   * The description of the activity.
   * @type {string}
   */
  @Column()
  description: string;

  /**
   * The class associated with the activity, established through a many-to-one relationship with the Class entity.
   * @type {Class}
   */
  @ManyToOne(() => Class, (classEntity) => classEntity.activities)
  @JoinColumn({ name: 'classId' })
  class: Class;
}
