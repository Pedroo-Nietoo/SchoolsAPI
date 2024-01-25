import { Role } from '@prisma/client';
import { Class } from '@/modules/class/entities/class.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 15 })
  firstName: string;

  @Column({ length: 20 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @Column()
  profilePicture?: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToMany(() => Class, (classEntity) => classEntity.user)
  classes: Class[];
}
