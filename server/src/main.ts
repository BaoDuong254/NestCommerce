import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WebsocketAdapter } from "src/websockets/websocket.adapter";
import envConfig from "src/shared/config/env";
import { corsConfig } from "src/shared/config/cors";
import { SwaggerModule } from "@nestjs/swagger";
import { createOpenApiDocument } from "src/shared/config/swagger";
import chalk from "chalk";
import { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import { Logger } from "nestjs-pino";
import { VersioningType } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });

  // Set up logging with Pino
  app.useLogger(app.get(Logger));

  // Trust proxy settings
  app.set("trust proxy", "loopback");

  // Enable CORS with shared configuration
  app.enableCors(corsConfig);

  // Enable API versioning
  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["1"],
  });

  // Security middleware with Helmet options for GraphQL Playground
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [`'self'`, "data:", "apollo-server-landing-page.cdn.apollographql.com"],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [`'self'`, "apollo-server-landing-page.cdn.apollographql.com"],
          frameSrc: [`'self'`, "sandbox.embed.apollographql.com"],
        },
      },
    })
  );

  // WebSocket setup
  const websocketAdapter = new WebsocketAdapter(app);
  await websocketAdapter.connectToRedis();
  app.useWebSocketAdapter(websocketAdapter);

  // Swagger setup
  SwaggerModule.setup("/api/v1/swagger", app, createOpenApiDocument(app), {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Start the application
  await app.listen(envConfig.PORT ?? 3000);
  console.log(chalk.blue(`Application is running on: http://localhost:${envConfig.PORT ?? 3000}/api/v1`));
}

bootstrap().catch((err) => {
  console.error("Error starting the application:", err);
  process.exit(1);
});
