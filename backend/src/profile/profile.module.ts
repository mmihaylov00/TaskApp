import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ProfileController } from './profile.controller';
import { UserModule } from '../user/user.module';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';

@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([User]),
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
