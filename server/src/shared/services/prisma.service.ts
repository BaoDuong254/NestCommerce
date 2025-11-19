import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "generated/prisma/client";
import envConfig from "src/shared/config";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: envConfig.DATABASE_URL,
    });
    super({
      adapter,
      log: ["query", "info", "warn", "error"],
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
