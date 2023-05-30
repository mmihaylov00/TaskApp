import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';

export const PageParams = createParamDecorator((data: unknown, ctx: ExecutionContext): PageRequestDto => {
    const request = ctx.switchToHttp().getRequest();
    const page = parseInt(request.query.page, 10) || 1;
    const pageAmount = parseInt(request.query.pageAmount, 10) || 20;

    return { page, pageAmount };
  }
);
