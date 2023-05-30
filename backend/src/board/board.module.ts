import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../project/project.entity';
import { Board } from './board.entity';
import { Stage } from '../stage/stage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Board, Stage])],
  providers: [],
  controllers: [],
  exports: []
})
export class BoardModule {
}
