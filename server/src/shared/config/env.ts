import fs from "fs";
import path from "path";
import { config } from "dotenv";
import z from "zod";
import chalk from "chalk";

const envPath = path.resolve(process.cwd(), ".env");

// Only load .env file if it exists (development mode)
// In production, Docker Compose injects env vars directly
if (fs.existsSync(envPath)) {
  config({ path: envPath });
} else if (process.env.NODE_ENV !== "production") {
  console.error(chalk.red("Can not find .env file at path:"), chalk.yellow(envPath));
  process.exit(1);
}

const configSchema = z.object({
  PORT: z.string().optional(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  DATABASE_URL: z.string(),
  ADMIN_PASSWORD: z.string(),
  ADMIN_EMAIL: z.email(),
  ADMIN_NAME: z.string(),
  ADMIN_PHONE_NUMBER: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  PAYMENT_API_KEY: z.string(),
  OTP_EXPIRES_IN: z.string().default("5m"),
  RESEND_API_KEY: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),
  GOOGLE_CLIENT_REDIRECT_URI: z.string(),
  APP_NAME: z.string(),
  // S3_ENPOINT: z.string(), // If using another service like DigitalOcean Spaces, uncomment this line
  S3_BUCKET_NAME: z.string(),
  S3_REGION: z.string(),
  S3_ACCESS_KEY: z.string(),
  S3_SECRET_KEY: z.string(),
  REDIS_URL: z.string(),
  CLIENT_URL: z.url(),
});

const configServer = configSchema.safeParse(process.env);

if (!configServer.success) {
  console.log("Config validation error:");
  console.log(z.treeifyError(configServer.error));
  process.exit(1);
}

const envConfig = configServer.data;

export default envConfig;
