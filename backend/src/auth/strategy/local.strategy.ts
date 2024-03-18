import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../../user/user.service';
import { UserStatus } from 'taskapp-common/dist/src/enums/user-status.enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.userService.loginUser(username, password);

    if (!user || user.deletedAt || user.status === UserStatus.DISABLED) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
