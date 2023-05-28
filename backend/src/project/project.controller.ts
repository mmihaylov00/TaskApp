import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { Authenticated } from '../auth/decorator/authenticated.decorator';
import { User } from '../user/user.entity';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { Roles } from '../auth/decorator/role.decorator';

@Controller('projects')
export class ProjectController {

  @Get()
  async list(@Authenticated() user: User): Promise<void> {
    //todo
  }

  @Post()
  @Roles(Role.ADMIN)
  async create(@Authenticated() user: User): Promise<void> {
    //todo
  }

  @Put()
  @Roles(Role.ADMIN)
  async update(@Authenticated() user: User): Promise<void> {
    //todo
  }

  @Delete()
  @Roles(Role.ADMIN)
  async delete(@Authenticated() user: User): Promise<void> {
    //todo
  }
}
