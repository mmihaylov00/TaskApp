import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import configuration from '../config/configuration';
import { JwtGuard } from './guard/jwt.guard';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        return {
          secret: configuration().app_secret,
          signOptions: { expiresIn: '6h' }
        };
      }
    })
  ],
  controllers: [AuthController],
  providers: [ConfigService, AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService]
})
export class AuthModule {
}
