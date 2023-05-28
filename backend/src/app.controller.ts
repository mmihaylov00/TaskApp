import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TaskDto } from 'taskapp-common/dist/src/dto/task.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): TaskDto {
    return {title: 'test'};
  }
}
