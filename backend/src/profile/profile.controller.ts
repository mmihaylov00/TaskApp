import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { Authenticated } from '../auth/decorator/authenticated.decorator';
import { UserService } from '../user/user.service';
import {
  LoginRequestDto,
  LoginResponseDto,
  ProfileSetupDto,
  UpdatePasswordDto,
  UserDetailsDto,
} from 'taskapp-common/dist/src/dto/auth.dto';
import { AuthService } from '../auth/auth.service';
import { JwtUser } from '../auth/decorator/jwt-user.dto';
import { UserStatus } from 'taskapp-common/dist/src/enums/user-status.enum';
import { TaskAppError } from '../error/task-app.error';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async login(@Body() data: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userService.loginUser(data.email, data.password);
    if (!user || user.deletedAt || user.status == UserStatus.DISABLED) {
      throw new TaskAppError('bad_credentials', HttpStatus.BAD_REQUEST);
    }

    return {
      status: user.status,
      token: this.authService.login(user),
    };
  }

  @Get()
  @UseGuards(JwtGuard)
  async details(@Authenticated() user: JwtUser): Promise<UserDetailsDto> {
    const u = await this.userService.getUserData(user.id);
    if (!u) {
      throw new UnauthorizedException();
    }
    return {
      ...u.toDto(),
      token: this.authService.login(u),
    };
  }

  @Put('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard)
  async update(
    @Authenticated() user: JwtUser,
    @Body() data: UpdatePasswordDto,
  ) {
    await this.userService.changePassword(user, data);
  }

  @Post('/setup')
  setup(@Body() data: ProfileSetupDto) {
    return this.userService.setupProfile(data);
  }

  @Get('invitation/:id')
  getInvitationUser(@Authenticated() user: JwtUser, @Param('id') id: string) {
    return this.userService.getInvitationUser(id);
  }
}
