import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { DatabaseModule } from '../database/database.module';
import { TaskModule } from '../task/task.module';
import { TaskService } from '../task/task.service';
import { BoardModule } from '../board/board.module';
import { ProjectModule } from '../project/project.module';
import { BoardService } from '../board/board.service';
import { ProjectService } from '../project/project.service';

@Module({
  imports: [DatabaseModule, BoardModule, ProjectModule, TaskModule],
  providers: [AttachmentService, BoardService, ProjectService, TaskService],
  controllers: [AttachmentController],
  exports: [AttachmentService],
})
export class AttachmentModule {}
