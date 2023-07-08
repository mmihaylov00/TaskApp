import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stage } from './stage.entity';
import { Board } from '../board/board.entity';
import { StageService } from './stage.service';
import { StageController } from './stage.controller';
import { Task } from '../task/task.entity';
import { BoardModule } from '../board/board.module';
import { BoardService } from '../board/board.service';
import { ProjectService } from '../project/project.service';
import { ProjectModule } from '../project/project.module';
import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Board, Stage, Task, User]), BoardModule, ProjectModule],
  providers: [StageService, BoardService, ProjectService],
  controllers: [StageController],
  exports: [StageService]
})
export class StageModule {
}
