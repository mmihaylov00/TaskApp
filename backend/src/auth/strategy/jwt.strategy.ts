import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import configuration from '../../config/configuration';
import { JwtUser } from '../decorator/jwt-user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().app_secret,
    });
  }

  validate(payload: any): JwtUser {
    return new JwtUser(payload);
  }
}
