/*
  Warnings:

  - You are about to drop the column `discordId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_discordId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "discordId";

-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReactionBoard" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "ReactionBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReactionBoardMessage" (
    "id" TEXT NOT NULL,
    "reactionBoardId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "ReactionBoardMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guild_id_key" ON "Guild"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- AddForeignKey
ALTER TABLE "ReactionBoard" ADD CONSTRAINT "ReactionBoard_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionBoardMessage" ADD CONSTRAINT "ReactionBoardMessage_reactionBoardId_fkey" FOREIGN KEY ("reactionBoardId") REFERENCES "ReactionBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
