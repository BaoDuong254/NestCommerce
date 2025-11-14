import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import requestIp from "request-ip";

export const IP = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const clientIp = requestIp.getClientIp(request) || "";
  return clientIp;
});
