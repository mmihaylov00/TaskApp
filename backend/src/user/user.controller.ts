import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginRequestDto, LoginResponseDto, UserDetailsDto } from 'taskapp-common/src/dto/user.dto';
import { AuthService } from '../auth/auth.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { Authenticated } from '../auth/decorator/authenticated.decorator';
import { User } from './user.entity';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {
  }

  @Post()
  async login(@Body() data: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userService.loginUser(data.email, data.password);
    return {
      token: this.authService.login(user),
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };
  }

  @Get()
  @UseGuards(JwtGuard)
  async details(@Authenticated() user: User): Promise<UserDetailsDto> {
    const u = await this.userService.getUserData(user.id);
    return {
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role
    };
  }
}
