import z from "zod";

const configSchema = z.object({
  VITE_API_ENDPOINT: z.string().default(""),
  VITE_BANK_ACCOUNT_NUMBER: z.string(),
  VITE_BANK_NAME: z.string(),
});

const configServer = configSchema.safeParse(import.meta.env);

if (!configServer.success) {
  console.error(configServer.error.issues);
  throw new Error("Invalid environment variables");
}

const envConfig = configServer.data;

export default envConfig;
