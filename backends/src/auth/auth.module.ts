import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module'; // <= import ici
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenBlacklistService } from './token-blacklist.service';
import { JwtBlacklistGuard } from './guards/jwt-blacklist.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
@Module({
  imports: [
    UsersModule, // <= obligatoire
    PassportModule,
    ConfigModule, // déjà global, mais ok
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') ?? '1d' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy , JwtAuthGuard, JwtBlacklistGuard, TokenBlacklistService ],
  controllers: [AuthController],
  exports: [AuthService, JwtBlacklistGuard, TokenBlacklistService],
})
export class AuthModule {}
