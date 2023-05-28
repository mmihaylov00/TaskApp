import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from '../ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(options),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    UserModule
  ],
  providers: []
})
export class AppModule {
}
