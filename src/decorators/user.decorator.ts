import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator<string>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
