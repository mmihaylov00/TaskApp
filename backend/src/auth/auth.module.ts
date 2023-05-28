import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import configuration from '../config/configuration';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: () => {
        return {
          secret: configuration().app_secret,
          signOptions: { expiresIn: '6h' },
        };
      },
    }),
  ],
  providers: [ConfigService, AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
