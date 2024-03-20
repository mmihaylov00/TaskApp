import { Module } from '@nestjs/common';
import { ProjectService } from '../project/project.service';
import { ProjectModule } from '../project/project.module';
import { DatabaseModule } from '../database/database.module';
import { BoardGateway } from './board.gateway';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, ProjectModule, AuthModule],
  providers: [BoardGateway, ProjectService, AuthService, JwtService],
  exports: [BoardGateway],
})
export class WSModule {}
