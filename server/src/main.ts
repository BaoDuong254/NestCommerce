import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WebsocketAdapter } from "src/websockets/websocket.adapter";
import envConfig from "src/shared/config/env";
import { corsConfig } from "src/shared/config/cors";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { cleanupOpenApiDoc } from "nestjs-zod";
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

  // Security middleware with Helmet
  app.use(helmet());

  // WebSocket setup
  const websocketAdapter = new WebsocketAdapter(app);
  await websocketAdapter.connectToRedis();
  app.useWebSocketAdapter(websocketAdapter);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle("NestCommerce API")
    .setDescription("API documentation for the NestCommerce application")
    .setVersion("1.0")
    .addBearerAuth()
    .addApiKey(
      {
        name: "authorization",
        type: "apiKey",
      },
      "payment-api-key"
    )
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/v1/swagger", app, cleanupOpenApiDoc(documentFactory), {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Start the application
  await app.listen(envConfig.PORT ?? 3000);
  console.log(chalk.blue(`Application is running on: http://localhost:${envConfig.PORT ?? 3000}`));
}

bootstrap().catch((err) => {
  console.error("Error starting the application:", err);
  process.exit(1);
});
