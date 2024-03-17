import { Module } from '@nestjs/common';
import { StageService } from './stage.service';
import { StageController } from './stage.controller';
import { BoardModule } from '../board/board.module';
import { BoardService } from '../board/board.service';
import { ProjectService } from '../project/project.service';
import { ProjectModule } from '../project/project.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, BoardModule, ProjectModule],
  providers: [StageService, BoardService, ProjectService],
  controllers: [StageController],
  exports: [StageService],
})
export class StageModule {}
