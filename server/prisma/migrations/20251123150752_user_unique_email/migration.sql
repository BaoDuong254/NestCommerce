-- DropIndex
DROP INDEX "User_email_key";

CREATE UNIQUE INDEX user_email_unique
ON "User" (email)
WHERE "deletedAt" IS NULL;
