import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CustomRequest } from 'src/common/interfaces/Authentication';

export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<CustomRequest>();
    return request.user?.sub;
  },
);
