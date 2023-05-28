import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginRequestDto, LoginResponseDto, UserDetailsDto } from 'common/src/dto/auth.dto';
import { AuthService } from '../auth/auth.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { Authenticated } from '../auth/decorator/authenticated.decorator';
import { User } from './user.entity';
import { Roles } from '../auth/decorator/role.decorator';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';


@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get()
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  async list(@Authenticated() user: User): Promise<void> {
    //todo if role == admin and no project specified return all users
    //todo
  }

  @Post()
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  async invite(@Authenticated() user: User): Promise<void> {
    //todo
  }

  @Put()
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  async update(@Authenticated() user: User): Promise<void> {
    //todo
  }
}
