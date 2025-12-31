import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { IsPublic } from "src/shared/decorators/auth.decorator";

@Controller()
@IsPublic()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
