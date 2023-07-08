import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from '../ormconfig';
import { ProjectModule } from './project/project.module';
import { BoardModule } from './board/board.module';
import { StageModule } from './stage/stage.module';
import { TaskModule } from './task/task.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(options),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ProfileModule,
    ProjectModule,
    BoardModule,
    StageModule,
    TaskModule,
  ],
  providers: [],
})
export class AppModule {}
