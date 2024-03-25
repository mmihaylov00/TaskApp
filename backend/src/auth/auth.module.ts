import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import configuration from '../config/configuration';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        return {
          secret: configuration().app_secret,
          signOptions: { expiresIn: '6h' },
        };
      },
    }),
  ],
  providers: [ConfigService, AuthService, JwtStrategy, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
