import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from '../ormconfig';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(options),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    UserModule,
    ProjectModule
  ],
  providers: []
})
export class AppModule {
}
