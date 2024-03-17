import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import {
  LoginRequestDto,
  LoginResponseDto,
} from 'taskapp-common/src/dto/auth.dto';
import { TaskAppError } from '../error/task-app.error';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async login(@Body() data: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userService.loginUser(data.email, data.password);
    if (!user || user.deletedAt || user.disabled) {
      throw new TaskAppError('bad_credentials', HttpStatus.BAD_REQUEST);
    }

    return {
      ...user.toDto(),
      token: this.authService.login(user),
    };
  }
}
