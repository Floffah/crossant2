/*
  Warnings:

  - Made the column `minReactions` on table `ReactionBoard` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ReactionBoard" ALTER COLUMN "minReactions" SET NOT NULL;
