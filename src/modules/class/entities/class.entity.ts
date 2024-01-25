import { Activitiy } from '@prisma/client';
import { Activity } from 'src/modules/activity/entities/activity.entity';
import { User } from '@/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  number: number;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.classes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Activity, (activityEntity) => activityEntity.class)
  activities: Activitiy[];
}
