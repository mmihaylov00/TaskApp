import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService
  ) {
  }

  login(user: User): string {
    return this.jwtService.sign({
      email: user.email,
      id: user.id
    });
  };


  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}
