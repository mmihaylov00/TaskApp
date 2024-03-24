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
  async create(@Authenticated() user: JwtUser, @Body() data: CreateTaskDto) {
    return this.taskService.create(user, data);
  }

  @Get('/:id')
  async get(@Authenticated() user: JwtUser, @Param('id') id: string) {
    return (await this.taskService.get(id, user)).toDto();
  }

  @Put('/:id')
  async update(
    @Authenticated() user: JwtUser,
    @Body() data: CreateTaskDto,
    @Param('id') id: string,
  ) {
    return this.taskService.update(id, user, data);
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

  @Put('/:id/complete')
  async archive(@Authenticated() user: JwtUser, @Param('id') id: string) {
    return this.taskService.complete(id, user);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Authenticated() user: JwtUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.taskService.delete(id, user);
  }
}
