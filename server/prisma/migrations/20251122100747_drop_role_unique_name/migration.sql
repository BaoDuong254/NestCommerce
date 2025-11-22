-- DropIndex
DROP INDEX "Role_name_key";

CREATE UNIQUE INDEX role_name_unique
ON "Role" (name)
WHERE "deletedAt" IS NULL;
