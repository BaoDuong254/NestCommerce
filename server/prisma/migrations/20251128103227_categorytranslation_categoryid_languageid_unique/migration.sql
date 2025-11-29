CREATE UNIQUE INDEX categorytranslation_categoryId_languageId_unique
ON "CategoryTranslation" ("categoryId", "languageId")
WHERE "deletedAt" IS NULL;
