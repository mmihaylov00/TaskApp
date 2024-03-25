import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Authenticated } from '../auth/decorator/authenticated.decorator';
import { StageService } from './stage.service';
import { StageDto } from 'taskapp-common/dist/src/dto/stage.dto';
import { JwtUser } from '../auth/decorator/jwt-user.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';

@Controller('stages')
@UseGuards(JwtGuard)
export class StageController {
  constructor(private readonly stageService: StageService) {}

  @Get('board/:id')
  list(
    @Authenticated() user: JwtUser,
    @Param('id') boardId: string,
  ): Promise<StageDto[]> {
    return this.stageService.list(user, boardId);
  }
}
