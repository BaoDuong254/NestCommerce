CREATE UNIQUE INDEX brandtranslation_brandId_languageId_unique
ON "BrandTranslation" ("brandId", "languageId")
WHERE "deletedAt" IS NULL;
