import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { Authenticated } from '../auth/decorator/authenticated.decorator';
import { User } from '../user/user.entity';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { Roles } from '../auth/decorator/role.decorator';
import { Page, PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { CreateProjectDto, ProjectDto } from 'taskapp-common/dist/src/dto/project.dto';
import { StageService } from './stage.service';
import { PageParams } from '../decorator/page.decorator';
import { create } from 'domain';

@Controller('stages')
export class StageController {
  constructor(private readonly stageService: StageService) {
  }

  @Get()
  async list(@Authenticated() user: User): Promise<void> {
    //todo
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Authenticated() user: User, @Body() data: CreateProjectDto): Promise<void> {
    //todo
  }

  @Put()
  @Roles(Role.ADMIN)
  async update(@Authenticated() user: User): Promise<void> {
    //todo
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    //todo
  }
}
