import { PrismaService } from '@/prisma/PrismaService';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { Class } from './entities/class.entity';
123
@Module({
  imports: [TypeOrmModule.forFeature([Class])],
  controllers: [ClassController],
  providers: [ClassService, PrismaService],
})
export class ClassModule {}
