import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import type { Response as ExpressResponse } from "express";

export interface Response<T> {
  data: T;
  statusCode: number;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: T) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<ExpressResponse>();
        const statusCode = response.statusCode;
        return { data, statusCode };
      })
    );
  }
}
