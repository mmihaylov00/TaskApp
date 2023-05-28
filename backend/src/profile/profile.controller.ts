import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { LoginRequestDto, LoginResponseDto, UserDetailsDto } from 'common/src/dto/auth.dto';
import { AuthService } from '../auth/auth.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { Authenticated } from '../auth/decorator/authenticated.decorator';
import { Roles } from '../auth/decorator/role.decorator';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';


@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {
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

  @Put()
  @UseGuards(JwtGuard)
  async update(@Authenticated() user: User): Promise<void> {
    //todo
  }

  @Get('/:token')
  async getSetupData(@Authenticated() user: User): Promise<void> {
    //todo initial setup from invite token, return given email
  }

  @Post()
  async setup(@Authenticated() user: User): Promise<void> {
    //todo initial setup from invite link
  }
}
