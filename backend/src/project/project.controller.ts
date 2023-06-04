import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { Authenticated } from '../auth/decorator/authenticated.decorator';
import { User } from '../user/user.entity';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { Roles } from '../auth/decorator/role.decorator';
import { PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { CreateProjectDto } from 'taskapp-common/dist/src/dto/project.dto';
import { ProjectService } from './project.service';
import { PageParams } from '../decorator/page.decorator';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {
  }

  @Get()
  list(@Authenticated() user: User, @PageParams() pageParams: PageRequestDto) {
    return this.projectService.list(user, pageParams);
  }

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Authenticated() user: User, @Body() data: CreateProjectDto) {
    await this.projectService.create(user, data);
  }

  @Put('/:id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id') id: string, @Body() data: CreateProjectDto) {
    await this.projectService.update(id, data);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.projectService.delete(id);
  }

  @Get('/:id/user')
  async listUsers(@Authenticated() user: User,
                  @PageParams() pageParams: PageRequestDto,
                  @Param('id') id: string) {
    return this.projectService.listUsers(user, id, pageParams);
  }

  @Post('/:id/user/:userId')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async addUser(@Authenticated() user: User,
                @Param('id') id: string,
                @Param('userId') userId: string) {
    await this.projectService.addUser(user, id, userId);
  }

  @Delete('/:id/user/:userId')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeUser(@Authenticated() user: User,
                   @Param('id') id: string,
                   @Param('userId') userId: string) {
    await this.projectService.removeUser(user, id, userId);
  }
}
