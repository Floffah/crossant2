-- AlterTable
ALTER TABLE "ReactionBoard" ADD COLUMN     "minReactions" INTEGER;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;
