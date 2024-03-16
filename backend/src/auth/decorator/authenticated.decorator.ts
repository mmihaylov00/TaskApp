import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUser } from './jwt-user.dto';

export const Authenticated = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtUser =>
    ctx.switchToHttp().getRequest().user,
);
