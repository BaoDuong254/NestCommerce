import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { UnprocessableEntityException, ValidationPipe } from "@nestjs/common";
import { LoggingInterceptor } from "src/shared/interceptor/logging.interceptor";
import { TransformInterceptor } from "src/shared/interceptor/transform.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (validationErrors) => {
        return new UnprocessableEntityException(
          validationErrors.map((error) => ({
            field: error.property,
            errors: Object.values(error.constraints || {}).join(", "),
          }))
        );
      },
    })
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error("Error starting the application:", err);
  process.exit(1);
});
