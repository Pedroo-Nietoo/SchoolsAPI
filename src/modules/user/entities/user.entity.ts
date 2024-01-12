import { Role } from '@prisma/client';
import { Class } from 'src/modules/class/entities/class.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: [Role.USER],
  })
  role: Role;

  @OneToMany(() => Class, (classEntity) => classEntity.user)
  classes: Class[];
}
