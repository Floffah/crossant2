/*
  Warnings:

  - Added the required column `boardMessageId` to the `ReactionBoardMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReactionBoardMessage" ADD COLUMN     "boardMessageId" TEXT NOT NULL;
