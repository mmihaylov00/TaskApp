import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { ProjectService } from '../project/project.service';
import { ProjectModule } from '../project/project.module';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, ProjectModule, AuthModule],
  providers: [BoardService, ProjectService, AuthService, JwtService],
  controllers: [BoardController],
  exports: [BoardService],
})
export class BoardModule {}
