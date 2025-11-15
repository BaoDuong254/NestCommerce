import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { REQUEST_USER_KEY } from "src/shared/constants/auth.constant";
import { AccessTokenPayload } from "src/shared/types/jwt.type";

export const ActiveUser = createParamDecorator(
  (field: keyof AccessTokenPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request[REQUEST_USER_KEY] as AccessTokenPayload | undefined;
    return field ? user?.[field] : user;
  }
);
