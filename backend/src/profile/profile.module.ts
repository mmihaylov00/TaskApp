import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ProfileController } from './profile.controller';
import { UserModule } from '../user/user.module';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    DatabaseModule,
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
  providers: [UserService, AuthService, JwtStrategy],
  controllers: [ProfileController],
})
export class ProfileModule {}
