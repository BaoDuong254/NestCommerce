import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import envConfig from "src/shared/config";

@Injectable()
export class PaymentAPIKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const xAPIKey = request.headers["payment-api-key"] as string | undefined;
    if (xAPIKey !== envConfig.PAYMENT_API_KEY) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
