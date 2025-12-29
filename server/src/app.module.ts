import { Module } from "@nestjs/common";
import { SharedModule } from "./shared/shared.module";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { AuthModule } from "src/routes/auth/auth.module";
import CustomZodValidationPipe from "src/shared/pipes/custom-zod-validation.pipe";
import { ZodSerializerInterceptor } from "nestjs-zod";
import { HttpExceptionFilter } from "src/shared/filters/http-exception.filter";
import { LanguageModule } from "src/routes/language/language.module";
import { PermissionModule } from "src/routes/permission/permission.module";
import { RoleModule } from "src/routes/role/role.module";
import { ProfileModule } from "src/routes/profile/profile.module";
import { UserModule } from "src/routes/user/user.module";
import { MediaModule } from "src/routes/media/media.module";
import { BrandModule } from "src/routes/brand/brand.module";
import { BrandTranslationModule } from "src/routes/brand/brand-translation/brand-translation.module";
import { AcceptLanguageResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import path from "path";
import { CategoryModule } from "src/routes/category/category.module";
import { CategoryTranslationModule } from "src/routes/category/category-translation/category-translation.module";
import { ProductModule } from "src/routes/product/product.module";
import { ProductTranslationModule } from "src/routes/product/product-translation/product-translation.module";
import { CartModule } from "src/routes/cart/cart.module";
import { OrderModule } from "src/routes/order/order.module";
import { PaymentModule } from "src/routes/payment/payment.module";
import { BullModule } from "@nestjs/bullmq";
import { PaymentConsumer } from "src/queues/payment.consumer";
import envConfig from "src/shared/config/env";
import { WebsocketModule } from "src/websockets/websocket.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { ThrottlerBehindProxyGuard } from "src/shared/guards/throttler-behind-proxy.guard";
import { ReviewModule } from "src/routes/review/review.module";
import { ScheduleModule } from "@nestjs/schedule";
import { RemoveRefreshTokenCronjob } from "src/cronjobs/remove-refresh-token.cronjob";
import { RemoveVerificationCodeCronjob } from "src/cronjobs/remove-verification-code.cronjob";
import { CacheModule } from "@nestjs/cache-manager";
import KeyvRedis from "@keyv/redis";
import { LoggerModule } from "nestjs-pino";
import { Request, Response } from "express";
import pino from "pino";

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        serializers: {
          req(req: Request) {
            return {
              method: req.method,
              url: req.url,
              query: req.query,
              params: req.params,
            };
          },
          res(res: Response) {
            return {
              statusCode: res.statusCode,
            };
          },
        },
        stream: pino.destination({
          dest: path.resolve("logs/app.log"),
          sync: false, // Asynchronous logging
          mkdir: true, // Create the directory if it doesn't exist
        }),
      },
    }),
    CacheModule.register({
      isGlobal: true,
      useFactory: () => ({
        stores: [new KeyvRedis(envConfig.REDIS_URL)],
      }),
    }),
    ScheduleModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        path: path.join(__dirname, "/i18n/"),
        watch: envConfig.NODE_ENV !== "production",
      },
      resolvers: [{ use: QueryResolver, options: ["lang"] }, AcceptLanguageResolver],
      typesOutputPath: path.join(
        __dirname,
        "generated",
        `${envConfig.NODE_ENV === "production" ? "i18n.generated.d.ts" : "i18n.generated.ts"}`
      ),
    }),
    BullModule.forRoot({
      connection: {
        url: envConfig.REDIS_URL,
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: "short-term",
          ttl: 60000, // 1 minute
          limit: 10,
        },
        {
          name: "long-term",
          ttl: 600000, // 10 minutes
          limit: 50,
        },
      ],
    }),
    SharedModule,
    AuthModule,
    LanguageModule,
    PermissionModule,
    RoleModule,
    ProfileModule,
    UserModule,
    MediaModule,
    BrandModule,
    BrandTranslationModule,
    CategoryModule,
    CategoryTranslationModule,
    ProductModule,
    ProductTranslationModule,
    CartModule,
    OrderModule,
    PaymentModule,
    WebsocketModule,
    ReviewModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    PaymentConsumer,
    RemoveRefreshTokenCronjob,
    RemoveVerificationCodeCronjob,
  ],
})
export class AppModule {}
