import { plainToInstance } from "class-transformer";
import { IsString, validateSync } from "class-validator";
import fs from "fs";
import path from "path";
import { config } from "dotenv";

config({
  path: ".env",
});

if (!fs.existsSync(path.resolve(".env"))) {
  console.log("Not found .env file. Please create it.");
  process.exit(1);
}

class ConfigSchema {
  @IsString()
  DATABASE_URL: string;
  @IsString()
  ACCESS_TOKEN_SECRET: string;
  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string;
  @IsString()
  REFRESH_TOKEN_SECRET: string;
  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string;
  @IsString()
  SECRET_API_KEY: string;
}

const configServer = plainToInstance(ConfigSchema, process.env, {
  enableImplicitConversion: true,
});

const errorArray = validateSync(configServer);

if (errorArray.length > 0) {
  console.log("Config validation error:");
  const errors = errorArray.map((eItem) => {
    return {
      property: eItem.property,
      constraints: eItem.constraints,
      value: eItem.value as string | undefined,
    };
  });
  throw new Error(`Config validation failed: ${JSON.stringify(errors)}`);
}

const envConfig = configServer;

export default envConfig;
