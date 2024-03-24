import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { BoardModule } from './board/board.module';
import { StageModule } from './stage/stage.module';
import { TaskModule } from './task/task.module';
import { ProfileModule } from './profile/profile.module';
import { DatabaseModule } from './database/database.module';
import { WSModule } from './socket/socket.module';
import { AttachmentModule } from './attachment/attachment.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ProfileModule,
    ProjectModule,
    BoardModule,
    StageModule,
    WSModule,
    TaskModule,
    AttachmentModule,
  ],
  providers: [],
})
export class AppModule {}
