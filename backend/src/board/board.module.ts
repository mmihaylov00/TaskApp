import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { ProjectService } from '../project/project.service';
import { ProjectModule } from '../project/project.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, ProjectModule],
  providers: [BoardService, ProjectService],
  controllers: [BoardController],
  exports: [BoardService],
})
export class BoardModule {}
