import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

interface RequestWithUser {
  user: JwtPayload;
}

export const GetUser = createParamDecorator(
  (
    data: keyof JwtPayload | undefined,
    ctx: ExecutionContext,
  ): string | JwtPayload => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
