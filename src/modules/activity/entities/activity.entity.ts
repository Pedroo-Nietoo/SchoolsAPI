import { Class } from 'src/modules/class/entities/class.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  number: number;

  @Column()
  description: string;

  @ManyToOne(() => Class, (classEntity) => classEntity.activities)
  @JoinColumn({ name: 'classId' })
  class: Class;
}
