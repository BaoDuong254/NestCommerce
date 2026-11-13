import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { cleanupOpenApiDoc } from "nestjs-zod";

export const createOpenApiDocument = (app: INestApplication) => {
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
  return cleanupOpenApiDoc(SwaggerModule.createDocument(app, config));
};
