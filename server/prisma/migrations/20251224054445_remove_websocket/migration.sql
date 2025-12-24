/*
  Warnings:

  - You are about to drop the `Websocket` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Websocket" DROP CONSTRAINT "Websocket_userId_fkey";

-- DropTable
DROP TABLE "Websocket";
