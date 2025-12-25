import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import envConfig from "src/shared/config/env";

@Injectable()
export class PaymentAPIKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers["authorization"];
    if (!authHeader || typeof authHeader !== "string") {
      throw new UnauthorizedException();
    }
    const xAPIKey = authHeader.split(" ")[1];
    if (xAPIKey !== envConfig.PAYMENT_API_KEY) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
