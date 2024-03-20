import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { DatabaseModule } from '../database/database.module';
import { BoardModule } from '../board/board.module';
import { BoardService } from '../board/board.service';
import { ProjectModule } from '../project/project.module';
import { ProjectService } from '../project/project.service';

@Module({
  imports: [DatabaseModule, BoardModule, ProjectModule],
  providers: [TaskService, BoardService, ProjectService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
