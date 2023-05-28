import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Authenticated = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().user;
});
