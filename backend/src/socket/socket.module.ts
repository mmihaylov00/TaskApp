import { Module } from '@nestjs/common';
import { ProjectService } from '../project/project.service';
import { ProjectModule } from '../project/project.module';
import { DatabaseModule } from '../database/database.module';
import { BoardGateway } from './board.gateway';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { NotificationModule } from '../notification/notification.module';
import { NotificationService } from '../notification/notification.service';
import { NotificationGateway } from './notification.gateway';

@Module({
  imports: [DatabaseModule, ProjectModule, AuthModule, NotificationModule],
  providers: [
    BoardGateway,
    NotificationGateway,
    ProjectService,
    AuthService,
    JwtService,
    NotificationService,
  ],
  exports: [BoardGateway, NotificationGateway],
})
export class WSModule {}
