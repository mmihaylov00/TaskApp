import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { Authenticated } from '../auth/decorator/authenticated.decorator';
import { User } from '../user/user.entity';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { Roles } from '../auth/decorator/role.decorator';
import { Page, PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { CreateProjectDto, ProjectDto } from 'taskapp-common/dist/src/dto/project.dto';
import { ProjectService } from './project.service';
import { PageParams } from '../decorator/page.decorator';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {
  }

  @Get()
  list(@Authenticated() user: User, @PageParams() pageParams: PageRequestDto): Promise<Page<ProjectDto>> {
    return this.projectService.list(user, pageParams);
  }

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Authenticated() user: User, @Body() data: CreateProjectDto): Promise<void> {
     await this.projectService.create(user, data);
  }

  @Put()
  @Roles(Role.ADMIN)
  async update(@Authenticated() user: User): Promise<void> {
    //todo
  }

  @Delete('/:id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.projectService.delete(id);
  }
}
