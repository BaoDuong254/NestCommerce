import { ThrottlerGuard } from "@nestjs/throttler";
import { Injectable } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: Request): Promise<string> {
    return Promise.resolve(req.ips.length ? req.ips[0] : (req.ip ?? "unknown"));
  }
}
