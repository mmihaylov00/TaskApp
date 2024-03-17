import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Authenticated } from '../auth/decorator/authenticated.decorator';
import { User } from '../database/entity/user.entity';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { Roles } from '../auth/decorator/role.decorator';
import { StageService } from './stage.service';
import {
  ManageStageDto,
  StageDto,
} from 'taskapp-common/dist/src/dto/stage.dto';
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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  create(
    @Authenticated() user: JwtUser,
    @Body() data: ManageStageDto,
  ): Promise<void> {
    return this.stageService.create(user, data);
  }

  @Put('/:id')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  update(
    @Authenticated() user: JwtUser,
    @Param('id') id: string,
    @Body() data: ManageStageDto,
  ): Promise<void> {
    return this.stageService.update(user, id, data);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  delete(
    @Authenticated() user: JwtUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.stageService.delete(user, id);
  }
}
