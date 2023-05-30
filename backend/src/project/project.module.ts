import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { User } from '../user/user.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Board } from '../board/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User, Board])],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
