import { Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { Authenticated } from '../auth/decorator/authenticated.decorator';
import { User } from './user.entity';
import { Roles } from '../auth/decorator/role.decorator';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { JwtUser } from '../auth/decorator/jwt-user.dto';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  async list(@Authenticated() user: JwtUser): Promise<void> {
    //todo if role == admin and no project specified return all users
    //todo
  }

  @Post()
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  async invite(@Authenticated() user: JwtUser): Promise<void> {
    //todo
  }

  @Put()
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  async update(@Authenticated() user: User): Promise<void> {
    //todo
  }
}
