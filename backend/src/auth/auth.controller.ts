import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginRequestDto, LoginResponseDto, UserDetailsDto } from 'common/src/dto/auth.dto';
import { JwtGuard } from './guard/jwt.guard';
import { Authenticated } from './decorator/authenticated.decorator';
import { User } from '../user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService,
              private readonly authService: AuthService) {
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
}
