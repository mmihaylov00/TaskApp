import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { Authenticated } from '../auth/decorator/authenticated.decorator';
import { UserService } from '../user/user.service';
import {
  ProfileSetupDto,
  UserDetailsDto,
} from 'taskapp-common/dist/src/dto/auth.dto';
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
    if (!u) {
      throw new UnauthorizedException();
    }
    return {
      ...u.toDto(),
      token: this.authService.login(u),
    };
  }

  @Put()
  async update(@Authenticated() user: JwtUser): Promise<void> {
    //todo
  }

  @Post('/setup')
  async setup(
    @Authenticated() user: JwtUser,
    @Body() data: ProfileSetupDto,
  ): Promise<void> {
    await this.userService.setupProfile(user, data);
  }
}
