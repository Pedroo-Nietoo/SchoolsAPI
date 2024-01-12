import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/PrismaService';
import { UserModule } from './modules/user/user.module';
import { ClassModule } from './modules/class/class.module';
import { ActivityModule } from './modules/activity/activity.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.entity';
import { Class } from './modules/class/entities/class.entity';
import { Activity } from './modules/activity/entities/activity.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    UserModule,
    ClassModule,
    ActivityModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'SchoolDB',
      entities: [User, Class, Activity],
      synchronize: true, //! Warning: remove in production
      autoLoadEntities: true,
    }),
    ThrottlerModule.forRoot([
      //todo Configure throttler
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
