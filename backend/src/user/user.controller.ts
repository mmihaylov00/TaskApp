import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { Authenticated } from '../auth/decorator/authenticated.decorator';
import { Roles } from '../auth/decorator/role.decorator';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { JwtUser } from '../auth/decorator/jwt-user.dto';
import { PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { PageParams } from '../decorator/page.decorator';
import {
  CreateUserDto,
  SearchUserDto,
} from 'taskapp-common/dist/src/dto/user.dto';
import { UserStatus } from 'taskapp-common/dist/src/enums/user-status.enum';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.ADMIN)
  list(@PageParams() pageParams: PageRequestDto) {
    return this.userService.list(pageParams);
  }

  @Get('stats')
  stats(@Authenticated() user: JwtUser) {
    return this.userService.stats(user);
  }

  @Post()
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  invite(@Authenticated() user: JwtUser, @Body() data: CreateUserDto) {
    return this.userService.invite(user, data);
  }

  @Put('/:id')
  @Roles(Role.ADMIN)
  async update(
    @Authenticated() user: JwtUser,
    @Param('id') id: string,
    @Body() data: CreateUserDto,
  ) {
    await this.userService.update(user, id, data);
  }

  @Post('/search')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  find(@Authenticated() user: JwtUser, @Body() data: SearchUserDto) {
    return this.userService.find(user, data);
  }

  @Put('/:id/:status')
  @Roles(Role.ADMIN)
  async changeStatus(
    @Authenticated() user: JwtUser,
    @Param('id') id: string,
    @Param('status') status: UserStatus,
  ) {
    await this.userService.changeStatus(user, id, status);
  }
}
