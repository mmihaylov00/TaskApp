import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stage } from './stage.entity';
import { Board } from '../board/board.entity';
import { StageService } from './stage.service';
import { StageController } from './stage.controller';
import { Task } from '../task/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Stage, Task])],
  providers: [StageService],
  controllers: [StageController],
  exports: [StageService]
})
export class StageModule {
}
