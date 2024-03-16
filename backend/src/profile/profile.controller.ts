import { Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { Authenticated } from '../auth/decorator/authenticated.decorator';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import { AuthService } from '../auth/auth.service';
import { JwtUser } from '../auth/decorator/jwt-user.dto';

@Controller('profile')
@UseGuards(JwtGuard)
export class ProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async details(@Authenticated() user: JwtUser): Promise<UserDetailsDto> {
    const u = await this.userService.getUserData(user.id);
    return {
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role,
      token: this.authService.login(u),
    };
  }

  @Put()
  async update(@Authenticated() user: JwtUser): Promise<void> {
    //todo
  }

  @Get('/:token')
  async getSetupData(@Authenticated() user: JwtUser): Promise<void> {
    //todo initial setup from invite token, return given email
  }

  @Post()
  async setup(@Authenticated() user: JwtUser): Promise<void> {
    //todo initial setup from invite link
  }
}
