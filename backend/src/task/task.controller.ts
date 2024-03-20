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
import { TaskService } from './task.service';
import { JwtUser } from '../auth/decorator/jwt-user.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import {
  CreateTaskDto,
  MoveTaskDto,
} from 'taskapp-common/dist/src/dto/task.dto';

@Controller('tasks')
@UseGuards(JwtGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(@Authenticated() user: JwtUser, @Body() data: CreateTaskDto) {
    await this.taskService.create(user, data);
  }

  @Get('/:id')
  async get(@Authenticated() user: JwtUser, @Param('id') id: string) {
    return this.taskService.get(id, user);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Authenticated() user: JwtUser,
    @Body() data: CreateTaskDto,
    @Param('id') id: string,
  ) {
    await this.taskService.update(id, user, data);
  }

  @Put('/:id/stage')
  @HttpCode(HttpStatus.NO_CONTENT)
  async moveStage(
    @Authenticated() user: JwtUser,
    @Body() data: MoveTaskDto,
    @Param('id') id: string,
  ) {
    await this.taskService.move(id, user, data);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    //todo
  }
}
