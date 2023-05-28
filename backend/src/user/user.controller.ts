import { Body, Controller, Get, Post } from '@nestjs/common';
import { TaskDto } from 'taskapp-common/dist/src/dto/task.dto';
import { UserService } from './user.service';
import { LoginRequestDto, LoginResponseDto } from 'taskapp-common/dist/src/dto/login.dto';
import { AuthService } from '../auth/auth.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {
  }

  @Post()
  async login(@Body() data: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userService.loginUser(data.email, data.password);
    return { token: this.authService.login(user) };
  }
}
