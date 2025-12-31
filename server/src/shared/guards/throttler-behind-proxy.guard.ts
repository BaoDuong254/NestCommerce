import { ThrottlerGuard } from "@nestjs/throttler";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { GqlContextType } from "@nestjs/graphql";

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  // Skip throttling for GraphQL requests
  canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType<GqlContextType>() === "graphql") {
      return Promise.resolve(true);
    }
    return super.canActivate(context);
  }
  protected getTracker(req: Request): Promise<string> {
    return Promise.resolve(req.ips.length ? req.ips[0] : (req.ip ?? "unknown"));
  }
}
