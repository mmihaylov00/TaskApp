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
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { Roles } from '../auth/decorator/role.decorator';
import { PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { CreateProjectDto } from 'taskapp-common/dist/src/dto/project.dto';
import { ProjectService } from './project.service';
import { PageParams } from '../decorator/page.decorator';
import { JwtUser } from '../auth/decorator/jwt-user.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';

@Controller('projects')
@UseGuards(JwtGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  list(
    @Authenticated() user: JwtUser,
    @PageParams() pageParams: PageRequestDto,
  ) {
    return this.projectService.list(user, pageParams);
  }

  @Post()
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  @HttpCode(HttpStatus.CREATED)
  create(@Authenticated() user: JwtUser, @Body() data: CreateProjectDto) {
    return this.projectService.create(user, data);
  }

  @Get('/:id')
  async get(@Authenticated() user: JwtUser, @Param('id') id: string) {
    return (await this.projectService.getProject(id, user)).toDto();
  }

  @Get('/:id/stats')
  @Roles(Role.ADMIN)
  getStats(@Authenticated() user: JwtUser, @Param('id') id: string) {
    return this.projectService.getStats(id, user);
  }

  @Put('/:id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Authenticated() user: JwtUser,
    @Param('id') id: string,
    @Body() data: CreateProjectDto,
  ) {
    await this.projectService.update(id, data);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.projectService.delete(id);
  }

  @Get('/user/:id')
  @Roles(Role.ADMIN)
  listProjects(@Param('id') id: string) {
    return this.projectService.listProjects(id);
  }

  @Get('/:id/user')
  listUsers(
    @Authenticated() user: JwtUser,
    @PageParams() pageParams: PageRequestDto,
    @Param('id') id: string,
  ) {
    return this.projectService.listUsers(user, id, pageParams);
  }

  @Put('/:id/user/:userId')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async addUser(
    @Authenticated() user: JwtUser,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    await this.projectService.addUser(user, id, userId);
  }

  @Delete('/:id/user/:userId')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeUser(
    @Authenticated() user: JwtUser,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    await this.projectService.removeUser(user, id, userId);
  }
}
