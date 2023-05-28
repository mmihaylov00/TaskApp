import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { User } from '../user/user.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User])],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
