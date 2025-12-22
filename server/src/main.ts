import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WebsocketAdapter } from "src/websockets/websocket.adapter";
import envConfig from "src/shared/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const websocketAdapter = new WebsocketAdapter(app);
  await websocketAdapter.connectToRedis();
  app.useWebSocketAdapter(websocketAdapter);
  await app.listen(envConfig.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error("Error starting the application:", err);
  process.exit(1);
});
