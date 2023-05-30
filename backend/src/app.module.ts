import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from '../ormconfig';
import { ProjectModule } from './project/project.module';
import { BoardModule } from './board/board.module';
import { StageModule } from './stage/stage.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(options),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    UserModule,
    ProjectModule,
    BoardModule,
    StageModule,
    TaskModule
  ],
  providers: []
})
export class AppModule {
}
