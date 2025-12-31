import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello, welcome to NestCommerce API! You can access the GraphQL endpoint at /api/v1/graphql and the Swagger documentation at /api/v1/swagger.";
  }
}
