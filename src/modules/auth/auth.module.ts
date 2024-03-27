/* eslint-disable prettier/prettier */
import { UserModule } from '@/modules/user/user.module';
import { PrismaService } from '@/prisma/PrismaService';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: jwtConstants.secret,
        signOptions: {
          expiresIn: '1h',
        },
        cookie: {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
