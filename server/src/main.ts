import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WebsocketAdapter } from "src/websockets/websocket.adapter";
import envConfig from "src/shared/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { cleanupOpenApiDoc } from "nestjs-zod";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

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
  SwaggerModule.setup("api", app, cleanupOpenApiDoc(documentFactory), {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Start the application
  await app.listen(envConfig.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error("Error starting the application:", err);
  process.exit(1);
});
