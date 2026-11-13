import { writeFileSync } from "fs";
import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { createOpenApiDocument } from "src/shared/config/swagger";

async function main() {
  const output = process.argv[2];
  if (!output) throw new Error("Usage: export-openapi <output.json>");

  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix("api");
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: ["1"] });

  const document = createOpenApiDocument(app);
  if (process.env.API_URL) document.servers = [{ url: process.env.API_URL }];

  writeFileSync(output, JSON.stringify(document));
  console.log(`OpenAPI spec written to ${output} (${Object.keys(document.paths).length} paths)`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
